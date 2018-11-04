package platypus.api.handlers;

import platypus.api.JsonParser;
import platypus.api.models.User;
import platypus.api.models.CacheEntry;
import spark.Request;
import spark.Response;
import spark.Route;
import util.CacheUtil;

import org.mindrot.jbcrypt.BCrypt;

import java.net.URI;
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
		User u = JsonParser.getObject(User.class, request.body());

		// Set up connection to db
		System.out.println(u.getUsername());
		System.out.println(u.getPassword());
		Connection dbconn = null;

		try {
			dbconn = ds.getConnection();
			PreparedStatement stmt = dbconn
					.prepareStatement("SELECT username, userPassword, userID FROM user WHERE username = ?");
			stmt.setString(1, u.getUsername());
			ResultSet rows = stmt.executeQuery();
			stmt.close();

			if (!rows.next()) {
				System.out.print("The username/password does not exist");
				return new JsonResponse("FAIL", "", "Login failed: username/password does not exist.");
			}

			// The username exists, now validate the password.
			if (BCrypt.checkpw(u.getPassword(), rows.getString(2))) {
				u.setUserId(rows.getInt(3));

				String domain = request.headers("Host");
				if (domain.equalsIgnoreCase("localhost:8080") || domain.equalsIgnoreCase("127.0.0.1:8080")) {
					// Dev environment
					response.cookie("localhost", "/", AuthFilter.TOKEN_COOKIE, authFilter.createSession(u.getUsername()),
							60 * 60 * 24 * 7, false, false);
				} else {
					// Prod environment
					response.cookie(request.headers("Origin"), "/", AuthFilter.TOKEN_COOKIE,
							authFilter.createSession(u.getUsername()), 60 * 60 * 24 * 7, false, false);
				}

				// System.out.println("Request username should now be : " +
				// this.authFilter.getUsername());

				return new JsonResponse("SUCCESS", CacheUtil.buildCacheEntry(u.getUsername(), u.getUserId(), dbconn),
						"Login success.");
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
