import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { getUserData } from '../../store/slice/authSlice';

import ProfileDetails from './components/profileDetails/ProfileDetails';
import Versions from './components/versionList/Versions';
import StaffLoginFirstTime from './components/staffLoginFirstTime/StaffLoginFirstTime';
import './Profile.css';
import './../../styles.css';

const Profile = (props) => {

  const user = useSelector(getUserData);
  const location = useLocation();
  const params = new URLSearchParams(location.search);  
  const profileId = params.get('pid');
  const view = params.get('v');

  const getComponent = () => {
    if (!user.isCandidate && user.loginCount === 0 && !profileId) {
      return StaffLoginFirstTime;
    } else if (view === 'versions') {
      return Versions;
    } else {
      return ProfileDetails;
    }
  }

  return (
    <div className="not-support-for-sticky-header">
      <Switch>
      <Route path="/profile" exact component={getComponent()} />        
        {/* <Route path="/profile" exact component={!user.isCandidate && user.loginCount === 0 && !profileId ? StaffLoginFirstTime : ProfileDetails} />         */}
        {/* <Route path="/profile/versions" component={Versions} /> */}
      </Switch>
    </div>
  );
};

export default Profile;
