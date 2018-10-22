package platypus.api.handlers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

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
		);
		
		if (!matchesRegexRequirements(u)) {
			return new JsonResponse(
					"Error",
					"",
					"Fields do not match regex requirements."
			);
		}
		
		// Connect to DB
		Connection conn = null;
		try {
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
	
	private boolean matchesRegexRequirements(User u) {
		if (!u.getUsername().matches("^(?=.*[a-zA-Z])[A-Za-z\\d]{8,32}$")) {
			System.out.println("here");
			return false;
		}
		else if (!u.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,32}$")) {
			System.out.println("here1");
			return false;
		}
		else if (!u.getFirstName().matches("^(?=.*[A-Za-z])[A-Za-z]{1,32}$")) {
			System.out.println("here2");
			return false;
		}
		else if (!u.getLastName().matches("^(?=.*[A-Za-z])[A-Za-z]{1,32}$")) {
			System.out.println("here3");
			return false;
		}
		else if (!u.getEmail().matches("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")) {
			System.out.println("here4");
			return false;
		}
		else if (!u.getDateOfBirth().matches("^.+$")) {
			System.out.println("here5");
			return false;
		}
		return true;
	}

}
