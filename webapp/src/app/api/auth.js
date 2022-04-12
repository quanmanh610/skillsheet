/* eslint-disable no-unused-vars */
import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';

export async function login(data) {
  const response = await AxiosUtil.call(
    '/api/login',
    HTTPMethods.POST,
    data
  );
  return response;
}

export async function logout(data) {
  const response = await AxiosUtil.call(
    '/api/logout',
    HTTPMethods.POST,
    data
  );
  return response;
}

export async function loginCandidateApi(candidateId) {
  const response = await AxiosUtil.call(
    '/api/loginCandidate',
    HTTPMethods.POST,
    candidateId
  );
  return response;
}

export async function logoutCandidateApi(candidateId) {
  const response = await AxiosUtil.call(
    '/api/logoutCandidate',
    HTTPMethods.POST,
    candidateId
  );
  return response;
}

export async function increaseLoginCount() {    
  
  const response = await AxiosUtil.call(
    '/api/login/increaseLoginCount',
    HTTPMethods.POST,
    null,    
    false,
    null
  );

  return response;
}
