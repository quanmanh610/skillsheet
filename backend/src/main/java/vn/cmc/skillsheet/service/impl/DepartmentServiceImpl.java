package vn.cmc.skillsheet.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;

import vn.cmc.skillsheet.constant.UrlConst;
import vn.cmc.skillsheet.service.DepartmentService;
import vn.cmc.skillsheet.vo.Department;
import vn.cmc.skillsheet.vo.Du;
import vn.cmc.skillsheet.vo.Manager;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Override
    public List<Department> getListDepartment() {

        RestTemplate restTemplate = new RestTemplate();

        String result = restTemplate.getForObject(UrlConst.GATEWAY_GET_LIST_DEPARTMENT_URI,
                String.class);

        JSONArray resultJSONArray = new JSONArray(result);

        List<Department> listDepartment = new ArrayList<>();
        for (int i = 0; i < resultJSONArray.length(); i++) {
            Object objDepartmant = resultJSONArray.get(i);
            Department de = JSON.parseObject(objDepartmant.toString(), Department.class);
            listDepartment.add(de);
        }

        return listDepartment;
    }

    @Override
    public Manager getManagerByDuAndGroup(List<Department> listDepartment, String du,
            String group) {
        if (listDepartment.size() == 0) {
            return null;
        } else {
            for (int i = 0; i < listDepartment.size(); i++) {
                if (group.equals(listDepartment.get(i).getName())) {
                    if (null == listDepartment.get(i).getListChild()) {
                        return listDepartment.get(i).getManager().get(0);
                    }

                    if (null != listDepartment.get(i).getListChild()
                            && listDepartment.get(i).getListChild().size() == 0) {
                        return listDepartment.get(i).getManager().get(0);
                    }
                    for (int j = 0; j < listDepartment.get(i).getListChild().size(); j++) {
                        if (du.equals(listDepartment.get(i).getListChild().get(j).getName())) {
                            return listDepartment.get(i).getListChild().get(j).getManager().get(0);
                        }
                    }

                }

            }
        }

        return null;
    }
    
    @Override
	public Manager getManagerByDu(List<Department> listDepartment, String du) {
    	if (listDepartment.size() == 0) {
            return null;
        } else {
        	for (int i = 0; i < listDepartment.size(); i++) {
				Department dep = listDepartment.get(i);
				if (dep.getListChild() == null) {
					continue;
				}
				for (int j = 0; j < dep.getListChild().size(); j++) {
					Du duDep = dep.getListChild().get(j);
					if (duDep.getName().equals(du)) {
						return duDep.getManager().get(0);
					}
				}
			}
        }
		return null;
	}
    
	@Override
    public int isLeader(List<Department> listDepartment, String userName) {
        if (listDepartment.size() == 0) {
            return -1;
        } else {
        	int countGroup = 0;
        	int countDu = 0;
            for (int i = 0; i < listDepartment.size(); i++) {
            	List<Manager> groupLeaderList = listDepartment.get(i).getManager();
            	List<Du> childList = listDepartment.get(i).getListChild();
                if (groupLeaderList != null && groupLeaderList.size() != 0) {
                   for(int j=0; j<groupLeaderList.size(); j++ ) {
                	   if(userName.equals(groupLeaderList.get(j).getUserName())) {
                		   countGroup++; // Group Lead
                	   }
                   }
                }
                
                if (childList != null && childList.size() != 0) {
                	for (int k = 0; k < childList.size(); k++) {
                    	List<Manager> duLeaderList = childList.get(k).getManager();
                        if (duLeaderList != null && duLeaderList.size() != 0) {
                           for(int j=0; j<duLeaderList.size(); j++ ) {
                        	   if(userName.equals(duLeaderList.get(j).getUserName())) {
                        		   countDu++; // DU Lead
                        	   }
                           }
                        }
                	}
                }
            }
            
	        if(countGroup == 0 && countDu == 0) {
	        	return 0; //None
	        } else if (countGroup == 0 && countDu != 0) {
	        	return 2; //DU Lead Only
	        } else if (countGroup != 0 && countDu == 0) {
	        	return 1; //Group Lead Only
	        } else return 3;  //Both
        }
	}	
}
