package vn.cmc.skillsheet.service;

import java.util.List;

import vn.cmc.skillsheet.vo.Department;
import vn.cmc.skillsheet.vo.Manager;

public interface DepartmentService {

    public List<Department> getListDepartment();

    public Manager getManagerByDuAndGroup(List<Department> listDepartment, String du, String group);
    public Manager getManagerByDu(List<Department> listDepartment, String du);

	public int isLeader(List<Department> listDepartment, String userName);
};
