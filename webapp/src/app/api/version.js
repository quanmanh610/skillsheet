/* eslint-disable no-unused-vars */
import { ActivityKeyConstants } from '../constants/ActivityKeyConstants';
import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';
import { getActivityKey } from '../utils/PoaUtil';
import store from '../store/store';

export async function getListVersionIdOfStaff(data) {
  const keys = [
    ActivityKeyConstants.VIEW_LIST_VERSION
  ]
  let activityKey = getActivityKey(keys);
  const body = {
    ...data,
  };  
  const response = await AxiosUtil.call(
    '/api/version/getListVersionIdOfStaff',
    HTTPMethods.POST,
    body, 
    "animationOff",
    activityKey
  );
  return response;
}

export async function deleteMultiProfiles(ids) {
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";

  const token = {
    t: sendingToken,
  };

  const keys = [
    ActivityKeyConstants.VIEW_LIST_VERSION
  ]
  let activityKey = getActivityKey(keys);

  const response = await AxiosUtil.call(
    `/api/version/deleteMultiProfiles/${ids}`,
    HTTPMethods.DELETE,
    null,
    false,
    activityKey,
    token,
  );
  return response;
}