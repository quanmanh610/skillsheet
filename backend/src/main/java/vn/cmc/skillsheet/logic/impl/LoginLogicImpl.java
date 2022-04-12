package vn.cmc.skillsheet.logic.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.logic.LoginLogic;
import vn.cmc.skillsheet.repository.StaffRepository;

@Component
public class LoginLogicImpl implements LoginLogic {

    @Autowired
    private StaffRepository staffRepository;

//    @Override
//    public boolean isLoginStaffFirstTime(String userName) {
//
//        Staff staff = staffRepository.findOneByUserName(userName);
//
//        if (staff != null) {
//            return false;
//        }
//
//        return true;
//    }
    
    @Override
    public int getStaffLoginCount(String userName) {

        Staff staff = staffRepository.findOneByUserName(userName);

        if (staff != null) {
            return staff.getLoginCount();
        }

        return 0;
    }

}
