package platypus.api.handlers;

import java.net.InetAddress;
import java.net.UnknownHostException;

import platypus.api.models.Auto;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.embeddedserver.jetty.JettyHandler;
import spark.http.matching.MatcherFilter;
import spark.route.Routes;
import spark.staticfiles.StaticFilesConfiguration;

public class IndexHandler implements Route { // TODO: Remove this, it's no longer needed

	@Override
	public Object handle(Request request, Response response) throws Exception {
		Auto auto = new Auto();
		auto.setButt(123);
		
		String projectDir = System.getProperty("user.dir");
		
		// First get InetAddress for the machine, here localhost 
		InetAddress myIP = null; 
		try { myIP = InetAddress.getLocalHost(); } 
		catch (UnknownHostException e) { 
			// TODO Auto-generated catch block
			e.printStackTrace(); 
			} // getHostAddress() returns IP address of a machine 
		String IPAddress = myIP.getHostAddress(); // getHostname returns DNS hostname of a machine 
		String hostname = myIP.getHostName(); 
		String ipAddy = "\nIP address of Localhost: " + IPAddress + "\n"; 
		String hostAddy = "Host name of your machine is: " + hostname;
		projectDir += ipAddy + hostAddy;
		auto.setButtstring(projectDir);
		return auto;
	}
}


