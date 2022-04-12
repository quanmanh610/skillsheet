import { createSlice } from '@reduxjs/toolkit';

export const animationSlice = createSlice({
  name: 'animation',
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
});

export const { setLoading } = animationSlice.actions;
export const isLoadingStatus = (state) => {
  return state.animation.isLoading;
};

export const setLoadingStatus = (status) => (dispatch) => {
  dispatch(setLoading(status));
};

export default animationSlice.reducer;
