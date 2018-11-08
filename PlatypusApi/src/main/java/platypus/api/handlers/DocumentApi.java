package platypus.api.handlers;

import platypus.api.JsonParser;
import platypus.api.models.Document;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import spark.Request;
import spark.Response;
import spark.Route;

import com.zaxxer.hikari.HikariDataSource;


public class DocumentApi implements Route {
	
	HikariDataSource ds;
	//don't need Auth filter don't need to touch cookies
	
	public DocumentApi(HikariDataSource ds) {
		this.ds = ds;
	}
	
	//@Override
	public Object AddDocument(JsonParser.getObject(Document.class, req.body()), ds), gson::toJson) throws Exception{
		
		Connection conn = null;

		try {
			conn = ds.getConnection();
			
			PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) AS total FROM user WHERE username = ?")
		}
		
	}
	
	public static JsonResponse AddDocument(Document d, HikariDataSource ds, String username) throws Exception {

		Connection conn = null;
		CallableStatement stmt = null;
		
		try {
			conn = ds.getConnection();
			
			return new JsonResponse("SUCCESS", "", "New Document added.");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLERROR in Add Document");
		} 
		finally {
			conn.close();
		}
	}


	public static JsonResponse EditDocument(Document d, HikariDataSource ds, String username) throws Exception {
		
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "Success Edit Document");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in EditDocument");
		}
		finally {
			conn.close();
		} 
	}
	
	public static JsonResponse RemoveDocument(Document d, HikariDataSource ds) throws Exception {

		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", "", "Success Remove Document");
		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in RemoveDocument");
		}
		finally {
			conn.close();
		} 
	}
	
}