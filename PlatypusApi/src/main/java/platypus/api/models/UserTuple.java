package platypus.api.models;


public class UserTuple {
	private String username;
	private int userId;
	
	
	public UserTuple(String name, int id) {
		this.username = name;
		this.userId = id;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public int getId() {
		return this.userId;
	}
	
	@Override
	public String toString() {
		return "User [userId=" + userId + ", username=" + username + "]";
	}
	
}