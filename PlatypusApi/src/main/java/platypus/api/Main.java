package platypus.api;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.handlers.IndexHandler;
import platypus.api.handlers.LoginHandler;
import platypus.api.handlers.TaskHandler;
//import platypus.api.handlers.SettingsHandler;
import platypus.api.handlers.UserHandler;
import platypus.api.handlers.AuthFilter;
import platypus.api.handlers.CreateHandler;
import platypus.api.handlers.DocumentHandler;
import platypus.api.services.*;
import platypus.api.models.*;
import platypus.api.handlers.EventHandler;
import spark.Spark;

import java.util.Properties;

public class Main {
	
	public final static boolean IS_PRODUCTION = false;

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
		                Spark.post("/login", new LoginHandler(ds, authFilter), gson::toJson);
		            });
//		            Spark.before("/app/*", authFilter);
		            Spark.path("/app", () -> {
		            	Spark.before("/app/*", authFilter);
			            Spark.get("/test", (req, res) -> {
			                return "hi " + req.attribute(AuthFilter.USERNAME);
			            });

			            Spark.path("/task", () -> {
			            	
			            	// TODO, validate that this path works
			            	Spark.get("", (req, res) -> TaskHandler.get(ds, req), gson::toJson);
			            	
			            	Spark.post("/add", (req, res) -> TaskHandler.addTask(ds, req), gson::toJson);
			                Spark.post("/update", (req, res) -> TaskHandler.editTask(ds, req), gson::toJson);
		                    Spark.post("/delete", (req, res) -> TaskHandler.removeTask(ds, req), gson::toJson);
			            });
			            Spark.path("/event", () -> {
			            	Spark.get("", (req, res) -> EventHandler.get(ds, req), gson::toJson);
			                Spark.post("/add", (req, res) -> EventHandler.addEvent(ds, req), gson::toJson);
			                Spark.post("/update", (req, res) -> EventHandler.editEvent(ds, req), gson::toJson);
		                    Spark.post("/delete", (req, res) -> EventHandler.removeEvent(ds, req), gson::toJson);
			            });
			            Spark.path("/doc", () -> {
			            	Spark.get("", (req, res) -> DocumentHandler.get(ds, req), gson::toJson);
			            	Spark.post("/add", (req, res) -> DocumentHandler.addDoc(ds, req), gson::toJson);
			            	Spark.post("/update", (req, res) -> DocumentHandler.editDoc(ds, req), gson::toJson);
			            	Spark.post("/delete", (req, res) -> DocumentHandler.removeDoc(ds, req), gson::toJson);
		                });

			        }); //end app path grouping
			    });	//End api path grouping
				
	}
}