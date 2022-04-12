package vn.cmc.skillsheet.util;

public enum SettingItemStatus {
	NEW(2),		
	ACTIVE(0),
	INACTIVE(1);

	public final int value;
	
	private SettingItemStatus(int value) {
		this.value = value;
	}
}
