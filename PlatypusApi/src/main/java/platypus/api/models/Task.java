package platypus.api.models;

import java.sql.Date;

public class Task extends Item {

	private Date deadline;
	private Priority priority;
	private boolean completed;

	public Task() {
		super();
	}

	public Task(int itemID, ItemType type, String name, String description, Category category, Date notification,
			boolean pinned, Date deadline, Priority priority, boolean completed) {
		super(itemID, type, name, description, category, notification, pinned);
		this.deadline = deadline;
		this.priority = priority;
		this.completed = completed;
	}

	public Date getDeadline() {
		return deadline;
	}

	public void setDeadline(Date deadline) {
		this.deadline = deadline;
	}

	public Priority getPriority() {
		return priority;
	}

	public void setPriority(Priority priority) {
		this.priority = priority;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean b) {
		completed = b;
	}

	@Override
	public String toString() {
		return "Task [deadline=" + deadline + ", priority=" + priority + ", getItemID()=" + getItemID() + ", getType()="
				+ getType() + ", getName()=" + getName() + ", getDescription()=" + getDescription() + ", getCategory()="
				+ getCategory() + ", toString()=" + super.toString() + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + "]";
	}

}
