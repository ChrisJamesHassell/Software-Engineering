package platypus.api.handlers;

import spark.Request;
import spark.Service.StaticFiles;
import util.ItemFilter;
import spark.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Collection;
import java.util.UUID;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.Part;

import org.apache.tika.Tika;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.zaxxer.hikari.HikariDataSource;

import platypus.api.JsonParser;
import platypus.api.models.Category;
import platypus.api.models.Document;
import platypus.api.models.ItemType;

public class DocumentHandler {

	public static String addDoc(HikariDataSource ds, Request req, Response response)
			throws SQLException, IOException, ServletException, NullPointerException {
		Connection conn = null;
		CallableStatement stmt = null;

		try {

			conn = ds.getConnection();

			// Must be called to pull body parts as queryParams
			MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
			req.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);

			String PATH = File.separator + "platypus" + File.separator + "users";
			String directoryName = PATH + File.separator + req.queryParams("userID").toString() + File.separator;

			File directory = new File(directoryName);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			long maxFileSize = 5 * 1024 * 1024; // the maximum size allowed for uploaded files
			long maxRequestSize = 5 * 1024 * 1024; // the maximum size allowed for multipart/form-data requests
			int fileSizeThreshold = 1 * 1024 * 1024; // the size threshold after which files will be written to disk

			MultipartConfigElement MCE = new MultipartConfigElement(directoryName, maxFileSize, maxRequestSize,
					fileSizeThreshold);
			req.raw().setAttribute("org.eclipse.jetty.multipartConfig", MCE);

			Part uploadedFile = req.raw().getPart("FILE");

			if (uploadedFile.getSize() > maxFileSize) {
//				return new JsonResponse("FAILED", "", "File exceeds size limit.");
				response.redirect(req.headers("Referer"));
				return "";
			}

			String fName = uploadedFile.getSubmittedFileName();

			String ext = "";
			int i = fName.lastIndexOf('.');
			if (i > 0) {
				ext = fName.substring(i);
			}

			String fileName = directoryName + UUID.randomUUID().toString() + ext;
			Path fullPath = Paths.get(fileName);

			// Prepare the call from request body
			String expirationDate = req.queryParams("expirationDate");
			if ("".equals(expirationDate)) {
				expirationDate = null;
			}
			stmt = conn.prepareCall("{call insertDoc(?, ?, ?, ?, ?, ?, ?, ?)}");
			stmt.setString(1, req.queryParams("pinned"));
			stmt.setInt(2, Integer.parseInt(req.queryParams("groupID")));
			stmt.setString(3, req.queryParams("name"));
			stmt.setString(4, req.queryParams("description"));
			stmt.setString(5, req.queryParams("category"));
			stmt.setString(6, fileName);
			stmt.setString(7, expirationDate);
			stmt.registerOutParameter(8, Types.INTEGER);
			stmt.executeUpdate();
			int outID = stmt.getInt(8);

			try (final InputStream in = uploadedFile.getInputStream()) {
				Files.copy(in, fullPath, StandardCopyOption.REPLACE_EXISTING);
				uploadedFile.delete();
			}

			// cleanup
			MCE = null;
			uploadedFile = null;

			// SUCCESSFUL response
			response.redirect(req.headers("Referer"));
			return "";
			
		} catch (SQLException sqlE) {
			// ERROR in SQL response
			sqlE.printStackTrace();
			response.redirect(req.headers("Referer"));
			return "";
			
		} catch (ServletException srvE) {
			// SERVELET error
			srvE.printStackTrace();
			response.redirect(req.headers("Referer"));
			return "";
			
		} finally {
			conn.close();
		}
	}

	public static JsonResponse editDoc(HikariDataSource ds, Request req) throws SQLException {

		Connection conn = null;
		PreparedStatement stmt = null;

		try {
			conn = ds.getConnection();

			// Must be called to pull body parts as queryParams
			MultipartConfigElement multipartConfigElement = new MultipartConfigElement("/tmp");
			req.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);

			stmt = conn.prepareStatement(
					"UPDATE documents SET name = ?, description = ?, category = ?, expirationDate = ? WHERE docID = ?");
			stmt.setString(1, req.queryParams("name").toString());
			stmt.setString(2, req.queryParams("description").toString());
			stmt.setString(3, req.queryParams("category").toString());
			stmt.setString(4, req.queryParams("expirationDate").toString());
			stmt.setInt(5, Integer.parseInt(req.queryParams("documentID")));

			int ret = stmt.executeUpdate();
			System.out.println(ret);
			// Successful update
			if (ret == 1) {
				// Should not need to touch anything on the file system here, since we only
				// touched the database entry for it.
				return new JsonResponse("SUCCESS",
						getReturnedDocument(Integer.parseInt(req.queryParams("documentID")), conn),
						"Successfully edited document");
			} else {
				// The documentID does not exist.
				return new JsonResponse("FAIL", "", "The document does not exist");
			}

		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Editdocument");
		} finally {
			conn.close();
		}
	}

	// Successfully removes the document from all appropriate tables.
	public static JsonResponse removeDoc(HikariDataSource ds, Request req) throws SQLException {
		Connection conn = null;
		CallableStatement stmt = null;

		try {
			conn = ds.getConnection();

			// Prepare the call from request body
			Gson gson = new Gson();
			JsonObject jsonO = gson.fromJson(req.body(), JsonObject.class);
			JsonObject document = jsonO.get("document").getAsJsonObject();

			stmt = conn.prepareCall("{call delDoc(?)}");
			stmt.setInt(1, document.get("documentID").getAsInt());
			int ret = stmt.executeUpdate();

			String PATH = File.separator + "platypus" + File.separator + "users";
			String directoryName = PATH + File.separator + jsonO.get("userID").getAsInt() + File.separator;
			File f = new File(document.get("fileName").getAsString());
			String fName = f.getName();
			String fullPath = directoryName.concat(fName);

			System.out.println(fullPath);

			try {
				File file = new File(fullPath);

				if (file.delete()) {
					System.out.println(file.getName() + " is deleted!");
				} else {
					System.out.println("Failed to delete file.");
				}

			} catch (Exception e) {
				e.printStackTrace();
				return new JsonResponse("FAIL", "", "There is no document with that ID, failed document deletion.");
			}

			if (ret != 0) {
				return new JsonResponse("SUCCESS", "", "Successfully deleted document.");
			} else {
				// There is no document with that documentID
				return new JsonResponse("FAIL", "", "There is no document with that ID, failed document deletion.");
			}

		} catch (SQLException sqlE) {
			return new JsonResponse("ERROR", "", "SQLError in Add document");
		} finally {
			conn.close();
		}
	}

	public static byte[] download(HikariDataSource ds, Request request, Response response)
			throws IOException, SQLException {
		try (Connection conn = ds.getConnection()) {
			PreparedStatement stmt = conn.prepareStatement("SELECT fileName FROM documents WHERE docID = ?");
			stmt.setString(1, request.queryParams("docID"));
			ResultSet results = stmt.executeQuery();
			if (!results.next()) {
				// Error occurred
				return null;
			}
			String fileLocation = results.getString(1);
			Path filePath = Paths.get(fileLocation);
		    Tika tika = new Tika();
		    response.header("Content-Type", tika.detect(filePath.toFile()));
		    // Force download if preview mode is not specified
			if(!"true".equals(request.queryParams("preview"))) {
				response.header("Content-Disposition",
						String.format("attachment; filename=\"%s\"", filePath.getFileName()));
			}
			return Files.readAllBytes(filePath);
		}
	}

	public static JsonResponse get(HikariDataSource ds, Request request) throws SQLException {
		Connection conn = null;
		try {
			conn = ds.getConnection();
			return new JsonResponse("SUCCESS", ItemFilter.getDocuments(conn, request), "Berfect!");
		} catch (SQLException e) {
			e.printStackTrace();
			return new JsonResponse("ERROR", "", "SQLException in get_all_documents");
		} finally {
			conn.close();
		}
	}

	private static Document getReturnedDocument(int docID, Connection conn) throws SQLException {

		PreparedStatement ps = conn.prepareStatement(
				"SELECT * FROM documents INNER JOIN has_documents ON documents.docID = has_documents.docID WHERE documents.docID = ?");
		ps.setInt(1, docID);

		ResultSet rs = ps.executeQuery();
		ps.close();

		Document d = null;

		// Get first doc
		if (rs.next()) {
			d = new Document();
			d.setItemID(rs.getInt(ItemFilter.getColumnWithName("docID", rs)));
			d.setType(ItemType.DOCUMENT);
			d.setName(rs.getString(ItemFilter.getColumnWithName("name", rs)));
			d.setDescription(rs.getString(ItemFilter.getColumnWithName("description", rs)));
			d.setCategory(Category.valueOf(rs.getString(ItemFilter.getColumnWithName("category", rs)).toUpperCase()));
			d.setExpiration(rs.getDate(ItemFilter.getColumnWithName("expirationDate", rs)));
			d.setFileName(rs.getString(ItemFilter.getColumnWithName("fileName", rs)));
			d.setNotification(rs.getDate(ItemFilter.getColumnWithName("notification", rs)));
			d.setPinned(rs.getBoolean(ItemFilter.getColumnWithName("pinned", rs)));
		}
		rs.close();
		return d;
	}
}
