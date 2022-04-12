import React, { useRef } from 'react';
import { Collapse, Typography } from 'antd';
import * as settings from '../../constants/settings.constants';
import Skills from './components/Skills/Skills';
import Certificates from './components/Certificates/Certificates';
import Schools from './components/Schools/Schools';
import TemplateProfiles from './components/TemplateProfiles/TemplateProfiles';
import './Setting.css';
import './../../styles.css';
import ProjectRoles from './components/ProjectRoles/ProjectRoles';
import Emails from './components/Emails/Emails';
import { useSpring, animated } from 'react-spring'
import { UrlConstants } from '../../constants/Constants';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserData } from '../../store/slice/authSlice';
import Channel from "./components/Channel/Channel";
//import { isAuthorizedUser } from '../../utils/PoaUtil';

const { Panel } = Collapse;

const { Text } = Typography;

const Setting = () => {

  const user = useSelector(getUserData);

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  //const isPageAuthorized = isAuthorizedUser(user, UrlConstants.SETTINGS_PATH);

  function callback(key) {
    validateChildren();
  }
  const refs = useRef([]);

  function validateChildren() {
    refs.current.forEach((child) => {
      child.clearRowSelectionWhenOut();
    });
  }

  // if (!isPageAuthorized) {
  //   return <Redirect to={UrlConstants.UNAUTHORIZED_PATH} />
  // }

  return (
    <animated.div style={props} className="setting-area support-for-sticky-header">
      <Collapse accordion forceRender={true} onChange={callback}>
        <Panel
          header={<Text strong>{settings.PANEL_HEADER_SKILL_SETTINGS}</Text>}
          className="panel-header-style"
          id="SkillsSetting"
        >
          <Skills />
        </Panel>
        
        <Panel
          header={<Text strong>{settings.PANEL_HEADER_SCHOOL_SETTINGS}</Text>}
          className="panel-header-style"
        >
          <Schools />
        </Panel>
        
        <Panel
          header={<Text strong>{settings.PANEL_HEADER_CERTIFICATE_SETTINGS}</Text>}
          className="panel-header-style"
        >
          <Certificates />
        </Panel>

        <Panel
          header={<Text strong>{settings.PANEL_HEADER_PROJECT_ROLE_SETTINGS}</Text>}
          className="panel-header-style"
        >
          <ProjectRoles key={6} ref={(ins) => (refs.current[6] = ins)} />
        </Panel>

        <Panel
          header={<Text strong>{settings.PANEL_HEADER_PROFILE_TEMPLATE_SETTINGS}</Text>}
          className="panel-header-style"
        >
          <TemplateProfiles />
        </Panel>

        <Panel
          header={<Text strong>{settings.PANEL_HEADER_EMAIL_SETTINGS}</Text>}
          className="panel-header-style"
        >
          <Emails />
        </Panel>

        <Panel
            header={<Text strong>{settings.PANEL_HEADER_CHANNEL_SETTINGS}</Text>}
            className="panel-header-style"
        >
          <Channel />
        </Panel>
        
      </Collapse>
    </animated.div>
  );
};

export default Setting;
