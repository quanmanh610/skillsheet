package vn.cmc.skillsheet.constant;

public class EmailTemplateConst {
    public static final String getUpdateRequestToStaffTemplate(String staffFullname) {
        return "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">Dear&nbsp;</span><b><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121;mso-ansi-language:VI\">" + staffFullname
                + "</span></b><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121\">,<o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">You have a</span><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121;mso-ansi-language:VI\"> request update profile.</span><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121\"><o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">Please log into </span><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121;mso-ansi-language:VI\">Skills</span><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121\"> System </span><u><span lang=\"EN-US\" style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#5B9BD5;mso-themecolor:\r\n"
                + "accent1;mso-ansi-language:EN-US\">&lt;skills.cmcglobal.com.vn&gt;</span></u><span lang=\"EN-US\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121\"> </span><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;\r\n"
                + "font-family:&quot;Arial&quot;,sans-serif;color:#212121;mso-ansi-language:VI\">update\r\n"
                + "profile</span><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;\r\n"
                + "font-family:&quot;Arial&quot;,sans-serif;color:#212121\">.<o:p></o:p></span></p>\r\n"
                + "\r\n"
                + "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">Best regards,<o:p></o:p></span></p>\r\n"
                + "\r\n"
                + "<table class=\"MsoNormalTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:white;border-collapse:collapse;mso-yfti-tbllook:1184;\r\n"
                + " mso-padding-alt:0mm 0mm 0mm 0mm\">\r\n"
                + " <tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\r\n"
                + "  height:79.9pt\">\r\n"
                + "  <td width=\"402\" valign=\"top\" style=\"width:301.25pt;padding:0mm 5.4pt 0mm 5.4pt;\r\n"
                + "  height:79.9pt\">\r\n"
                + "  <p class=\"MsoNormal\" style=\"mso-margin-top-alt:auto;mso-margin-bottom-alt:auto;\r\n"
                + "  line-height:11.8pt\"><b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:\r\n"
                + "  &quot;Arial&quot;,sans-serif;color:#2E74B5\">Skills System</span></b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n"
                + "  <p class=\"MsoNormal\" style=\"margin-top:6.0pt;mso-margin-bottom-alt:auto;\r\n"
                + "  line-height:11.8pt\"><b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:\r\n"
                + "  &quot;Arial&quot;,sans-serif;color:#2E74B5\">CMC Global</span></b><b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#8496B0\">&nbsp;</span></b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">|\r\n"
                + "  8&amp;9 Floor, CMC Tower, Duy Tan, Cau Giay, Hanoi</span><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n"
                + "  <p class=\"MsoNormal\" style=\"margin-top:3.0pt;mso-margin-bottom-alt:auto;\r\n"
                + "  line-height:11.8pt\"><b><span lang=\"FR\" style=\"font-size:10.0pt;font-family:\r\n"
                + "  &quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:FR\">M&nbsp;</span></b><span lang=\"FR\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;\r\n"
                + "  mso-ansi-language:FR\">+84</span><span lang=\"EN-US\" style=\"font-size:10.0pt;\r\n"
                + "  font-family:&quot;Arial&quot;,sans-serif;color:gray\">915 090 499</span><span lang=\"FR\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:\r\n"
                + "  FR\">|&nbsp;</span><b><span lang=\"VI\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "  color:gray;mso-ansi-language:VI\">T</span></b><span lang=\"VI\" style=\"font-size:\r\n"
                + "  10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:VI\">&nbsp;</span><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">+84\r\n"
                + "  2</span><span lang=\"VI\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "  color:gray;mso-ansi-language:VI\">4&nbsp;</span><span lang=\"FR\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:\r\n"
                + "  FR\">7109 6686</span><span lang=\"VI\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "  color:gray;mso-ansi-language:VI\">&nbsp;|&nbsp;</span><b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">F&nbsp;</span></b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">+84\r\n"
                + "  24 32123396</span><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "  color:#212121\"><o:p></o:p></span></p>\r\n"
                + "  <p class=\"MsoNormal\" style=\"margin-top:3.0pt;mso-margin-bottom-alt:auto;\r\n"
                + "  line-height:11.8pt\"><b><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:\r\n"
                + "  &quot;Arial&quot;,sans-serif;color:gray\">W</span></b><span lang=\"EN-US\" style=\"font-size:\r\n"
                + "  10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">&nbsp;</span><span lang=\"EN-US\"><a href=\"http://cmcglobal.com.vn/\"><span style=\"font-size:10.0pt;font-family:\r\n"
                + "  &quot;Arial&quot;,sans-serif\">http://cmcglobal.com.vn/</span></a></span><span lang=\"EN-US\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n"
                + "  </td>\r\n" + " </tr>\r\n" + "</tbody></table>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:VI\">&nbsp;</span></b><span lang=\"EN-US\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\"><o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><span class=\"apple-converted-space\"><span lang=\"FR\" style=\"font-size:10.0pt;line-height:\r\n"
                + "150%;font-family:&quot;Arial&quot;,sans-serif;color:#1F497D;mso-ansi-language:FR\">&nbsp;</span></span><span lang=\"EN-US\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#2E74B5\">&nbsp;</span><span lang=\"EN-US\" style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n"
                + "\r\n" + "<i><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n"
                + "line-height:107%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Malgun Gothic&quot;;\r\n"
                + "mso-fareast-theme-font:minor-fareast;mso-ansi-language:EN-SG;mso-fareast-language:\r\n"
                + "EN-US;mso-bidi-language:AR-SA\">Note: This is an auto-generated email, please do\r\n"
                + "not reply.</span></i>";
    };

    public static final String getCreatedToCandiateTemplate(String staffFullname, String link,
            String date, String accessCode) {
        return "<p class=\"MsoNormal\" style=\"line-height:150%\"><span style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-language:ZH-SG\">Hi\r\n"
                + "" + staffFullname + ",<o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%\"><span style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif\">Welcome to CMC Global!\r\n"
                + "<o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%\"><span style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif\">Please click <u><span style=\"color:#5B9BD5;mso-themecolor:accent1\">"
                + "<a href=\"http://" + link + "\">here</a></span></u> to Sign in to the system\r\n"
                + "and update your profile. <br/>Your access code: " + accessCode + "</span><br/><br/><span style=\"font-size:10.0pt;line-height:150%;\r\n"
                + "font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:VI\"> </span><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121\">Please </span><span lang=\"VI\" style=\"font-size:10.0pt;line-height:\r\n"
                + "150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121;mso-ansi-language:VI\">update</span><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121\"> before&nbsp;</span><b><span style=\"font-size:10.0pt;line-height:\r\n"
                + "150%;font-family:&quot;Arial&quot;,sans-serif;color:red\">" + date
                + "</span></b><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#212121\">&nbsp;</span><span lang=\"VI\" style=\"font-size:10.0pt;line-height:\r\n"
                + "150%;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:VI\"><o:p></o:p></span></p>\r\n"
                + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%\"><span lang=\"VI\" style=\"font-size:\r\n"
                + "10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;mso-ansi-language:VI\"><o:p>&nbsp;</o:p></span></p>\r\n"
                + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%\"><span style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif\"><o:p>&nbsp;</o:p></span></p>\r\n"
                + "\r\n"
                + "<p style=\"margin-top:0in;margin-right:0in;margin-bottom:15.0pt;margin-left:\r\n"
                + "0in;background:white\"><span lang=\"EN-SG\" style=\"font-size: 10pt; line-height: 150%; font-family: Arial, sans-serif; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;\">We look forward to speaking with you soon!</span><span lang=\"EN-SG\" style=\"font-size: 10pt; line-height: 150%; font-family: Arial, sans-serif;\"><o:p></o:p></span></p>\r\n"
                + "\r\n"
                + "<p style=\"margin-top:15.0pt;background:white\"><b><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\">Contact us if you need more information\r\n"
                + "about updating your profile!<o:p></o:p></span></b></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\">W:</span></b><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\">&nbsp;</span><a href=\"http://cmcglobal.com.vn/\" target=\"_blank\"><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;\r\n"
                + "font-family:&quot;Arial&quot;,sans-serif;color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:\r\n"
                + "FR\">http://cmcglobal.com.vn/</span></a><span style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#5B9BD5;mso-themecolor:\r\n"
                + "accent1\"><o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\">T&nbsp;:</span></b><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\"> +84 24 7109 6686</span><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\"><o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\">E:</span></b><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\">&nbsp;</span><a href=\"mailto:recruitment-cmcglobal@cmc.com.vn\" target=\"_blank\"><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\">recruitment-cmcglobal@cmc.com.vn</span></a><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\"><o:p></o:p></span></p>\r\n"
                + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%\"><span style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#5B9BD5;mso-themecolor:\r\n"
                + "accent1\"><o:p>&nbsp;</o:p></span></p>\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%\"><span style=\"font-size:10.0pt;\r\n"
                + "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#5B9BD5;mso-themecolor:\r\n"
                + "accent1\">Sincerely,<o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><span lang=\"FR\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:FR\"><o:p>&nbsp;</o:p></span></p>\r\n"
                + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\">RECRUITMENT DEPARTMENT</span></b><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\"><o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\">CMC Global&nbsp;</span></b><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\">| 8<sup>th<span class=\"apple-converted-space\">&nbsp;</span></sup>- 9<sup>th</sup><span class=\"apple-converted-space\">&nbsp;</span>Floor, CMC Tower, Duy Tan, Cau Giay,\r\n"
                + "Hanoi<o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:VI\">&nbsp;</span></b><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#5B9BD5;mso-themecolor:accent1\"><o:p></o:p></span></p>\r\n" + "\r\n"
                + "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><span class=\"apple-converted-space\"><span lang=\"FR\" style=\"font-size:10.0pt;line-height:\r\n"
                + "150%;font-family:&quot;Arial&quot;,sans-serif;color:#1F497D;mso-ansi-language:FR\">&nbsp;</span></span><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n"
                + "color:#2E74B5\">&nbsp;</span><span style=\"font-size:10.0pt;line-height:150%;\r\n"
                + "font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n"
                + "\r\n" + "<i><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n"
                + "line-height:107%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Malgun Gothic&quot;;\r\n"
                + "mso-fareast-theme-font:minor-fareast;mso-ansi-language:EN-SG;mso-fareast-language:\r\n"
                + "EN-US;mso-bidi-language:AR-SA\">Note: This is an auto-generated email, please do\r\n"
                + "not reply.</span></i>";
    };
    
    public static final String getCreateRequestApproveToPICTemplate(String picName,
            String verionName, String linkApprove) {
        return "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n" + 
                "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">Dear&nbsp;</span><b><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#212121;mso-ansi-language:VI\">"+picName+"</span></b><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#212121\">,<o:p></o:p></span></p>\r\n" + 
                "\r\n" + 
                "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n" + 
                "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">You have a</span><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#212121;mso-ansi-language:VI\"> request pending approve</span><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#212121\">.&nbsp;Detail information:<o:p></o:p></span></p>\r\n" + 
                "\r\n" + 
                "<p class=\"MsoNormal\"><b><i><span style=\"font-size:10.0pt;line-height:107%;\r\n" + 
                "font-family:&quot;Arial&quot;,sans-serif;color:#212121;background:white\">Staff Profile:</span></i></b><span style=\"font-size:10.0pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#212121;background:white\">&nbsp;"+verionName+"</span><span style=\"font-size:\r\n" + 
                "10.0pt;line-height:107%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><br>\r\n" + 
                "<br>\r\n" + 
                "<br>\r\n" + 
                "<!--[if !supportLineBreakNewLine]--><br>\r\n" + 
                "<!--[endif]--></span><span style=\"font-size:10.0pt;line-height:107%;font-family:\r\n" + 
                "&quot;Arial&quot;,sans-serif\"><o:p></o:p></span></p>\r\n" + 
                "\r\n" + 
                "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n" + 
                "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">Please log into </span><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#212121;mso-ansi-language:VI\"><a href=\"https://skills.cmcglobal.com.vn/request\">Skills System</a></span><span lang=\"EN-SG\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#212121\"> system </span><u><span style=\"font-size:10.0pt;line-height:\r\n" + 
                "150%;font-family:&quot;Arial&quot;,sans-serif;color:#5B9BD5;mso-themecolor:accent1;\r\n" + 
                "mso-ansi-language:EN-US\">" +
                "</span></u><span style=\"font-size:10.0pt;\r\n" + 
                "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#5B9BD5;mso-themecolor:\r\n" + 
                "accent1;mso-ansi-language:VI\"> </span><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n" + 
                "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">to view it.<o:p></o:p></span></p>\r\n" + 
                "\r\n" + 
                "<p style=\"background:white\"><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n" + 
                "line-height:150%;font-family:&quot;Arial&quot;,sans-serif;color:#212121\">Best regards,<o:p></o:p></span></p>\r\n" + 
                "\r\n" + 
                "<table class=\"MsoNormalTable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:white;border-collapse:collapse;mso-yfti-tbllook:1184;\r\n" + 
                " mso-padding-alt:0in 0in 0in 0in\">\r\n" + 
                " <tbody><tr style=\"mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes;\r\n" + 
                "  height:79.9pt\">\r\n" + 
                "  <td width=\"402\" valign=\"top\" style=\"width:301.25pt;\r\n" + 
                "  height:79.9pt\">\r\n" + 
                "  <p class=\"MsoNormal\" style=\"mso-margin-top-alt:auto;mso-margin-bottom-alt:auto;\r\n" + 
                "  line-height:11.8pt\"><b><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "  color:#2E74B5\">Skills System</span></b><span style=\"font-size:10.0pt;\r\n" + 
                "  font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n" + 
                "  <p class=\"MsoNormal\" style=\"margin-top:6.0pt;mso-margin-bottom-alt:auto;\r\n" + 
                "  line-height:11.8pt\"><b><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "  color:#2E74B5\">CMC Global</span></b><b><span style=\"font-size:10.0pt;\r\n" + 
                "  font-family:&quot;Arial&quot;,sans-serif;color:#8496B0\">&nbsp;</span></b><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">| 8&amp;9\r\n" + 
                "  Floor, CMC Tower, Duy Tan, Cau Giay, Hanoi</span><span style=\"font-size:10.0pt;\r\n" + 
                "  font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n" + 
                "  <p class=\"MsoNormal\" style=\"margin-top:3.0pt;mso-margin-bottom-alt:auto;\r\n" + 
                "  line-height:11.8pt\"><b><span lang=\"FR\" style=\"font-size:10.0pt;font-family:\r\n" + 
                "  &quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:FR\">M&nbsp;</span></b><span lang=\"FR\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;\r\n" + 
                "  mso-ansi-language:FR\">+84</span><span style=\"font-size:10.0pt;font-family:\r\n" + 
                "  &quot;Arial&quot;,sans-serif;color:gray\">915 090 499</span><span lang=\"FR\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:\r\n" + 
                "  FR\">|&nbsp;</span><b><span lang=\"VI\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "  color:gray;mso-ansi-language:VI\">T</span></b><span lang=\"VI\" style=\"font-size:\r\n" + 
                "  10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:VI\">&nbsp;</span><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">+84 2</span><span lang=\"VI\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;\r\n" + 
                "  mso-ansi-language:VI\">4&nbsp;</span><span lang=\"FR\" style=\"font-size:10.0pt;\r\n" + 
                "  font-family:&quot;Arial&quot;,sans-serif;color:gray;mso-ansi-language:FR\">7109 6686</span><span lang=\"VI\" style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray;\r\n" + 
                "  mso-ansi-language:VI\">&nbsp;|&nbsp;</span><b><span style=\"font-size:10.0pt;\r\n" + 
                "  font-family:&quot;Arial&quot;,sans-serif;color:gray\">F&nbsp;</span></b><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:gray\">+84 24\r\n" + 
                "  32123396</span><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "  color:#212121\"><o:p></o:p></span></p>\r\n" + 
                "  <p class=\"MsoNormal\" style=\"margin-top:3.0pt;mso-margin-bottom-alt:auto;\r\n" + 
                "  line-height:11.8pt\"><b><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "  color:gray\">W</span></b><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "  color:gray\">&nbsp;</span><a href=\"http://cmcglobal.com.vn/\"><span style=\"font-size:10.0pt;font-family:\r\n" + 
                "  &quot;Arial&quot;,sans-serif\">http://cmcglobal.com.vn/</span></a><span style=\"font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:#212121\"><o:p></o:p></span></p>\r\n" + 
                "  </td>\r\n" + 
                " </tr>\r\n" + 
                "</tbody></table>\r\n" + 
                "\r\n" + 
                "<p class=\"MsoNormal\" style=\"line-height:150%;background:white\"><b><span lang=\"VI\" style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#5B9BD5;mso-themecolor:accent1;mso-ansi-language:VI\">&nbsp;</span></b><span style=\"font-size:10.0pt;line-height:150%;font-family:&quot;Arial&quot;,sans-serif;\r\n" + 
                "color:#5B9BD5;mso-themecolor:accent1\"><o:p></o:p></span></p>\r\n" + 
                "\r\n" + 
                "\r\n" + 
                "<i><span lang=\"EN-SG\" style=\"font-size:10.0pt;\r\n" + 
                "line-height:107%;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Malgun Gothic&quot;;\r\n" + 
                "mso-fareast-theme-font:minor-fareast;mso-ansi-language:EN-SG;mso-fareast-language:\r\n" + 
                "EN-US;mso-bidi-language:AR-SA\">Note: This is an auto-generated email, please do\r\n" + 
                "not reply.</span></i>";
    }
}
