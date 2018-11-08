package platypus.api.handlers;

import java.sql.Connection;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.Priority;
import spark.Request;
import util.ItemFilter;

public class TaskHandler {

	public static JsonResponse addTask(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		try {
			conn = ds.getConnection();

			return new JsonResponse("SUCCESS", "", "Success Edit event");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in EditEvent");
		} finally {
			conn.close();
		}

		// return null;
	}

	public static JsonResponse edit(Task t, HikariDataSource ds) throws SQLException {

		Connection conn = null;
		try {
			conn = ds.getConnection();

			// Prepare the call from request body
			stmt = conn.prepareStatement(
					"UPDATE tasks SET name = ?, description = ?, category = ?, deadline = ?, priority = ?, completed = ? WHERE taskID = ?");
			stmt.setString(1, task.get("name").getAsString());
			stmt.setString(2, task.get("description").getAsString());
			stmt.setString(3, task.get("category").getAsString());
			stmt.setString(4, task.get("deadline").getAsString());
			stmt.setString(5, task.get("priority").getAsString());
			stmt.setString(6, task.get("completed").getAsString());
			stmt.setInt(7, task.get("taskID").getAsInt());

			int ret = stmt.executeUpdate();

			// Successful update
			if (ret == 1) {
				// TODO: Build the CacheEntry + new Task stuff.
				return new JsonResponse("SUCCESS", "", "Successfully edited task");
			} else {
				// The tasktID does not exist.
				return new JsonResponse("FAIL", "", "The task does not exist");
			}

		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in EditEvent");
		} finally {
			conn.close();
		}
	}

	public static JsonResponse remove(Task t, HikariDataSource ds) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "Success remove event");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in RemoveEvent");
		} finally {
			conn.close();
		}
	}

	public static JsonResponse get(HikariDataSource ds, Request request) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS",
					ItemFilter.getTasks(ds.getConnection(), JsonParser.getFilterRequestObjects(request)), "Berfect!");
		} catch (SQLException e) {
			e.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLException in get_all_tasks");
		} finally {
			conn.close();
		}
	}

}
