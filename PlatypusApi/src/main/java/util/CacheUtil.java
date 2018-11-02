package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import spark.Request;

public class CacheUtil {

	public static CacheEntry buildCacheUtil(Request req, Connection conn) {
		
		// Parse request to fill the bulk of the CacheEntry object.
		JsonObject o = new JsonParser().parse(req.body()).getAsJsonObject();
		int userId = o.get("userId").getAsInt();
		String userName = o.get("userName").getAsString();
		int groupId = o.get("groupId").getAsInt();
		String groupName = o.get("groupName").getAsString();
		
		// Use request info to get a list of all groups associated with the user.
		try {
			
			/* Write SQL statement where group/user relation is joined with group to get fields groupID and groupName */
			PreparedStatement ps = conn.prepareStatement("SELECT groupID, groupName from groups join belongs_to WHERE userID = ?");
			ps.setInt(1, userId);
			ResultSet rs = ps.executeQuery();
			ps.close();
			
			GroupyWrapper[] groupyWrappers = new GroupyWrapper[getResultSetSize(rs)];
						
			int ct = 0;
			while (rs.next()) {
				groupyWrappers[0] = new GroupyWrapper(rs.getInt(0), rs.getString(1));
			}
			
			return new CacheEntry(userId, userName, groupId, groupName, groupyWrappers);
			
		}
		catch (SQLException e) {
			conn.close();
			e.printStackTrace();
			// TODO, throw proper error;
		}
		finally {
			conn.close();
		}
		
	}
	
	private static int getResultSetSize(ResultSet rs) throws SQLException {
		rs.last();
		int size = rs.getRow();
		rs.beforeFirst();
		return size;
	}
	
}
