package platypus.api.handlers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

import org.mindrot.jbcrypt.BCrypt;

import com.zaxxer.hikari.HikariDataSource;

import platypus.api.models.User;
import spark.Request;
import spark.Response;
import spark.Route;

public class CreateHandler implements Route {
	
	HikariDataSource ds;
	
	public CreateHandler(HikariDataSource ds) {
		this.ds = ds;
	}

	@Override
	public Object handle(Request request, Response response) throws Exception {
		
		// Instantiate user class with JSON post request
		User u = new User(
				request.queryParams("firstname"),
				request.queryParams("lastname"),
				request.queryParams("email"),
				request.queryParams("username"),
				request.queryParams("password"),
				request.queryParams("dateofbirth")
		); // TODO, verify with Micah that this is how query params will look.
		
		System.out.println(u.toString());
		// TODO, Verify username and password requirements. Break out early if invalid [????]
		
		// Connect to DB
		Connection conn = null;
		try {
			// Connect to DB
			conn = ds.getConnection();
			
			// Check DB for existing username, break out early if invalid
			PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) AS total FROM user WHERE username = ?");
			ps.setString(1, u.getUsername());
			
			ResultSet rs = ps.executeQuery();
			ps.close();
			rs.next();
			if (rs.getInt("total") > 0) {
				// return existing user to front-end
				return new JsonResponse(
						"Failure",
						"",
						"Username already exists."
				);
			}
			rs.close();
			
			// Create account in the database
			ps = conn.prepareStatement("INSERT INTO user (first_name, last_name, email, username, password, date_of_birth) VALUES (?,?,?,?,?,?)");
			ps.setString(1, u.getFirstName());
			ps.setString(2, u.getLastName());
			ps.setString(3, u.getEmail());
			ps.setString(4, u.getUsername());
			ps.setString(5, BCrypt.hashpw(u.getPassword(), BCrypt.gensalt()));
			ps.setString(6, u.getDateOfBirth());
			int ret = ps.executeUpdate();
			ps.close();
			if (ret == 1) {
				// Insert success, return success
				return new JsonResponse(
						"Success",
						"",
						"Account created successfully."
				);
			}
			else {
				// Insert failed, return failure
				return new JsonResponse(
						"Failure",
						"",
						"Account creation failed. PreparedStatement returned non-1 value."
				);
			}
		}
		catch (SQLException e) {
			// return failure to front-end.
			System.out.println(e.getMessage());
			return new JsonResponse(
					"Error",
					"",
					"SQLException occured."
			);
		}
		catch (IllegalArgumentException e) {
			System.out.println(e.getMessage());
			return new JsonResponse(
					"Error",
					"",
					"IllegalArgumentException occured while hashing password."
			);
		}
		finally {
			conn.close();
		}
	}

}
