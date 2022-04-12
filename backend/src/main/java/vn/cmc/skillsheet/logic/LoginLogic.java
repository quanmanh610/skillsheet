package vn.cmc.skillsheet.logic;

public interface LoginLogic {

    /**
     * 
     * @param staffId
     * @return
     */
    //public boolean isLoginStaffFirstTime(String userName);
	
	public int getStaffLoginCount(String userName);
}
