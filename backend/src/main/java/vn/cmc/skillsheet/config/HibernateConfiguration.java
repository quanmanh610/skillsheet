//package vn.cmc.skillsheet.config;
//
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
//import org.springframework.context.annotation.Configuration;
//
//import vn.cmc.skillsheet.util.TableInterceptor;
//
//@Configuration
//public class HibernateConfiguration extends HibernateJpaAutoConfiguration {
//
//     @Bean
//     public TableInterceptor tableInterceptor() {
//     return new TableInterceptor();
//     }
//    
//     public void addInterceptors(InterceptorRegistry registry) {
//     registry.addInterceptor(tableInterceptor());
//     }
//
//    @Autowired
//    TableInterceptor tableInterceptor;
//
//    protected void customizeVendorProperties(Map<String, Object> vendorProperties) {
//        vendorProperties.put("hibernate.ejb.interceptor", tableInterceptor);
//    }
//}
