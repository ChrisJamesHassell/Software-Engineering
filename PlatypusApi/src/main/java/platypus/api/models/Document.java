package platypus.api.models;

import java.sql.Date;

public class Document extends Item {

	private String fileName;
	private Date expiration;
	
	public Document() {
		super();
	}

	public Document(int itemID, ItemType type, String name, String description, Category category, Date notification, boolean pinned, String fileName, Date expiration) {
		super(itemID, type, name, description, category, notification, pinned);
		this.fileName = fileName;
		this.expiration = expiration;
	}

	public String getFileName() {
		return fileName;
	}
	
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	
	public Date getExpiration() {
		return expiration;
	}
	
	public void setExpiration(Date expiration) {
		this.expiration = expiration;
	}

	@Override
	public String toString() {
		return "Document [fileName=" + fileName + ", expiration=" + expiration + ", getItemID()=" + getItemID()
				+ ", getType()=" + getType() + ", getName()=" + getName() + ", getDescription()=" + getDescription()
				+ ", getCategory()=" + getCategory() + ", getNotification()=" + getNotification() + ", isPinned()="
				+ isPinned() + ", toString()=" + super.toString() + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + "]";
	}
	
}
