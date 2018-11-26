package platypus.api.handlers;

public class ErrorMessage {
	// Private variables should only be thread safe, as the `handle()` method will
	// be called in a multi-threaded fashion.
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