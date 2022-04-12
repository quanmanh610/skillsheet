package vn.cmc.skillsheet.controller;

import java.util.Date;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import vn.cmc.skillsheet.dto.LogDto;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.LogService;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.StringUtils;

@Controller
public class LogController {
    @Autowired
    private LogService service;
    
    @Autowired
	private StaffRepository staffRepository;

    @RequestMapping(value = { "/api/logs/getLogList" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getLogList(@RequestBody String pagination) {
        JSONObject obj = new JSONObject(pagination);
        
        String token = obj.getString("token");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
        
        if (!RoleUtil.canViewLogList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        int page = obj.getInt("page");
        int size = obj.getInt("size");
        String column = obj.getString("column");
        String sort = obj.getString("sort");
        String editor = obj.getString("editor");
        String table = obj.getString("tableName");
        Date from;
        Date to;

        if ("".equals(obj.getString("from"))) {
            from = new Date("01/01/1976");
        } else {
        	from = new Date(obj.getString("from"));
        }
        if ("".equals(obj.getString("from"))) {
            to = new Date();
        } else {
        	to = new Date(obj.getString("to"));
        }

        LogDto logDto = service.getListOfLogPagination(page, size, column, sort, editor, table,
                from, to);
        return new ResponseEntity<>(logDto, HttpStatus.OK);
    }

}
