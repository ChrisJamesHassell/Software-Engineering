package platypus.api.handlers;

import platypus.api.models.UserTuple;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.models.User;


public class UserApi {
	
	/*
	 * Return a JsonObject of the User, (This is to retrieve all Groups a user is in) 
	 */
	public static Object getUserInfo(HikariDataSource ds, UserTuple userSess) throws SQLException {
		Connection conn = null;
		System.out.println("Current user for /GET/userstuff: " + userSess.toString());
		List<Integer> test = new ArrayList<Integer>();
		String json = null;

		//Get connection and make query
		try {
			PreparedStatement stmt = null;
			conn = ds.getConnection();
			stmt = conn.prepareStatement("SELECT * FROM belongs_to WHERE userID = ?");
			stmt.setInt(1, userSess.getId());
			ResultSet rows = stmt.executeQuery();
			stmt.close();
			
			//Grab all groups for this userID.
			while (rows.next()) {
				System.out.println("User: " + rows.getInt(2) + " is in group: " + rows.getInt(1));
				test.add(rows.getInt(1));
			}

			json = new Gson().toJson(test);
			
		} catch (SQLException e) {
			return new JsonResponse("ERROR", "", "SQL fuckywuckied in UserApi.");
		} finally {
			conn.close();
		}
		
		return new JsonResponse("SUCCESS", json, "Got all user contents.");
	}
}