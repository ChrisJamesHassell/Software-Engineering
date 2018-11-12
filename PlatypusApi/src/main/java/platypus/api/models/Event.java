package platypus.api.models;

import java.sql.Date;

public class Event extends Item {

	private Date start;
	private Date end;
	private String location;

	public Event() {
		super();
	}

	public Event(int itemID, ItemType type, String name, String description, Category category, Date notification,
			boolean pinned, Date start, Date end, String location) {
		super(itemID, type, name, description, category, notification, pinned);
		this.start = start;
		this.end = end;
		this.location = location;
	}

	public Date getStart() {
		return start;
	}

	public void setStart(Date start) {
		this.start = start;
	}

	public Date getEnd() {
		return end;
	}

	public void setEnd(Date end) {
		this.end = end;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	@Override
	public String toString() {
		return "Event [start=" + start + ", end=" + end + ", location=" + location + ", getItemID()=" + getItemID()
				+ ", getType()=" + getType() + ", getName()=" + getName() + ", getDescription()=" + getDescription()
				+ ", getCategory()=" + getCategory() + ", toString()=" + super.toString() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + "]";
	}

}
