package platypus.api;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.handlers.HelloHandler;
import platypus.api.handlers.IndexHandler;
import platypus.api.handlers.LoginHandler;
import platypus.api.handlers.AuthFilter;
import platypus.api.handlers.CorsFilter;
import platypus.api.handlers.CreateHandler;
import platypus.api.services.*;
import spark.Service.StaticFiles;
import spark.embeddedserver.EmbeddedServers;
import spark.embeddedserver.jetty.EmbeddedJettyServer;
import spark.embeddedserver.jetty.JettyHandler;
import spark.http.matching.MatcherFilter;
import spark.route.Routes;
import spark.servlet.SparkApplication;
import spark.staticfiles.StaticFilesConfiguration;
import spark.Spark;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Properties;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Main {

	public static void main(String[] args) {
		// To build on eclipse:
		// Right click on project, run as, maven install
		// Then in the `target/` project directory, copy the jar with dependencies to
		// server in some non public folder.
		// Then on server `java -jar
		// platypus-api-1.0-SNAPSHOT-jar-with-dependencies.jar`

		final Gson gson = new Gson();
		
		// ***************************** //
		// DB stuff
		// ***************************** //
		// DB conn pool config
		final HikariDataSource ds = InitService.initDatabase();
//		ds.setMaximumPoolSize(8);
//		ds.setDriverClassName("org.mariadb.jdbc.Driver");
//		ds.setJdbcUrl("jdbc:mariadb://127.0.0.1:3306/platypus"); // TODO, agree on a database name.
//		ds.addDataSourceProperty("user", "root");
//		ds.addDataSourceProperty("password", "lamepassword");
//		ds.setAutoCommit(true); // Changed to true

		final Properties emailConfig = InitService.initEmailConfig();
//		final Properties emailConfig = new Properties();
//		emailConfig.put("mail.smtp.auth", true);
//		emailConfig.put("mail.smtp.starttls.enable", "true");
//		emailConfig.put("mail.smtp.host", "smtp.gmail.com"); // TODO
//		emailConfig.put("mail.smtp.port", "465");
		// emailConfig.put("username", "someuser");
		// emailConfig.put("password", "somepass");
		final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
		// scheduler.scheduleAtFixedRate(new NotificationEngine(ds, emailConfig), 1, 30,
		// TimeUnit.MINUTES);

//		// Force the server to only listen on localhost:8080. Nginx will forward to this
//		// interface / port.
		InitService.initSparkConfig();
		//		
//		Spark.ipAddress("127.0.0.1");
//		Spark.port(8080);
//		CorsFilter.apply();
		
//		Spark.options("/*",
//		        (request, response) -> {
//
//		            String accessControlRequestHeaders = request
//		                    .headers("Access-Control-Request-Headers");
//		            if (accessControlRequestHeaders != null) {
//		                response.header("Access-Control-Allow-Headers",
//		                        accessControlRequestHeaders);
//		            }
//
//		            String accessControlRequestMethod = request
//		                    .headers("Access-Control-Request-Method");
//		            if (accessControlRequestMethod != null) {
//		                response.header("Access-Control-Allow-Methods",
//		                        accessControlRequestMethod);
//		            }
//
//		            return "OK";
//		        });
//
//		Spark.before((request, response) -> {
//			response.header("Access-Control-Allow-Origin", request.headers("Origin"));
//			response.header("Access-Control-Allow-Credentials", "true");
//			response.header("Vary", "Origin");
//		});

		//Spark.get("/", new IndexHandler(), gson::toJson);
		final AuthFilter authFilter = new AuthFilter();
		
		// Setting up the path groups.
		Spark.path("/", () -> {
			Spark.before("/api/*", authFilter);
//			Spark.get("/api/test", (req, res) -> {return "hi " + req.attribute(AuthFilter.USERNAME);});
			Spark.path("/user", () -> {
				// Spark.verb(String, Route, ResponseTransformer.render(Object));
//				Spark.post("/create/:firstname/:lastname/:email/:username/:password/:dateofbirth", new CreateHandler(ds), gson::toJson); //Update this to be a userCreate handler
				Spark.post("/create", new CreateHandler(ds), gson::toJson);
				Spark.get("/settings", new IndexHandler(), gson::toJson); //Update to settings manager
//				Spark.post("/login/:username/:password", new LoginHandler(ds, authFilter), gson::toJson);
				Spark.post("/login", new LoginHandler(ds, authFilter), gson::toJson);
			});
		});	
	}
}
