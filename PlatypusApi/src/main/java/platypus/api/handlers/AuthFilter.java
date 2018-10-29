package platypus.api.handlers;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import platypus.api.models.UserTuple;
import spark.Filter;
import spark.Request;
import spark.Response;
import spark.Spark;

public class AuthFilter implements Filter {
	public static final String TOKEN_COOKIE = "tokepi";
	public static final String USERNAME = "USERNAME";

	private final ConcurrentHashMap<String, UserTuple> sessions;

	public AuthFilter() {
		this.sessions = new ConcurrentHashMap<>(); // Has to be concurrent cause everything is sharing this filter ==>
													// Thread safe
	}

	public String createSession(String userName, int id) {
		String token = UUID.randomUUID().toString() + "." + UUID.randomUUID().toString();
		UserTuple user = new UserTuple(userName, id);
		sessions.put(token, user);
		return token;
	}
	
	/* 
	 *  Returns the username + id corresponding to the request cookie.
	 */ 
	public UserTuple getUser(String cookie) {
		UserTuple user = sessions.get(cookie);
		return user;
	}
	
	@Override
	public void handle(Request request, Response response) throws Exception {
		String token = request.cookie(TOKEN_COOKIE);
	
		if(token == null) {
			throw Spark.halt(401, "Cookie not found");
		}
		
		UserTuple user = sessions.get(token);
		String userName = user.getUsername();
		
		if (userName == null) {
			throw Spark.halt(401, "This can be JSON later, but means unauthorized");
		}
		request.attribute(USERNAME, userName);
		
		System.out.println(this.sessions.toString());
		
	}

}