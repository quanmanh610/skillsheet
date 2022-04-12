import { createSlice } from '@reduxjs/toolkit';
import { getProfileVersionListByEmail } from '../../api/profile';

const initialState = {
  versions: [],
  totalElements: 0,
};

export const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {
    setVersions: (state, action) => {
      const data = action.payload;
      const total = data[0] ? data[0].totalElements : 0;
      const versions = data.map((obj) => {
        if (obj)
          return { ...obj.version, profile: obj.profile, email: obj.profile.email }
      });
      return { ...state, versions: versions, totalElements: total };
    },
  },
});

export const {
  setVersions
} = versionSlice.actions;

export const getVersionsFromStore = (state) => state.version.versions;

export const getTotalVersionElements = (state) => state.version.totalElements;

export const fecthProfileVersionList = (data) => async (dispatch) => {
  try {
  const response = await getProfileVersionListByEmail(data);
  dispatch(setVersions(response.data));
} catch (error) {
  console.log(error);
}
};


export default versionSlice.reducer;
