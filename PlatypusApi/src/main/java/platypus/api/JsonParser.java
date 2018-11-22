package platypus.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import util.DateParser;

public class JsonParser {

	private static final Gson gson = new GsonBuilder().setDateFormat(DateParser.DATE_FORMAT_STRING).create();

	public static <T> T getObject(Class<T> type, String json) {
		return gson.fromJson(json, type);
	}

}
