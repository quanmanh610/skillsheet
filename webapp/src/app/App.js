import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LDAP from './pages/auth/components/LDAP';
import CANDI from './pages/auth/components/CANDI';
import Profile from './pages/profile/Profile';
import { ProtectedRoute } from "./components/ProtectedRoute";
import AppHeader from './components/AppHeader';
import AppContent from './components/AppContent';
import AppFooter from './components/AppFooter';
import Home from './pages/home/Home';
import Candidates from './pages/candidate/Candidates';
import Request from './pages/requestManagement/RequestManagement';
import Setting from './pages/setting/Setting';
import Logs from './pages/logs/Logs';
import { Layout } from 'antd';
import PAGE404 from './components/Page404';
import Versions from './pages/profile/components/versionList/Versions';
import PAGE401 from './components/Page401';
import { UrlConstants } from './constants/Constants';
import './styles.css';

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh', minWidth: "1200px", backgroundColor: "white" }} >      
      <AppHeader type="main" />
      <AppContent>
        <Switch>
          <ProtectedRoute exact path="/" name="" component={Home} />
          <Route exact path="/login" name="Login Page" component={LDAP} />
          <Route exact path="/loginCandidate" component={CANDI} />
          <ProtectedRoute exact path="/home" component={Home} />
          <ProtectedRoute exact path="/profile" component={Profile} />          
          {/* <ProtectedRoute exact path="/profile/versions" component={Versions} /> */}
          <ProtectedRoute exact path="/candidate" component={Candidates} />
          {/* <ProtectedRoute exact path="/profile/candidate" component={Profile} /> */}
          <ProtectedRoute exact path="/request" component={Request} />
          <ProtectedRoute exact path="/setting" component={Setting} />
          <ProtectedRoute exact path="/logs" component={Logs} />
          <Route exact path={UrlConstants.UNAUTHORIZED_PATH} component={PAGE401} />
          <Route path="*" component={PAGE404} />
        </Switch>
      </AppContent>
      <AppFooter />
    </Layout>
  )
};

export default App;
