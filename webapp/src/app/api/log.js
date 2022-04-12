import { ActivityKeyConstants } from '../constants/ActivityKeyConstants';
import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';
import { getActivityKey } from '../utils/PoaUtil';

/**
 * candidate - Candidate api
 */
export async function getLogList(data) {  
  const body = {
    ...data,
  };
  const keys = [
    ActivityKeyConstants.VIEW_LOGS_CHANGE_HISTORY,   
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/logs/getLogList',
    HTTPMethods.POST,
    body,
    false,
    activityKey
  );
  return response;
}


export async function searchLog(log) {
  const keys = [
    ActivityKeyConstants.VIEW_LOGS_CHANGE_HISTORY,   
  ]
  let activityKey = getActivityKey(keys);
  const response = await AxiosUtil.call(
    '/api/logs/searchLog',
    HTTPMethods.POST,
    log,
    false,
    activityKey
  );
  return response;
}