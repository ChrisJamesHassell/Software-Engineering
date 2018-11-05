package platypus.api;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;


import platypus.api.handlers.IndexHandler;
import platypus.api.handlers.LoginHandler;
import platypus.api.handlers.TaskApi;
//import platypus.api.handlers.SettingsHandler;
import platypus.api.handlers.UserApi;
import platypus.api.handlers.AuthFilter;
import platypus.api.handlers.CreateHandler;
import platypus.api.handlers.DocumentApi;
import platypus.api.services.*;
import platypus.api.models.*;
import platypus.api.handlers.EventApi;
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
		            Spark.before("/app/*", authFilter);
		            Spark.path("/app", () -> {
			            Spark.get("/test", (req, res) -> {
			                return "hi " + req.attribute(AuthFilter.USERNAME);
			            });

			            Spark.path("/task", () -> {
			            	
			            	// TODO, validate that this path works
			            	Spark.get("", (req, res) -> TaskApi.get(ds, req), gson::toJson);
			            	
			            	Spark.post("/add", (req, res) -> TaskApi.addTask(ds, req), gson::toJson);
			                Spark.post("/update", (req, res) -> TaskApi.editTask(ds, req), gson::toJson);
		                    Spark.post("/delete", (req, res) -> TaskApi.removeTask(ds, req), gson::toJson);
			            });
			            Spark.path("/event", () -> {
			         //   	Spark.get("/get", (req, res) -> EventApi.get(ds, req), gson::toJson);
			                Spark.post("/add", (req, res) -> EventApi.addEvent(ds, req), gson::toJson);
			                Spark.post("/update", (req, res) -> EventApi.editEvent(ds, req), gson::toJson);
		                    Spark.post("/delete", (req, res) -> EventApi.removeEvent(ds, req), gson::toJson);
			            });
			            Spark.path("/doc", () -> {
			            	Spark.post("/add", (req, res) -> DocumentApi.addDoc(ds, req), gson::toJson);
			            	Spark.post("/update", (req, res) -> DocumentApi.editDoc(ds, req), gson::toJson);
			            	Spark.post("/delete", (req, res) -> DocumentApi.removeDoc(ds, req), gson::toJson);
		                });

			        }); //end app path grouping
			    });	//End api path grouping
				
	}
}