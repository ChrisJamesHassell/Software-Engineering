package platypus.api.handlers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;

import platypus.api.models.Auto;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;

public class HelloHandler implements Route {

	// Private variables should only be thread safe, as the `handle()` method will be called in a multi-threaded fashion.
	private DataSource ds;
	public HelloHandler(DataSource ds) {
		this.ds = ds;
	}
	
	@Override
	public Object handle(Request request, Response response) throws Exception {
		List<Auto> output = new ArrayList<>();
		try (Connection db = ds.getConnection()) {
			PreparedStatement stmt = db.prepareStatement("SELECT blah FROM testbutts");
			try(ResultSet rows = stmt.executeQuery()){
				while(rows.next()) {
					Auto auto = new Auto();
					auto.setButt(rows.getInt("blah"));
					auto.setButtstring("Derek is the biggest butt");
					output.add(auto);
				}
			}
		}
		catch (SQLException e) {
			response.status(500);
			return new ErrorMessage(e);
		}
		return output;
	}
    
}
