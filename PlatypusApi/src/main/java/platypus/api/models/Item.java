package platypus.api.models;

public class Item {
	
	private int itemID;
	private ItemType type;
	private String name;
	private String description;
	private Category category;
	
	public Item() {
		
	}
	
	public Item(int itemID, ItemType type, String name, String description, Category category) {
		super();
		this.itemID = itemID;
		this.type = type;
		this.name = name;
		this.description = description;
		this.category = category;
	}

	public int getItemID() {
		return itemID;
	}
	
	public void setItemID(int itemID) {
		this.itemID = itemID;
	}
	
	public ItemType getType() {
		return type;
	}
	
	public void setType(ItemType type) {
		this.type = type;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public Category getCategory() {
		return category;
	}
	
	public void setCategory(Category category) {
		this.category = category;
	}

	@Override
	public String toString() {
		return "Item [itemID=" + itemID + ", type=" + type + ", name=" + name + ", description=" + description
				+ ", category=" + category + "]";
	}

}
