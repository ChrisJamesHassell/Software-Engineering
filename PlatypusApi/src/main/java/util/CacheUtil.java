package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.function.Predicate;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import platypus.api.models.CacheEntry;
import platypus.api.models.Category;
import platypus.api.models.Document;
import platypus.api.models.Event;
import platypus.api.models.GroupyWrapper;
import platypus.api.models.ItemType;
import platypus.api.models.LoginEntry;
import platypus.api.models.Priority;
import platypus.api.models.Task;
import spark.Request;

public class CacheUtil {

	public static CacheEntry buildCacheEntry(Request req, Connection conn) throws SQLException {
		
		// Parse request to fill the bulk of the CacheEntry object.
		JsonObject o = new JsonParser().parse(req.body()).getAsJsonObject();
		int userId = o.get("userId").getAsInt();
		String userName = o.get("userName").getAsString();
		int groupId = o.get("groupId").getAsInt();
		String groupName = o.get("groupName").getAsString();
		
		// Use request info to get a list of all groups associated with the user.		
		// TODO: Update to retrieve all correct info later.
		PreparedStatement ps = conn.prepareStatement("SELECT groupId, groupName FROM belongs_to inner join groups on groupId where belongs_to.userID = ?");
		ps.setInt(1, userId);
		ResultSet rs = ps.executeQuery();
		ps.close();
		
		GroupyWrapper[] groupyWrappers = new GroupyWrapper[getResultSetSize(rs)];
					
		int ct = 0;
		while (rs.next()) {
			groupyWrappers[0] = new GroupyWrapper(rs.getInt(1), rs.getString(2));
		}
		
		return new CacheEntry(userName, userId, groupId, groupName, groupyWrappers);
				
	}
	
	public static CacheEntry buildCacheEntry(String userName, int id, Connection conn) throws SQLException {
		
		// Use userId to get groupId & groupName for the user's self group.
		PreparedStatement ps = conn.prepareStatement("SELECT belongs_to.userID, groups.groupID, groups.groupName FROM belongs_to "
													+ "INNER JOIN groups ON belongs_to.groupID = groups.groupID "
													+ "WHERE belongs_to.userID = ?");
		ps.setInt(1, id);
		ResultSet rs = ps.executeQuery();
		ps.close();
		
		
		// Get id and name
		rs.next();
		int groupId = rs.getInt(2);
		String groupName = rs.getString(3);
		
		rs.close();
		
		return new CacheEntry(userName, id, groupId, groupName, new GroupyWrapper[] {new GroupyWrapper(groupId, groupName)});
	
	}
	
	public static LoginEntry buildLoginEntry(String userName, int id, Connection conn) throws SQLException {
		// Populate guaranteed returns
		CacheEntry ce = buildCacheEntry(userName, id, conn);
		LoginEntry loginEntry = new LoginEntry(
				ce.getUsername(), 
				ce.getId(), 
				ce.getGroupId(), 
				ce.getselfGroupName(), 
				ce.getGroupyWrapper()
		);
		
		// TODO, get all tasks where this user part of the group
	
		// Get all tasks, events, docs that meet filter criteria.
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM tasks WHERE groupID = ?");	// TODO, Join relation table so that every taskID has a groupID, pinned, notification field. 
																								// FOR ALL GROUP IDS IN GROUPYWRAPPER
		ps.setInt(1, ce.getGroupId());
		ResultSet rs = ps.executeQuery();
		ps.close();
		
		// TODO, add notification and pinned fields and set them as well? Needs relation table
		
		Task[] tasks = new Task[getResultSetSize(rs)];
		int i = 0;
		while (rs.next()) {
			tasks[i].setItemID(rs.getInt(getColumnWithName("taskID", rs)));
			tasks[i].setType(ItemType.TASK);
			tasks[i].setName(rs.getString(getColumnWithName("name", rs)));
			tasks[i].setDescription(rs.getString(getColumnWithName("description", rs)));
			tasks[i].setCategory(Category.valueOf(rs.getString(getColumnWithName("category", rs))));
			tasks[i].setDeadline(rs.getString(getColumnWithName("deadline", rs)));
			tasks[i].setPriority(Priority.valueOf(rs.getString(getColumnWithName("priority", rs))));
			tasks[i].setCompleted(rs.getBoolean(getColumnWithName("completed", rs)));
			//tasks[i].setNotification(relation.getDate(getColumnWithName("notification", rs)));
			//tasks[i].setPinned(relation.getBoolean(getColumnWithName("pinned", rs)));
			i++;
		}
		rs.close();
		i = 0;
		
		ps = conn.prepareStatement("SELECT * FROM userevents");
		rs = ps.executeQuery();
		ps.close();
		
		Event[] events = new Event[getResultSetSize(rs)];
		while (rs.next()) {
			events[i].setItemID(rs.getInt(getColumnWithName("eventID", rs)));
			events[i].setType(ItemType.EVENT);
			events[i].setName(rs.getString(getColumnWithName("name", rs)));
			events[i].setDescription(rs.getString(getColumnWithName("description", rs)));
			events[i].setCategory(Category.valueOf(rs.getString(getColumnWithName("category", rs))));
			events[i].setStart(rs.getString(getColumnWithName("startDate", rs)));
			events[i].setEnd(rs.getString(getColumnWithName("endDate", rs)));
			events[i].setLocation(rs.getString(getColumnWithName("location", rs)));
			i++;
		}
		rs.close();
		i = 0;
		
		ps = conn.prepareStatement("SELECT * FROM documents");
		rs = ps.executeQuery();
		ps.close();
		
		Document[] documents = new Document[getResultSetSize(rs)];
		while (rs.next()) {
			documents[i].setItemID(rs.getInt(getColumnWithName("eventID", rs)));
			documents[i].setType(ItemType.DOCUMENT);
			documents[i].setName(rs.getString(getColumnWithName("name", rs)));
			documents[i].setDescription(rs.getString(getColumnWithName("description", rs)));
			documents[i].setCategory(Category.valueOf(rs.getString(getColumnWithName("category", rs))));
			documents[i].setFileName(rs.getString(getColumnWithName("fileName", rs)));
			documents[i].setExpiration(rs.getString(getColumnWithName("expirationDate", rs)));
			i++;
		}
		rs.close();
		i = 0;
		
		// Apply predicates for date filtering
		ArrayList<Task> a = new ArrayList<>(Arrays.asList(tasks));
		a.removeIf(new Predicate<Task>() {

			@Override
			public boolean test(Task t) {
				if (!t.isCompleted() && dateWithin(2, t.getDeadline())) {
					return true;
				}
				return false;
			}
			
		});
		tasks = a.toArray(new Task[tasks.length]);
		
		ArrayList<Event> b = new ArrayList<>(Arrays.asList(events));
		b.removeIf(new Predicate<Event>() {

			@Override
			public boolean test(Event e) {
				if (dateWithin(2, e.getStart())) {
					return true;
				}
				return false;
			}
			
		});
		events = b.toArray(new Event[events.length]);
		
		ArrayList<Document> c = new ArrayList<>(Arrays.asList(documents));
		c.removeIf(new Predicate<Document>() {

			@Override
			public boolean test(Document d) {
				if (dateWithin(2, d.getExpiration())) {
					return true;
				}
				return false;
			}
			
		});
		documents = c.toArray(new Document[documents.length]);
		
		loginEntry.setTasks(tasks);
		loginEntry.setEvents(events);
		loginEntry.setDocuments(documents);
		
		return loginEntry;
	
	}
	
	private static boolean dateWithin(int weeks, String itemDate) {
		int days = weeks * 7;
		
		// TODO, verify that MM-dd is correct and not dd-MM;
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		
		if (itemDate != null) {
			try {
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(new Date());            
				calendar.add(Calendar.DAY_OF_YEAR, days);
				Date dateToCompareTo = calendar.getTime();
				Date d = df.parse(itemDate);
				
				if (d.compareTo(dateToCompareTo) < 0) {
					return true;
				}
			} catch (ParseException e) {
				System.out.println("PARSE EXCEPTION IN PARSING DATE");
				e.printStackTrace();
			}
		}
		return false;
	}
	
	private static int getColumnWithName(String s, ResultSet rs) throws SQLException {
		ResultSetMetaData md = rs.getMetaData();
		int count = md.getColumnCount();
		for (int i = 1; i <= count; i++) {
		    if (md.getColumnName(i).equals(s)) {
		        return i;
		    }
		}
		
		// Doesn't exist
		return -1;
	}
	
	private static int getResultSetSize(ResultSet rs) throws SQLException {
		rs.last();
		int size = rs.getRow();
		rs.beforeFirst();
		return size;
	}
	
}
