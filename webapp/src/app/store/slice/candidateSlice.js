import { createSlice } from '@reduxjs/toolkit';
import {
  getCandidateList,
} from '../../api/candidate';
import { mergeByProperty } from '../../utils/mergeByProperty';
const initialState = {
  candidates: [],
  totalElements: 0,
};

export const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setCandidatesData: (state, action) => {
      return {
        ...state,
        candidates: action.payload.candidateList,
        totalElements: action.payload.totalElements
      };
    },
    sortCandidatesData: (state, action) => {
      return { ...state, candidates: action.payload };
    },
    searchData: (state, action) => {
      return { ...state, candidates: action.payload.data };
    },
    resetSearchData: (state, action) => {
      return { ...state, candidates: action.payload };
    },
    deleteCandidateById: (state, action) => {
      const newCandidates = state.candidates.filter(candi => candi.candidateId !== action.payload);
      return { ...state, candidates: newCandidates };
    },
    resendRequestChangeStore: (state, action) => {
      const newCandidates = mergeByProperty(state.candidates, action.payload.data, "candidateId");
      return { ...state, candidates: newCandidates };
    },
  }
});

export const {
  setCandidatesData,
  sortCandidatesData,
  searchData,
  resetSearchData,
  deleteCandidateById,
  resendRequestChangeStore
} = candidateSlice.actions;
export const getCandidatesInStore = (state) => state.candidate.candidates;

export const getTotalElements = (state) => state.candidate.totalElements;

export const fetchCandidates = (data) => async (dispatch) => {
  try {
    const response = await getCandidateList(data);
    dispatch(setCandidatesData(response.data));
  } catch (error) {
    console.log(error);
  }

};

export const sortCandidates = (data) => (dispatch) => {
  dispatch(sortCandidatesData(data));
};

export const search = (data) => (dispatch) => {
  dispatch(searchData(data));
};

export const resetSearch = (data) => (dispatch) => {
  dispatch(resetSearchData(data));
};


export const deleteCandidate = (data) => (dispatch) => {
  dispatch(deleteCandidateById(data));
};

export const resendRequest = (data) => (dispatch) => {
  dispatch(resendRequestChangeStore(data));
};

export default candidateSlice.reducer;
