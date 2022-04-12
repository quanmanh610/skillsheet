import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import profileReducer from './slice/profileSlice';
import settingReducer from './slice/settingSlice';
import animationReducer from './slice/animationSlice';
import candidateReducer from './slice/candidateSlice';
import versionReducer from './slice/versionSlice';
import requestApprovalReducer from './slice/requestMangementSlice';
import logReducer from './slice/logSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    setting: settingReducer,
    animation: animationReducer,
    candidate: candidateReducer,
    version: versionReducer,
    log: logReducer,
    requestApproval: requestApprovalReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: false
    }),
  },
});

export default store