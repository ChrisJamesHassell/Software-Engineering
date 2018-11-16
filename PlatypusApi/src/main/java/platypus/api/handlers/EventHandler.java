package platypus.api.handlers;
import spark.Request;
import util.ItemFilter;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import java.sql.Types;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.Category;
import platypus.api.models.Event;
import platypus.api.models.ItemType;
import platypus.api.models.Priority;
import platypus.api.models.Task;
public class EventHandler {

	// TODO: -Set up the response body to return CacheEntry + Event stuff
	// -Test more extensively if needed
	public static JsonResponse addEvent(HikariDataSource ds, Request req) throws SQLException {
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


			// Prepare the call from request body
			stmt = conn.prepareCall("{call insertEvent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
			stmt.setString(1, event.get("pinned").getAsString());
			stmt.setString(2, event.get("notification").getAsString());
			stmt.setInt(3, group.get("groupID").getAsInt());
			stmt.setString(4, event.get("name").getAsString());
			stmt.setString(5, event.get("description").getAsString());
			stmt.setString(6, event.get("category").getAsString());
			stmt.setString(7, event.get("startDate").getAsString());
			stmt.setString(8, event.get("endDate").getAsString());
			stmt.setString(9, event.get("location").getAsString());
			stmt.registerOutParameter(10, Types.INTEGER);

			stmt.executeUpdate();
			int outID = stmt.getInt(10);
			stmt.close();

			Event e = getReturnedEvent(outID, conn);

			return new JsonResponse("SUCCESS", e, "Successfully inserted event.");
		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLError in Add Event");
		} finally {
			conn.close();
		}
	}

	public static JsonResponse editEvent(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		PreparedStatement stmt = null;

		try {
			// Parse request body to get the event stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			JsonObject event = jsonO.get("event").getAsJsonObject();

			conn = ds.getConnection();

			// Prepare the call from request body
			stmt = conn.prepareStatement(
					"UPDATE userevents SET name = ?, description = ?, category = ?, startDate = ?, endDate = ?, location = ? WHERE eventID = ?");
			stmt.setString(1, event.get("name").getAsString());
			stmt.setString(2, event.get("description").getAsString());
			stmt.setString(3, event.get("category").getAsString());
			stmt.setString(4, event.get("startDate").getAsString());
			stmt.setString(5, event.get("endDate").getAsString());
			stmt.setString(6, event.get("location").getAsString());
			stmt.setInt(7, event.get("eventID").getAsInt());

			int ret = stmt.executeUpdate();
			stmt.close();

			// Successful update
			if (ret == 1) {
				// Given a successful update, update the relational table too.
				stmt = conn.prepareStatement("UPDATE has_events SET pinned = ?, notification = ? WHERE eventID = ?");
				stmt.setString(1, event.get("pinned").getAsString());
				stmt.setString(2, event.get("notification").getAsString());
				stmt.setInt(3, event.get("eventID").getAsInt());
				
				ret = stmt.executeUpdate();
				stmt.close();
				
				if (ret == 1) {
					return new JsonResponse("SUCCESS", getReturnedEvent(event.get("eventID").getAsInt(), conn), "Successfully edited event");	
				} else {
					return new JsonResponse("FAIL", "", "Failure updating the relational table");
				}
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
	// -Test more extensively.
	public static JsonResponse removeEvent(HikariDataSource ds, Request req) throws SQLException {
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

			// Prepare the call from request body
			stmt = conn.prepareCall("{call delEvent(?)}");
			stmt.setInt(1, event.get("eventID").getAsInt());
			int ret = stmt.executeUpdate();
			stmt.close();

			if (ret != 0) {
				// TODO: Need to return CacheEntry for this user + the EventInfo
				return new JsonResponse("SUCCESS", "", "Successfully deleted event.");
			} else {
				// There is no event with that eventID
				return new JsonResponse("FAIL", "", "There is no event with that ID, failed event deletion.");
			}

		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add Event");
		} finally {
			conn.close();
		}
	}

	public static JsonResponse get(HikariDataSource ds, Request request) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", ItemFilter.getEvents(conn, request), "Berfect!");
		}
		catch (SQLException e) {
			e.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLException in get_all_events");
		} finally {
			conn.close();
		}
	}

	private static Event getReturnedEvent(int eventID, Connection conn) throws SQLException {

		PreparedStatement ps = conn.prepareStatement("SELECT * FROM userevents INNER JOIN has_events ON userevents.eventID = has_events.eventID WHERE userevents.eventID = ?");
		ps.setInt(1, eventID);

		ResultSet rs = ps.executeQuery();
		ps.close();

		Event e = null;

		// Get first event
		if (rs.next()) {
			e = new Event();
			e.setItemID(rs.getInt(ItemFilter.getColumnWithName("eventID", rs)));
			e.setType(ItemType.EVENT);
			e.setName(rs.getString(ItemFilter.getColumnWithName("name", rs)));
			e.setDescription(rs.getString(ItemFilter.getColumnWithName("description", rs)));
			e.setCategory(Category.valueOf(rs.getString(ItemFilter.getColumnWithName("category", rs)).toUpperCase()));
			e.setStart(rs.getDate(ItemFilter.getColumnWithName("startDate", rs)));
			e.setEnd(rs.getDate(ItemFilter.getColumnWithName("endDate", rs)));
			e.setLocation(rs.getString(ItemFilter.getColumnWithName("location", rs)));
			e.setNotification(rs.getDate(ItemFilter.getColumnWithName("notification", rs)));
			e.setPinned(rs.getBoolean(ItemFilter.getColumnWithName("pinned", rs)));
		}
		rs.close();

		return e;

	}

}
