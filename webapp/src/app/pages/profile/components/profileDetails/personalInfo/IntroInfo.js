import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Tag } from 'antd';
import { AntdColor } from '../../../../../constants/AntdColor';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { useSelector } from 'react-redux';
import { getUserData } from '../../../../../store/slice/authSlice';
import moment from 'moment';

import { dateFormat } from '../../../../../constants/DateTimes';
import { InfoCircleOutlined } from '@ant-design/icons';
import ProfileTitle from '../common/ProfileTitle';
import './PersonalInfo.css'

const { Text } = Typography;

const IntroInfo = ({ rootProfile }) => {
  const user = useSelector(getUserData);

  const [bestSkill, setBestSkill] = useState([]);

  useEffect(() => {
    if (rootProfile.profileSkills) {
      setBestSkill(
        rootProfile.profileSkills
          .filter((obj) => obj.bestSkill === '1')
          .map((item) => {
            if (item) return item.skill.name;
            return item;
          })
      );
    }
  }, [rootProfile]);

  const displayBookedTime = () => {
    if (!user.userInfo) {      
      return null;
    }

    if (!user.userInfo.projectBooked) {
      return null;
    }

    return (
      <>
        <Row style={{width: '100%'}}>
          <Col span={5}>
            <Text>Booked</Text>
          </Col>
          <Col span={19}>
            <Text strong>
              {
               user.userInfo.du + '-' + user.userInfo.projectBooked.projectName               
              }
            </Text>
          </Col>
        </Row>
        
        <Row style={{width: '100%'}}>  
          <Col span={5}></Col>      
          <Col span={8}>
            <Text strong>
              From Date:{' '}
              {
                moment(user.userInfo.projectBooked.startDate).format(dateFormat)                
              }
            </Text>
          </Col>
          <Col span={3}></Col>
          <Col span={8}>
            <Text strong>
              To Date:{' '}
              {
                moment(user.userInfo.projectBooked.endDate).format(dateFormat)                
              }
            </Text>
          </Col>
        </Row>
      </>
    );
  }

  const displayAvailableTime = () => {

    return (
      <>
        <Row style={{width: '100%'}}>
          <Col span={5}>
            <Text>Available Time</Text>
          </Col>
          <Col span={19}>
            <Text strong>
              {user.userInfo
                ? moment(user.userInfo.availableTime).format(dateFormat)
                : ''}
            </Text>
          </Col>
        </Row>
        {displayBookedTime()}
      </>
    );
  }

  const displayBestSkills = () => {
    return (
      <Row style={{width: '100%'}}>
        <Col span={5}><Text>Best Skills</Text></Col>
        <Col span={19}>{bestSkill.map((name, index) => (
          <Tag
            className="margin-bottom-10"
            key={index}
            color={AntdColor[0]}
            style={{
              textAlign: 'center',
              minWidth: CSSConstants.BUTTON_WIDTH,
            }}
          >
            {name}
          </Tag>
        ))}</Col>
      </Row>
    );
  }

  const displayIntro = () => {
    if (rootProfile.staff) {
      return (
        <div className='intro-section'>
          {displayAvailableTime()}
          {displayBestSkills()}
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div id="INTROPANEL" style={{width: '100%'}}>
      <ProfileTitle
        name={"Intro"}
        leftIcon={<InfoCircleOutlined />}
      />
      {displayIntro()}      
    </div>
  );
};
export default IntroInfo;
