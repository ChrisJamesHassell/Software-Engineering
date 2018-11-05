package platypus.api.models;

import java.util.Arrays;

public class LoginEntry extends CacheEntry {
	
	TaskWrapper[] tasks;
	EventWrapper[] events;
	DocumentWrapper[] documents;

	public LoginEntry(String name, int id, int gid, String gn, GroupyWrapper[] groupy) {
		super(name, id, gid, gn, groupy);
	}
	
	public TaskWrapper[] getTasks() {
		return tasks;
	}

	public void setTasks(TaskWrapper[] tasks) {
		this.tasks = tasks;
	}

	public EventWrapper[] getEvents() {
		return events;
	}

	public void setEvents(EventWrapper[] events) {
		this.events = events;
	}

	public DocumentWrapper[] getDocuments() {
		return documents;
	}

	public void setDocuments(DocumentWrapper[] documents) {
		this.documents = documents;
	}

	@Override
	public String toString() {
		return "LoginEntry [tasks=" + Arrays.toString(tasks) + ", events=" + Arrays.toString(events) + ", documents="
				+ Arrays.toString(documents) + ", getUsername()=" + getUsername() + ", getId()=" + getId()
				+ ", getGroupId()=" + getGroupId() + ", getselfGroupName()=" + getselfGroupName() + ", toString()="
				+ super.toString() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + "]";
	}

}
