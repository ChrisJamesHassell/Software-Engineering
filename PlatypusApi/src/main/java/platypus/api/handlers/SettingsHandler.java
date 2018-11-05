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


public class SettingsHandler implements Route {
	private HikariDataSource ds;
	private AuthFilter authFilter;
	
	public SettingsHandler(HikariDataSource ds, AuthFilter auth) {
		this.ds = ds;
		this.authFilter = auth;
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception {
		try {
			Connection conn = ds.getConnection();
		} catch (SQLException e) {
			return new JsonResponse("ERROR", "", "SettingsHandler SQL error");
		}
		
		return new JsonResponse("SUCCESS", "", "Settings returned properly");
	}
	
}