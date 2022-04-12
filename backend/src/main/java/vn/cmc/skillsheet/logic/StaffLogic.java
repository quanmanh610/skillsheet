package vn.cmc.skillsheet.logic;

import java.util.List;

import vn.cmc.skillsheet.entity.Staff;

public interface StaffLogic {
    /**
     * 
     */
    public List<Staff> getStaffList();

    /**
     * 
     * @param staff
     */
    public Staff updateStaff(Staff staff);

    /**
     * 
     * @param staff
     */
    public Staff addStaff(Staff staff);

    /**
     * 
     * @param staff
     */
    public void deleteStaff(int staffId);

    /**
     * 
     * @param staffID
     * @return
     */
    public Staff getStaff(int staffId);

}
