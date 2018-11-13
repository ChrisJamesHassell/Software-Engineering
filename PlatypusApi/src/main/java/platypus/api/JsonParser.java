package platypus.api;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import platypus.api.models.Category;
import spark.Request;

public class JsonParser {

	private static final Gson gson = new Gson();
	
	public static <T> T getObject(Class<T> type, String json){
		return gson.fromJson(json, type);
	}
	
	
	/*
	 What FE request for filtered items should look like
	 
	 {
	 	"user":{
	 		"userId":xxxxx
	 	},
	 	"group":{
	 		"groupId":xxxxx
	 	},
	 	"filter":{
	 		"category":AUTO,
	 		"weeksAhead":2,
	 		"pinned":true
	 	}
	 }
	 */
	
}
