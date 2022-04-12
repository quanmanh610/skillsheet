import { createSlice } from '@reduxjs/toolkit';
import { 
  getProfileById, 
  getProfileByCandidateEmail, 
  getProfileByStaffEmail, 
  getProfileByVersion, 
  getProjectListHome, 
  //getProfileByCandidateId 
} from '../../api/profile';
import { getDuAndGroupFromDashboard, getListProjectForSkillSheet } from '../../api/gatewayApi';
import { useHistory } from 'react-router-dom';

const initialState = {
  profile: {},
  isOwner: false,
  projectTitles: [],
  profiles: [],
  totalElements: 0,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      const data = action.payload;
      return { ...state, profile: { ...data, avatar: "data:image/jpeg;base64," + data.avatar } };
    },
    setVersions: (state, action) => {
      const data = action.payload;
      return { ...state, versions: data };
    },
    setProjectTitle: (state, action) => {
      const data = action.payload;

      const projectTitles = data.map((obj) => {
        if (obj.projectName)
          return { key: obj.projectName, value: obj.projectName }
        return undefined;
      }).filter(item => item !== undefined);
      return { ...state, projectTitles: projectTitles };
    },
    setProjectListHome: (state, action) => {
      return {
        ...state,
        profiles: action.payload.profileHomes,
        totalElements: action.payload.totalElements
      };
    },
    updateUserDuAndGroupData: (state, action) => {
      return {
        ...state,
        profile: {
          ...state.profile, staff: {
            ...state.profile.staff, du: action.payload.groupName, staffGroup: action.payload.parentName
          }
        },
        totalElements: action.payload.totalElements
      };
    },
  },
});

export const {
  setProfile,
  setVersions,
  setProjectTitle,
  setProjectListHome,
  updateUserDuAndGroupData
} = profileSlice.actions;

export const getProfile = (state) => state.profile.profile;

export const getProfileIdFromStore = (state) => state.profile.profile.profileId;

export const getProfilesTotalElements = (state) => state.profile.totalElements;

export const getProfileListInStore = (state) => state.profile.profiles;

export const isOwnerProfile = (state) => state.profile.profile.email === state.auth.user.email;

export const getProjectTitles = (state) => state.profile.projectTitles;

export const fetchProfileById = (data) => async (dispatch) => {
  const response = await getProfileById(data);
  dispatch(setProfile(response.data));
};

export const fetchProfileByCandidateEmail = (data) => async (dispatch) => {
  try {
    const response = await getProfileByCandidateEmail(data);
    dispatch(setProfile(response.data));
  } catch (error) {
    console.log(error);
  }
};

// export const fetchProfileByCandidateId = (candidateId) => async (dispatch) => {
//   try {
//     const response = await getProfileByCandidateId(candidateId);
//     dispatch(setProfile(response.data));
//   } catch (error) {
//     console.log(error);
//   }
// };

export const fetchProfileByStaffEmail = (data) => async (dispatch) => {
  try {
    const response = await getProfileByStaffEmail(data);
    dispatch(setProfile(response.data));
  } catch (error) {
    console.log(error);
  }
};

export const fecthProfileByVersion = (data) => async (dispatch) => {
  try {
    const response = await getProfileByVersion(data);
    dispatch(setProfile(response.data));
  } catch (error) {
    console.log(error);
  }

};


export const updateStoreProfile = (data) => async (dispatch) => {
  dispatch(setProfile(data));
};

export const fetchProjectTitleFromDashboard = () => async (dispatch) => {

  const response = await getListProjectForSkillSheet();
  dispatch(setProjectTitle(response.data));
};

export const fetchProjectListHome = (data) => async (dispatch) => {  
  try {
    const response = await getProjectListHome(data);
    dispatch(setProjectListHome(response.data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchDuAndGroup = (userName) => async (dispatch) => {
  const response = await getDuAndGroupFromDashboard(userName);
  dispatch(updateUserDuAndGroupData(response.data));
};

export default profileSlice.reducer;
