import { ActivityKeyConstants } from '../constants/ActivityKeyConstants';
import { UrlConstants } from '../constants/Constants';
import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';
import { getActivityKey } from '../utils/PoaUtil';
import store from '../store/store';

const headers = {
  'Content-Type': 'application/json',
};
/**
 * Setting - Skill api
 */
export async function getSkillsList() {
  const response = await AxiosUtil.call(
    '/api/setting/getSkillList',
    HTTPMethods.GET,
    null,
  );
  return response;
}

export async function addNewSkill(newSkillData) {
  const keys = [
    ActivityKeyConstants.CREATE_SKILL
  ]
  let activityKey = getActivityKey(keys);

  const response = await 
  AxiosUtil.call(
    '/api/setting/addSkill',
    HTTPMethods.POST,
    JSON.stringify(newSkillData),
    false,
    activityKey
  );
 
  return response;
}

export async function updateSkill(updateSkillData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_SKILL
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/setting/updateSkill',
    HTTPMethods.POST,
    updateSkillData,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function deleteSkill(SkillIdList) {
  const keys = [
    ActivityKeyConstants.DELETE_SKILL
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/setting/deleteSkill',
    HTTPMethods.POST,
    SkillIdList,
    false,
    activityKey
  );
  return response;
}

export async function activeAllSkill(SkillIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_SKILL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/activeAllSkill',
    HTTPMethods.POST,
    JSON.stringify(SkillIdList),
    false,
    activityKey,
    token,
  );
  return response;
}

/**
 * Setting - School api
 */
export async function getSchoolList() {
  const response = await AxiosUtil.call(
    '/api/setting/getSchoolList',
    HTTPMethods.GET,
    null
  );
  return response;
}

export async function addNewSchool(newSchoolData) {
  const keys = [
    ActivityKeyConstants.CREATE_SCHOOL
  ]
  let activityKey = getActivityKey(keys);
  const response = await 
  AxiosUtil.call(
    '/api/setting/addSchool',
    HTTPMethods.POST,
    JSON.stringify(newSchoolData),
    false,
    activityKey
  );
  return response;
}

export async function updateSchool(updateSchoolData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_SCHOOL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/updateSchool',
    HTTPMethods.POST,
    updateSchoolData,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function deleteSchool(schoolIdList) {
  const keys = [
    ActivityKeyConstants.DELETE_SCHOOL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/deleteSchool',
    HTTPMethods.POST,
    schoolIdList,
    false,
    activityKey
  );
  return response;
}

export async function activeAllSchool(schoolIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_SCHOOL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/activeAllSchool',
    HTTPMethods.POST,
    JSON.stringify(schoolIdList),
    false,
    activityKey,
    token,
  );
  return response;
}

/**
 * Setting - Certificate api
 */
export async function getCertificateList() {
  const response = await AxiosUtil.call(
    '/api/setting/getCertificateList',
    HTTPMethods.GET,
    null
  );
  return response;
}

export async function addNewCertificate(newCertificateData) {
  const keys = [
    ActivityKeyConstants.CREATE_CERTIFICATE
  ]
  let activityKey = getActivityKey(keys);
  const response = await 
  AxiosUtil.call(
    '/api/setting/addCertificate',
    HTTPMethods.POST,
    JSON.stringify(newCertificateData),
    false,
    activityKey
  );
  return response;
}

export async function updateCertificate(updateCertificateData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_CERTIFICATE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/updateCertificate',
    HTTPMethods.POST,
    updateCertificateData,
    false,
    activityKey,
    token
  );
  return response;
}

export async function deleteCertificate(certificateIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.DELETE_CERTIFICATE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/deleteCertificate',
    HTTPMethods.POST,
    certificateIdList,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function checkCertificate(certificateIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_CERTIFICATE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/checkCertificate',
    HTTPMethods.POST,
    certificateIdList,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function deleteProfileCertificate(certificateIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.DELETE_CERTIFICATE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/deleteProfileCertificateByCerId',
    HTTPMethods.POST,
    certificateIdList,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function activeAllCertificate(certificateIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_CERTIFICATE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/activeAllCertificate',
    HTTPMethods.POST,
    JSON.stringify(certificateIdList),
    false,
    activityKey,
    token,
  );
  return response;
}

/**
 * Setting - Projectrole api
 */
export async function getProjectroleList() {  
  const response = await AxiosUtil.call(
    '/api/setting/getProjectroleList',
    HTTPMethods.GET,
    null,
    false,
    null
  );
  return response;
}

export async function addNewProjectrole(newProjectroleData) {
  const keys = [
    ActivityKeyConstants.CREATE_PROJECT_ROLE
  ]
  let activityKey = getActivityKey(keys);
  const response = await 
  AxiosUtil.call(
    '/api/setting/addProjectrole',
    HTTPMethods.POST,
    JSON.stringify(newProjectroleData),
    false,
    activityKey
  );
  return response;
}

export async function updateProjectrole(updateProjectroleData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_PROJECT_ROLE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/updateProjectrole',
    HTTPMethods.POST,
    updateProjectroleData,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function deleteProjectrole(projectroleIdList) {
  const keys = [
    ActivityKeyConstants.DELETE_PROJECT_ROLE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/deleteProjectrole',
    HTTPMethods.POST,
    projectroleIdList,
    false,
    activityKey
  );
  return response;
}

export async function activeAllProjectrole(projectroleIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_PROJECT_ROLE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/activeAllProjectrole',
    HTTPMethods.POST,
    JSON.stringify(projectroleIdList),
    false,
    activityKey,
    token,
  );
  return response;
}

/**
 * Setting - Channel api
 */
// duong fix
export async function addNewChannel(newChannelData) {
  const keys = [
    ActivityKeyConstants.SETTING_EMAIL
  ]
  let activityKey = getActivityKey(keys);
  const response = await
      AxiosUtil.call(
          '/api/setting/addChannel',
          HTTPMethods.POST,
          JSON.stringify(newChannelData),
          false,
          activityKey
      );
  return response;
}

export async function getChannelList() {
  const keys = [
    ActivityKeyConstants.SETTING_EMAIL
  ]
  let activityKey = getActivityKey(keys);
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    token: sendingToken,
  };

  const response = await AxiosUtil.call(
      '/api/setting/getChannelList',
      HTTPMethods.POST,
      JSON.stringify(token),
      false,
      activityKey
  );
  return response;
}

export async function deleteChannel(id) {
  const keys = [
    ActivityKeyConstants.SETTING_EMAIL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
      'api/setting/deleteChannel',
      HTTPMethods.POST,
      id,
      false,
      activityKey
  );
  return response;
}


export async function updateChannel(channelForm) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_PROJECT_ROLE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/updateChannel',
    HTTPMethods.POST,
    channelForm,
    false,
    activityKey,
    token,
  );
  return response;
}


/**
 * Setting - Email api
 */
export async function getEmailList() {
  const keys = [
    ActivityKeyConstants.SETTING_EMAIL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/getEmailList',
    HTTPMethods.POST,
    null,
    false,
    activityKey
  );
  return response;
  // const response = await fetch(UrlConstants.API_BASE_URL + '/api/setting/getEmailList', {
  //   method: 'POST',
  //   headers,
  // });  
  // return response.json();
}

export async function addNewEmail(newEmailData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.SETTING_EMAIL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call('/api/setting/addEmail',
    HTTPMethods.POST,
    newEmailData,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function updateEmail(updateEmailData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.EDIT_SETTING_EMAIL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call('/api/setting/updateEmail',
    HTTPMethods.POST,
    updateEmailData,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function deleteEmail(emailIdList) {
  const keys = [
    ActivityKeyConstants.EDIT_SETTING_EMAIL
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call('/api/setting/deleteEmail',
    HTTPMethods.POST,
    emailIdList,
    false,
    activityKey
  );
  return response;
}

export async function sendUpdateRequestToStaff(email) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.REQUEST_UPDATE_PROFILE
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/setting/sendUpdateRequestToStaff',
    HTTPMethods.POST,
    email,
    false,
    activityKey,
    token,
  );
  return response;
}

/**
 * Setting - Template Profile api
 */

export async function getTemplateProfileList() {
  const response = await AxiosUtil.call(
    '/api/setting/getTemplateProfileList',
    HTTPMethods.GET,
    null,
    false,
    null,
  );
  return response;
}

export async function addNewTemplateProfile(selectedFile, createBy) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const form = new FormData();
  form.append('file', selectedFile);
  form.append('createBy', createBy);
  const response = await AxiosUtil.call(
    '/api/setting/addTemplateProfile/',
    HTTPMethods.POST,
    form,
    false,
    ActivityKeyConstants.UPLOAD_TEMPLATE_OF_PROFILE,
    token,
  );
  return response;
}

export async function updateTemplateProfile(updateTemplateProfileData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const response = await AxiosUtil.call(
    '/api/setting/updateTemplateProfile',
    HTTPMethods.POST,
    updateTemplateProfileData,
    false,
    ActivityKeyConstants.EDIT_TEMPLATE_OF_PROFILE,
    token,
  );
  return response;
}

export async function deleteTemplateProfile(templateProfileIdList) {
  const response = await AxiosUtil.call(
    '/api/setting/deleteTemplateProfile',
    HTTPMethods.POST,
    templateProfileIdList,
    false,
    ActivityKeyConstants.DELETE_CERTIFICATE //TEMPLATE_PROFILE
  );
  return response;
}

export async function checkSkill(skillIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const response = await AxiosUtil.call(
    '/api/setting/checkSkill',
    HTTPMethods.POST,
    skillIdList,
    false,
    ActivityKeyConstants.DELETE_SKILL,
    token,
  );
  return response;
}

export async function deleteProfileSkill(skillIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const response = await AxiosUtil.call(
    '/api/setting/deleteProfileSkillBySkillId',
    HTTPMethods.POST,
    skillIdList,
    false,
    ActivityKeyConstants.DELETE_SKILL,
    token,
  );
  return response;
}

export async function checkSchool(schoolIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const response = await AxiosUtil.call(
    '/api/setting/checkSchool',
    HTTPMethods.POST,
    schoolIdList,
    false,
    ActivityKeyConstants.DELETE_SCHOOL,
    token,
  );
  return response;
}

export async function deleteProfileSchool(schoolIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const response = await AxiosUtil.call(
    '/api/setting/deleteProfileSchoolBySchoolId',
    HTTPMethods.POST,
    schoolIdList,
    false,
    ActivityKeyConstants.DELETE_SCHOOL,
    token,
  );
  return response;
}

export async function checkRole(roleIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const response = await AxiosUtil.call(
    '/api/setting/checkRole',
    HTTPMethods.POST,
    roleIdList,
    false,
    ActivityKeyConstants.DELETE_PROJECT_ROLE,
    token,
  );
  return response;
}

export async function deleteProfileRole(roleIdList) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const response = await AxiosUtil.call(
    '/api/setting/deleteProfileRoleByRoleId',
    HTTPMethods.POST,
    roleIdList,
    false,
    ActivityKeyConstants.DELETE_PROJECT_ROLE,
    token,
  );
  return response;
}

// export async function downloadTemplateProfile(templateProfileIdList) {
//   const response = await AxiosUtil.call(
//     '/api/setting/downloadTemplateProfile',
//     HTTPMethods.GET,
//     templateProfileIdList,
//     false,
//     null
//   );
//   return response;
// }

export async function downloadTemplateProfileWithId(templateProfileId) {
  const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

  const response = await AxiosUtil.call(
    '/api/setting/downloadTemplateProfile/' + templateProfileId,
    HTTPMethods.GET,
    null,
    false,
    null,
    token,
  );
  return response;
}
