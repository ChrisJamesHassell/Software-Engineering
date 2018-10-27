package platypus.api.handlers;
import platypus.api.models.Event;
import com.zaxxer.hikari.HikariDataSource;

public class EventApi {
	
	public static JsonResponse AddEvent(Event e, HikariDataSource ds) {
		return new JsonResponse("SUCCESS", "", "Add event succ");
	}
	
	public static JsonResponse EditEvent(Event e, HikariDataSource ds) {
		return new JsonResponse("SUCCESS", "", "Edit event succ");
	}
	
	public static JsonResponse RemoveEvent(Event e, HikariDataSource ds) {
		return new JsonResponse("SUCCESS", "", "Remove event succ");
	}
	
}

