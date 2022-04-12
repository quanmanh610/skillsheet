package vn.cmc.skillsheet.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.codec.binary.Base64;

public class StringUtils {
	public static String formatDate(Object obj) {
		if (obj == null) {
			return "";
		}
		
		if (obj instanceof Date) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			return dateFormat.format((Date) obj);
		} else {
			return "";
		}
	}
	
	public static String hashString(String input) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
			Base64 base64 = new Base64();
			return base64.encodeToString(encodedhash);
		} catch (Exception e) {
			e.printStackTrace();
			return input;
		}
	}
}
