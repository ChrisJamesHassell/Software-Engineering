package platypus.api;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

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

public class NotificationEngine implements Runnable {

	private final DataSource dataSource;
	private final Properties emailConfig;

	public NotificationEngine(DataSource dataSource, Properties emailConfig) {
		this.dataSource = dataSource;
		this.emailConfig = emailConfig;
	}

	@Override
	public void run() {
		// Connect to the mail server
//		Session session = Session.getInstance(emailConfig, new Authenticator() {
//		    @Override
//		    protected PasswordAuthentication getPasswordAuthentication() {
//		        return new PasswordAuthentication(emailConfig.getProperty("username"), emailConfig.getProperty("password"));
//		    }
//		});
//		// These are try-blocks with auto-closing. obj.close() will be automatically called when the scope dies
//		try (Connection sqlConn = dataSource.getConnection()) {
//			try (PreparedStatement stmt = sqlConn.prepareStatement("TODO")) {
//				try (ResultSet results = stmt.executeQuery()) {
//					while (results.next()) {
//						// send email
//						sendEmail(session, "from address", "body here");
//					}
//				}
//			}
//		} catch (SQLException ex) {
//			ex.printStackTrace();
//		} catch(MessagingException ex) {
//			ex.printStackTrace();
//		}
	}

	private void sendEmail(Session session, String fromAddress, String body) throws MessagingException {
		Message message = new MimeMessage(session);
		message.setFrom(new InternetAddress("from@gmail.com"));
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse("to@gmail.com"));
		message.setSubject("Mail Subject");
		String msg = "This is my first email using JavaMailer";
		MimeBodyPart mimeBodyPart = new MimeBodyPart();
		mimeBodyPart.setContent(msg, "text/plain");
		Multipart multipart = new MimeMultipart();
		multipart.addBodyPart(mimeBodyPart);
		message.setContent(multipart);
		Transport.send(message);
	}
}
