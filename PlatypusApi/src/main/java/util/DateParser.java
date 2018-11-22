package util;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateParser {
	
	private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("MMM d, yyyy");

	public static java.sql.Date parseDate(String s){
		return Date.valueOf(LocalDate.parse(s, DATE_FORMAT));
	}
	
}
