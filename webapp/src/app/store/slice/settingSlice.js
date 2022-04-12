import { createSlice } from '@reduxjs/toolkit';
import {
  getSkillsList,
  getSchoolList,
  getCertificateList,
  getProjectroleList,
  getEmailList,
  getTemplateProfileList, getChannelList,
} from '../../api/setting';

const initialState = {
  skills: [],
  skillCategories: [],
  skillsBK: [],
  school: [],
  schoolCategories: [],
  schoolBK: [],
  certificate: [],
  certificateCategories: [],
  email: [],
  templateProfile: [],
  projectRoles: [],
  projectRolesBK: [],
  channel: [],
  channelBK: [],
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSkillData: (state, action) => {
      const data = action.payload;
      const temp = new Map(data.map((it) => [it.category, { key: it.category, value: it.category }]));
      const categoriesNoDuplicate = [...temp.values()];
      return { ...state, skills: action.payload, skillsBK: action.payload, skillCategories: categoriesNoDuplicate };
    },
    setSchoolData: (state, action) => {
      const data = action.payload;
      const temp = new Map(data.map((it) => [it.category, { key: it.category, value: it.category }]));
      const categoriesNoDuplicate = [...temp.values()];
      return { ...state, school: action.payload, schoolBK: action.payload, schoolCategories: categoriesNoDuplicate };
    },
    setCertificateData: (state, action) => {
      const data = action.payload;
      const temp = new Map(data.map((it) => [it.category, { key: it.category, value: it.category }]));
      const categoriesNoDuplicate = [...temp.values()];
      return { ...state, certificate: action.payload, certificateCategories: categoriesNoDuplicate };
    },
    setEmailData: (state, action) => {
      return { ...state, email: action.payload };
    },
    setTemplateProfileData: (state, action) => {
      return { ...state, templateProfile: action.payload };
    },
    setProjectRolesData: (state, action) => {
      return {
        ...state,
        projectRoles: action.payload,
        projectRolesBK: action.payload,
      };
    },
    setChannelData: (state, action) => {
      return {
        ...state,
        channel: action.payload,
        channelBK: action.payload,
      };
    },
    sortProjectRolesData: (state, action) => {
      return { ...state, projectRoles: action.payload };
    },
    sortSkillsData: (state, action) => {
      return { ...state, skills: action.payload };
    },
    sortSchoolsData: (state, action) => {
      return { ...state, school: action.payload };
    },

  },
});

export const {
  setSkillData,
  setSchoolData,
  setChannelData,
  setCertificateData,
  setEmailData,
  setTemplateProfileData,
  setProjectRolesData,
  sortProjectRolesData,
  sortSkillsData,
  sortSchoolsData,
} = settingSlice.actions;
export const getSkillsInStore = (state) => state.setting.skills;
export const getSkillsCategory = (state) => state.setting.skillCategories;
export const getActiveSkillsInStore = (state) => state.setting.skills.filter((item) => item.status === 0);
export const getSchoolInStore = (state) => state.setting.school;
export const getSchoolsCategory = (state) => state.setting.schoolCategories;
export const getCertificateInStore = (state) => state.setting.certificate;
export const getCertificateCategory = (state) => state.setting.certificateCategories;
export const getActiveCertificatesInStore = (state) => state.setting.certificate.filter((item) => item.status === 0);
export const getEmailsInStore = (state) => state.setting.email;
export const getTemplateProfileInStore = (state) => state.setting.templateProfile;
export const getProjectRolesInStore = (state) => state.setting.projectRoles;
export const getChannelInStore = (state) => state.setting.channel;
export const getActiveProjectRolesInStore = (state) => state.setting.projectRoles.filter((item) => item.status === 0);
export const getProjectRolesBKInStore = (state) => state.setting.projectRolesBK;
export const getSkillsBKInStore = (state) => state.setting.skillsBK;
export const getSchoolsBKInStore = (state) => state.setting.schoolBK;

export const fetchSkills = () => async (dispatch) => {
  const response = await getSkillsList();
  dispatch(setSkillData(response.data));
};
export const fetchSchool = () => async (dispatch) => {
  const response = await getSchoolList();
  dispatch(setSchoolData(response.data));
};
export const fetchCertificate = () => async (dispatch) => {
  const response = await getCertificateList();
  dispatch(setCertificateData(response.data));
};
export const fetchProjectRoles = () => async (dispatch) => {
  const response = await getProjectroleList();
  dispatch(setProjectRolesData(response.data));
};

export const fetchChannel = () => async (dispatch) => {
  const response = await getChannelList();
  dispatch(setChannelData(response.data));
};

export const sortProjectRoles = (data) => (dispatch) => {
  dispatch(sortProjectRolesData(data));
};

export const sortSkills = (data) => (dispatch) => {
  dispatch(sortSkillsData(data));
};

export const sortSchools = (data) => (dispatch) => {
  dispatch(sortSchoolsData(data));
};

export const fetchEmails = () => async (dispatch) => {
  const response = await getEmailList();
  dispatch(setEmailData(response.data));
};
export const fetchTemplateProfile = () => async (dispatch) => {
  const response = await getTemplateProfileList();
  dispatch(setTemplateProfileData(response.data));
};

export default settingSlice.reducer;
