package platypus.api.handlers;

import platypus.api.models.*;
import spark.Request;
import spark.Response;
import spark.Route;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

public class LoginHandler implements Route {
	
	private DataSource ds;
	
	public LoginHandler(DataSource ds) {
		this.ds = ds;
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception 	{
		User u = new User( 
				Integer.parseInt(request.queryParams("id")),
				request.queryParams("username"),
				request.queryParams("pass"),
				request.queryParams("email"),
				request.queryParams("name"));
		
		
		try (Connection db = ds.getConnection()) {
			System.out.println("Successfully got db connection");
			// Check if username and password are correct, if they are
			// redirect to next dashboard?
			
		} catch (SQLException e) {
			response.status(500);
			e.printStackTrace();
		}
		
		return u; 
	}
}
