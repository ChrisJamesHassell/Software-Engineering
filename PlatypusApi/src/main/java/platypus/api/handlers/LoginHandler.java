package platypus.api.handlers;

import platypus.api.JsonParser;
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
	private AuthFilter authFilter;

	public LoginHandler(HikariDataSource ds, AuthFilter authFilter) {
		this.ds = ds;
		this.authFilter = authFilter;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		System.out.println("=========");
		System.out.println(request.body());
		User u = JsonParser.getObject(User.class, request.body());
		
		//User u = new User(request.params(":username"), request.params(":password"));
//		System.out.println(request.queryParams("username"));
//		System.out.println(request.queryParams("password"));
		
		
		//User u = new User(request.queryParams("username"), request.queryParams("password"));
		// Set up connection to db
		System.out.println(u.getUsername());
		System.out.println(u.getPassword());
		Connection dbconn = null;

		try {
			dbconn = ds.getConnection();
			PreparedStatement stmt = dbconn.prepareStatement("SELECT username, password FROM user WHERE username = ?");
			stmt.setString(1, u.getUsername());
			ResultSet rows = stmt.executeQuery();
			stmt.close();

			if (!rows.next()) {
				System.out.print("The username/password does not exist");
				return new JsonResponse("FAIL", "", "Login failed: username/password does not exist.");
			}

			// The username exists, now validate the password.
			if (BCrypt.checkpw(u.getPassword(), rows.getString(2))) {
				// set cookie here
				// if request domain is localhost, we are on dev environment
				// else we are on prod environment
				System.out.println("Request headers: " + request.headers());
				String domain = request.headers("Host");
				
				if (domain.equalsIgnoreCase("127.0.0.1:8080") || domain.equalsIgnoreCase("localhost:8080")) {
					System.out.println("localhost request: dev environment");
					response.cookie("localhost", "/", AuthFilter.TOKEN_COOKIE, authFilter.createSession(u.getUsername()),
							60 * 60 * 24 * 7, false, false);
				}
				else {
					System.out.println("External request: prod environment");
					response.cookie(request.headers("Origin"), "/", AuthFilter.TOKEN_COOKIE, authFilter.createSession(u.getUsername()),
							60 * 60 * 24 * 7, false, false);
				}



				return new JsonResponse("SUCCESS", "", "Login success.");
			}
			return new JsonResponse("FAIL", "", "Login failure: Incorrect Password");

		} catch (SQLException e) {
			System.out.println(e.getMessage());
			return new JsonResponse("FAIL", "", "SQLException occurred at Login.");
		} finally {
			dbconn.close();
		}

	}

}
