import React from 'react';
import { Typography } from 'antd';
import './CandidateProfile.css';
import CandidateSkillProfile from './CandidateSkillProfile';

const { Text } = Typography;

const CandidateProfile = ({ rootProfile }) => {
  return (
    <div className="candidate_profile_form">
        <label className="candidate_profile_label">
          Select Skills and Languages
        </label>
        <hr style={{ border: "1px solid #C4C4C4"}} />
        <CandidateSkillProfile rootProfile={rootProfile}></CandidateSkillProfile>
    </div> 
  );
};

export default CandidateProfile;
