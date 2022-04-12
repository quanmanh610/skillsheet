package vn.cmc.skillsheet.config;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.web.client.RestTemplate;

import vn.cmc.skillsheet.constant.UrlConst;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.logic.StaffLogic;
import vn.cmc.skillsheet.repository.ProfileRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.DepartmentService;
import vn.cmc.skillsheet.service.ProfileService;
import vn.cmc.skillsheet.util.TempEmailUtils;
import vn.cmc.skillsheet.vo.Department;
import vn.cmc.skillsheet.vo.TimeAndProject;

@Configuration
@EnableScheduling
public class SchedulerConfig implements SchedulingConfigurer {

	@Value("${dummyemail}")
	private String dummyemail;
	
	@Value("${environment}")
	private String environment;

	private final int POOL_SIZE = 10;

	@Autowired
	private StaffRepository staffRepository;

	@Autowired
	private StaffLogic staffLogic;

	@Autowired
	private DepartmentService departmentService;
	
	@Autowired
	private TempEmailUtils tempEmailUtils;

	@Autowired
	private ProfileService profileService;

	@Autowired
	private ProfileRepository profileRepository;

	@Override
	public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {
		scheduledTaskRegistrar.setTaskScheduler(this.poolScheduler());
	}

	@Bean
	public TaskScheduler poolScheduler() {
		ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
		scheduler.setPoolSize(POOL_SIZE);
		scheduler.setThreadNamePrefix("name");
		return scheduler;
	}
	
	@Scheduled(cron = "0 0 17 * * WED")
	public void sendWeeklySummaryToGleadAndRec() {
		tempEmailUtils.sendWeeklySummaryToGleadAndRec();
	}
	
//	@Scheduled(fixedRate = 3000000)
//	@Scheduled(cron = "0 0 12 * * MON-FRI")
	public void sendWarningEmailToStaffAndDuLead() {
		tempEmailUtils.sendWarningEmailToStaffAndDuLead();
	}

	@Scheduled(cron = "0 0 0 * * ?")
//	@Scheduled(fixedRate = 3000000)
	public void updateUserFromPoa() {
		
		final String uri = "https://gateway.cmcglobal.com.vn/poa/api/user/GetAllUserpoa";

		RestTemplate restTemplate = new RestTemplate();
		DateFormat sourceFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		try {
			String result = ((RestTemplate) restTemplate).getForObject(uri, String.class);
			JSONArray allPoaUsers = new JSONArray(result);
			ResponseEntity<Department[]> departmentResponse = restTemplate
					.getForEntity(UrlConst.GATEWAY_GET_LIST_DEPARTMENT_URI, Department[].class);
			List<Department> depList = Arrays.asList(departmentResponse.getBody());

			for (int i = 0; i < allPoaUsers.length(); i++) {
				try {
					boolean ldapStatus = allPoaUsers.getJSONObject(i).getBoolean("status");
					SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
					JSONArray listHistoryUserGroup = allPoaUsers.getJSONObject(i).getJSONArray("listHistoryUserGroup");
					Date startDate = dateFormat.parse(
							listHistoryUserGroup.getJSONObject(listHistoryUserGroup.length() - 1)
							.getString("startDate"));
					String strEndDate = listHistoryUserGroup.getJSONObject(listHistoryUserGroup.length() - 1)
							.getString("endDate");
					Date endDate = null;
					if (!strEndDate.isEmpty()) {
						endDate = dateFormat.parse(strEndDate);
					}
					
					int isDuLead = 0;
					int isGroupLead = 0;
					String email = allPoaUsers.getJSONObject(i).isNull("email") ? ""
							: allPoaUsers.getJSONObject(i).getString("email");
					String createdDate = allPoaUsers.getJSONObject(i).getString("createdDate");
					String updatedDate = allPoaUsers.getJSONObject(i).getString("updatedDate");
					String userName = allPoaUsers.getJSONObject(i).getString("userName");
					String du = allPoaUsers.getJSONObject(i).getString("departmentName");
					String fullName = allPoaUsers.getJSONObject(i).getString("fullName");
					String groupRespond = ((RestTemplate) restTemplate)
							.getForObject(UrlConst.GATEWAY_GET_USER_GROUP_URI + userName, String.class);
					ResponseEntity<TimeAndProject> timeAndProjectRespond = ((RestTemplate) restTemplate)
							.getForEntity(UrlConst.GATEWAY_GET_USER_AVAILABLE_TIME + userName, TimeAndProject.class);
					TimeAndProject timeAndProject = timeAndProjectRespond.getBody();
					JSONObject group = new JSONObject();
					if (groupRespond.equals("User not found in Dashboard system!")) {
						continue;
					} else {
						group = new JSONObject(groupRespond);
					}
					
					if (group.isNull("groupName")) {
						continue;
					}
					
					String groupName = group.isNull("parentName") ? group.getString("groupName") : group.getString("parentName");
					int isLeader = departmentService.isLeader(depList, userName);
					if (isLeader == 1) {
						isGroupLead = 1;
					} else if (isLeader == 2) {
						isDuLead = 1;
					} else if (isLeader == 3) {
						isDuLead = 1;
						isGroupLead = 1;
					}

					Staff staff = staffRepository.findOneByUserName(userName);
					if (staff == null) {
						if (!ldapStatus) {
							continue;
						}
						
						if (du.toUpperCase().startsWith("DU") || 
								du.toUpperCase().startsWith("CJ") || 
								du.toUpperCase().startsWith("DJ") || 
								du.toUpperCase().equals("TDX")) {
							staff = new Staff();
							staff.setLoginCount(0);
							staff.setCreatedDate(createdDate.equals("") ? new Date() : sourceFormat.parse(createdDate));
							staff.setUpdatedDate(updatedDate.equals("") ? new Date() : sourceFormat.parse(updatedDate));
						}
					}
					if (staff != null) {
						staff.setLdapStatus(ldapStatus);
						staff.setStartDate(startDate);
						staff.setEndDate(endDate);
						staff.setDu(du);
						if (!email.equals(staff.getEmail())) {
							profileRepository.updateEmail(staff.getEmail(), email);
							staff.setEmail(email);
						}
						staff.setFullName(fullName);
						staff.setStaffGroup(groupName);
						staff.setUserName(userName);
						staff.setIsDuLead(isDuLead);
						staff.setIsGroupLead(isGroupLead);
						staff.setAvailableTime(timeAndProject.getAvailableTime());
						staff.setUpdatedDate(new Date());
						if (timeAndProject.getProjectBooked() != null) {
							staff.setBookedFrom(timeAndProject.getProjectBooked().getStartDate());
							staff.setBookedTo(timeAndProject.getProjectBooked().getEndDate());
							staff.setBookedProject(timeAndProject.getProjectBooked().getProjectName());
						} else {
							staff.setBookedFrom(null);
							staff.setBookedTo(null);
							staff.setBookedProject(null);
						}

						staffLogic.updateStaff(staff);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}