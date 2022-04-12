import React from 'react';
import { Switch } from 'react-router-dom';

const MainApp = (props) => {

  return (
    <Switch >
      {/* <ProtectedRoute exact path={`/home`} {...props} component={Home} />
      <ProtectedRoute exact path={`/profile`} {...props} component={Profile} />
      <ProtectedRoute exact path={`/versions`} {...props} component={ProfileVersionList} />
      <ProtectedRoute exact path={`/candidate`} {...props} component={Candidates} />
      <ProtectedRoute exact path={`/request`} {...props} component={Request} />
      <ProtectedRoute exact path={`/setting`} {...props} component={Setting} />
      <ProtectedRoute exact path={`/logs`} {...props} component={Logs} /> */}
    </Switch>
  );


};

export default MainApp;
