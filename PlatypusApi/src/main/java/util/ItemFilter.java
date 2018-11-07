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
import platypus.api.models.ItemType;
import platypus.api.models.Priority;
import platypus.api.models.Task;
import platypus.api.models.TaskWrapper;

public class ItemFilter {

	public static TaskWrapper[] getTasks(Connection conn, HashMap<String, JsonObject> filterMap) throws SQLException {
		
		JsonObject user = filterMap.get("user");
		JsonObject group = filterMap.get("group");
		JsonObject filter = filterMap.get("filter");
		
		int userId = user.get("userId").getAsInt();
		Category category = Category.valueOf(filter.get("category").getAsString());
		int weeksAhead = filter.get("weeksAhead").getAsInt();
		boolean pinned = filter.get("pinned").getAsBoolean();
		
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
			if (t.getTask().getCategory().equals(category) && dateWithin(weeksAhead, t.getTask().getDeadline()) && t.getTask().isPinned() == pinned) {
				return true;
			}
			return false;
		});
			
		return stream.toArray(TaskWrapper[]::new);
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
	
}
