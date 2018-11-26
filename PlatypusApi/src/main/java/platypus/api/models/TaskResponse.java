package platypus.api.models;

public class TaskResponse {

	private String username;
	private int userId;
	private int selfGroupId;
	private String selfGroupName;
	private Task task;
	
	public TaskResponse(String username, int userId, int selfGroupId, String selfGroupName, Task task) {
		super();
		this.username = username;
		this.userId = userId;
		this.selfGroupId = selfGroupId;
		this.selfGroupName = selfGroupName;
		this.task = task;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getSelfGroupId() {
		return selfGroupId;
	}

	public void setSelfGroupId(int selfGroupId) {
		this.selfGroupId = selfGroupId;
	}

	public String getSelfGroupName() {
		return selfGroupName;
	}

	public void setSelfGroupName(String selfGroupName) {
		this.selfGroupName = selfGroupName;
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	@Override
	public String toString() {
		return "TaskResponse [username=" + username + ", userId=" + userId + ", selfGroupId=" + selfGroupId
				+ ", selfGroupName=" + selfGroupName + ", task=" + task + "]";
	}
	
}
