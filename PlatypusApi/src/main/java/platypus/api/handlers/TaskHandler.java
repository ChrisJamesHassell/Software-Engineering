package platypus.api.handlers;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.models.Priority;
import spark.Request;

public class TaskHandler {
	
	public static JsonResponse addTask(HikariDataSource ds, Request req) throws SQLException {
		
		Connection conn = null;
		CallableStatement stmt = null;
		
		try {
			// Parse request body to get the task stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			
			JsonObject user = jsonO.get("user").getAsJsonObject();
			JsonObject group = jsonO.get("group").getAsJsonObject();
			JsonObject task = jsonO.get("task").getAsJsonObject();
			
			conn = ds.getConnection();

			//Prepare the call from request body
			stmt = conn.prepareCall("{call insertTask(?, ?, ?, ?, ?, ?, ?, ?)}");
			stmt.setString(1, task.get("pinned").getAsString());
			stmt.setString(2, task.get("notification").getAsString());
			stmt.setInt(3, group.get("groupID").getAsInt());
			stmt.setString(4, task.get("name").getAsString());
			stmt.setString(5, task.get("description").getAsString());
			stmt.setString(6, task.get("category").getAsString());
			stmt.setString(7, task.get("deadline").getAsString());
			stmt.setString(8, task.get("priority").getAsString());
			
			stmt.executeUpdate();
			
			// Need to return CacheEntry for this user + the Task stuff
			return new JsonResponse("SUCCESS", "", "Successfully inserted task.");
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
			
			//Prepare the call from request body
			stmt = conn.prepareStatement("UPDATE tasks SET name = ?, description = ?, category = ?, deadline = ?, priority = ?, completed = ? WHERE taskID = ?");
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
			return new JsonResponse("ERROR", "", "SQLError in Edit Task");
		} finally {
			conn.close();
		} 
	}
	
	// Successfully removes the task from all appropriate tables.
	// TODO: -Build the response correctly.
	//		 -Test more extensively.
	public static JsonResponse removeTask(HikariDataSource ds, Request req) throws SQLException {
		Connection conn = null;
		CallableStatement stmt = null;
		
		try {
			// Parse request body to get the task stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			
			// Still necessary to build the CacheEntry response.
			JsonObject user = jsonO.get("user").getAsJsonObject();
			JsonObject group = jsonO.get("group").getAsJsonObject();
			JsonObject task = jsonO.get("task").getAsJsonObject();
			
			conn = ds.getConnection();
			
			//Prepare the call from request body
			stmt = conn.prepareCall("{call delTask(?)}");
			stmt.setInt(1, task.get("taskID").getAsInt());
			
			int ret = stmt.executeUpdate();
			if (ret != 0) {
				// TODO: Need to return CacheEntry for this user + the TaskInfo
				return new JsonResponse("SUCCESS", "", "Successfully deleted task.");	
			} 
			else {
				// There is no task with that taskID
				return new JsonResponse("FAIL", "", "There is no task with that ID, failed task deletion.");
			}
			
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add Task");
		} finally {
			conn.close();
		} 
	}
	
	public static JsonResponse get(HikariDataSource ds, Request request) {
		return null;
	}

}
