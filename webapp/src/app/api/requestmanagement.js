import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';
import { ActivityKeyConstants } from '../constants/ActivityKeyConstants';
import { getActivityKey } from '../utils/PoaUtil';
import store from '../store/store';

/**
 * Get - requestManagement api
 */
export async function getRequestManagementList(data) {  
  const body = {
    ...data,
  };
  const keys = [
    ActivityKeyConstants.VIEW_LIST_REQUEST_APPROVAL_OF_STAFF_PROFILE,   
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/request/getRequestManagementList',
    HTTPMethods.POST,
    body,
    false,
    activityKey
  );
  return response;
}

// export async function getListRequestApproval(data) {
//   const form = new FormData();
//   const body = {
//     ...data,
//   };
//   form.append('pagination', JSON.stringify(body));
//   const response = await AxiosUtil.call(
//     '/api/requestApproval/getListRequestApproval',
//     HTTPMethods.POST,
//     body,
//     false,
//     ActivityKeyConstants.VIEW_LIST_REQUEST_APPROVAL_OF_STAFF_PROFILE
//   );
//   return response;
// }

/**
 * Create - requestManagement api
 */
// export async function createRequest(newRequestData) {
//   // const response = await fetch('/api/requestmanagement/addRequest', {
//   //   method: 'POST',
//   //   headers,
//   //   body: JSON.stringify(newRequestData),
//   // });
//   // return response.json();
//   const keys = [
//     ActivityKeyConstants.REQUEST_UPDATE_STAFF_PROFILE
//   ]
//   let activityKey = getActivityKey(keys);
//   const response = await AxiosUtil.call(
//     '/api/requestmanagement/addRequest',
//     HTTPMethods.POST,
//     JSON.stringify(newRequestData),
//     false,
//     activityKey
//   );
//   return response;
// }

export async function approveMultiProfiles(ids) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.APPROVE_REJECT_STAFF_PROFILE
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    `/api/request/approveAll`,
    HTTPMethods.POST,
    JSON.stringify(ids),
    false,
    activityKey,
    token,
  );
  return response;
}

export async function rejectAllRequest(updateRequestDataList) {
  const keys = [
    ActivityKeyConstants.APPROVE_REJECT_STAFF_PROFILE
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/request/rejectAllRequestApproval',
    HTTPMethods.POST,
    JSON.stringify(updateRequestDataList),
    false,
    activityKey
  );
  return response;
}

/**
 * Update - requestManagement api
 */
export async function updateRequest(updateRequestData) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.APPROVE_REJECT_STAFF_PROFILE
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    '/api/request/updateRequestApproval',
    HTTPMethods.POST,
    JSON.stringify(updateRequestData),
    false,
    activityKey,
    token
  );
  return response;
}

export async function getRequestSuggestions(type, searchValue = '') { 
  const keys = [
    ActivityKeyConstants.VIEW_LIST_REQUEST_APPROVAL_OF_STAFF_PROFILE
  ]
  let activityKey = getActivityKey(keys);

  const body = {
      type: type,
      searchValue
  };    
  const response = await AxiosUtil.call(
      '/api/request/getSuggestions',
      HTTPMethods.POST,
      body,
      true,
      activityKey
  );
  return response;
}