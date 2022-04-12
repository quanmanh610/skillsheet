import { ActivityKeyConstants } from '../constants/ActivityKeyConstants';
import { HTTPMethods } from '../constants/HTTPMethods';
import AxiosUtil from '../utils/AxiosUtil';
import { getActivityKey } from '../utils/PoaUtil';
import store from '../store/store';

/**
 * Profile api
 */

export async function getProfileById(data) {    
    const body = {
        ...data,
    };

    const keys = [
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN,
        ActivityKeyConstants.VIEW_LIST_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,        
    ]
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/profile/getProfileById',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
    );
    return response;
}

export async function getProfileByCandidateEmail(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN,
        ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,
        ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,        
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/getProfileByCandidateEmail',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
    );
    return response;
}

// export async function getProfileByCandidateId(candidateId) {        
//     const body = {
//         candidateId,
//     };     
//     const keys = [
//         ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN,
//         ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_G,
//         ActivityKeyConstants.VIEW_EDIT_ALL_CANDIDATE_INFO,        
//     ]
//     let activityKey = getActivityKey(keys);   
//     const response = await AxiosUtil.call(
//         '/api/profile/getProfileByCandidateId',
//         HTTPMethods.POST,
//         body,
//         false,
//         activityKey,
//     );
//     return response;
// }


export async function getProfileByStaffEmail(data) {    
    const body = {
        ...data,
    };
    
    const keys = [
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN,
        // ActivityKeyConstants.VIEW_LIST_STAFF_PROFILE,
        // ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        // ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        // ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,        
    ]
    let activityKey = getActivityKey(keys);    
    
    const response = await AxiosUtil.call(
        '/api/profile/getProfileByStaffEmail',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response; 
}

export async function updateProfile(data) {  
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };    

    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/profile/updateProfile',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token,
    );
    return response;
}

export async function deleteEducation(data) {    
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);   

    const response = await AxiosUtil.call(
        '/api/profile/deleteEducation',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token,
    );
    return response;
}

export async function deleteWorkExperience(data) {  
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/deleteWorkExperience',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token,
    );
    return response;
}

export async function deleteLanguage(data) {    
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/deleteLanguage',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token,
    );
    return response;
}

export async function deleteProject(data) {    
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/deleteProject',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token,
    );
    return response;
}

export async function addProfileCertificate(data) {    
    const body = {
        ...data,
    };
    
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/profile/addProfileCertificate',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function updateProfileCertificate(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/updateProfileCertificate',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}



export async function deleteProfileCertificate(data) {    
    const body = {
        ...data,
    };
    
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/profile/deleteProfileCertificate',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function addProfileSkill(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/addProfileSkill',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function updateProfileSkill(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/updateProfileSkill',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}



export async function deleteProfileSkill(data) {    
    const body = {
        ...data,
    };
    
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/profile/deleteProfileSkill',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function createFirstStaffProfile(data) {    
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

    const body = {
        ...data,
    };
    const keys = [        
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/createFirstStaffProfile',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token
    );
    
    return response;
}


export async function copyCandidateProfile(data) {
    const form = new FormData();
    const body = {
        ...data,
    };
    
    const keys = [        
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/profile/copyCandidateProfile',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function setMainVersion(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN,
        ActivityKeyConstants.SET_THE_PROFILE_AS_MAIN_VERSION,     
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/setMainVersion',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function requestApprove(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.SEND_REQUEST_APPROVAL_STAFF_PROFILE,        
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/requestApprove',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    ); 
    return response;
}

export async function requestSubmitCandidateProfile(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.SUBMIT_CANDIDATE_PROFILE,        
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/requestSubmitCandidateProfile',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function cloneNewVersion(data) {
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.CREATE_NEW_VERSION,        
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/cloneNewVersion',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token,
    );
    return response;
}

export async function deleteProfileVersion(data) {    
    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };

    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/deleteVersion',
        HTTPMethods.POST,
        body,
        false,
        activityKey,
        token
    );
    return response;
}

export async function getProfileVersionListByEmail(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.VIEW_LIST_VERSION,       
    ]
    let activityKey = getActivityKey(keys);    
    const response = await AxiosUtil.call(
        '/api/profile/getProfileVersionListByEmail',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function getProfileByVersion(data) {    
    const body = {
        ...data,
    };
    const keys = [
        ActivityKeyConstants.EDIT_ALL_STAFF_PROFILE,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_G,
        ActivityKeyConstants.EDIT_STAFF_PROFILE_BY_DU,
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN
    ]
    let activityKey = getActivityKey(keys);
    const response = await AxiosUtil.call(
        '/api/profile/getProfileByVersion',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function downloadProfile(profileId, templateId = 0) {
    // const keys = [                
    //     ActivityKeyConstants.VIEW_EDIT_CANDIDATE_INFO_BY_OWN,         
    // ]
    // let activityKey = getActivityKey(keys);

    const state = store.getState();
    const sendingToken = state.auth.user.token || "";

    const token = {
      t: sendingToken,
    };
    
    const url = '/api/profile/downloadProfile/' + profileId + "?tid=" + templateId;    
    const response = await AxiosUtil.call(
        url,
        HTTPMethods.POST,
        null,
        "animationOff",
        ActivityKeyConstants.VIEW_EDIT_STAFF_CANDIDATE_PROFILE_BY_OWN,
        token,
    );
    return response;
}

export async function getProjectListHome(data) {
    const body = {
        ...data,
    };
    
    const keys = [        
        ActivityKeyConstants.VIEW_LIST_STAFF_PROFILE,           
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_ALL_STAFF_PROFILE_ALL_INFO,   
        ActivityKeyConstants.VIEW_ALL_STAFF_PROFILE_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_LIST_CANDIATE_PROFILE,   
        ActivityKeyConstants.VIEW_CANDIDATE_PROFILE_BY_G_ALL_INFO,   
        ActivityKeyConstants.VIEW_CANDIDATE_PROFILE_BY_G_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_ALL_CANDIDATE_PROFILE_ALL_INFO,
        ActivityKeyConstants.VIEW_ALL_CANDIDATE_PROFILE_NO_PHONE_EMAIL,
    ]
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/home/getProfileList',
        HTTPMethods.POST,
        body,
        false,
        activityKey
    );
    return response;
}

export async function getProfileListSuggestions(type, searchValue = '') {    
    const body = {
        type: type,
        searchValue
    }; 

    const keys = [        
        ActivityKeyConstants.VIEW_LIST_STAFF_PROFILE,           
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_ALL_STAFF_PROFILE_ALL_INFO,   
        ActivityKeyConstants.VIEW_ALL_STAFF_PROFILE_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_LIST_CANDIATE_PROFILE,   
        ActivityKeyConstants.VIEW_CANDIDATE_PROFILE_BY_G_ALL_INFO,   
        ActivityKeyConstants.VIEW_CANDIDATE_PROFILE_BY_G_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_ALL_CANDIDATE_PROFILE_ALL_INFO,
        ActivityKeyConstants.VIEW_ALL_CANDIDATE_PROFILE_NO_PHONE_EMAIL,
    ]

    let activityKey = getActivityKey(keys);    
    const response = await AxiosUtil.call(
        '/api/home/getSuggestions',
        HTTPMethods.POST,
        body,
        true,
        activityKey
    );
    return response;
}

export async function getListProfileId(data) {    
    const body = {
        ...data,
    };

    const keys = [        
        ActivityKeyConstants.VIEW_LIST_STAFF_PROFILE,           
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO,   
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_ALL_STAFF_PROFILE_ALL_INFO,   
        ActivityKeyConstants.VIEW_ALL_STAFF_PROFILE_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_LIST_CANDIATE_PROFILE,   
        ActivityKeyConstants.VIEW_CANDIDATE_PROFILE_BY_G_ALL_INFO,   
        ActivityKeyConstants.VIEW_CANDIDATE_PROFILE_BY_G_NO_PHONE_EMAIL,   
        ActivityKeyConstants.VIEW_ALL_CANDIDATE_PROFILE_ALL_INFO,
        ActivityKeyConstants.VIEW_ALL_CANDIDATE_PROFILE_NO_PHONE_EMAIL,
    ]
    
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/profile/getListProfileId',
        HTTPMethods.POST,
        body, "animationOff",
        activityKey
    );
    return response;
}


export async function requestUpdate(data) {    
    const body = {
        ...data,
    };
    
    const keys = [                       
        ActivityKeyConstants.REQUEST_UPDATE_STAFF_PROFILE,           
    ]
    
    let activityKey = getActivityKey(keys);

    const response = await AxiosUtil.call(
        '/api/home/requestUpdate',
        HTTPMethods.POST,
        body, "animationOff",
        activityKey
    );
    return response;
}