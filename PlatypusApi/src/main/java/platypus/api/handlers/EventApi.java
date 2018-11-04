package platypus.api.handlers;
import spark.Request;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;
public class EventApi {
	
	
	// TODO: -Set up the response body to return CacheEntry + Event stuff
	//		 -Test more extensively if needed
	public static JsonResponse AddEvent(HikariDataSource ds, Request req) throws SQLException  {
		Connection conn = null;
		CallableStatement stmt = null;
		
		try {
			// Parse request body to get the event stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			
			JsonObject user = jsonO.get("user").getAsJsonObject();
			JsonObject group = jsonO.get("group").getAsJsonObject();
			JsonObject event = jsonO.get("event").getAsJsonObject();
			
			conn = ds.getConnection();

			
			//Prepare the call from request body
			stmt = conn.prepareCall("{call insertEvent(?, ?, ?, ?, ?, ?, ?, ?, ?)}");
			stmt.setString(1, event.get("pinned").getAsString());
			stmt.setString(2, event.get("notification").getAsString());
			stmt.setInt(3, group.get("groupID").getAsInt());
			stmt.setString(4, event.get("name").getAsString());
			stmt.setString(5, event.get("description").getAsString());
			stmt.setString(6, event.get("category").getAsString());
			stmt.setString(7, event.get("startDate").getAsString());
			stmt.setString(8, event.get("endDate").getAsString());
			stmt.setString(9, event.get("location").getAsString());
			
			stmt.executeUpdate();
			
			// Need to return CacheEntry for this user + the Event stuff
			return new JsonResponse("SUCCESS", "", "Successfully inserted event.");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add Event");
		} finally {
			conn.close();
		}
	}


	public static JsonResponse EditEvent(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			// Parse request body to get the event stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			JsonObject event = jsonO.get("event").getAsJsonObject();
			
			
			
			conn = ds.getConnection();
			
			//Prepare the call from request body
			stmt = conn.prepareStatement("UPDATE userevents SET name = ?, description = ?, startDate = ?, endDate = ?, location = ? WHERE eventID = ?");
			stmt.setString(1, event.get("name").getAsString());
			stmt.setString(2, event.get("description").getAsString());
			stmt.setString(3, event.get("startDate").getAsString());
			stmt.setString(4, event.get("endDate").getAsString());
			stmt.setString(5, event.get("location").getAsString());
			stmt.setInt(6, event.get("eventID").getAsInt());
			
			
			int ret = stmt.executeUpdate();			
			// Successful update
			if (ret == 1) {
				// TODO: Build the CacheEntry + new Event stuff.
				return new JsonResponse("SUCCESS", "", "Successfully edited event");
			} else {
				// The eventID does not exist.
				return new JsonResponse("FAIL", "", "The event does not exist");
			}
			
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in EditEvent");
		} finally {
			conn.close();
		}
	}
	
	
	
	// Successfully removes the event from all appropriate tables.
	// TODO: -Build the response correctly.
	//		 -Test more extensively.
	public static JsonResponse RemoveEvent(HikariDataSource ds, Request req) throws SQLException {
		Connection conn = null;
		CallableStatement stmt = null;
	
		
		
		try {
			// Parse request body to get the event stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			
			// Still necessary to build the CacheEntry response.
			JsonObject user = jsonO.get("user").getAsJsonObject();
			JsonObject group = jsonO.get("group").getAsJsonObject();
			JsonObject event = jsonO.get("event").getAsJsonObject();
			
			conn = ds.getConnection();

			
			//Prepare the call from request body
			stmt = conn.prepareCall("{call delEvent(?)}");
			stmt.setInt(1, event.get("eventID").getAsInt());
			stmt.executeUpdate();
			
			// TODO: Need to return CacheEntry for this user + the EventInfo
			return new JsonResponse("SUCCESS", "", "Successfully deleted event.");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add Event");
		}
		finally {
			conn.close();
		}
	}

}
