import React, { useState, useEffect, useMemo } from 'react';
import PersonalInfo from './personalInfo/PersonalInfo';
import LinkBar from './linkBar/LinkBar';
import ObjectiveInfo from './personalObjective/ObjectiveInfo';
import ProfessionalSummaryInfo from './personalSummary/ProfessionalSummaryInfo';
import EducationInfo from './education/EducationInfo';
import CertificateInfo from './certificate/CertificateInfo';
import WorkExperienceInfo from './workExperience/WorkExperienceInfo';
import ProfileSKillInfo from './skills/ProfileSKillInfo';
import LanguagesInfo from './languages/LanguagesInfo';
import ProjectListInfo from './projectList/ProjectListInfo';
import PersonalInterestsInfo from './personalInterests/PersonalInterestsInfo';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfileByCandidateEmail,
  getProfile,
  fetchProfileByStaffEmail,
  fetchProjectTitleFromDashboard,
  fetchProfileById,
  isOwnerProfile,
} from '../../../../store/slice/profileSlice';
import {
  fetchStaffAvailableTime,
  getUserData,
} from '../../../../store/slice/authSlice';
import './ProfileDetails.css';
import { fetchProjectRoles } from '../../../../store/slice/settingSlice';
import { useSpring, animated } from 'react-spring';
import { Affix, Col, Row } from 'antd';
import { useLocation } from 'react-router-dom';
import FunctionButtons from './functionButtons/FunctionButtons';
import IntroInfo from './personalInfo/IntroInfo';
import Text from 'antd/lib/typography/Text';
import CandidateProfile from './candidateProfile/CandidateProfile';
import { ActivityKeyConstants } from '../../../../constants/ActivityKeyConstants';
import { getActivityKey } from '../../../../utils/PoaUtil';
import { POARoles } from '../../../../constants/POARoles';
import PAGE401 from '../../../../components/Page401';

const ProfileDetails = () => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  const topOffset = 60;
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector(getUserData);

  const isOwner = useSelector(isOwnerProfile);

  const rootProfile = useSelector(getProfile);
  const [init, setInit] = useState(true);

  const [isManagerByDUOfProfile, setIsManagerByDUOfProfile] = useState(false);
  const [isManagerByGroupOfProfile, setIsManagerByGroupOfProfile] = useState(
    false
  );
  const [isRecruiterOrSale, setIsRecruiterOrSale] = useState(false);
  const [editingComponent, setEditingComponent] = useState('');

  //const [showToTop, setShowToTop] = useState('none');

  useEffect(() => {
    async function fetchProjectRolesData() {
      await dispatch(fetchProjectRoles());
    }
    if (!userData.isCandidate) {
      async function fetchProjectTitleFromDashboardData() {
        await dispatch(fetchProjectTitleFromDashboard());
      }
      async function fetchStaffAvailableTimeData() {
        await dispatch(fetchStaffAvailableTime(userData.userName));
      }

      // async function fetchDuAndGroupFromDashboardData() {
      //   await dispatch(fetchDuAndGroup(userData.userName));
      // }

      // fetchDuAndGroupFromDashboardData();
      fetchStaffAvailableTimeData();
      fetchProjectTitleFromDashboardData();
    }
    fetchProjectRolesData();
  }, []);

  useEffect(() => {
    setIsRecruiterOrSale(false);
    if (userData && userData.roles) {
      for (let i = 0; i < userData.roles.length; i++) {
        const role = userData.roles[i];
        if (role.name === POARoles.RECRUITER || role.name === POARoles.SALE) {
          setIsRecruiterOrSale(true);
          break;
        }
      }
    }
  }, [isRecruiterOrSale]);

  useEffect(() => {
    if (userData) {
      const keys = [
        ActivityKeyConstants.VIEW_LIST_STAFF_PROFILE,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL,
      ];
      const activityKey = getActivityKey(keys);
      if (
        activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO ||
        activityKey ===
          ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL
      ) {
        if (
          rootProfile.staff &&
          rootProfile.staff.staffGroup === userData.group
        ) {
          setIsManagerByGroupOfProfile(true);
        } else {
          setIsManagerByGroupOfProfile(false);
        }
      } else if (
        activityKey ===
          ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO ||
        activityKey ===
          ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL
      ) {
        if (rootProfile.staff && rootProfile.staff.du === userData.du) {
          setIsManagerByDUOfProfile(true);
        } else {
          setIsManagerByDUOfProfile(false);
        }
      }
    }
  });

  const params = new URLSearchParams(location.search);
  const encodedEmail = params.get('ce');
  const candidateEmail = encodedEmail ? window.atob(encodedEmail) : '';
  const profileId = params.get('pid');

  useMemo(() => {
    if (!init) {
      return;
    }
    setInit(false);
    if (profileId) {
      if (
        Object.keys(rootProfile).length === 0 &&
        rootProfile.constructor === Object
      ) {
        dispatch(fetchProfileById({ profileId: window.atob(profileId) }));
      }
    } else if (candidateEmail && !userData.isCandidate) {
      if (
        Object.keys(rootProfile).length === 0 &&
        rootProfile.constructor === Object
      ) {
        dispatch(
          fetchProfileByCandidateEmail({ candidateEmail: candidateEmail })
        );
      }
    } else {
      if (
        userData.isCandidate &&
        Object.keys(rootProfile).length === 0 &&
        rootProfile.constructor === Object
      ) {
        dispatch(
          fetchProfileByCandidateEmail({ candidateEmail: userData.email })
        );
      }

      if (
        !userData.isCandidate &&
        userData.loginCount !== 0 &&
        Object.keys(rootProfile).length === 0 &&
        rootProfile.constructor === Object
      ) {
        dispatch(fetchProfileByStaffEmail({ staffEmail: userData.email }));
      }
    }
  }, [init]);

  const displayCandidateProfileBeingUpdated = () => {
    return (
      <Row
        style={{
          textAlign: 'center',
          marginTop: '50px',
          backgroundColor: 'white',
          fontSize: '25px',
        }}
      >
        <Col span={24}>
          <Text style={{ color: 'gray' }} strong>
            Profile is being updated...
          </Text>
        </Col>
      </Row>
    );
  };

  const displayCandidateProfileStep0 = () => {
    return (
      <Row>
        <Col span={8} className="candidate-profile"></Col>
        <Col span={8} className="candidate-profile">
          <CandidateProfile rootProfile={rootProfile}></CandidateProfile>
        </Col>
        <Col span={8} className="candidate-profile"></Col>
      </Row>
    );
  };

  const displayProfileDetails = () => {
    return (
      <Row>
        <Col span={6}>
          <Affix offsetTop={topOffset} id="personal-info">
            <PersonalInfo
              rootProfile={rootProfile}
              editingComponent={editingComponent}
              setEditingComponent={setEditingComponent}
            />
          </Affix>
        </Col>
        <Col span={12}>
          <div id="details">
            <Row hidden={rootProfile?.staff === null}>
              <IntroInfo rootProfile={rootProfile} />
            </Row>
            <Row>
              <ObjectiveInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <ProfessionalSummaryInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <EducationInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <CertificateInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <WorkExperienceInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <ProfileSKillInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <LanguagesInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <ProjectListInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
            <Row>
              <PersonalInterestsInfo
                rootProfile={rootProfile}
                editingComponent={editingComponent}
                setEditingComponent={setEditingComponent}
              />
            </Row>
          </div>
        </Col>
        <Col span={5} className="right-panel">
          <Affix offsetTop={topOffset}>
            <Row justify="center" id="function-buttons">
              <FunctionButtons profile={rootProfile} />
            </Row>
            <Row id="section-links">
              <LinkBar rootProfile={rootProfile} />
            </Row>
          </Affix>
        </Col>
        <Col span={1}></Col>
      </Row>
    );
  };

  const display401Page = () => {
    return <PAGE401></PAGE401>;
  };

  const displayProfile = () => {
    if (
      rootProfile.staff === null &&
      rootProfile.status === 'New' &&
      !isOwner
    ) {
      return <div>{displayCandidateProfileBeingUpdated()}</div>;
    } else if (userData.isCandidate && userData.step === 0 && isOwner) {
      return <div>{displayCandidateProfileStep0()}</div>;
    } else if (
      isOwner ||
      (!isOwner && isManagerByDUOfProfile) ||
      (!isOwner && isManagerByGroupOfProfile) ||
      (!isOwner && isRecruiterOrSale)
    ) {
      return <div>{displayProfileDetails()}</div>;
    } else {
      return <div></div>;
    }
  };

  return (
    <animated.div style={props} style={{ backgroundColor: '#F0F2F5' }}>
      {displayProfile()}
    </animated.div>
  );
};

export default ProfileDetails;
