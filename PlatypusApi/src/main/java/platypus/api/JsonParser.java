package platypus.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class JsonParser {

	private static final Gson gson = new Gson();
	
	public static <T> T getObject(Class<T> type, String json){
		return gson.fromJson(json, type);
	}
	
	// Append one JsonObject with another.
	public static String appendJson(JsonObject j1, JsonObject j2) {
		j1.geta
	}
}
