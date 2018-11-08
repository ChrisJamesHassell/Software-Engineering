import java.io.*;
import java.nio.file.*;
import platypus.api.models.*;

import javax.servlet.http.HttpServletResponse;

import static spark.Spark.get;
import spark.Request;
import spark.Response;
import spark.Route;

import com.google.gson.Gson;

import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.User;

public class FileApi implements Route {
	
	HikariDataSource ds;
	
	public FileApi(HikariDataSource ds) {
		this.ds = ds;
	}
	
	//public static JsonResponse addFile(HikariDataSource ds) throws Exception {

            @Override
            public Object handle(Request req, Response res) throws Exception {
        		Document doc = JsonParser.getObject(Document.class, req.body());
        		
            	String PATH = "/platypus/users/";
            	Path fileName = doc.getFileName();
            	// TODO get userId from request body
            	// 24 will be userId
            	String directoryName = PATH.concat("24" + "/" + fileName);
            	
            	File uploadDir = new File(directoryName);
            	uploadDir.mkdir();//should make the new directory if not already exist
            	
            	// TODO get actual fucking file from the request body
            	byte[] bytes = Files.readAllBytes(fileName);         
            	HttpServletResponse raw = res.raw();

            	raw.getOutputStream().write(bytes);
            	raw.getOutputStream().flush();
            	raw.getOutputStream().close();

            	return res.raw();
            }
    
}