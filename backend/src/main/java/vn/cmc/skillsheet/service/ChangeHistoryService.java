package vn.cmc.skillsheet.service;

import java.util.List;

import org.hibernate.event.spi.PostUpdateEvent;

import vn.cmc.skillsheet.entity.ChangeHistory;

public interface ChangeHistoryService {

    public List<ChangeHistory> compareObjDiffForUpdate(PostUpdateEvent event, Object[] preUpdate,
            Object[] newEntity, Object entity, String action, String editor);

    public List<ChangeHistory> compareObjDiffForSave(Object entity, String action, String editor);

    public List<ChangeHistory> compareObjDiffForDelete(Object entity, String action, String editor);
}
