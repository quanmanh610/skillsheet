package vn.cmc.skillsheet.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.dto.RequestApprovalDto;
import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.logic.RequestApprovalLogic;
import vn.cmc.skillsheet.repository.RequestApprovalRepository;
import vn.cmc.skillsheet.repository.VersionRepository;
import vn.cmc.skillsheet.service.RequestApprovalService;
import vn.cmc.skillsheet.vo.FindRequestParams;
import vn.cmc.skillsheet.vo.ProfileHome;

@Service
public class RequestApprovalServiceImpl implements RequestApprovalService {

    @Autowired
    private RequestApprovalRepository requestApprovalRepository;
    
    @Autowired
    private VersionRepository versionRepository;
    
    @Autowired
    private RequestApprovalLogic logic;

//    @Override
//    public RequestApprovalDto getRequestApprovalsPagination(int page, int size, String column,
//            String sort, String fullName, String roleName, String status, Date from, Date to) {
//
//        RequestApprovalDto outDto = new RequestApprovalDto();
//
//        String sortColumn = "requestApprovalId";
//        // if ("roleName".equals(column))
//        // sortColumn = "roleName";
//        // else if ("status".equals(column))
//        // sortColumn = "status";
//        // else if ("fullName".equals(column))
//        // sortColumn = "fullName";
//        // else if ("sendDate".equals(column))
//        // sortColumn = "sendDate";
//        // else if ("email".equals(column))
//        // sortColumn = "email";
//
//        String sortDirec = "ASC";
//        if ("DES".equals(sort))
//            sortDirec = "DESC";
//
//        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(
//                "ASC".equals(sortDirec) ? Sort.Direction.ASC : Sort.Direction.DESC, sortColumn));
//        Page<RequestApproval> pageRequestApprovals = requestApprovalRepository
//                .findByFullNameLikeAndRoleNameLikeAndStatusLikeAndCreatedDateAfterAndCreatedDateBefore(
//                        "%" + fullName + "%", "%" + roleName + "%", "%" + status + "%", from, to,
//                        pageRequest);
//
//        List<RequestApproval> requestApprovals = null;
//        requestApprovals = pageRequestApprovals.getContent();
//
//        outDto.setRequestApprovals(requestApprovals);
//        outDto.setTotalElements(pageRequestApprovals.getTotalElements());
//
//        return outDto;
//    }
    
    @Override
    public RequestApprovalDto getRequestApprovalsPagination(FindRequestParams params) {

        RequestApprovalDto outDto = new RequestApprovalDto();

        List<Object> results = 
        		requestApprovalRepository
        			.findRequestApproval(
        					params.getFullName(),
        					params.getRoleName(),
        					params.getStatus(),
        					params.getFromDate(),
        					params.getToDate(),
        					params.getGroup(),
        					params.getDu(),
        					params.getPicEmail(),
        					params.getPageIndex() - 1,
        					params.getPageSize());

        List<RequestApproval> requestApprovals = new ArrayList<RequestApproval>();
        
        for (Iterator<Object> it = results.iterator(); it.hasNext();) {
            Object[] object = (Object[]) it.next();
            try {
            	RequestApproval item = new RequestApproval();
            	item.setRequestApprovalId((Integer) object[0]);
            	item.setFullName((String) object[1]);
            	item.setUserName((String) object[2]);
            	item.setEmail((String) object[3]);
            	item.setRoleName((String) object[4]);
            	item.setGroup((String) object[5]);
            	item.setDu((String) object[6]);
            	item.setStatus((String) object[7]);
            	item.setSubmittedDate((Date) object[8]);
            	item.setVersion(versionRepository.findOneById((Integer) object[9]));
            	item.setPicEmail((String) object[10]);
            	requestApprovals.add(item);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        outDto.setRequestApprovals(requestApprovals);
        outDto.setTotalElements(
        		requestApprovalRepository
        			.getRequestApprovalCount(
		        		params.getFullName(),
						params.getRoleName(),
						params.getStatus(),						
						params.getFromDate(),
						params.getToDate(),
						params.getGroup(),
						params.getDu(),
						params.getPicEmail()));

        return outDto;
    }
    
    @Override
    public RequestApproval updateRequestApproval(RequestApproval req) {
    	RequestApproval out = logic.updateRequestApproval(req);
    	return out;
    };

    @Override
	public List<String> getSuggestions(String type, String searchValue) {
		List<String> suggestions = logic.getFieldSuggestions(type, searchValue);
		return suggestions;
	}
}
