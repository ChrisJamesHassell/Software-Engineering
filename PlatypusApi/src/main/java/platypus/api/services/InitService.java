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
		scheduler.scheduleAtFixedRate(new NotificationEngine(ds, emailConfig), 1, 30, TimeUnit.MINUTES);
	}

	public static HikariDataSource initDatabase() {
		HikariDataSource ds = new HikariDataSource();
		ds.setMaximumPoolSize(8);
		ds.setDriverClassName("org.mariadb.jdbc.Driver");
		ds.setJdbcUrl("jdbc:mariadb://127.0.0.1:3306/platypus");
		ds.addDataSourceProperty("user", "platypus");
		ds.addDataSourceProperty("password", "mydogfartsblue!ps");
		/* To create a mysql user in terminal:
			
			sudo su #swaps to root user
			mysql --user=root mysql #launches a local connection to the mysql database as root

			MariaDB [mysql]> DROP USER platypus@localhost;
			Query OK, 0 rows affected (0.00 sec)
			
			MariaDB [mysql]> FLUSH PRIVILEGES;
			Query OK, 0 rows affected (0.00 sec)
			
			MariaDB [mysql]> CREATE USER 'platypus'@'localhost' IDENTIFIED BY 'mydogfartsblue!ps';
			Query OK, 0 rows affected (0.00 sec)
			
			MariaDB [mysql]> GRANT ALL PRIVILEGES ON platypus.* TO 'platypus'@'localhost' WITH GRANT OPTION;
			Query OK, 0 rows affected (0.00 sec)
		 */
		ds.setAutoCommit(true); // Changed to true
		return ds;
	}

	public static Properties initEmailConfig() {
		Properties emailConfig = new Properties();
		emailConfig.put("mail.smtp.auth", true);
		emailConfig.put("mail.smtp.starttls.enable", "true");
		emailConfig.put("mail.smtp.host", "smtp.gmail.com"); // TODO
		emailConfig.put("mail.smtp.port", "465");
		// emailConfig.put("username", "someuser"); // TODO: set this
		// emailConfig.put("password", "somepass"); // TODO: set this
		return emailConfig;
	}

	public static void initSparkConfig() {
		// Force the server to only listen on localhost:8080. Nginx will forward to this
		// interface / port.
		Spark.ipAddress("127.0.0.1");
		Spark.port(8080); // TODO: This will probably need to be changed
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
