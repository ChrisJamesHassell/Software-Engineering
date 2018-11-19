package platypus.api.models;

import java.sql.Date;

public class Item {

	private int itemID;
	private ItemType type;
	private String name;
	private String description;
	private Category category;
	private Date notification;
	private boolean pinned;

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
	
	public Item(int itemID, ItemType type, String name, String description, Category category, Date notification, boolean pinned) {
		super();
		this.itemID = itemID;
		this.type = type;
		this.name = name;
		this.description = description;
		this.category = category;
		this.notification = notification;
		this.pinned = pinned;
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

	public Date getNotification() {
		return notification;
	}

	public void setNotification(Date notification) {
		this.notification = notification;
	}

	public boolean isPinned() {
		return pinned;
	}

	public void setPinned(boolean pinned) {
		this.pinned = pinned;
	}

	@Override
	public String toString() {
		return "Item [itemID=" + itemID + ", type=" + type + ", name=" + name + ", description=" + description
				+ ", category=" + category + ", notification=" + notification + ", pinned=" + pinned + "]";
	}

}
