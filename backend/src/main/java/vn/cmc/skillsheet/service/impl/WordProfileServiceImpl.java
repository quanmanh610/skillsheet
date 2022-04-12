package vn.cmc.skillsheet.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;

import pl.jsolve.templ4docx.core.Docx;
import pl.jsolve.templ4docx.core.VariablePattern;
import pl.jsolve.templ4docx.variable.BulletListVariable;
import pl.jsolve.templ4docx.variable.ImageType;
import pl.jsolve.templ4docx.variable.ImageVariable;
import pl.jsolve.templ4docx.variable.TableVariable;
import pl.jsolve.templ4docx.variable.TextVariable;
import pl.jsolve.templ4docx.variable.Variable;
import pl.jsolve.templ4docx.variable.Variables;
import vn.cmc.skillsheet.entity.Education;
import vn.cmc.skillsheet.entity.Language;
import vn.cmc.skillsheet.entity.Profile;
import vn.cmc.skillsheet.entity.ProfileCertificate;
import vn.cmc.skillsheet.entity.ProfileSkill;
import vn.cmc.skillsheet.entity.Project;
import vn.cmc.skillsheet.entity.TemplateProfile;
import vn.cmc.skillsheet.entity.WorkExperience;
import vn.cmc.skillsheet.vo.ProjectSkill;

@Service
public class WordProfileServiceImpl extends DowloadProfileServiceImpl {

	private final String NOT_AVAILABLE = "N/A";

	@Override
	public TemplateProfile writeProfileToWord(TemplateProfile templateProfile, Optional<Profile> profile,
			ArrayList<String> introList, ArrayList<String> introContentList, ArrayList<String> summaryList)
			throws Exception {
		if (templateProfile == null) {
			return super.writeProfileToWord(templateProfile, profile, introList, introContentList, summaryList);
		}

		// String templateFile = "D:\\DuAn\\SkillsSheet\\TaiLieu\\CV-template.docx";
		// String templateFile = folderPath + templateProfile.getTemplateName();
		Docx docx = new Docx(new ByteArrayInputStream(templateProfile.getFile()));
		docx.setVariablePattern(new VariablePattern("${", "}"));

		insertPersonalDetails(docx, introList, introContentList, profile.get());
		insertObjectives(docx, profile.get());
		insertProfessionalSummary(docx, summaryList);
		insertWorkExperience(docx, profile.get());
		insertLanguages(docx, profile.get());
		insertEducation(docx, profile.get());
		insertSkills(docx, profile.get());
		insertPersonalInterests(docx, profile.get());
		insertProjects(docx, profile.get());
		insertAvatar(docx, profile.get());
		insertCertificates(docx, profile.get());

		ByteArrayOutputStream fos = null;
		fos = new ByteArrayOutputStream();
		docx.save(fos);
		templateProfile.setFile(fos.toByteArray());
		return templateProfile;
	}

	private void insertCertificates(Docx docx, Profile profile) {
		if (docx == null) {
			return;
		}

		List<ProfileCertificate> certificateList = profile.getProfileCertificates();
		Variables variables = new Variables();
		TableVariable tableVariable = new TableVariable();
		List<Variable> dateVars = new ArrayList<Variable>();
		List<Variable> nameVars = new ArrayList<Variable>();
		List<Variable> achievementVars = new ArrayList<Variable>();

		if (certificateList.size() == 0) {
			dateVars.add(new TextVariable("${cert_date}", NOT_AVAILABLE));
			nameVars.add(new TextVariable("${cert_name}", NOT_AVAILABLE));
			achievementVars.add(new TextVariable("${cert_achievement}", NOT_AVAILABLE));
		} else {

			SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");
			for (int i = 0; i < certificateList.size(); i++) {
				ProfileCertificate certificate = certificateList.get(i);
				dateVars.add(new TextVariable("${cert_date}",
						certificate.getIssuedDate() != null ? dateFormat.format(certificate.getIssuedDate()) : " "));
				nameVars.add(new TextVariable("${cert_name}", certificate.getCertificate().getName()));
				achievementVars.add(new TextVariable("${cert_achievement}", certificate.getAchievement()));
			}
		}

		tableVariable.addVariable(dateVars);
		tableVariable.addVariable(nameVars);
		tableVariable.addVariable(achievementVars);

		variables.addTableVariable(tableVariable);

		docx.fillTemplate(variables);
	}

	private void insertAvatar(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}

		if (profile.getAvatar() == null) {
			return;
		}

		List<String> docVars = docx.findVariables();
		if (!docVars.contains("${avatar}")) {
			return;
		}

		int width = 75;
		int height = 75;
		InputStream imageFile = new ByteArrayInputStream(profile.getAvatar());
		ImageVariable imageVariable = new ImageVariable("${avatar}", imageFile, ImageType.JPEG, width, height);
		Variables variables = new Variables();
		variables.addImageVariable(imageVariable);
		docx.fillTemplate(variables);
	}

	private void insertProjects(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}

		List<Project> projectList = profile.getProjects();
		Variables variables = new Variables();
		TableVariable tableVariable = new TableVariable();
		List<Variable> nameVars = new ArrayList<Variable>();
		List<Variable> fromVars = new ArrayList<Variable>();
		List<Variable> toVars = new ArrayList<Variable>();
		// List<Variable> clientVars = new ArrayList<Variable>();
		List<Variable> descVars = new ArrayList<Variable>();
		List<Variable> roleVars = new ArrayList<Variable>();
		List<Variable> teamSizeVars = new ArrayList<Variable>();
		List<Variable> respVars = new ArrayList<Variable>();
		List<Variable> skillsVars = new ArrayList<Variable>();

		if (projectList.isEmpty()) {
			nameVars.add(new TextVariable("${proj_name}", NOT_AVAILABLE));
			fromVars.add(new TextVariable("${proj_from}", NOT_AVAILABLE));
			toVars.add(new TextVariable("${proj_to}", NOT_AVAILABLE));
			// clientVars.add(new TextVariable("${proj_client}", NOT_AVAILABLE));
			descVars.add(new TextVariable("${proj_description}", NOT_AVAILABLE));
			roleVars.add(new TextVariable("${proj_role}", NOT_AVAILABLE));
			teamSizeVars.add(new TextVariable("${proj_teamSize}", NOT_AVAILABLE));
			respVars.add(new TextVariable("${proj_responsibilities}", NOT_AVAILABLE));
			skillsVars.add(new TextVariable("${proj_skills}", NOT_AVAILABLE));
		} else {
			try {
				for (int i = 0; i < projectList.size() - 1; i++) {
					LocalDate toMonth1 = LocalDate.parse("01 - " + projectList.get(i).getToMonth(),
							DateTimeFormatter.ofPattern("dd - MMM - yyyy"));

					for (int j = i + 1; j < projectList.size(); j++) {
						LocalDate toMonth2 = LocalDate.parse("01 - " + projectList.get(j).getToMonth(),
								DateTimeFormatter.ofPattern("dd - MMM - yyyy"));
						if (toMonth1.isBefore(toMonth2)) {
							Project temp = projectList.get(i);
							projectList.set(i, projectList.get(j));
							projectList.set(j, temp);
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

			for (int i = 0; i < projectList.size(); i++) {
				Project project = projectList.get(i);
				nameVars.add(new TextVariable("${proj_name}", project.getTitle()));
				fromVars.add(new TextVariable("${proj_from}", project.getFromMonth()));
				toVars.add(new TextVariable("${proj_to}", project.getToMonth()));
				// clientVars.add(new TextVariable("${proj_client}", project.getClient()));
				descVars.add(new TextVariable("${proj_description}", project.getDescription()));
				roleVars.add(new TextVariable("${proj_role}", project.getProjectRole().getName()));
				teamSizeVars.add(new TextVariable("${proj_teamSize}", project.getTeamSize()));
				String strResp = project.getResponsibilities();
				String[] parts = strResp.split("[\\r\\n]+");
				List<Variable> respList = new ArrayList<Variable>();
				for (String resp : parts) {
					respList.add(new TextVariable("${proj_responsibilities}", resp));
				}
				respVars.add(new BulletListVariable("${proj_responsibilities}", respList));

				List<Variable> skillsList = new ArrayList<Variable>();
				JSONArray arraySkills = new JSONArray(project.getArraySkillNames());
				for (int k = 0; k < arraySkills.length(); k++) {
					Object obj = arraySkills.get(k);
					ProjectSkill projectSkill = JSON.parseObject(obj.toString(), ProjectSkill.class);
					for (String strSkill : projectSkill.getSkills()) {
						skillsList.add(new TextVariable("${proj_skills}", strSkill));
					}
				}
				skillsVars.add(new BulletListVariable("${proj_skills}", skillsList));
			}
		}

		tableVariable.addVariable(nameVars);
		tableVariable.addVariable(fromVars);
		tableVariable.addVariable(toVars);
		// tableVariable.addVariable(clientVars);
		tableVariable.addVariable(descVars);
		tableVariable.addVariable(roleVars);
		tableVariable.addVariable(teamSizeVars);
		tableVariable.addVariable(respVars);
		tableVariable.addVariable(skillsVars);

		variables.addTableVariable(tableVariable);

		docx.fillTemplate(variables);
	}

	private void insertPersonalInterests(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}

		Variables variables = new Variables();
		String strPersonalInterests = profile.getPersionalInteresting();
		List<Variable> personalInterestsVars = new ArrayList<Variable>();

		if (strPersonalInterests == null) {
			personalInterestsVars.add(new TextVariable("${personalInterests}", NOT_AVAILABLE));
		} else {
			String[] parts = strPersonalInterests.split("[\\r\\n]+");
			for (String interest : parts) {
				personalInterestsVars.add(new TextVariable("${personalInterests}", interest));
			}
		}

		variables.addBulletListVariable(new BulletListVariable("${personalInterests}", personalInterestsVars));
		docx.fillTemplate(variables);
	}

	private void insertSkills(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}

		List<ProfileSkill> skillList = profile.getProfileSkills();
		Variables variables = new Variables();
		TableVariable tableVariable = new TableVariable();
		List<Variable> nameVars = new ArrayList<Variable>();
		List<Variable> levelVars = new ArrayList<Variable>();
		List<Variable> yearOfExperienceVars = new ArrayList<Variable>();
		List<Variable> lastUsedVars = new ArrayList<Variable>();

		if (skillList.isEmpty()) {
			nameVars.add(new TextVariable("${skill_name}", NOT_AVAILABLE));
			levelVars.add(new TextVariable("${skill_level}", NOT_AVAILABLE));
			yearOfExperienceVars
					.add(new TextVariable("${skill_yearsOfExperience}", NOT_AVAILABLE));
			lastUsedVars.add(new TextVariable("${skill_lastUsed}", NOT_AVAILABLE));
		} else {

			for (int i = 0; i < skillList.size(); i++) {
				ProfileSkill profileSkill = skillList.get(i);
				nameVars.add(new TextVariable("${skill_name}", profileSkill.getSkill().getName()));
				levelVars.add(new TextVariable("${skill_level}", profileSkill.getLevel()));
				yearOfExperienceVars
						.add(new TextVariable("${skill_yearsOfExperience}", profileSkill.getYearOfExperiences() + ""));
				lastUsedVars.add(new TextVariable("${skill_lastUsed}", profileSkill.getLastUsed()));
			}
		}

		tableVariable.addVariable(nameVars);
		tableVariable.addVariable(levelVars);
		tableVariable.addVariable(yearOfExperienceVars);
		tableVariable.addVariable(lastUsedVars);

		variables.addTableVariable(tableVariable);

		docx.fillTemplate(variables);
	}

	private void insertEducation(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}

		List<Education> educationList = profile.getEducations();
		try {
			Variables variables = new Variables();
			TableVariable tableVariable = new TableVariable();
			List<Variable> fromVars = new ArrayList<Variable>();
			List<Variable> toVars = new ArrayList<Variable>();
			List<Variable> schoolVars = new ArrayList<Variable>();
			List<Variable> majorVars = new ArrayList<Variable>();
			List<Variable> gradeVars = new ArrayList<Variable>();
			List<Variable> qualificationVars = new ArrayList<Variable>();
			List<Variable> achievementVars = new ArrayList<Variable>();
			if (educationList.isEmpty()) {
				fromVars.add(new TextVariable("${edu_from}", NOT_AVAILABLE));
				toVars.add(new TextVariable("${edu_to}", NOT_AVAILABLE));
				schoolVars.add(new TextVariable("${edu_school}", NOT_AVAILABLE));
				majorVars.add(new TextVariable("${edu_major}", NOT_AVAILABLE));
				gradeVars.add(new TextVariable("${edu_grade}", NOT_AVAILABLE));
				qualificationVars.add(new TextVariable("${edu_qualification}", NOT_AVAILABLE));
				achievementVars.add(new TextVariable("${edu_achievement}", NOT_AVAILABLE));
			} else {

				for (int i = 0; i < educationList.size(); i++) {
					Education education = educationList.get(i);
					fromVars.add(new TextVariable("${edu_from}", education.getFromMonth()));
					toVars.add(new TextVariable("${edu_to}", education.getToMonth()));
					schoolVars.add(new TextVariable("${edu_school}", education.getSchool().getName()));
					majorVars.add(new TextVariable("${edu_major}", education.getSubject()));
					gradeVars.add(new TextVariable("${edu_grade}", education.getGrade()));
					qualificationVars.add(new TextVariable("${edu_qualification}", education.getQualification()));
					achievementVars.add(new TextVariable("${edu_achievement}", education.getAchievement()));
				}
			}

			tableVariable.addVariable(fromVars);
			tableVariable.addVariable(toVars);
			tableVariable.addVariable(schoolVars);
			tableVariable.addVariable(majorVars);
			tableVariable.addVariable(gradeVars);
			tableVariable.addVariable(qualificationVars);
			tableVariable.addVariable(achievementVars);

			variables.addTableVariable(tableVariable);

			docx.fillTemplate(variables);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void insertLanguages(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}

		List<Language> languageList = profile.getLanguages();
		Variables variables = new Variables();
		TableVariable tableVariable = new TableVariable();
		List<Variable> nameVars = new ArrayList<Variable>();
		List<Variable> levelVars = new ArrayList<Variable>();
		List<Variable> noteVars = new ArrayList<Variable>();

		if (languageList.isEmpty()) {
			nameVars.add(new TextVariable("${lang_name}", NOT_AVAILABLE));
			levelVars.add(new TextVariable("${lang_level}", NOT_AVAILABLE));
			noteVars.add(new TextVariable("${lang_note}", NOT_AVAILABLE));
		} else {
			for (int i = 0; i < languageList.size(); i++) {
				Language language = languageList.get(i);
				nameVars.add(new TextVariable("${lang_name}", language.getName()));
				levelVars.add(new TextVariable("${lang_level}", language.getLevel()));
				noteVars.add(new TextVariable("${lang_note}", language.getNote()));
			}
		}

		tableVariable.addVariable(nameVars);
		tableVariable.addVariable(levelVars);
		tableVariable.addVariable(noteVars);

		variables.addTableVariable(tableVariable);

		docx.fillTemplate(variables);
	}

	private void insertWorkExperience(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}

		List<WorkExperience> workExperienceList = profile.getWorkExperiences();
		try {
			Variables variables = new Variables();
			TableVariable tableVariable = new TableVariable();
			List<Variable> fromVars = new ArrayList<Variable>();
			List<Variable> toVars = new ArrayList<Variable>();
			List<Variable> companyVars = new ArrayList<Variable>();
			List<Variable> descriptionVars = new ArrayList<Variable>();
			List<Variable> positionVars = new ArrayList<Variable>();
			if (workExperienceList.isEmpty()) {
				fromVars.add(new TextVariable("${we_from}", NOT_AVAILABLE));
				toVars.add(new TextVariable("${we_to}", NOT_AVAILABLE));
				companyVars.add(new TextVariable("${we_company}", NOT_AVAILABLE));
				positionVars.add(new TextVariable("${we_position}", NOT_AVAILABLE));
				descriptionVars.add(new TextVariable("${we_description}", NOT_AVAILABLE));
			} else {

				try {
					LocalDate now = LocalDate.now();
					for (int i = 0; i < workExperienceList.size() - 1; i++) {
						LocalDate toMonth1 = now;
						if (!workExperienceList.get(i).isNow()) {
							toMonth1 = LocalDate.parse("01 - " + workExperienceList.get(i).getToMonth(),
									DateTimeFormatter.ofPattern("dd - MMM - yyyy"));
						}

						for (int j = i + 1; j < workExperienceList.size(); j++) {
							LocalDate toMonth2 = now;
							if (!workExperienceList.get(j).isNow()) {
								toMonth2 = LocalDate.parse("01 - " + workExperienceList.get(j).getToMonth(),
										DateTimeFormatter.ofPattern("dd - MMM - yyyy"));
							}

							if (toMonth1.isBefore(toMonth2)) {
								WorkExperience temp = workExperienceList.get(i);
								workExperienceList.set(i, workExperienceList.get(j));
								workExperienceList.set(j, temp);
							}
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}

				for (int i = 0; i < workExperienceList.size(); i++) {
					WorkExperience workExperience = workExperienceList.get(i);
					fromVars.add(new TextVariable("${we_from}", workExperience.getFromMonth()));
					toVars.add(
							new TextVariable("${we_to}", workExperience.isNow() ? "Now" : workExperience.getToMonth()));
					companyVars.add(new TextVariable("${we_company}", workExperience.getCompany()));
					positionVars.add(new TextVariable("${we_position}", workExperience.getPosition()));
					descriptionVars.add(new TextVariable("${we_description}", workExperience.getDescription()));
				}
			}

			tableVariable.addVariable(fromVars);
			tableVariable.addVariable(toVars);
			tableVariable.addVariable(companyVars);
			tableVariable.addVariable(descriptionVars);
			tableVariable.addVariable(positionVars);

			variables.addTableVariable(tableVariable);

			docx.fillTemplate(variables);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void insertProfessionalSummary(Docx docx, ArrayList<String> summaryList) {
		Variables variables = new Variables();
		List<Variable> summaries = new ArrayList<Variable>();
		if (summaryList.isEmpty()) {
			summaries.add(new TextVariable("${professionalSummary}", NOT_AVAILABLE));
		} else {
			for (String summary : summaryList) {
				String[] parts = summary.split("[\\r\\n]+");
				for (String sum : parts) {
					summaries.add(new TextVariable("${professionalSummary}", sum));
				}
			}
		}

		variables.addBulletListVariable(new BulletListVariable("${professionalSummary}", summaries));
		docx.fillTemplate(variables);
	}

	private void insertObjectives(Docx docx, Profile profile) {
		if (profile == null) {
			return;
		}
		Variables variables = new Variables();
		List<Variable> objectives = new ArrayList<Variable>();
		String strObjective = profile.getObjective();
		if (strObjective == null) {
			objectives.add(new TextVariable("${objectives}", NOT_AVAILABLE));
		} else {
			String[] parts = strObjective.split("[\\r\\n]+");
			for (String objective : parts) {
				objectives.add(new TextVariable("${objectives}", objective));
			}
		}

		variables.addBulletListVariable(new BulletListVariable("${objectives}", objectives));
		docx.fillTemplate(variables);
	}

	private void insertPersonalDetails(Docx docx, ArrayList<String> introKeys, ArrayList<String> introValues,
			Profile profile) {
		Variables variables = new Variables();
		for (int i = 0; i < introKeys.size(); i++) {
			variables.addTextVariable(new TextVariable("${" + introKeys.get(i) + "}",
					introValues.get(i) == null ? " " : introValues.get(i)));
		}
		docx.fillTemplate(variables);

		if (profile == null) {
			return;
		}

		variables = new Variables();
		variables.addTextVariable(new TextVariable("${phone}", profile.getPhone()));
		variables.addTextVariable(new TextVariable("${email}", profile.getEmail()));
		docx.fillTemplate(variables);
	}

}
