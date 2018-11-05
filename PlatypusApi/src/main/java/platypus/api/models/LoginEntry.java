package platypus.api.models;

import java.util.Arrays;

public class LoginEntry extends CacheEntry {
	
	Task[] tasks;
	Event[] events;
	Document[] documents;

	public LoginEntry(String name, int id, int gid, String gn, GroupyWrapper[] groupy) {
		super(name, id, gid, gn, groupy);
	}
	
	public Task[] getTasks() {
		return tasks;
	}

	public void setTasks(Task[] tasks) {
		this.tasks = tasks;
	}

	public Event[] getEvents() {
		return events;
	}

	public void setEvents(Event[] events) {
		this.events = events;
	}

	public Document[] getDocuments() {
		return documents;
	}

	public void setDocuments(Document[] documents) {
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
