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
		System.out.println(token);
		return token;
	}

	@Override
	public void handle(Request request, Response response) throws Exception {
		String token = request.cookie(TOKEN_COOKIE);
		System.out.println("Token cookie: " + token);
		if (token == null) {
			throw Spark.halt(401, "Cookie not found");
		}
		String userName = sessions.get(token);
		if (userName == null) {
			throw Spark.halt(401, "This can be JSON later, but means unauthorized");
		}
		request.attribute(USERNAME, userName);

	}

}
