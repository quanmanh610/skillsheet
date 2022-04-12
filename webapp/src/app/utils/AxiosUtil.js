import axios from 'axios';
import { HTTPMethods } from '../constants/HTTPMethods';
import { HttpStatus } from '../constants/HttpStatus';
import store from '../store/store';
import { openNotification } from '../components/OpenNotification';
import { Messages } from '../utils/AppMessage';
import { setLoadingStatus } from '../store/slice/animationSlice';
import { logout } from '../store/slice/authSlice';
import { UrlConstants } from '../constants/Constants';

const AxiosUtil = {

  async call(url, method, data, animationOff = false, activityKey = null, params = null) {    
    if (!url.startsWith("http")) {
      url = UrlConstants.API_BASE_URL + url;
    }

    const state = store.getState();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + state.auth.user.token,
      userName: state.auth.user.isCandidate ? state.auth.user.email : state.auth.user.userName
    };


    if (!animationOff) {
      store.dispatch(setLoadingStatus(true));
    }

    if (!data) {
      data = {};
    }

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
      }
    }

    const sendingToken = state.auth.user.token || "";

    const token = {
      token: 'Bearer '.concat(sendingToken),
    };

    data = Object.assign(data, token);

    let sendingParams = {
      method: method,
      headers: { ...headers, activityKey: activityKey },
      url: url,
      timeout: 50000,
      data: data
    };

    sendingParams = Object.assign({}, sendingParams, { params: params });

    const exceptionHandle = (error) => {
      console.log("exceptionHandle", error);
      console.log("exception.response", error.response);
      if (!error.response) {
        if (error.request && error.request.readyState === 4 && error.request.status === 0) {
          openNotification(Messages.ERROR, "ERROR", "Could not connect to server")
        } else {
          openNotification(Messages.ERROR, "UNDEFINED", "UNDEFINED ERROR");
        }
      } else {
        if (error.response.status === HttpStatus.SERVER_ERROR) {
          if (error.response.data.message && error.response.data.message.length < 60) {
            openNotification(Messages.ERROR, HttpStatus.SERVER_ERROR, error.response.data.message);
          }
          else {
            openNotification(Messages.ERROR, HttpStatus.SERVER_ERROR, "Something went wrong");
          }
        } else if (error.response.status === HttpStatus.UNAUTHORIZED) {
          if (error.response.data === "Token is not valid") {
            openNotification(Messages.ERROR, HttpStatus.UNAUTHORIZED, error.response.data);                        
          } else {
            openNotification(Messages.ERROR, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
          }

          store.dispatch(logout());
          window.location.reload();
        } else if (error.response.status === HttpStatus.FORBIDDEN) {
          openNotification(Messages.ERROR, HttpStatus.FORBIDDEN, "FORBIDDEN");
        } else if (error.response.status === HttpStatus.BAD_REQUEST) {
          if (error.response.config.url.includes("downloadTemplateProfile")) {
            openNotification(Messages.ERROR, "Cannot download the file!");
          } else {
            if (error.response.data) {
              openNotification(Messages.ERROR, HttpStatus.BAD_REQUEST, error.response.data);
            } else {
              openNotification(Messages.ERROR, HttpStatus.BAD_REQUEST, "BAD REQUEST");
            }
          }
        } else {
          if (error.response && error.response.data) {
            let el = document.createElement('a');
            el.href = url;
            if (error.response.data.errorMessage) {
              openNotification(Messages.ERROR, el.host, error.response.data.errorMessage);
            } else if (error.response.data.message) {
              openNotification(Messages.ERROR, el.host, error.response.data.message);
            } else {
              openNotification(Messages.ERROR, el.host, "UNDEFINED ERROR");
            }
          } else {
            openNotification(Messages.ERROR, "UNDEFINED", "UNDEFINED ERROR");
          }
        }
      }
    }

    //console.log('AxiosUtil', sendingParams);

    const resp = await axios(sendingParams).then((response) => {
      return response;
    }).catch(exception => {
      exceptionHandle(exception);
    });
    store.dispatch(setLoadingStatus(false));
    return resp;

  },
};

export default AxiosUtil;
