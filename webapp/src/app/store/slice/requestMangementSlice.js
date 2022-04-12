import { createSlice } from '@reduxjs/toolkit';
import { getRequestManagementList } from '../../api/requestmanagement';

const initialState = {
  requestApprovals: [],
  totalElements: 0,
};

export const requestManagementSlice = createSlice({
  name: 'requestApproval',
  initialState,
  reducers: {
    setRequestData: (state, action) => {
      return { ...state, requestApprovals: action.payload.requestApprovals, totalElements: action.payload.totalElements };
    },
  },
});

export const { setRequestData } = requestManagementSlice.actions;

export const getRequestManagementFromStore = (state) => state.requestApproval.requestApprovals;

export const getTotalApproveRequestElements = (state) => state.requestApproval.totalElements;

export const fecthRequestManagementList = (data) => async (dispatch) => {  
  const response = await getRequestManagementList(data);
  dispatch(setRequestData(response.data));
};

export default requestManagementSlice.reducer;
