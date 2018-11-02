package platypus.api.handlers;

import platypus.api.JsonParser;
import platypus.api.models.User;
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
		Connection dbconn = null;
		
		try {
			dbconn = ds.getConnection();
			PreparedStatement stmt = dbconn.prepareStatement("SELECT username, pass FROM user WHERE username = ?");
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
				final URI uri = new URI(request.headers("Origin"));
				if("localhost".equals(uri.getHost()) || "platypus.null-terminator.com".equals(uri.getHost())) {
					response.cookie(uri.getHost(), "/", AuthFilter.TOKEN_COOKIE, authFilter.createSession(u.getUsername()),
							60 * 60 * 24 * 7, false, false);
					return new JsonResponse("SUCCESS", CacheUtil.buildCacheUtil(request, dbconn), "Login success.");	
				}
				return new JsonResponse("ERROR", "", "The request is from an unknown origin");

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
