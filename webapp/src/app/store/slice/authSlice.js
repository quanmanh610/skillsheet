import { createSlice } from '@reduxjs/toolkit';
import { getStaffAvailableTime, getDuAndGroupFromDashboard } from '../../api/gatewayApi';
import { decryptMessage, encryptMessage } from '../../utils/EncryptionUtil';

const getUserDataFromStorage = () => {
  const localStorageData = localStorage.getItem('skill_sheet_cache');
  const sessionStorageData = sessionStorage.getItem('skill_sheet_cache');
  if (localStorageData) {
    const data = decryptMessage(localStorageData);
    if (data !== '') {
      return JSON.parse(data);
    } else {
      localStorage.clear();
    }
  } else if (sessionStorageData) {
    const data = decryptMessage(sessionStorageData);
    if (data !== '') {
      return JSON.parse(data);
    } else {
      sessionStorage.clear();
    }
  }

  return {};
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {    
    // user: localStorage.getItem('skill_sheet_cache') 
    // //? JSON.parse(decodeURIComponent(escape(window.atob(localStorage.getItem('skill_sheet_cache'))))) 
    // ? JSON.parse(decryptMessage(localStorage.getItem('skill_sheet_cache')))
    // //: sessionStorage.getItem('skill_sheet_cache') ? JSON.parse(decodeURIComponent(escape(window.atob(sessionStorage.getItem('skill_sheet_cache'))))) : {},
    // : sessionStorage.getItem('skill_sheet_cache') ? JSON.parse(decryptMessage(localStorage.getItem('skill_sheet_cache'))) : {},
    user: getUserDataFromStorage()
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();      
      return {
        ...state,
        user: {},
      };
    },
    setUserData: (state, action) => {
      const data = action.payload;      
      const user = Object.assign({}, data.user ? data.user : data, {
        isAuthenticated: !!data.token,
        token: data.token,
        refreshToken: data.refreshToken,
        menuTabs: data.menuTabs,
        isCandidate: data.isCandidate,
        candidateRole: data.candidateRole,
        //isStaffLoginFirstTime: data.staffLoginFirstTime,
        loginCount: data.loginCount,
        du: data.user ? data.user.du : '',
        group: data.user ? data.user.group : '',
        step: data.step,
      });         
      let userData = encryptMessage(user);      
      if (!user.isCandidate) {
        //localStorage.setItem('skill_sheet_cache', window.btoa(unescape(encodeURIComponent(JSON.stringify(user)))));
        localStorage.setItem('skill_sheet_cache', userData);
      } else {
        //sessionStorage.setItem('skill_sheet_cache', window.btoa(unescape(encodeURIComponent(JSON.stringify(user)))));
        sessionStorage.setItem('skill_sheet_cache', userData);
      }      
      return {
        ...state,        
        user: user,
      };
    },
    updateUserData: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          //isStaffLoginFirstTime: false
        },
      };
    },
    updateUserInfoData: (state, action) => {
      let userData = encryptMessage({ ...state.user, userInfo: action.payload });
      //localStorage.setItem('skill_sheet_cache', window.btoa(unescape(encodeURIComponent(JSON.stringify({ ...state.user, userInfo: action.payload })))));
      localStorage.setItem('skill_sheet_cache', userData);
      return {
        ...state,
        user: { ...state.user, userInfo: action.payload },
      };
    },
    updateUserDuAndGroupData: (state, action) => {
      let userData = encryptMessage({ ...state.user, du: action.payload.groupName, group: action.payload.parentName });
      // localStorage.setItem('skill_sheet_cache',
      //   window.btoa(unescape(encodeURIComponent(JSON.stringify({ ...state.user, du: action.payload.groupName, group: action.payload.parentName })))));
      localStorage.setItem('skill_sheet_cache', userData);
      return {
        ...state,
        user: { ...state.user, du: action.payload.groupName, group: action.payload.parentName },
      };
    },
    updateUserLoginCount: (state, action) => {   
      let userData = encryptMessage({ ...state.user, loginCount: action.payload });
      //localStorage.setItem('skill_sheet_cache', window.btoa(unescape(encodeURIComponent(JSON.stringify({ ...state.user, loginCount: action.payload })))));
      localStorage.setItem('skill_sheet_cache', userData);
      return {
        ...state,
        user: { ...state.user, loginCount: action.payload },
      };
    },
  },
});

export const { setUserData, logout, updateUserData, updateUserInfoData, updateUserDuAndGroupData, updateUserLoginCount } = authSlice.actions;

export const getUserData = (state) => { return state.auth.user; };

export const getAuthStatus = (state) => state.auth.user.isAuthenticated;

export const getCandiateStatus = (state) => state.auth.user.isCandidate;

export const firstStaffProfileCreated = (loginCount) => async (dispatch) => {  
  dispatch(updateUserLoginCount(loginCount));
};

export const fetchStaffAvailableTime = (userName) => async (dispatch) => {
  const response = await getStaffAvailableTime(userName);
  if (response != null) {    
    dispatch(updateUserInfoData(response.data));
  }
};

export const fetchDuAndGroupFromDashboard = (userName) => async (dispatch) => {
  const response = await getDuAndGroupFromDashboard(userName);
  dispatch(updateUserDuAndGroupData(response.data));
};
export default authSlice.reducer;
