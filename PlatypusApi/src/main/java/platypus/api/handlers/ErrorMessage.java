package platypus.api.handlers;

public class ErrorMessage {

	private String value;

	public ErrorMessage(String val) {
		setValue(val);
	}

	public ErrorMessage(Exception ex) {
		setValue(ex.getMessage());
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}