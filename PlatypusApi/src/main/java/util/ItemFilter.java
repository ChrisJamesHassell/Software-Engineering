package util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Predicate;
import java.util.stream.Stream;

import com.google.gson.JsonObject;

import platypus.api.models.Category;
import platypus.api.models.Document;
import platypus.api.models.DocumentWrapper;
import platypus.api.models.Event;
import platypus.api.models.EventWrapper;
import platypus.api.models.ItemType;
import platypus.api.models.Priority;
import platypus.api.models.Task;
import platypus.api.models.TaskWrapper;
import spark.Request;

public class ItemFilter {
	
	public static TaskWrapper[] getTasks(Connection conn, Request r) throws SQLException {
		
		int userId = Integer.parseInt(r.queryParams("userID"));
		int groupId = Integer.parseInt(r.queryParams("groupID"));
		Category category = r.queryParams("category").equals("null") ? null : Category.valueOf(r.queryParams("category"));
		int weeksAhead = Integer.parseInt(r.queryParams("weeksAhead"));
		Boolean pinned = r.queryParams("pinned").equals("null") ? null : Boolean.parseBoolean(r.queryParams("pinned"));
		
		// Get resultSet from util method.
		ResultSet rs = Queries.getItems(ItemType.TASK, conn, userId);
		
		ArrayList<TaskWrapper> tasks = new ArrayList<>();
		
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
			tasks.add(new TaskWrapper(t, rs.getInt(getColumnWithName("groupID", rs))));
		}
		rs.close();
		
		Stream<TaskWrapper> stream = tasks.stream().filter(t -> {
			if ((category == null || t.getTask().getCategory().equals(category)) 
					&& ((weeksAhead == -1 || (t.getTask().getDeadline() != null && dateWithin(weeksAhead, t.getTask().getDeadline()))))
					&& (pinned == null || t.getTask().isPinned() == pinned)) {
				return true;
			}
			return false;
		});
			
		return stream.toArray(TaskWrapper[]::new);
	}
	
	public static EventWrapper[] getEvents(Connection conn, Request r) throws SQLException {
		
		int userId = Integer.parseInt(r.queryParams("userID"));
		int groupId = Integer.parseInt(r.queryParams("groupID"));
		Category category = r.queryParams("category").equals("null") ? null : Category.valueOf(r.queryParams("category"));
		int weeksAhead = Integer.parseInt(r.queryParams("weeksAhead"));
		Boolean pinned = r.queryParams("pinned").equals("null") ? null : Boolean.parseBoolean(r.queryParams("pinned"));
		
		// Get resultSet from util method.
		ResultSet rs = Queries.getItems(ItemType.EVENT, conn, userId);
		
		ArrayList<EventWrapper> events = new ArrayList<>();
		
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
			e.setNotification(rs.getDate(getColumnWithName("notification", rs)));
			e.setPinned(rs.getBoolean(getColumnWithName("pinned", rs)));
			events.add(new EventWrapper(e, rs.getInt(getColumnWithName("groupID", rs))));
		}
		rs.close();
		
		Stream<EventWrapper> stream = events.stream().filter(t -> {
			if ((category == null || t.getEvent().getCategory().equals(category)) 
					&& (weeksAhead == -1 || dateWithin(weeksAhead, t.getEvent().getStart())) 
					&& (pinned == null || t.getEvent().isPinned() == pinned)) {
				return true;
			}
			return false;
		});
			
		return stream.toArray(EventWrapper[]::new);
	}
	
	public static DocumentWrapper[] getDocuments(Connection conn, Request r) throws SQLException {
		
		int userId = Integer.parseInt(r.queryParams("userID"));
		int groupId = Integer.parseInt(r.queryParams("groupID"));
		Category category = r.queryParams("category").equals("null") ? null : Category.valueOf(r.queryParams("category"));
		int weeksAhead = Integer.parseInt(r.queryParams("weeksAhead"));
		Boolean pinned = r.queryParams("pinned").equals("null") ? null : Boolean.parseBoolean(r.queryParams("pinned"));
		
		// Get resultSet from util method.
		ResultSet rs = Queries.getItems(ItemType.DOCUMENT, conn, userId);
		
		ArrayList<DocumentWrapper> documents = new ArrayList<>();
		
		while (rs.next()) {
			Document d = new Document();
			d.setItemID(rs.getInt(getColumnWithName("documentID", rs)));
			d.setType(ItemType.DOCUMENT);
			d.setName(rs.getString(getColumnWithName("name", rs)));
			d.setDescription(rs.getString(getColumnWithName("description", rs)));
			d.setCategory(Category.valueOf(rs.getString(getColumnWithName("category", rs)).toUpperCase()));
			d.setFileName(rs.getString(getColumnWithName("fileName", rs)));
			d.setExpiration(rs.getDate(getColumnWithName("expirationDate", rs)));
			d.setNotification(rs.getDate(getColumnWithName("notification", rs)));
			d.setPinned(rs.getBoolean(getColumnWithName("pinned", rs)));
			documents.add(new DocumentWrapper(d, rs.getInt(getColumnWithName("groupID", rs))));
		}
		rs.close();
		
		Stream<DocumentWrapper> stream = documents.stream().filter(t -> {
			if ((category == null || t.getDocument().getCategory().equals(category)) 
					&& (weeksAhead == -1 || (t.getDocument().getExpiration() != null && dateWithin(weeksAhead, t.getDocument().getExpiration()))) 
					&& (pinned == null || t.getDocument().isPinned() == pinned)) {
				return true;
			}
			return false;
		});
			
		return stream.toArray(DocumentWrapper[]::new);
	}

	public static int getColumnWithName(String s, ResultSet rs) throws SQLException {
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
	
	private static boolean dateWithin(int weeks, java.sql.Date itemDate) {
		
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		
		if (itemDate != null) {
			
			Date currentDate = new Date();
			LocalDateTime localDateTime = LocalDateTime.ofInstant(currentDate.toInstant().plus(Period.ofWeeks(weeks)), ZoneId.systemDefault());
			Date dateToCompareTo = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
			
			/*
			System.out.println("item deadline: " + DateFormat.getDateInstance().format(itemDate));
			System.out.println("Date to compare to: " + DateFormat.getDateInstance().format(dateToCompareTo));
			*/
			
			if (itemDate.compareTo(dateToCompareTo) < 0) {
				return true;
			}

		}
		return false;
	
	}
	
}
