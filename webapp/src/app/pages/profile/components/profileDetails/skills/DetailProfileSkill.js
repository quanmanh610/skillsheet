import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Tag } from 'antd';
import moment from 'moment';
import { yearFormat } from '../../../../../constants/DateTimes';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { useSelector } from 'react-redux';
import { AntdColor } from '../../../../../constants/AntdColor';
import { getSkillsInStore } from '../../../../../store/slice/settingSlice';
import { useSpring, animated } from 'react-spring'
import { SettingItemStatus } from '../../../../../constants/SettingItemStatus';

const { Text } = Typography;

const DetailProfileSkill = ({ profileSkills, index }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const skillSInStore = useSelector(getSkillsInStore);

  const [pSs, setPSs] = useState(profileSkills)
  useEffect(() => {
    if (profileSkills) {
      setPSs(profileSkills.map((obj) => {
        if (obj)
          return { ...obj, skill: skillSInStore.filter((item) => item.name === obj.skill)[0] }
        return undefined
      }))
    }
  }, [profileSkills, skillSInStore]);
  return (
    <animated.div style={props}>
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Row>
            <Col span={24}>
              <Row className="margin-bottom-10">
                <Col span={8} >  <Text strong className="margin-top-10">Skill</Text> </Col>                
                <Col span={6} >   <Text strong className="margin-top-10">Level</Text></Col>
                <Col span={6} >   <Text strong className="margin-top-10">Years of Experience</Text></Col>
                <Col span={4} >   <Text strong className="margin-top-10">Last Used</Text></Col>
              </Row>
              {pSs.map((profileSkill) =>
                <Row className="margin-bottom-10" key={profileSkill.profileSkillId}>
                  <Col span={8} >
                    <Row>
                      <Tag size="small" style={{ textAlign: "center", minWidth: CSSConstants.BUTTON_WIDTH }} color={ profileSkill.bestSkill == true ? AntdColor[0] : AntdColor[55] } >{profileSkill?.skill?.name}</Tag>
                      <Text strong>{profileSkill?.skill?.status === SettingItemStatus.NEW ? "(waiting for approval...)" : ""}</Text>
                    </Row>
                  </Col>                  
                  <Col span={6} >   <Text className="margin-top-10">{profileSkill.level}</Text></Col>
                  <Col span={6} >   <Text className="margin-top-10">{profileSkill.yearOfExperiences}</Text></Col>
                  <Col span={4} >   <Text className="margin-top-10">{moment(profileSkill.lastUsed).isValid() ? moment(profileSkill.lastUsed).format(yearFormat) : ''}</Text></Col>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
      </Row>      
    </animated.div>
  );
};

export default DetailProfileSkill;
