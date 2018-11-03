package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import platypus.api.models.CacheEntry;
import platypus.api.models.GroupyWrapper;
import spark.Request;

public class CacheUtil {

	public static CacheEntry buildCacheEntry(Request req, Connection conn) throws SQLException {
		
		// Parse request to fill the bulk of the CacheEntry object.
		JsonObject o = new JsonParser().parse(req.body()).getAsJsonObject();
		int userId = o.get("userId").getAsInt();
		String userName = o.get("userName").getAsString();
		int groupId = o.get("groupId").getAsInt();
		String groupName = o.get("groupName").getAsString();
		
		// Use request info to get a list of all groups associated with the user.		
		// TODO: Update to retrieve all correct info later.
		PreparedStatement ps = conn.prepareStatement("SELECT groupId, groupName FROM belongs_to inner join groups on groupId where belongs_to.userID = ?");
		ps.setInt(1, userId);
		ResultSet rs = ps.executeQuery();
		ps.close();
		
		GroupyWrapper[] groupyWrappers = new GroupyWrapper[getResultSetSize(rs)];
					
		int ct = 0;
		while (rs.next()) {
			groupyWrappers[0] = new GroupyWrapper(rs.getInt(1), rs.getString(2));
		}
		
		return new CacheEntry(userName, userId, groupId, groupName, groupyWrappers);
				
	}
	
	public static CacheEntry buildCacheEntry(String userName, int id, Connection conn) throws SQLException {
		
		// Use userId to get groupId & groupName for the user's self group.
		PreparedStatement ps = conn.prepareStatement("SELECT belongs_to.userId, groups.groupID, groups.groupName FROM belongs_to "
													+ "INNER JOIN groups ON belongs_to.groupID = groups.groupID "
													+ "WHERE belongs_to.userId = ?");
		ps.setInt(1, id);
		ResultSet rs = ps.executeQuery();
		ps.close();
		
		
		// Get id and name
		rs.next();
		int groupId = rs.getInt(2);
		String groupName = rs.getString(3);
		
		rs.close();
		
		return new CacheEntry(userName, id, groupId, groupName, new GroupyWrapper[] {new GroupyWrapper(groupId, groupName)});
	
	}
	
	private static int getResultSetSize(ResultSet rs) throws SQLException {
		rs.last();
		int size = rs.getRow();
		rs.beforeFirst();
		return size;
	}
	
}
