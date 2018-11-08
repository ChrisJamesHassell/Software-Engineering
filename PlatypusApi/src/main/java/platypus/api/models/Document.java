package platypus.api.models;

import java.nio.file.Path;

public class Document extends Item {

	private Path fileName;
	private String expiration;
	
	public Document() {
		super();
	}

	public Document(int itemID, ItemType type, String name, String description, Category category, Path fileName, String expiration) {
		super(itemID, type, name, description, category);
		this.fileName = fileName;
		this.expiration = expiration;
	}

	public Path getFileName() {
		return fileName;
	}
	
	public void setFileName(Path fileName) {
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
				+ ", getCategory()=" + getCategory() + ", toString()=" + super.toString() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + "]";
	}
	
}
