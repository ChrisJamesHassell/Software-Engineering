package platypus.api.models;

public class Group {

	private int userId;
	private int groupId;
	private String name;
	private boolean self;
	private int ownerId;
	
	public Group(int userId, int groupId, String name, boolean self, int ownerId) {
		super();
		this.userId = userId;
		this.groupId = groupId;
		this.name = name;
		this.self = self;
		this.ownerId = ownerId;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getGroupId() {
		return groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public boolean isSelf() {
		return self;
	}

	public void setSelf(boolean self) {
		this.self = self;
	}

	public int getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(int ownerId) {
		this.ownerId = ownerId;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Group [userId=" + userId + ", groupId=" + groupId + ", self=" + self + ", ownerId=" + ownerId + ", name= " + name + "]";
	}
	
}
