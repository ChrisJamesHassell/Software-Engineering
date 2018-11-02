
package platypus.api;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;


import platypus.api.handlers.IndexHandler;
import platypus.api.handlers.LoginHandler;
//import platypus.api.handlers.SettingsHandler;
import platypus.api.handlers.UserApi;
import platypus.api.handlers.AuthFilter;
import platypus.api.handlers.CreateHandler;
import platypus.api.services.*;
import platypus.api.models.*;
import platypus.api.handlers.EventApi;
import spark.Spark;


import java.util.Properties;

public class Main {

	public static void main(String[] args) {
		// To build on eclipse:
		// Right click on project, run as, maven install
		// Then in the `target/` project directory, copy the jar with dependencies to
		// server in some non public folder.
		// Then on server `java -jar
		// platypus-api-1.0-SNAPSHOT-jar-with-dependencies.jar`

		final Gson gson = new Gson();
		final HikariDataSource ds = InitService.initDatabase();
		final Properties emailConfig = InitService.initEmailConfig();
		InitService.initNotificationService(ds, emailConfig);
		InitService.initSparkConfig();
 
		final AuthFilter authFilter = new AuthFilter();
		
		
		// Setting up the path groups.
		// Setting up the path groups.
				Spark.path("/api", () -> {
					Spark.before("/api/*", authFilter);
					Spark.get("/api/test", (req, res) -> {return "hi " + req.attribute(AuthFilter.USERNAME);});
					});
					
					Spark.path("/user", () -> {
						Spark.post("/create/", new CreateHandler(ds, authFilter), gson::toJson);
		
						//TODO: User needs a GET route to return a User object with all of its groups.
			//			Spark.get("/settings", new SettingsHandler(ds, authFilter), gson::toJson);
				//		Spark.post("/login/", (req, res) -> UserApi.login(JsonParser.getObject(User.class, req.body(), ds), gson::toJson);
						Spark.post("/login/", new LoginHandler(ds, authFilter), gson::toJson);
					});
					Spark.path("/task", () -> {

					});
					Spark.path("/event", () -> {
						Spark.post("/add/", (req, res) -> EventApi.AddEvent(ds, req), gson::toJson);
						Spark.post("/update/", (req, res) -> EventApi.EditEvent(ds, req), gson::toJson);
						Spark.post("/delete/", (req, res) -> EventApi.RemoveEvent(ds, req), gson::toJson);
					});
					Spark.path("/doc", () -> {
						
					});
				
	}
}