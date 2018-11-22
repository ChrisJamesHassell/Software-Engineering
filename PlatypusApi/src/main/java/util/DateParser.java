package util;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateParser {
	
	public static final String DATE_FORMAT_STRING = "MMM d, yyyy";
	private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern(DATE_FORMAT_STRING);

	public static java.sql.Date parseDate(String s){
		return Date.valueOf(LocalDate.parse(s, DATE_FORMAT));
	}
	
}
