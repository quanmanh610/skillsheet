//package vn.cmc.skillsheet.util;
//
//import java.io.Serializable;
//import java.util.List;
//
//import org.hibernate.EmptyInterceptor;
//import org.hibernate.type.Type;
//import org.springframework.stereotype.Component;
//import org.springframework.web.servlet.HandlerInterceptor;
//
//import vn.cmc.skillsheet.entity.Candidate;
//import vn.cmc.skillsheet.entity.Certificate;
//import vn.cmc.skillsheet.entity.ChangeHistory;
//import vn.cmc.skillsheet.entity.Education;
//import vn.cmc.skillsheet.entity.Email;
//import vn.cmc.skillsheet.entity.Language;
//import vn.cmc.skillsheet.entity.Profile;
//import vn.cmc.skillsheet.entity.ProfileCertificate;
//import vn.cmc.skillsheet.entity.ProfileSkill;
//import vn.cmc.skillsheet.entity.Project;
//import vn.cmc.skillsheet.entity.ProjectRole;
//import vn.cmc.skillsheet.entity.RequestApproval;
//import vn.cmc.skillsheet.entity.School;
//import vn.cmc.skillsheet.entity.Skill;
//import vn.cmc.skillsheet.entity.Staff;
//import vn.cmc.skillsheet.entity.TemplateProfile;
//import vn.cmc.skillsheet.entity.Version;
//import vn.cmc.skillsheet.entity.WorkExperience;
//import vn.cmc.skillsheet.repository.ChangeHistoryRepository;
//import vn.cmc.skillsheet.service.ChangeHistoryService;
//
//@Component
//public class TableInterceptor extends EmptyInterceptor implements HandlerInterceptor {
//
//    @Override
//    public void onDelete(Object entity, Serializable id, Object[] state, String[] propertyNames,
//            Type[] types) {
//
//        ChangeHistoryService changeHistoryService = SpringContextUtil.getApplicationContext()
//                .getBean(ChangeHistoryService.class);
//        ChangeHistoryRepository changeHistoryRepository = SpringContextUtil.getApplicationContext()
//                .getBean(ChangeHistoryRepository.class);
//        List<ChangeHistory> changeHistories = changeHistoryService.compareObjDiffForDelete(entity,
//                propertyNames, "Delete", "Editor");
//
//        changeHistoryRepository.saveAll(changeHistories);
//
//    }
//
//    @Override
//    public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState,
//            Object[] previousState, String[] propertyNames, Type[] types) {
//        String tableName = "";
//        if (entity instanceof School) {
//            tableName = "School";
//        }
//        if (entity instanceof Certificate) {
//            tableName = "Certificate";
//        }
//        if (entity instanceof Candidate) {
//            tableName = "Candidate";
//        }
//        if (entity instanceof Education) {
//            tableName = "Education";
//        }
//        if (entity instanceof Email) {
//            tableName = "Email";
//        }
//        if (entity instanceof Language) {
//            tableName = "Language";
//        }
//        if (entity instanceof Profile) {
//            tableName = "Profile";
//        }
//        if (entity instanceof ProjectRole) {
//            tableName = "ProjectRole";
//        }
//        if (entity instanceof RequestApproval) {
//            tableName = "RequestApproval";
//        }
//        if (entity instanceof Skill) {
//            tableName = "Skill";
//        }
//        if (entity instanceof Staff) {
//            tableName = "Staff";
//        }
//        if (entity instanceof TemplateProfile) {
//            tableName = "TemplateProfile";
//        }
//        if (entity instanceof Version) {
//            tableName = "Version";
//        }
//        if (entity instanceof ProfileCertificate) {
//            tableName = "ProfileCertificate";
//        }
//        if (entity instanceof ProfileSkill) {
//            tableName = "ProfileSkill";
//        }
//        if (entity instanceof Project) {
//            tableName = "Project";
//        }
//        if (entity instanceof WorkExperience) {
//            tableName = "WorkExperience";
//        }
//
//        ChangeHistoryService changeHistoryService = SpringContextUtil.getApplicationContext()
//                .getBean(ChangeHistoryService.class);
//        ChangeHistoryRepository changeHistoryRepository = SpringContextUtil.getApplicationContext()
//                .getBean(ChangeHistoryRepository.class);
//        List<ChangeHistory> changeHistories = changeHistoryService.compareObjDiffForUpdate(
//                currentState, previousState, propertyNames, tableName, "Update", "Editor");
//
//        changeHistoryRepository.saveAll(changeHistories);
//
//        return false;
//    }
//
//    @Override
//    public boolean onSave(Object entity, Serializable id, Object[] state, String[] propertyNames,
//            Type[] types) {
//        if (entity instanceof ChangeHistory) {
//            return false;
//        }
//        ChangeHistoryService changeHistoryService = SpringContextUtil.getApplicationContext()
//                .getBean(ChangeHistoryService.class);
//        ChangeHistoryRepository changeHistoryRepository = SpringContextUtil.getApplicationContext()
//                .getBean(ChangeHistoryRepository.class);
//        List<ChangeHistory> changeHistories = changeHistoryService.compareObjDiffForSave(id, entity,
//                propertyNames, "Create", "Editor");
//
//        changeHistoryRepository.saveAll(changeHistories);
//
//        return false;
//    }
//
//    private static final long serialVersionUID = -818808374889268894L;
//}