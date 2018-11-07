package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Predicate;
import java.util.stream.Stream;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import platypus.api.models.CacheEntry;
import platypus.api.models.Category;
import platypus.api.models.Document;
import platypus.api.models.DocumentWrapper;
import platypus.api.models.Event;
import platypus.api.models.EventWrapper;
import platypus.api.models.GroupyWrapper;
import platypus.api.models.ItemType;
import platypus.api.models.LoginEntry;
import platypus.api.models.Priority;
import platypus.api.models.Task;
import platypus.api.models.TaskWrapper;
import spark.Request;

public class CacheUtil {
	
	/*

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
			groupyWrappers[ct] = new GroupyWrapper(rs.getInt(1), rs.getString(2));
			ct++;
		}
		
		return new CacheEntry(userName, userId, groupId, groupName, groupyWrappers);
				
	}
	
	*/
	
	public static CacheEntry buildCacheEntry(String userName, int id, Connection conn) throws SQLException {
		
		// Use userId to get groupId & groupName for the user's self group.
		PreparedStatement ps = conn.prepareStatement("SELECT belongs_to.userID, groups.groupID, groups.groupName FROM belongs_to "
													+ "INNER JOIN groups ON belongs_to.groupID = groups.groupID "
													+ "WHERE belongs_to.userID = ? and belongs_to.self = '1'");
		ps.setInt(1, id);
		ResultSet rs = ps.executeQuery();
		ps.close();
		
		rs.next();
		int groupId = rs.getInt(getColumnWithName("groupID", rs));
		String groupName = rs.getString(getColumnWithName("groupName", rs));
		rs.close();
		
		ps = conn.prepareStatement("SELECT belongs_to.userID, groups.groupID, groups.groupName FROM belongs_to "
									+ "INNER JOIN groups ON belongs_to.groupID = groups.groupID "
									+ "WHERE belongs_to.userID = ?");
		ps.setInt(1, id);
		rs = ps.executeQuery();
		ps.close();
		
		GroupyWrapper[] groupyWrappers = new GroupyWrapper[getResultSetSize(rs)];
		
		int ct = 0;
		while (rs.next()) {
			groupyWrappers[ct] = new GroupyWrapper(rs.getInt(2), rs.getString(3));
			ct++;
		}
		rs.close();
		
		// TODO, verify that a user with multiple groups gets the right cacheEntry return.
		// Needs a user in multiple groups.
		return new CacheEntry(userName, id, groupId, groupName, groupyWrappers);
	
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
			
		// Get all tasks that meet filter criteria.
		ResultSet rs = Queries.getItems(ItemType.TASK, conn, id);
		
		TaskWrapper[] taskWrappers = new TaskWrapper[getResultSetSize(rs)];
		int i = 0;
		while (rs.next()) {
			Task t = new Task();
			t.setItemID(rs.getInt(getColumnWithName("taskID", rs)));
			t.setType(ItemType.TASK);
			t.setName(rs.getString(getColumnWithName("name", rs)));
			t.setDescription(rs.getString(getColumnWithName("description", rs)));
			t.setCategory(Category.valueOf(rs.getString(getColumnWithName("category", rs)).toUpperCase()));
			t.setDeadline(rs.getDate(getColumnWithName("deadline", rs)));
			t.setPriority(Priority.valueOf(rs.getString(getColumnWithName("priority", rs)).toUpperCase()));
			t.setCompleted(rs.getBoolean(getColumnWithName("completed", rs)));
			t.setNotification(rs.getDate(getColumnWithName("notification", rs)));
			t.setPinned(rs.getBoolean(getColumnWithName("pinned", rs)));
			taskWrappers[i] = new TaskWrapper(t, rs.getInt(getColumnWithName("groupID", rs)));
			i++;
		}
		rs.close();
		i = 0;
		
		rs = Queries.getItems(ItemType.EVENT, conn, id);
		
		EventWrapper[] eventWrappers = new EventWrapper[getResultSetSize(rs)];
		while (rs.next()) {
			Event e = new Event();
			e.setItemID(rs.getInt(getColumnWithName("eventID", rs)));
			e.setType(ItemType.EVENT);
			e.setName(rs.getString(getColumnWithName("name", rs)));
			e.setDescription(rs.getString(getColumnWithName("description", rs)));
			e.setCategory(Category.valueOf(rs.getString(getColumnWithName("category", rs)).toUpperCase()));
			e.setStart(rs.getDate(getColumnWithName("startDate", rs)));
			e.setEnd(rs.getDate(getColumnWithName("endDate", rs)));
			e.setLocation(rs.getString(getColumnWithName("location", rs)));
			eventWrappers[i] = new EventWrapper(e, rs.getInt(getColumnWithName("groupID", rs)));
			i++;
		}
		rs.close();
		i = 0;
	
		rs = Queries.getItems(ItemType.DOCUMENT, conn, id);
		
		DocumentWrapper[] documentWrappers = new DocumentWrapper[getResultSetSize(rs)];
		while (rs.next()) {
			Document d = new Document();
			d.setItemID(rs.getInt(getColumnWithName("eventID", rs)));
			d.setType(ItemType.DOCUMENT);
			d.setName(rs.getString(getColumnWithName("name", rs)));
			d.setDescription(rs.getString(getColumnWithName("description", rs)));
			d.setCategory(Category.valueOf(rs.getString(getColumnWithName("category", rs)).toUpperCase()));
			d.setFileName(rs.getString(getColumnWithName("fileName", rs)));
			d.setExpiration(rs.getDate(getColumnWithName("expirationDate", rs)));
			documentWrappers[i] = new DocumentWrapper(d, rs.getInt(getColumnWithName("groupID", rs)));
			i++;
		}
		rs.close();
		i = 0;
		
		// Apply predicates for date filtering
		ArrayList<TaskWrapper> a = new ArrayList<>(Arrays.asList(taskWrappers));
		Stream<TaskWrapper> taskStream = a.stream().filter(new Predicate<TaskWrapper>() {

			@Override
			public boolean test(TaskWrapper t) {
				if (!t.getTask().isCompleted() && dateWithin(2, t.getTask().getDeadline())) {
					return true;
				}
				return false;
			}
			
		});
		taskWrappers = taskStream.toArray(TaskWrapper[]::new);
		
		ArrayList<EventWrapper> b = new ArrayList<>(Arrays.asList(eventWrappers));
		Stream<EventWrapper> eventStream = b.stream().filter(new Predicate<EventWrapper>() {

			@Override
			public boolean test(EventWrapper e) {
				if (dateWithin(2, e.getEvent().getStart())) {
					return true;
				}
				return false;
			}
			
		});
		eventWrappers = eventStream.toArray(EventWrapper[]::new);
		
		ArrayList<DocumentWrapper> c = new ArrayList<>(Arrays.asList(documentWrappers));
		Stream<DocumentWrapper> documentStream = c.stream().filter(new Predicate<DocumentWrapper>() {

			@Override
			public boolean test(DocumentWrapper d) {
				if (dateWithin(2, d.getDocument().getExpiration())) {
					return true;
				}
				return false;
			}
			
		});
		documentWrappers = documentStream.toArray(DocumentWrapper[]::new);
		
		loginEntry.setTasks(taskWrappers);
		loginEntry.setEvents(eventWrappers);
		loginEntry.setDocuments(documentWrappers);
		
		return loginEntry;
	
	}
	
	private static boolean dateWithin(int weeks, java.sql.Date itemDate) {
		
		// TODO, verify that MM-dd is correct and not dd-MM;
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		
		if (itemDate != null) {
			
			Date currentDate = new Date();
			LocalDateTime localDateTime = LocalDateTime.ofInstant(currentDate.toInstant().plus(Period.ofWeeks(weeks)), ZoneId.systemDefault());
			Date dateToCompareTo = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
							
			System.out.println("item deadline: " + DateFormat.getDateInstance().format(itemDate));
			System.out.println("Date to compare to: " + DateFormat.getDateInstance().format(dateToCompareTo));
			
			if (itemDate.compareTo(dateToCompareTo) < 0) {
				System.out.println("Here");
				return true;
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
