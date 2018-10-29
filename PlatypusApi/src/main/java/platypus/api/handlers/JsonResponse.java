package platypus.api.handlers;

public class JsonResponse {
	
	String status;
	Object data; // This will be whatever the front-end needs.
	String message;
	
	public JsonResponse() {
		
	}
	
	public JsonResponse(String status, Object data, String message) {
		this.status = status;
		this.data = data;
		this.message = message;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public Object getData() {
		return data;
	}
	
	public void setData(Object data) {
		this.data = data;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
}
