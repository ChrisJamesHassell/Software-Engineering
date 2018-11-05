package platypus.api.models;

public class Task extends Item {

	private String deadline;
	private Priority priority;

	public Task() {
		super();
	}
	
	public Task(int itemID, ItemType type, String name, String description, Category category, String deadline, Priority priority) {
		super(itemID, type, name, description, category);
		this.deadline = deadline;
		this.priority = priority;
	}

	public String getDeadline() {
		return deadline;
	}
	
	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}
	
	public Priority getPriority() {
		return priority;
	}
	
	public void setPriority(Priority priority) {
		this.priority = priority;
	}

	@Override
	public String toString() {
		return "Task [deadline=" + deadline + ", priority=" + priority + ", getItemID()=" + getItemID() + ", getType()="
				+ getType() + ", getName()=" + getName() + ", getDescription()=" + getDescription() + ", getCategory()="
				+ getCategory() + ", toString()=" + super.toString() + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + "]";
	}
	
}
