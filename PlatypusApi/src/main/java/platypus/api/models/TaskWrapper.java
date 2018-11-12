package platypus.api.models;

public class TaskWrapper {

	Task task;
	int groupID;
	
	public TaskWrapper(Task t, int groupID) {
		this.task = t;
		this.groupID = groupID;
	}
	
	public Task getTask() {
		return task;
	}
	
	public void setTask(Task t) {
		this.task = t;
	}
	
	public int getGroupID() {
		return groupID;
	}
	
	public void setGroupID(int groupID) {
		this.groupID = groupID;
	}
	
}
