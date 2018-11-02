package platypus.api.handlers;
import platypus.api.models.Event;
import platypus.api.models.UserTuple;
import spark.Request;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariDataSource;

public class EventApi {
	
	public static JsonResponse AddEvent(HikariDataSource ds, Request req) throws SQLException  {
		Connection conn = null;
		CallableStatement stmt = null;
		//System.out.println("USER PLS WORK: " + userSess.toString());
		System.out.println("User Token: " + req.cookie("tokepi").toString());
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
	
	public static JsonResponse EditEvent(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "EditEvent");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in EditEvent");
		}
		finally {
			conn.close();
		} 
	}
	
	
	public static JsonResponse RemoveEvent(HikariDataSource ds, Request req) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "RemoveEvent");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in RemoveEvent");
		}
		finally {
			conn.close();
		} 
	}
	
}

