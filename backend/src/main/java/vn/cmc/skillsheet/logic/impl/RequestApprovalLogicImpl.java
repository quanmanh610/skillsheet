package vn.cmc.skillsheet.logic.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.entity.RequestApproval;
import vn.cmc.skillsheet.logic.RequestApprovalLogic;
import vn.cmc.skillsheet.repository.RequestApprovalRepository;


@Component
public class RequestApprovalLogicImpl implements RequestApprovalLogic{

	@Autowired
	RequestApprovalRepository requestApprovalRepository;
	
	@Override
	public List<RequestApproval> getRequestApprovalList() {
		return requestApprovalRepository.findAll(Sort.by(Sort.Direction.DESC, "submittedDate"));
	}

	@Override
	public RequestApproval updateRequestApproval(RequestApproval requestApproval) {
		return requestApprovalRepository.save(requestApproval);
	}

	@Override
	public RequestApproval addRequestApproval(RequestApproval requestApproval) {
		return requestApprovalRepository.save(requestApproval);
	}

	@Override
	public void deleteRequestApproval(int requestApprovalId) {
		requestApprovalRepository.deleteById(requestApprovalId);
		
	}

	@Override
	public List<String> getFieldSuggestions(String type, String searchValue) {
		List<String> suggestions = new ArrayList<String>();
		if (type == null) {
			return suggestions;
		}
		type = type.toUpperCase();
		if (type.equals("ROLE")) {
			suggestions = requestApprovalRepository.getAllRoleNames();
		} else if (type.equals("FULLNAME")) {
			suggestions = requestApprovalRepository.getNameSuggestions(searchValue, 20);
		}
		
		return suggestions;
	}
}
