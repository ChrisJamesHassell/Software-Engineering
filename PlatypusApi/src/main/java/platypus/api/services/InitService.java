package platypus.api.services;

import java.util.Properties;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.zaxxer.hikari.HikariDataSource;
import platypus.api.NotificationEngine;
import platypus.api.handlers.CorsFilter;
import spark.Spark;

public class InitService {

	public static void initNotificationService(HikariDataSource ds, Properties emailConfig) {
		final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
		scheduler.scheduleAtFixedRate(new NotificationEngine(ds, emailConfig), 1, 12, TimeUnit.HOURS);
	}

	public static HikariDataSource initDatabase() {
		HikariDataSource ds = new HikariDataSource();
		ds.setMaximumPoolSize(8);
		ds.setDriverClassName("org.mariadb.jdbc.Driver");
		ds.setJdbcUrl("jdbc:mariadb://127.0.0.1:3306/platypus");
		ds.addDataSourceProperty("user", "platypus");
		ds.addDataSourceProperty("password", "mydogfartsblue!ps");
		ds.setAutoCommit(true); // Changed to true
		return ds;
	}

	public static Properties initEmailConfig() {
		Properties emailConfig = new Properties();
		emailConfig.put("mail.smtp.auth", true);
		emailConfig.put("mail.smtp.starttls.enable", "true");
		emailConfig.put("mail.smtp.host", "smtp.gmail.com");
		emailConfig.put("mail.smtp.port", "587");
		emailConfig.put("username", "setest465@gmail.com");
		emailConfig.put("password", "mydogfartsblue!ps");
		return emailConfig;
	}

	public static void initSparkConfig() {
		// Force the server to only listen on localhost:8080. Nginx will forward to this interface / port.
		Spark.ipAddress("127.0.0.1");
		Spark.port(8080);
		Spark.options("/*", (request, response) -> {

			String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
			if (accessControlRequestHeaders != null) {
				response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
			}

			String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
			if (accessControlRequestMethod != null) {
				response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
			}

			return "OK";
		});

		Spark.before((request, response) -> {
			response.header("Access-Control-Allow-Origin", request.headers("Origin"));
			response.header("Access-Control-Allow-Credentials", "true");
			response.header("Vary", "Origin");
		});
	}
}
