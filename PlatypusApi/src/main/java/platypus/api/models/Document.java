package platypus.api.models;

public class Document extends Item {

	private String fileName;
	private String expiration;
	
	public Document() {
		super();
	}

	public Document(int itemID, ItemType type, String name, String description, Category category, String fileName, String expiration) {
		super(itemID, type, name, description, category);
		this.fileName = fileName;
		this.expiration = expiration;
	}

	public String getFileName() {
		return fileName;
	}
	
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	
	public String getExpiration() {
		return expiration;
	}
	
	public void setExpiration(String expiration) {
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