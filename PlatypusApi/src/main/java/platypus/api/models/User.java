package platypus.api.models;

public class User {

	private int userId;
	private String firstName;
	private String lastName;
	private String email;
	private String username;
	private String pass;
	private String dateOfBirth;

	public User() {

	}

	public User(String fn, String ln, String e, String un, String p, String dob) {
		this.firstName = fn;
		this.lastName = ln;
		this.email = e;
		this.username = un;
		this.pass = p;
		dateOfBirth = dob;
	}

	public User(int u, String fn, String ln, String e, String un, String p, String dob) {
		this.userId = u;
		this.firstName = fn;
		this.lastName = ln;
		this.email = e;
		this.username = un;
		this.pass = p;
		dateOfBirth = dob;
	}

	public User(String un, String p) {
		this.username = un;
		this.pass = p;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return pass;
	}

	public void setPassword(String password) {
		this.pass = password;
	}

	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dob) {
		dateOfBirth = dob;
	}

	@Override
	public String toString() {
		return "User [userId=" + userId + ", firstName=" + firstName + ", lastName=" + lastName + ", email=" + email
				+ ", username=" + username + ", password=" + pass + ", dateOfBirth=" + dateOfBirth + "]";
	}

}