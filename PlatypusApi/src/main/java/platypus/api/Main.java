
package platypus.api;

import java.util.Properties;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.handlers.AuthFilter;
import platypus.api.handlers.CreateHandler;
import platypus.api.handlers.EventApi;
import platypus.api.handlers.LoginHandler;
import platypus.api.services.*;
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
		final HikariDataSource ds = InitService.initDatabase();
		final Properties emailConfig = InitService.initEmailConfig();
		InitService.initNotificationService(ds, emailConfig);
		InitService.initSparkConfig();

		final AuthFilter authFilter = new AuthFilter();

		Spark.path("/api", () -> {
			Spark.path("/user", () -> {
				Spark.post("/create", new CreateHandler(ds, authFilter), gson::toJson);

				// TODO: User needs a GET route to return a User object with all of its groups.
				// Spark.get("/settings", new SettingsHandler(ds, authFilter), gson::toJson);
				// Spark.get("/userstuff/", (req, res) -> UserApi.getUserInfo(ds,
				// authFilter.getUser(req.cookie(authFilter.TOKEN_COOKIE))), gson::toJson);
				Spark.post("/login", new LoginHandler(ds, authFilter), gson::toJson);
			});
			Spark.path("/app", () -> {
				Spark.before(authFilter);
				Spark.get("/test", (req, res) -> {
					return "hi " + req.attribute(AuthFilter.USERNAME);
				});

				Spark.path("/task", () -> {

				});
				Spark.path("/event", () -> {
					Spark.post("/add", (req, res) -> EventApi.AddEvent(ds, req), gson::toJson);
					Spark.post("/update", (req, res) -> EventApi.EditEvent(ds, req), gson::toJson);
					Spark.post("/delete", (req, res) -> EventApi.RemoveEvent(ds, req), gson::toJson);
				});
				Spark.path("/doc", () -> {

				});

			});
		});

	}
}