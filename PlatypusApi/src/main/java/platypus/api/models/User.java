package platypus.api.models;


public class User {
	//Bare minimum for the functionality to create a new User at the moment.
	private int userid;
	private String username;
	private String pass;
	private String email;
	private String name;
	
	public User(int id, String username, String pass, String email, String name) {
		this.userid = id;
		this.username = username;
		this.pass = pass;
		this.email = email;
		this.name = name;
	}
	
	public int GetId() {
		return userid;
	}
	
	public String GetUserName() {
		return username;
	}
	
	public String GetPass() {
		return pass;
	}
	
	public String GetEmail() {
		return email;
	}
	
	public String GetName() {
		return name;
	}
}

