/* eslint-disable no-unused-vars */
import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';

export async function getStaffAvailableTime(userName) {
  const url = 'https://gateway.cmcglobal.com.vn/dashboard/api/user/available?userName=' + userName;
  const response = await AxiosUtil.call(
    url,
    HTTPMethods.GET,
    null,
    "animationOff"
  );
  return response;
}

export async function getListProjectForSkillSheet() {
  const response = await AxiosUtil.call(
    "https://gateway.cmcglobal.com.vn/dashboard/api/project/listProjectForSkillSheet",
    HTTPMethods.GET,
    null,
    "animationOff"
  );
  return response;
}

export async function getDuAndGroupFromDashboard(userName) {
  const url = 'https://group-dashboard.cmcglobal.com.vn/api/group/groupOfUser?userName=' + userName;
  const response = await AxiosUtil.call(
    url,
    HTTPMethods.GET,
    null,
    "animationOff"
  );
  return response;
}
