package platypus.api.handlers;
import platypus.api.models.Event;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariDataSource;

public class EventApi {
	
	public static JsonResponse AddEvent(Event e, HikariDataSource ds, String username) throws Exception  {
		Connection conn = null;
		CallableStatement stmt = null;
		System.out.println("USER PLS WORK: " + username);
		
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
	
	public static JsonResponse EditEvent(Event e, HikariDataSource ds) throws Exception {

		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "Success Edit event");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in EditEvent");
		}
		finally {
			conn.close();
		} 
	}
	
	
	public static JsonResponse RemoveEvent(Event e, HikariDataSource ds) throws Exception {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "Success remove event");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in RemoveEvent");
		}
		finally {
			conn.close();
		} 
	}
	
}

