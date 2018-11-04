package platypus.api.models;


public class CacheEntry {
	private String username;
	private int userId;
	private int selfGroupId;
	private String selfGroupName;
	private GroupyWrapper[] groupList;

	
	public CacheEntry(String name, int id, int gid, String gn, GroupyWrapper[] groupy) {
		this.username = name;
		this.userId = id;
		this.selfGroupId = gid;
		this.selfGroupName = gn;
		this.groupList = groupy;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public int getId() {
		return this.userId;
	}
	
	public int getGroupId() {
		return this.selfGroupId;
	}
	
	public String getselfGroupName() {
		return this.selfGroupName;
	}
	
	@Override
	public String toString() {
		return "User [userId=" + this.userId + ", username=" + this.username + ", groupId=" + this.selfGroupId + ", selfGroupName=" + this.selfGroupName + "]";
	}
	
}