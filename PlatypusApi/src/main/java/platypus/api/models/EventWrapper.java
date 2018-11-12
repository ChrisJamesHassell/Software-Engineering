package platypus.api.models;

public class EventWrapper {

	Event event;
	int groupID;
	
	public EventWrapper(Event e, int groupID) {
		this.event = e;
		this.groupID = groupID;
	}
	
	public Event getEvent() {
		return event;
	}
	
	public void setEvent(Event e) {
		this.event = e;
	}
	
	public int getGroupID() {
		return groupID;
	}
	
	public void setGroupID(int groupID) {
		this.groupID = groupID;
	}

}
