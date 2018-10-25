package platypus.api.models;

public class Event extends Item {

	private String start;
	private String end;
	private String location;
	
	public Event() {
		super();
	}

	public Event(int itemID, ItemType type, String name, String description, Category category, String start, String end, String location) {
		super(itemID, type, name, description, category);
		this.start = start;
		this.end = end;
		this.location = location;
	}

	public String getStart() {
		return start;
	}
	
	public void setStart(String start) {
		this.start = start;
	}
	
	public String getEnd() {
		return end;
	}
	
	public void setEnd(String end) {
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
