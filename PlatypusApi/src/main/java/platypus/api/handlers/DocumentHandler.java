package platypus.api.handlers;

import spark.Request;
import spark.Service.StaticFiles;
import util.ItemFilter;
import spark.*;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Collection;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.Category;
import platypus.api.models.Document;
import platypus.api.models.ItemType;

public class DocumentHandler {

	// TODO: -Set up the response body to return CacheEntry + document stuff
	//		 -Test more extensively if needed
	public static JsonResponse addDoc(HikariDataSource ds, Request req) throws SQLException, IOException, ServletException, NullPointerException  {
		Connection conn = null;
		CallableStatement stmt = null;

		try {
			
			conn = ds.getConnection();			

			//Must be called to pull body parts as queryParams
	        MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
	        req.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
			
			//TODO determine desired final pathway for project
        	String PATH = File.separator + "platypus" + File.separator + "users";
        	String directoryName = PATH + File.separator + req.queryParams("userID").toString() + File.separator;
        	        	
		    File directory = new File(directoryName);
		    if (! directory.exists()){
		        directory.mkdirs();
		        // If you require it to make the entire directory path including parents,
		        // use directory.mkdirs(); here instead.
		    }
				           	
           	
			 long maxFileSize = 500000;       // the maximum size allowed for uploaded files
			 long maxRequestSize = 500000;    // the maximum size allowed for multipart/form-data requests
			 int fileSizeThreshold = 1024;       // the size threshold after which files will be written to disk      

			 MultipartConfigElement MCE = new MultipartConfigElement(
			      directoryName, maxFileSize, maxRequestSize, fileSizeThreshold);
			  req.raw().setAttribute("org.eclipse.jetty.multipartConfig",
					  MCE);


			 Part uploadedFile = req.raw().getPart("FILE");

			    
			 if ( uploadedFile.getSize() > maxFileSize) {
				 return new JsonResponse("FAILED", "", "File exceeds size limit.");
			 }

				String fName = uploadedFile.getSubmittedFileName(); 

	           	
	           	String ext = "";
	           	int i = fName.lastIndexOf('.');
	           	if (i > 0) {
	           		ext = fName.substring(i);
	           	}
	           	
	           
	           	
	           	
	           	
				//Prepare the call from request body
				stmt = conn.prepareCall("{call insertDoc(?, ?, ?, ?, ?, ?, ?, ?, ?)}");
				stmt.setString(1, req.queryParams("pinned").toString());
				stmt.setString(2, req.queryParams("notification").toString());
				stmt.setInt(3, Integer.parseInt(req.queryParams("groupID")));
				stmt.setString(4, req.queryParams("name").toString());
				stmt.setString(5, req.queryParams("description").toString());
				stmt.setString(6, req.queryParams("category").toString());
				stmt.setString(7, "Kolbydumbdumb");
				stmt.setString(8, req.queryParams("expirationDate").toString());
				stmt.registerOutParameter(9, Types.INTEGER);
				stmt.executeUpdate();
			 
				// File is in there, now make the update call to set fileName properly.
				int docID = stmt.getInt(9);
				//fileName = directoryName + docID + ext;
				// Possible issue here
	           	String fileName = directoryName + docID + ext;
	           	System.out.println(fileName);
	        	Path fullPath = Paths.get(fileName);
				PreparedStatement st = conn.prepareStatement("UPDATE documents SET fileName = ? WHERE docID = ?");
				st.setString(1, fileName);
				st.setInt(2, docID);
				st.executeUpdate();
				
			 try (final InputStream in = uploadedFile.getInputStream()){
			    Files.copy(in, fullPath, StandardCopyOption.REPLACE_EXISTING);
			    uploadedFile.delete();
			 }

			 // cleanup
			 MCE = null;
			 //parts = null;
			 uploadedFile = null;	

			// Need to return CacheEntry for this user + the document stuff
			return new JsonResponse("SUCCESS", "", "Successfully inserted document.");
		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLError in Add document");
		} catch (ServletException srvE) {
			srvE.printStackTrace();
			return new JsonResponse("ERROR", "", "ServletException in Add document");
		} 
		finally {
			conn.close();
		} 
	}

	
	public static JsonResponse editDoc(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		PreparedStatement stmt = null;

		try {
			conn = ds.getConnection();
			
			//Must be called to pull body parts as queryParams
	        MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
	        req.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
			
	        
	        //TODO if they do not change the actual document then only need these params
	        //if they do change the file then we need the same params as addDoc
			stmt = conn.prepareStatement("UPDATE documents SET name = ?, description = ?, category = ?, expirationDate = ? WHERE docID = ?");
			stmt.setString(1, req.queryParams("name").toString());
			stmt.setString(2, req.queryParams("description").toString());
			stmt.setString(3, req.queryParams("category").toString());
			stmt.setString(4, req.queryParams("expirationDate").toString());
			stmt.setInt(5, Integer.parseInt(req.queryParams("documentID")));
			
			
			int ret = stmt.executeUpdate();		
			System.out.println(ret);
			// Successful update
			if (ret == 1) {
				// Given a successful update, update the relational table too.
				stmt = conn.prepareStatement("UPDATE has_documents SET pinned = ?, notification = ? WHERE docID = ?");
				stmt.setString(1, req.queryParams("pinned").toString());
				stmt.setString(2, req.queryParams("notification").toString());
				stmt.setInt(3, Integer.parseInt(req.queryParams("documentID")));
				
				ret = stmt.executeUpdate();
				stmt.close();
		
				if (ret == 1) {
					return new JsonResponse("SUCCESS", getReturnedDocument(Integer.parseInt(req.queryParams("documentID")), conn), "Successfully edited document");
				} else {
					return new JsonResponse("FAIL", "", "Failure updating the relational table");
				}
			} else {
				// The documentID does not exist.
				return new JsonResponse("FAIL", "", "The document does not exist");
			}

		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Editdocument");
		} finally {
			conn.close();
		}
	}

	// Successfully removes the document from all appropriate tables.
	// TODO: -Build the response correctly.
	// -Test more extensively.
	public static JsonResponse removeDoc(HikariDataSource ds, Request req) throws SQLException {
		Connection conn = null;
		CallableStatement stmt = null;

		try {
			
			//Must be called to pull body parts as queryParams
	        MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
	        req.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);

			
			conn = ds.getConnection();

			// Prepare the call from request body
			stmt = conn.prepareCall("{call delDoc(?)}");
			stmt.setInt(1, Integer.parseInt(req.queryParams("documentID")));
			int ret = stmt.executeUpdate();
			
        	String PATH = File.separator + "platypus" + File.separator + "users";
        	String directoryName = PATH + File.separator + req.queryParams("userID").toString() + File.separator;
			String fName = req.queryParams("fileName"); 
			String fullPath = directoryName.concat(fName);
			
			System.out.println(fullPath);
		
	    	try{
	    		File file = new File(fullPath);
	        	System.out.println(file.getName());
	    		if(file.delete()){
	    			System.out.println(file.getName() + " is deleted!");
	    		}else{
	    			System.out.println("Failed to delete file.");
	    		}
	    	   
	    	}catch(Exception e){
	    		e.printStackTrace();
	    		return new JsonResponse("FAIL", "", "There is no document with that ID, failed document deletion.");
	    	}
			
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
		} finally {
			conn.close();
		}
	}

	public static JsonResponse get(HikariDataSource ds, Request request) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", ItemFilter.getDocuments(conn, request), "Berfect!");
		}
		catch (SQLException e) {
			e.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLException in get_all_documents");
		} finally {
			conn.close();
		}
	}

	private static Document getReturnedDocument(int docID, Connection conn) throws SQLException {

		PreparedStatement ps = conn.prepareStatement(
				"SELECT * FROM documents INNER JOIN has_documents ON documents.docID = has_documents.docID WHERE documents.docID = ?");
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