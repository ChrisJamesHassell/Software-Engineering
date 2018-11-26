package platypus.api.handlers;

import java.net.URI;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.mindrot.jbcrypt.BCrypt;

import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.Main;
import platypus.api.models.User;
import spark.Request;
import spark.Response;
import spark.Route;
import java.util.HashMap;
import util.*;

import com.google.gson.Gson;
import com.google.gson.*;

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
			PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) AS total FROM users WHERE username = ?");
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
			CallableStatement st = conn.prepareCall("{call insertUser(?, ?, ?, ?, ?, ?)}");
			st.setString(1, u.getUsername());
			st.setString(2, u.getFirstName());
			st.setString(3, u.getLastName());
			st.setString(4, u.getEmail());
			st.setString(5, BCrypt.hashpw(u.getPassword(), BCrypt.gensalt()));
			st.setString(6, u.getDateOfBirth());
			st.executeUpdate();

			// Get user id for cookie
			ps = conn.prepareStatement("SELECT userID FROM users WHERE username = ?");
			ps.setString(1, u.getUsername());
			ResultSet rows = ps.executeQuery();
			ps.close();
			int id;

			if (!rows.next()) {
				return new JsonResponse("ERROR", "", "Error in retrieving userId for cookie.");
			} else {
				id = rows.getInt(1);
			}
			rows.close();

			// Branch cookie settings depending on if using production environment.
			if (!Main.IS_PRODUCTION) {
				// set cookie here
				response.cookie("localhost", "/", AuthFilter.TOKEN_COOKIE, authFilter.createSession(u.getUsername()),
						60 * 60 * 24 * 7, false, false);
				// Insert success, return success
				return new JsonResponse("SUCCESS", CacheUtil.buildCacheEntry(u.getUsername(), id, conn),
						"Account created successfully.");
			} else {
				final URI uri = new URI(request.headers("Origin"));
				if ("localhost".equals(uri.getHost()) || "platypus.null-terminator.com".equals(uri.getHost())) {
					response.cookie(uri.getHost(), "/", AuthFilter.TOKEN_COOKIE, authFilter.createSession(u.getUsername()),
							60 * 60 * 24 * 7, false, false);
					// Insert success, return success
					return new JsonResponse("SUCCESS", CacheUtil.buildCacheEntry(u.getUsername(), id, conn),
							"Account created successfully.");
				}
				return new JsonResponse("ERROR", "", "The request is from an unknown origin");
			}
		} catch (SQLException e) {
			// return failure to front-end.
			e.printStackTrace();
			String error = e.getMessage(); // SQLException occurred
			HashMap<String, Integer> errorMap = new HashMap<>();
			errorMap.put("email: " + u.getEmail(), error.indexOf("unique_email"));
			errorMap.put("username: " + u.getUsername(), error.indexOf("unique_username"));
			for (String key : errorMap.keySet()) {
				if (errorMap.get(key) > -1)
					error = "ERROR: User with " + key + " already exists.";
			}
			
			return new JsonResponse("ERROR", "", error);
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