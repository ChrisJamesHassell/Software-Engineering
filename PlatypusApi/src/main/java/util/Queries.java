package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import platypus.api.models.ItemType;

public class Queries {

	private static final String GET_TASKS = 
			"SELECT *" + 
			" FROM tasks JOIN has_tasks ON tasks.taskID = has_tasks.taskID" + 
			" WHERE tasks.taskID IN (SELECT (taskID) FROM has_tasks" +
			" WHERE groupID IN (SELECT (groupID) FROM belongs_to" +
			" WHERE userID = ?));";
	
	private static final String GET_EVENTS =
			"SELECT *" + 
			" FROM userevents JOIN has_events ON userevents.eventID = has_events.eventID" + 
			" WHERE userevents.eventID IN (SELECT (eventID) FROM has_events" + 
			" WHERE groupID IN (SELECT (groupID) FROM belongs_to" + 
			" WHERE userID = ?));";
	
	private static final String GET_DOCUMENTS = 
			"SELECT *" +
			" FROM documents JOIN has_documents ON documents.docID = has_documents.docID" +
			" WHERE documents.docID IN (SELECT (docID) FROM has_documents" +
			" WHERE groupID IN (SELECT (groupID) FROM belongs_to" +
			" WHERE userID = ?));";

	public static ResultSet getItems(ItemType type, Connection conn, int userId) throws SQLException {
		PreparedStatement ps = conn.prepareStatement(getQueryString(type));
		ps.setInt(1, userId);
		ResultSet rs = ps.executeQuery();
		ps.close();
		return rs;
	}
	
	private static String getQueryString(ItemType type) {
		switch(type) {
			case TASK:
				return GET_TASKS;
			case EVENT:
				return GET_EVENTS;
			case DOCUMENT:
				return GET_DOCUMENTS;
			default:
				return null;
		}
	}
	
}
