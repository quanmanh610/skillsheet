import { ActivityKeyConstants } from '../constants/ActivityKeyConstants';
import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';
import { getActivityKey } from '../utils/PoaUtil';
import store from '../store/store';

/**
 * candidate - Candidate api
 */
export async function getCandidateList(data) {
  const body = {
    ...data,
  };
  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,    
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/candidate/getCandidateList',
    HTTPMethods.POST,
    body,
    false,
    activityKey
  );
  return response;
}


export async function getListCandidateId(data) {  
  const body = {
    ...data,
  };

  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,    
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/candidate/getListCandidateId',
    HTTPMethods.POST,
    body, "animationOff",
    activityKey
  );
  return response;
}

// export async function countEmail(data) {  
//   const body = {
//     ...data,
//   };
//   const keys = [
//     ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,
//     ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,    
//   ]
//   let activityKey = getActivityKey(keys);
//   const response = await AxiosUtil.call(
//     '/api/candidate/countEmail',
//     HTTPMethods.POST,
//     body, "animationOff",
//     activityKey
//   );
//   return response;
// }
export async function addNewCandidate(candidate) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.CREATE_CANDIDATE_INFO,      
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/candidate/addCandidate',
    HTTPMethods.POST,
    candidate,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function updateCandidate(updateCandidateData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,   
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,   
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_OWN,   
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/candidate/updateCandidate',
    HTTPMethods.POST,
    updateCandidateData,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function deleteCandidate(candidateIdList) {
  const keys = [
    ActivityKeyConstants.DEACTIVATE_CANDIDATE,   
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/candidate/deleteCandidate',
    HTTPMethods.POST,
    candidateIdList,
    false,
    activityKey
  );
  return response;
}

export async function activeAllCandidate(candidateIdList) {
  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,   
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,       
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/activeAllCandidate',
    HTTPMethods.POST,
    candidateIdList,
    false,
    activityKey
  );
  return response;
}

export async function activeCandidate(candidateIdList) {
  const keys = [
    ActivityKeyConstants.DEACTIVATE_CANDIDATE,    
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/activeCandidate',
    HTTPMethods.POST,
    candidateIdList,
    false,
    activityKey
  );
  return response;
}

export async function deactiveCandidate(candidateIdList) {
  const keys = [
    ActivityKeyConstants.DEACTIVATE_CANDIDATE,   
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/inactiveCandidate',
    HTTPMethods.POST,
    candidateIdList,
    false,
    activityKey
  );
  return response;
}

export async function resendRequest(idSelectedLst) {
  const keys = [
    ActivityKeyConstants.RESEND_REQUEST,    
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/resendRequest',
    HTTPMethods.POST,
    idSelectedLst,
    "animationOff",
    activityKey
  );
  return response;
}

export async function searchCandidate(candidate) {
  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,   
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,       
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/searchCandidate',
    HTTPMethods.POST,
    candidate,
    false,
    activityKey
  );
  return response;
}

export async function findCandidateByEmailAndRole(candidate) {
  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,   
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,       
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/getCandidateByEmailAndRole',
    HTTPMethods.POST,
    candidate,
    false,
    activityKey
  );
  return response;
}

export async function findCandidateByEmail(candidate) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,   
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,       
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/getCandidateByEmail',
    HTTPMethods.POST,
    candidate,
    false,
    activityKey,
    token,
  );
  return response;
}

export async function getCandidateSuggestions(type, searchValue = '') {
  const body = {
    type: type,
    searchValue
  };
  const keys = [
    ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,   
    ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,       
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/candidate/getSuggestions',
    HTTPMethods.POST,
    body,
    true,
    activityKey
  );
  return response;
}

export async function getChannel() {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";
  const body = {
    token: sendingToken
  };
  const keys = [
    ActivityKeyConstants.SETTING_EMAIL,
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
      '/api/setting/getChannelList',
      HTTPMethods.POST,
      body,
      true,
      activityKey
  );
  return response;
}
