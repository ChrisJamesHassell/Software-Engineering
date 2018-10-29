package platypus.api.handlers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.mindrot.jbcrypt.BCrypt;

import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.User;
import spark.Request;
import spark.Response;
import spark.Route;

public class CreateHandler implements Route {

	HikariDataSource ds;
	private AuthFilter authFilter;

	public CreateHandler(HikariDataSource ds, AuthFilter authFilter) {
		this.ds = ds;
		this.authFilter = authFilter;
	}


	@Override
	public Object handle(Request request, Response response) throws Exception {
		User u = JsonParser.getObject(User.class, request.body());
		
		if (!matchesRegexRequirements(u)) {
			return new JsonResponse("ERROR", "", "Fields do not match regex requirements.");
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
				return new JsonResponse("FAIL", "", "Username already exists.");
			}
			rs.close();

			// Create account in the database
			ps = conn.prepareStatement(
					"INSERT INTO user (firstName, lastName, email, username, userPassword, dateOfBirth) VALUES (?,?,?,?,?,?)");
			ps.setString(1, u.getFirstName());
			ps.setString(2, u.getLastName());
			ps.setString(3, u.getEmail());
			ps.setString(4, u.getUsername());
			ps.setString(5, BCrypt.hashpw(u.getPassword(), BCrypt.gensalt()));
			ps.setString(6, u.getDateOfBirth());
			int ret = ps.executeUpdate();
			ps.close();
			if (ret == 1) {
				//Get user id for cookie
				ps = conn.prepareStatement("SELECT userID FROM user WHERE username = ?");
				ps.setString(1, u.getUsername());
				ResultSet rows = ps.executeQuery();
				int id;
				if (!rows.next()) {
					System.out.println("Some fuckywucky here");
					return new JsonResponse("ERROR", "", "Made a fuckywucky in retrieving userId for cookie.");
				} else {
					id = rows.getInt(1);
				}
				// set cookie here
				response.cookie("localhost", "/", AuthFilter.TOKEN_COOKIE, authFilter.createSession(u.getUsername(), id),
						60 * 60 * 24 * 7, false, false);
				// Insert success, return success
				return new JsonResponse("SUCCESS", "", "Account created successfully.");
			} else {
				// Insert failed, return failure
				return new JsonResponse("FAIL", "", "Account creation failed. PreparedStatement returned non-1 value.");
			}
		} catch (SQLException e) {
			// return failure to front-end.
			System.out.println(e.getMessage());
			return new JsonResponse("ERROR", "", "SQLException occured.");
		} catch (IllegalArgumentException e) {
			System.out.println(e.getMessage());
			return new JsonResponse("ERROR", "", "IllegalArgumentException occured while hashing password.");
		} finally {
			conn.close();
		}
	}

	private boolean matchesRegexRequirements(User u) {
		if (!u.getUsername().matches("^(?=.*[a-zA-Z])[A-Za-z\\d]{8,32}$")) {
			return false;
		} else if (!u.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,32}$")) {
			return false;
		} else if (!u.getFirstName().matches("^(?=.*[A-Za-z])[A-Za-z]{1,32}$")) {
			return false;
		} else if (!u.getLastName().matches("^(?=.*[A-Za-z])[A-Za-z]{1,32}$")) {
			return false;
		} else if (!u.getEmail().matches("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")) {
			return false;
		} else if (!u.getDateOfBirth().matches("^.+$")) {
			return false;
		}
		return true;
	}

}
