package platypus.api.handlers;

import java.sql.Connection;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariDataSource;

import platypus.api.models.Event;
import platypus.api.models.Item;
import platypus.api.models.Task;
import spark.Request;

public class TaskApi {

	public static JsonResponse add(HikariDataSource ds, Request r) throws SQLException {

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
			return new JsonResponse("SUCCESS", "", "Success Edit event");
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

}
