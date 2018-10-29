package platypus.api.handlers;
import platypus.api.models.Event;
import platypus.api.models.UserTuple;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariDataSource;

public class EventApi {
	
	public static JsonResponse AddEvent(Event e, HikariDataSource ds, UserTuple userSess) throws SQLException  {
		Connection conn = null;
		CallableStatement stmt = null;
		System.out.println("USER PLS WORK: " + userSess.toString());
		
		try {
			conn = ds.getConnection();

			return new JsonResponse("SUCCESS", "", "Successfully inserted event.");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add Event");
		}
		finally {
			conn.close();
		} 
	}
	
	public static JsonResponse EditEvent(Event e, HikariDataSource ds) throws SQLException {

		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "Successfully edited Event");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in EditEvent");
		}
		finally {
			conn.close();
		} 
	}
	
	
	public static JsonResponse RemoveEvent(Event e, HikariDataSource ds) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "Successfully removed event.");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in RemoveEvent");
		}
		finally {
			conn.close();
		} 
	}
	
}

