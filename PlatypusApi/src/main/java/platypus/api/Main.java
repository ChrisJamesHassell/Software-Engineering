package platypus.api;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.handlers.HelloHandler;
import spark.Spark;

public class Main {

	public static void main(String[] args) {
		// To build on eclipse:
		// Right click on project, run as, maven install
		// Then in the `target/` project directory, copy the jar with dependencies to
		// server in some non public folder.
		// Then on server `java -jar
		// platypus-api-1.0-SNAPSHOT-jar-with-dependencies.jar`
		final Gson gson = new Gson();
		// DB conn pool config
		final HikariDataSource ds = new HikariDataSource();
		ds.setMaximumPoolSize(8);
		ds.setDriverClassName("org.mariadb.jdbc.Driver");
		ds.setJdbcUrl("jdbc:mariadb://127.0.0.1:3306/butts");
		ds.addDataSourceProperty("user", "root");
		ds.addDataSourceProperty("password", "lamepassword");
		ds.setAutoCommit(false);

		// Force the server to only listen on localhost:8080. Nginx will forward to this
		// interface / port.
		Spark.ipAddress("127.0.0.1");
		Spark.port(8080);
		Spark.get("/hello", new HelloHandler(ds), gson::toJson);
	}
}
