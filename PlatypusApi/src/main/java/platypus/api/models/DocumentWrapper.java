package platypus.api.models;

public class DocumentWrapper {
	
	Document document;
	int groupID;
	
	public DocumentWrapper(Document d, int groupID) {
		this.document = d;
		this.groupID = groupID;
	}
	
	public Document getDocument() {
		return document;
	}
	
	public void setDocument(Document d) {
		this.document = d;
	}
	
	public int getGroupID() {
		return groupID;
	}
	
	public void setGroupID(int groupID) {
		this.groupID = groupID;
	}

}
