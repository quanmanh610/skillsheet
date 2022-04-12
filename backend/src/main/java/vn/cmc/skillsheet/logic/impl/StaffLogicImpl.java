package vn.cmc.skillsheet.logic.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.logic.StaffLogic;
import vn.cmc.skillsheet.repository.StaffRepository;

@Component
public class StaffLogicImpl implements StaffLogic {
    @Autowired
    private StaffRepository staffRepository;

    @Override
    public List<Staff> getStaffList() {
        return staffRepository.findAll();
    }

    @Override
    public Staff updateStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    @Override
    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);

    }

    @Override
    public void deleteStaff(int staffId) {
        staffRepository.deleteById(staffId);

    }

    @Override
    public Staff getStaff(int staffId) {
        return staffRepository.findOneById(staffId);
    }
}
