package platypus.api.handlers;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map.Entry;
import java.sql.Types;
import java.text.DateFormat;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.Category;
import platypus.api.models.ItemType;
import platypus.api.models.Priority;
import platypus.api.models.Task;
import spark.Request;
import util.DateParser;
import util.ItemFilter;

public class TaskHandler {

	private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("MMM d, yyyy");

	public static JsonResponse addTask(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		CallableStatement stmt = null;

		try {
			// Parse request body to get the task stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);

			JsonObject group = jsonO.get("group").getAsJsonObject();
			JsonObject task = jsonO.get("task").getAsJsonObject();

			conn = ds.getConnection();

			// Prepare the call from request body
			stmt = conn.prepareCall("{call insertTask(?, ?, ?, ?, ?, ?, ?, ?, ?)}");
			stmt.setInt(1, task.get("pinned").getAsInt());
			stmt.setDate(2,
					task.get("notification").isJsonNull() ? null : DateParser.parseDate(task.get("notification").getAsString()));
			stmt.setInt(3, group.get("groupID").getAsInt());
			stmt.setString(4, task.get("name").getAsString());
			stmt.setString(5, task.get("description").getAsString());
			stmt.setString(6, task.get("category").getAsString());
			stmt.setDate(7,
					task.get("deadline").isJsonNull() ? null : DateParser.parseDate(task.get("deadline").getAsString()));
			stmt.setString(8, task.get("priority").getAsString());
			stmt.registerOutParameter(9, Types.INTEGER);

			stmt.executeUpdate();
			int outID = stmt.getInt(9);
			stmt.close();

			Task t = getReturnedTask(outID, conn);

			return new JsonResponse("SUCCESS", t, "Successfully inserted task.");
		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLError in Add Task");
		} finally {
			conn.close();
		}
	}

	public static JsonResponse editTask(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		PreparedStatement stmt = null;

		try {
			// Parse request body to get the task stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			JsonObject task = jsonO.get("task").getAsJsonObject();

			conn = ds.getConnection();
			conn.setAutoCommit(false);

			// Prepare the call from request body
			stmt = conn.prepareStatement(
					"UPDATE tasks SET name = ?, description = ?, category = ?, deadline = ?, priority = ?, completed = ? WHERE taskID = ?");
			stmt.setString(1, task.get("name").getAsString());
			stmt.setString(2, task.get("description").getAsString());
			stmt.setString(3, task.get("category").getAsString());
			stmt.setDate(4,
					task.get("deadline").isJsonNull() ? null : DateParser.parseDate(task.get("deadline").getAsString()));
			stmt.setString(5, task.get("priority").getAsString());
			stmt.setInt(6, task.get("completed").getAsInt());
			stmt.setInt(7, task.get("taskID").getAsInt());

			int ret = stmt.executeUpdate();
			stmt.close();

			// Successful update
			if (ret == 1) {
				// Given a successful update, update the relational table too.
				stmt = conn.prepareStatement("UPDATE has_tasks SET pinned = ?, notification = ? WHERE taskID = ?");
				stmt.setInt(1, task.get("pinned").getAsInt());
				stmt.setDate(2, task.get("notification").isJsonNull() ? null
						: DateParser.parseDate(task.get("notification").getAsString()));
				stmt.setInt(3, task.get("taskID").getAsInt());

				ret = stmt.executeUpdate();
				stmt.close();
				conn.commit();

				if (ret == 1) {
					return new JsonResponse("SUCCESS", getReturnedTask(task.get("taskID").getAsInt(), conn),
							"Successfully edited task");
				} else {
					return new JsonResponse("FAIL", "", "Failure updating the relational table");
				}
			} else {
				// The tasktID does not exist.
				return new JsonResponse("FAIL", "", "The task does not exist");
			}
		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			conn.rollback();
			return new JsonResponse("ERROR", "", "SQLError in Edit Task");
		} finally {
			conn.close();
		}
	}

	// Removes the task from all appropriate tables.
	public static JsonResponse removeTask(HikariDataSource ds, Request req) throws SQLException {
		Connection conn = null;
		CallableStatement stmt = null;

		try {
			// Parse request body to get the task stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);

			JsonObject task = jsonO.get("task").getAsJsonObject();

			conn = ds.getConnection();

			// Prepare the call from request body
			stmt = conn.prepareCall("{call delTask(?)}");
			stmt.setInt(1, task.get("taskID").getAsInt());

			int ret = stmt.executeUpdate();
			stmt.close();
			if (ret != 0) {
				return new JsonResponse("SUCCESS", "", "Successfully deleted task.");
			} else {
				// There is no task with that taskID
				return new JsonResponse("FAIL", "", "There is no task with that ID, failed task deletion.");
			}

		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add Task");
		} finally {
			conn.close();
		}
	}

	public static JsonResponse get(HikariDataSource ds, Request request) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();

			return new JsonResponse("SUCCESS", ItemFilter.getTasks(conn, request), "Berfect!");
		} catch (SQLException e) {
			e.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLException in get_all_tasks");
		} finally {
			conn.close();
		}
	}

	private static Task getReturnedTask(int taskID, Connection conn) throws SQLException {

		PreparedStatement ps = conn.prepareStatement(
				"SELECT * FROM tasks INNER JOIN has_tasks ON tasks.taskID = has_tasks.taskID WHERE tasks.taskID = ?");
		ps.setInt(1, taskID);

		ResultSet rs = ps.executeQuery();
		ps.close();

		Task t = null;

		// Get first task
		if (rs.next()) {
			t = new Task();
			t.setItemID(rs.getInt(ItemFilter.getColumnWithName("taskID", rs)));
			t.setType(ItemType.TASK);
			t.setName(rs.getString(ItemFilter.getColumnWithName("name", rs)));
			t.setDescription(rs.getString(ItemFilter.getColumnWithName("description", rs)));
			t.setCategory(Category.valueOf(rs.getString(ItemFilter.getColumnWithName("category", rs)).toUpperCase()));
			t.setDeadline(rs.getDate(ItemFilter.getColumnWithName("deadline", rs)));
			t.setPriority(Priority.valueOf(rs.getString(ItemFilter.getColumnWithName("priority", rs)).toUpperCase()));
			t.setCompleted(rs.getBoolean(ItemFilter.getColumnWithName("completed", rs)));
			t.setNotification(rs.getDate(ItemFilter.getColumnWithName("notification", rs)));
			t.setPinned(rs.getBoolean(ItemFilter.getColumnWithName("pinned", rs)));
		}
		rs.close();

		return t;

	}

}