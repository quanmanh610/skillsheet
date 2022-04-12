package vn.cmc.skillsheet.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ScheduledFuture;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import vn.cmc.skillsheet.entity.Email;
import vn.cmc.skillsheet.logic.SettingLogic;
import vn.cmc.skillsheet.service.EmailService;
import vn.cmc.skillsheet.service.TaskSchedulerService;

/**
 * @author NDDUC
 *
 */
@Configuration
@EnableScheduling
@Service
public class TaskSchedulerServiceImpl implements TaskSchedulerService {

    @Autowired
    private SettingLogic settingLogic;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TaskScheduler taskScheduler;

    ScheduledFuture<?> scheduledFuture;

    public ScheduledFuture<?> getScheduledFuture() {
        return scheduledFuture;
    }

    public void setScheduledFuture(ScheduledFuture<?> scheduledFuture) {
        this.scheduledFuture = scheduledFuture;
    }

    @Override
    public void run() {
        System.out.println(
                "####### TASKSCHEDULER RUN... ####### ");
        String cronExpression = getCronSyntax();

        Trigger trigger = new CronTrigger(
                cronExpression/* , TimeZone.getTimeZone("UTC +7") */);
        scheduledFuture = taskScheduler.schedule(() -> {
            try {
                System.out.println(
                        "####### UPDATE REQUEST EMAIL CALLED: Update request email is sending... ####### ");
                emailService.sendUpdateRequestEmailToStaff();
            } catch (MessagingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.out.println("####### UPDATE REQUEST EMAIL SENDED SUCCESSFULLY ####### ");
        }, trigger);

    }

    private String getCronSyntax() {
        // set default CRON EXPRESSION when does not have any DB record
        // 0 0 1 1 * * mean at firt day of every month 1:00AM
        String cronSyntax = "0 0 1 1 * *";
        List<Email> emailList = settingLogic.getEmailList();
        for (int i = 0; i < emailList.size(); i++) {
            Email email = emailList.get(i);
            if (null == email) {
                return cronSyntax;
            } else
                cronSyntax = convertDataToCron(email);

        }
        return cronSyntax;
    }

    private String getDay(String input) {
        String outPut = "";
        switch (input) {
            case "1st":
                return "1";
            case "2nd":
                return "2";
            case "3rd":
                return "3";
            case "4th":
                return "4";
            case "5th":
                return "5";
            case "6th":
                return "6";
            case "7th":
                return "7";
            case "8th":
                return "8";
            case "9th":
                return "9";
            case "10th":
                return "10";
            case "11th":
                return "11";
            case "12th":
                return "12";
            case "13th":
                return "13";
            case "14th":
                return "14";
            case "15th":
                return "15";
            case "16th":
                return "16";
            case "17th":
                return "17";
            case "18th":
                return "18";
            case "19th":
                return "19";
            case "20th":
                return "20";
            case "21st":
                return "21";
            case "22nd":
                return "22";
            case "23rd":
                return "23";
            case "24th":
                return "24";
            case "25th":
                return "25";
            case "26th":
                return "26";
            case "27th":
                return "27";
            case "28th":
                return "28";
            case "29th":
                return "29";
            case "30th":
                return "30";
            case "31st":
                return "31";
            default:
                outPut = "1";
        }
        return outPut;
    }

    private String convertDataToCron(Email e) {
        String cron = "";

        if ("Quarterly".equals(e.getSchedule())) {
            String month = "*/3 *";
            if (null == e.getDay() || "".equals(e.getDay())) {
                String day = getDay(e.getHaveRepeat());
                String time = getTime(e);
                cron = "0 " + time + " " + day + " " + month;
            } else {
                String time = getTime(e);
                String orderDay = getOrderDay(e.getHaveRepeat());
                String weekDay = getWeekDay(e.getDay());
                cron = "0 " + time + " " + orderDay + " */3 " + weekDay;
            }
        }
        if ("Half-year".equals(e.getSchedule())) {
            String month = "*/6 *";
            if (null == e.getDay() || "".equals(e.getDay())) {
                String day = getDay(e.getHaveRepeat());
                String time = getTime(e);
                cron = "0 " + time + " " + day + " " + month;
            } else {
                String time = getTime(e);
                String orderDay = getOrderDay(e.getHaveRepeat());
                String weekDay = getWeekDay(e.getDay());
                cron = "0 " + time + " " + orderDay + " */6 " + weekDay;
            }
        }
        if ("Monthly".equals(e.getSchedule())) {
            String month = "* *";
            if (null == e.getDay() || "".equals(e.getDay())) {
                String day = getDay(e.getHaveRepeat());
                String time = getTime(e);
                cron = "0 " + time + " " + day + " " + month;
            } else {
                String time = getTime(e);
                String orderDay = getOrderDay(e.getHaveRepeat());
                String weekDay = getWeekDay(e.getDay());
                cron = "0 " + time + " " + orderDay + " * " + weekDay;
            }
        }
        return cron;
    }

    private String getTime(Email e) {
        String timeOut = "";
        if ("AM".equals(e.getTime().substring(6, 8))) {
            timeOut = String.valueOf(Integer.parseInt(e.getTime().substring(3, 5))) + " "
                    + String.valueOf(Integer.parseInt(e.getTime().substring(0, 2)));
        } else {
            timeOut = "12".equals(e.getTime().substring(3, 5)) ? "0"
                    : String.valueOf(Integer.parseInt(e.getTime().substring(3, 5))) + " "
                            + String.valueOf(Integer.parseInt(e.getTime().substring(0, 2)) + 12);
        }
        return timeOut;
    }

    private String getOrderDay(String input) {
        String outPut = "";
        switch (input) {
            case "First":
                outPut = "1-7";
                break;
            case "Second":
                outPut = "8-14";
                break;
            case "Third":
                outPut = "15-21";
                break;
            case "Fourth":
                outPut = "22-28";
                break;
            case "Last":
                outPut = "29-31";
                break;
            default:
                outPut = "1-7";
                break;
        }
        return outPut;
    }

    private String getWeekDay(String input) {
        String outPut = "";
        switch (input) {
            case "Sunday":
                outPut = "SUN";
                break;
            case "Monday":
                outPut = "MON";
                break;
            case "Tuesday":
                outPut = "TUE";
                break;
            case "Wednesday":
                outPut = "WED";
                break;
            case "Thursday":
                outPut = "THU";
                break;
            case "Friday":
                outPut = "FRI";
                break;
            case "Saturday":
                outPut = "SAT";
                break;
            default:
                outPut = "MON";
                break;
        }
        return outPut;
    }

    @Override
    public void stop() {
        this.scheduledFuture.cancel(true);
    }

}