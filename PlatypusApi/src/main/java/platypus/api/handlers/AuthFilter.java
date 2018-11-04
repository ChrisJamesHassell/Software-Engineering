package platypus.api.handlers;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import spark.Filter;
import spark.Request;
import spark.Response;
import spark.Spark;

public class AuthFilter implements Filter {
	public static final String TOKEN_COOKIE = "tokepi";
	public static final String USERNAME = "USERNAME";

	private final ConcurrentHashMap<String, String> sessions;

	public AuthFilter() {
		this.sessions = new ConcurrentHashMap<>(); // Has to be concurrent cause everything is sharing this filter ==>
													// Thread safe
	}

	public String createSession(String userName) {
		String token = UUID.randomUUID().toString() + "." + UUID.randomUUID().toString();
		sessions.put(token, userName);
		return token;
	}
	
	/* 
	 *  Returns the username corresponding to the cookie in the sessions map.
	 *  Useful for figuring out what username corresponds to a request.
	 */ 
	public String getUsername(String cookie) {
		String username = sessions.get(cookie);
		return username;
	}
	
	@Override
	public void handle(Request request, Response response) throws Exception {
		String token = request.cookie(TOKEN_COOKIE);
		System.out.println("Token cookie: " + token);
		if(token == null) {
			throw Spark.halt(401, "Cookie not found");
		}
		String userName = sessions.get(token);
		if (userName == null) {
			throw Spark.halt(401, "This can be JSON later, but means unauthorized");
		}
		request.attribute(USERNAME, userName);

	}

}
