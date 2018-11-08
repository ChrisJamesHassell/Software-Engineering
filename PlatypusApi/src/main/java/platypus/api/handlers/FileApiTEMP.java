package platypus.api.handlers;

import platypus.api.JsonParser;
import platypus.api.models.Document;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.io.*;
import java.nio.file.*;

import javax.servlet.*;
import javax.servlet.http.Part;

import spark.*;
import java.util.*;

import com.zaxxer.hikari.HikariDataSource;

public class FileApi {
	
	HikariDataSource ds;
	
	public FileApi(HikariDataSource ds) {
		this.ds = ds;
	}
	
	public static JsonResponse addFile() throws Exception {
		
		 //File uploadDir = new File("upload");
		 //uploadDir.mkdir();
		 
		
/*
		
		 Spark.post("/upload", "multipart/form-data", (request, response) -> {

		 String location = "image";          // the directory location where files will be stored
		 long maxFileSize = 100000000;       // the maximum size allowed for uploaded files
		 long maxRequestSize = 100000000;    // the maximum size allowed for multipart/form-data requests
		 int fileSizeThreshold = 1024;       // the size threshold after which files will be written to disk

		 MultipartConfigElement multipartConfigElement = new MultipartConfigElement(
		      location, maxFileSize, maxRequestSize, fileSizeThreshold);
		  request.raw().setAttribute("org.eclipse.jetty.multipartConfig",
		      multipartConfigElement);

		 Collection<Part> parts = request.raw().getParts();
		 for (Part part : parts) {
		    System.out.println("Name: " + part.getName());
		    System.out.println("Size: " + part.getSize());
		    System.out.println("Filename: " + part.getSubmittedFileName());
		 }

		 String fName = request.raw().getPart("file").getSubmittedFileName();
		 System.out.println("Title: " + request.raw().getParameter("title"));
		 System.out.println("File: " + fName);

		 Part uploadedFile = request.raw().getPart("file");
		 Path out = Paths.get("image/" + fName);
		 try (final InputStream in = uploadedFile.getInputStream()) {
		    Files.copy(in, out);
		    uploadedFile.delete();
		 }
		 // cleanup
		 multipartConfigElement = null;
		 parts = null;
		 uploadedFile = null;

*/
		
		
	
		 return new JsonResponse("File Successfully Uploaded!", " ", "Ok.");
		 });
		 
		 return new JsonResponse("File Failed to upload.", " ", "Nope");
	}
	

}