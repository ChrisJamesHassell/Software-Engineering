package platypus.api.handlers;

import spark.Request;
import util.ItemFilter;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import java.util.HashMap;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.Category;
import platypus.api.models.Document;
import platypus.api.models.Event;
import platypus.api.models.ItemType;

public class DocumentHandler {
	
	// TODO: -Set up the response body to return CacheEntry + document stuff
	//		 -Test more extensively if needed
	public static JsonResponse addDoc(HikariDataSource ds, Request req) throws SQLException  {
		Connection conn = null;
		CallableStatement stmt = null;
		
		try {
			// Parse request body to get the document stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			
			JsonObject user = jsonO.get("user").getAsJsonObject();
			JsonObject group = jsonO.get("group").getAsJsonObject();
			JsonObject document = jsonO.get("document").getAsJsonObject();
			
			conn = ds.getConnection();

			
			//Prepare the call from request body
			stmt = conn.prepareCall("{call insertDoc(?, ?, ?, ?, ?, ?, ?, ?, ?)}");
			stmt.setString(1, document.get("pinned").getAsString());
			stmt.setString(2, document.get("notification").getAsString());
			stmt.setInt(3, group.get("groupID").getAsInt());
			stmt.setString(4, document.get("name").getAsString());
			stmt.setString(5, document.get("description").getAsString());
			stmt.setString(6, document.get("category").getAsString());
			stmt.setString(7, document.get("fileName").getAsString());
			stmt.setString(8, document.get("expirationDate").getAsString());
			stmt.registerOutParameter(9, Types.INTEGER);
			
			stmt.executeUpdate();
			int outID = stmt.getInt(9);
			stmt.close();
			
			Document d = getReturnedDocument(outID, conn);
			
			// TODO: Actually insert the document on the file system. :(
			return new JsonResponse("SUCCESS", d, "Successfully inserted document.");
		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLError in Add document");
		}
		finally {
			conn.close();
		} 
	}
	
	public static JsonResponse editDoc(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			// Parse request body to get the document stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			JsonObject document = jsonO.get("document").getAsJsonObject();
			
			conn = ds.getConnection();
			
			//Prepare the call from request body
			stmt = conn.prepareStatement("UPDATE documents SET name = ?, description = ?, category = ?, expirationDate = ? WHERE docID = ?");
			stmt.setString(1, document.get("name").getAsString());
			stmt.setString(2, document.get("description").getAsString());
			stmt.setString(3, document.get("category").getAsString());
			stmt.setString(4, document.get("expirationDate").getAsString());
			stmt.setInt(5, document.get("documentID").getAsInt());
			
			int ret = stmt.executeUpdate();		
			stmt.close();
			// Successful update
			if (ret == 1) {
				// Should not need to touch anything on the file system here, since we only touched the database entry for it.
				// TODO: Build the CacheEntry + new document stuff.
				return new JsonResponse("SUCCESS", "", "Successfully edited document");
			} else {
				// The documentID does not exist.
				return new JsonResponse("FAIL", "", "The document does not exist");
			}
			
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Editdocument");
		}
		finally {
			conn.close();
		} 
	}
	
	
	
	// Successfully removes the document from all appropriate tables.
	// TODO: -Build the response correctly.
	//		 -Test more extensively.
	public static JsonResponse removeDoc(HikariDataSource ds, Request req) throws SQLException {
		Connection conn = null;
		CallableStatement stmt = null;
	
		
		
		try {
			// Parse request body to get the document stuff.
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			
			// Still necessary to build the CacheEntry response.
			JsonObject user = jsonO.get("user").getAsJsonObject();
			JsonObject group = jsonO.get("group").getAsJsonObject();
			JsonObject document = jsonO.get("document").getAsJsonObject();
			
			conn = ds.getConnection();

			
			//Prepare the call from request body
			stmt = conn.prepareCall("{call delDoc(?)}");
			stmt.setInt(1, document.get("documentID").getAsInt());
			int ret = stmt.executeUpdate();
			stmt.close();
			
			if (ret != 0) {
				// TODO: Need to return CacheEntry for this user + the documentInfo
				// -Delete the file off the file system as well.
					return new JsonResponse("SUCCESS", "", "Successfully deleted document.");	
			} else {
				// There is no document with that documentID
					return new JsonResponse("FAIL", "", "There is no document with that ID, failed document deletion.");
			}
			
			
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add document");
		}
		finally {
			conn.close();
		} 
	}

	public static JsonResponse get(HikariDataSource ds, Request request) throws SQLException {
		HashMap<String, JsonObject> filterMap = new HashMap();
		Gson g = new Gson();
		filterMap.put("user", g.fromJson(request.headers("user"), JsonObject.class));
		filterMap.put("group", g.fromJson(request.headers("group"), JsonObject.class));
		filterMap.put("filter", g.fromJson(request.headers("filter"), JsonObject.class));
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", ItemFilter.getDocuments(conn, filterMap), "Berfect!");
		}
		catch (SQLException e) {
			e.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLException in get_all_documents");
		}
		finally {
			conn.close();
		}
	}
	
	private static Document getReturnedDocument(int docID, Connection conn) throws SQLException {
		
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM documents INNER JOIN has_documents ON documents.docID = has_documents.docID WHERE documents.docID = ?");
		ps.setInt(1, docID);
		
		ResultSet rs = ps.executeQuery();
		ps.close();
		
		Document d = null;
		
		// Get first doc
		if (rs.next()) {
			d = new Document();
			d.setItemID(rs.getInt(ItemFilter.getColumnWithName("docID", rs)));
			d.setType(ItemType.DOCUMENT);
			d.setName(rs.getString(ItemFilter.getColumnWithName("name", rs)));
			d.setDescription(rs.getString(ItemFilter.getColumnWithName("description", rs)));
			d.setCategory(Category.valueOf(rs.getString(ItemFilter.getColumnWithName("category", rs)).toUpperCase()));
			d.setExpiration(rs.getDate(ItemFilter.getColumnWithName("expirationDate", rs)));
			d.setFileName(rs.getString(ItemFilter.getColumnWithName("fileName", rs)));
			d.setNotification(rs.getDate(ItemFilter.getColumnWithName("notification", rs)));
			d.setPinned(rs.getBoolean(ItemFilter.getColumnWithName("pinned", rs)));
		}
		rs.close();
		
		return d;
		
	}
	
}

