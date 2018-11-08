package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
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
import platypus.api.models.GroupyWrapper;
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
		PreparedStatement ps = conn.prepareStatement(
				"SELECT groupId, groupName FROM belongs_to inner join groups on groupId where belongs_to.userID = ?");
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
		PreparedStatement ps = conn
				.prepareStatement("SELECT belongs_to.userID, groups.groupID, groups.groupName FROM belongs_to "
						+ "INNER JOIN groups ON belongs_to.groupID = groups.groupID " + "WHERE belongs_to.userID = ?");
		ps.setInt(1, id);
		ResultSet rs = ps.executeQuery();
		ps.close();

		// Get id and name
		rs.next();
		int groupId = rs.getInt(getColumnWithName("groupID", rs));
		String groupName = rs.getString(getColumnWithName("groupName", rs));
		rs.close();

		ps = conn.prepareStatement("SELECT belongs_to.userID, groups.groupID, groups.groupName FROM belongs_to "
				+ "INNER JOIN groups ON belongs_to.groupID = groups.groupID " + "WHERE belongs_to.userID = ?");
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

		// TODO, verify that a user with multiple groups gets the right cacheEntry
		// return.
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

		rs.close();

		return new CacheEntry(userName, id, groupId, groupName,
				new GroupyWrapper[] { new GroupyWrapper(groupId, groupName) });

	}

	private static int getResultSetSize(ResultSet rs) throws SQLException {
		rs.last();
		int size = rs.getRow();
		rs.beforeFirst();
		return size;
	}

}
