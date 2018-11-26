package platypus.api;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.Properties;
import java.util.stream.Stream;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;

import platypus.api.handlers.JsonResponse;
import platypus.api.models.Document;
import platypus.api.models.DocumentWrapper;
import platypus.api.models.Event;
import platypus.api.models.EventWrapper;
import platypus.api.models.ItemType;
import platypus.api.models.Priority;
import platypus.api.models.Task;
import platypus.api.models.TaskWrapper;
import util.Queries;

public class NotificationEngine implements Runnable {

	private final DataSource dataSource;
	private final Properties emailConfig;
	private final String NOTIF_EMAIL = "setest465@gmail.com";
	
	public NotificationEngine(DataSource dataSource, Properties emailConfig) {
		this.dataSource = dataSource;
		this.emailConfig = emailConfig;
	}

	@Override
	public void run() {
		// Connect to the mail server
		Session session = Session.getInstance(emailConfig, new Authenticator() {
	    @Override
		    protected PasswordAuthentication getPasswordAuthentication() {
		        return new PasswordAuthentication(emailConfig.getProperty("username"), emailConfig.getProperty("password"));
		    }
		});
		
		String emailBody = null;
		
		try (Connection conn = dataSource.getConnection()) {
			
			try (PreparedStatement stmt = conn.prepareStatement("SELECT userID, email, username FROM users")) {

				try (ResultSet rs = stmt.executeQuery()) {
					// rs now has all users in db.
					while (rs.next()) {
						// Get all items for each user in the result set, while filtering for those with a notification
						// date of today.
						EventWrapper events[] = getNotifEvents(conn, rs.getInt(1));
						TaskWrapper tasks[] = getNotifTasks(conn, rs.getInt(1));
						DocumentWrapper docs[] = getNotifDocs(conn, rs.getInt(1));
						emailBody = buildEmailBody(events, tasks, docs);
						
						if (emailBody.equals("")) {
							System.out.println("No notification for this user");
						} else {
							System.out.println("Sending email for user: " + rs.getInt(1));
							try {
								sendEmail(session, NOTIF_EMAIL, rs.getString(2), emailBody);
							} catch (MessagingException e) {
								e.printStackTrace();
							}
						}
						
					}
				}
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}	
	}
	

	private void sendEmail(Session session, String fromAddress, String toAddress, String body) throws MessagingException {
		Message message = new MimeMessage(session);
		message.setFrom(new InternetAddress(fromAddress));
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toAddress));
		message.setSubject("Platypus Notifications");
		MimeBodyPart mimeBodyPart = new MimeBodyPart();
		mimeBodyPart.setContent(body, "text/plain");
		Multipart multipart = new MimeMultipart();
		multipart.addBodyPart(mimeBodyPart);
		message.setContent(multipart);
		Transport.send(message);
	}
	
	
	// Iterates through the item wrappers for a user and builds their notification email body.
	private static String buildEmailBody(EventWrapper[] events, TaskWrapper[] tasks, DocumentWrapper[] docs) {
		String emailBody = "";
	
		for (int i = 0; i < events.length; i++) {
			emailBody += "\nEvent: " + events[i].getEvent().getName() + " comes up on " + events[i].getEvent().getStart();
		}
		
		for (int i = 0; i < tasks.length; i++) {
			emailBody += "\nTask: " + tasks[i].getTask().getName() + " with a " + tasks[i].getTask().getPriority() + " still needs to be completed.  You are not being professional :( ";
		}
		
		for (int i = 0; i < docs.length; i++) {
			emailBody += "\nDocument: " + docs[i].getDocument().getName() + " had a notification set for today.";
		}
		return emailBody;
	}
	
	 
	//  Gets all events for the given user that need to be notified today.
	private static EventWrapper[] getNotifEvents(Connection conn, int userID) throws SQLException {
		ResultSet items = Queries.getItems(ItemType.EVENT, conn, userID);
		ArrayList<EventWrapper> events = new ArrayList<>();
		
		while (items.next()) {
			Event e = new Event();
			e.setName(items.getString(getColumnWithName("name", items)));
			e.setNotification(items.getDate(getColumnWithName("notification", items)));
			e.setStart(items.getDate(getColumnWithName("startDate", items)));
			events.add(new EventWrapper(e, items.getInt(getColumnWithName("groupID", items))));
		}
		items.close();
		
		Stream<EventWrapper> stream = events.stream().filter(t -> {
			if (dateEquals(t.getEvent().getNotification())) {
				return true;
			}
			return false;
		});

		return stream.toArray(EventWrapper[]::new);
	}
	
	
	// Gets all tasks for given user that need to be notified today.
	public static TaskWrapper[] getNotifTasks(Connection conn, int userID) throws SQLException {
		ResultSet rs = Queries.getItems(ItemType.TASK, conn, userID);
		ArrayList<TaskWrapper> tasks = new ArrayList<>();
		
		while (rs.next()) {
			Task t = new Task();
			t.setName(rs.getString(getColumnWithName("name", rs)));
			t.setNotification(rs.getDate(getColumnWithName("notification", rs)));
			t.setPriority(Priority.valueOf(rs.getString(getColumnWithName("priority", rs)).toUpperCase()));
			tasks.add(new TaskWrapper(t, rs.getInt(getColumnWithName("groupID", rs))));
		}
		rs.close();
		
		Stream<TaskWrapper> stream = tasks.stream().filter(t -> {
			if (dateEquals(t.getTask().getNotification())) {
				return true;
			}
			return false;
		});
		
		return stream.toArray(TaskWrapper[]::new);
	}
	
	
	
	public static DocumentWrapper[] getNotifDocs(Connection conn, int userID) throws SQLException {
		ResultSet rs = Queries.getItems(ItemType.DOCUMENT, conn, userID);
		ArrayList<DocumentWrapper> docs = new ArrayList<>();
		
		while (rs.next()) {
			Document d = new Document();
			d.setName(rs.getString(getColumnWithName("name", rs)));
			d.setNotification(rs.getDate(getColumnWithName("notification", rs)));
			docs.add(new DocumentWrapper(d, rs.getInt(getColumnWithName("groupID", rs))));
		}
		rs.close();
		
		Stream<DocumentWrapper> stream = docs.stream().filter(t -> {
			if (dateEquals(t.getDocument().getNotification())) {
				return true;
			}
			return false;
		});
		
		return stream.toArray(DocumentWrapper[]::new);	
	}
	
	
	private static boolean dateEquals(java.sql.Date itemDate) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
					
		if (itemDate != null) {
			Date test = new Date();
			LocalDateTime ldt = LocalDateTime.ofInstant(test.toInstant(), ZoneId.systemDefault());
			Date comparison = Date.from(ldt.atZone(ZoneId.systemDefault()).toInstant());
			
			if (DateFormat.getDateInstance().format(itemDate).compareTo(DateFormat.getDateInstance().format(comparison))  == 0) {
				return true;
			}
		}	
		return false;
	}

	
	
	
	private static int getColumnWithName(String s, ResultSet rs) throws SQLException {
		ResultSetMetaData md = rs.getMetaData();
		int count = md.getColumnCount();
		for (int i = 1; i <= count; i++) {
		    if (md.getColumnName(i).equals(s)) {
		        return i;
		    }
		}
		// Doesn't exist
		return -1;
	}
	
	
}
