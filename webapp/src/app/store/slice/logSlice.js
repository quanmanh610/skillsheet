import { createSlice } from '@reduxjs/toolkit';
import {
  getLogList,
} from '../../api/log';
const initialState = {
  logs: [],
  totalElements: 0,
};

export const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    setLogsData: (state, action) => {
      return {
        ...state,
        logs: action.payload.changeHistories,
        totalElements: action.payload.totalElements
      };
    }
  }
});

export const {
  setLogsData

} = logSlice.actions;
export const getLogsInStore = (state) => state.log.logs;

export const getTotalElements = (state) => state.log.totalElements;

export const fetchLogs = (data) => async (dispatch) => {
  const response = await getLogList(data);
  dispatch(setLogsData(response.data));
};

export default logSlice.reducer;
