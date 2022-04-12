package vn.cmc.skillsheet.util;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManagerFactory;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.event.spi.PostDeleteEvent;
import org.hibernate.event.spi.PostDeleteEventListener;
import org.hibernate.event.spi.PostInsertEvent;
import org.hibernate.event.spi.PostInsertEventListener;
import org.hibernate.event.spi.PostUpdateEvent;
import org.hibernate.event.spi.PostUpdateEventListener;
import org.hibernate.internal.SessionFactoryImpl;
import org.hibernate.jpa.HibernateEntityManagerFactory;
import org.hibernate.persister.entity.EntityPersister;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.cmc.skillsheet.entity.ChangeHistory;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.repository.ChangeHistoryRepository;
import vn.cmc.skillsheet.service.ChangeHistoryService;

@SuppressWarnings("deprecation")
@Component
public class HibernateEventListner
        implements PostInsertEventListener, PostUpdateEventListener, PostDeleteEventListener {

    /**
     * 
     */
    private static final long serialVersionUID = -8047526070015916306L;

    @Autowired
    EntityManagerFactory entityManagerFactory;

    @Autowired
    ChangeHistoryService changeHistoryService;

    @Autowired
    ChangeHistoryRepository changeHistoryRepository;
    
    @Autowired
    private HttpServletRequest request;

    @PostConstruct
    private void init() {
        HibernateEntityManagerFactory hibernateEntityManagerFactory = (HibernateEntityManagerFactory) this.entityManagerFactory;
        SessionFactoryImpl sessionFactoryImpl = (SessionFactoryImpl) hibernateEntityManagerFactory
                .getSessionFactory();
        EventListenerRegistry registry = sessionFactoryImpl.getServiceRegistry()
                .getService(EventListenerRegistry.class);
        registry.appendListeners(EventType.POST_INSERT, this);
        registry.appendListeners(EventType.POST_UPDATE, this);
        registry.appendListeners(EventType.POST_DELETE, this);
    }

    @Override
    public boolean requiresPostCommitHanding(EntityPersister persister) {
        return false;
    }

    @Override
    public void onPostDelete(PostDeleteEvent event) {
        final Object entity = event.getEntity();
        if (entity == null) {
            return;
        }
        if (entity instanceof ChangeHistory) {
            return;
        }
        Map<String, String> map = new HashMap<String, String>();
        Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        List<ChangeHistory> changeHistories;
        try {
            changeHistories = changeHistoryService.compareObjDiffForDelete(entity, "Delete",
            		map.get("username"));
            changeHistoryRepository.saveAll(changeHistories);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onPostUpdate(PostUpdateEvent event) {
        final Object entity = event.getEntity();
        final Object[] oldEntity = event.getOldState();
        final Object[] newEntity = event.getState();
        if (entity == null) {
            return;
        }
        if (entity instanceof ChangeHistory || entity instanceof Staff) {
            return;
        }
        Map<String, String> map = new HashMap<String, String>();
    	Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        List<ChangeHistory> changeHistories;
        try {
            changeHistories = changeHistoryService.compareObjDiffForUpdate(event, oldEntity,
                    newEntity, entity, "Update", map.get("username"));
            changeHistoryRepository.saveAll(changeHistories);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPostInsert(PostInsertEvent event) {
        final Object entity = event.getEntity();
        if (entity == null) {
            return;
        }

        if (entity instanceof ChangeHistory || entity instanceof Staff) {
            return;
        }
        Map<String, String> map = new HashMap<String, String>();
    	Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        List<ChangeHistory> changeHistories;
        try {
            changeHistories = changeHistoryService.compareObjDiffForSave(entity, "Create",
            		map.get("username"));
            changeHistoryRepository.saveAll(changeHistories);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}