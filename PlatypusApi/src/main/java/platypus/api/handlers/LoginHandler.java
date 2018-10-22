package platypus.api.handlers;

import platypus.api.models.User;
import spark.Request;
import spark.Response;
import spark.Route;
import org.mindrot.jbcrypt.BCrypt;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.zaxxer.hikari.HikariDataSource;


public class LoginHandler implements Route {
	
	private HikariDataSource ds;
	
	public LoginHandler(HikariDataSource ds) {
		this.ds = ds;
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception 	{
		User u = new User( 
				request.queryParams("username"),
				request.queryParams("password"));
		
		
		//Set up connection to db
		Connection dbconn = null;
		
		try {
			dbconn = ds.getConnection();
			// TODO: Verify username/password requirements 
			PreparedStatement stmt = dbconn.prepareStatement("SELECT username, password FROM user WHERE username = ?");
			stmt.setString(1, u.getUsername());

			ResultSet rows = stmt.executeQuery();
			stmt.close();

			if (!rows.next()) {
				System.out.print("The username/password does not exist");
				return new JsonResponse( 
						"Failure",
						"",
						"Login failed: username/password does not exist.");
			}
			else {
				// The username exists, now validate the password.
				return ValidatePassword(u.getPassword(), rows.getString(2));
			}
			
		} catch (SQLException e) {
			System.out.println(e.getMessage());
			return new JsonResponse(
					"Failure",
					"",
					"SQLException occurred at Login.");
		}
		finally {
			dbconn.close();
		}

	}
	
	/* 
	 *	ValidatePassword 
	 *  	Parameters:
	 *  		-pass: User password provided from front-end
	 *  		-dbpass: Hashed password in the database
	 */
	public JsonResponse ValidatePassword(String pass, String dbpass) {
		if (BCrypt.checkpw(pass, dbpass)) {
			System.out.println("Password match");
			return new JsonResponse(
					"Success",
					"",
					"Login success.");
		}
		else {
			System.out.println("Password mismatch");
			return new JsonResponse(
					"Failure",
					"",
					"Login failure: Incorrect Password");
		}
	}
}