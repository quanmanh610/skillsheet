import React from 'react';
import { Row, Col, Typography } from 'antd';
import moment from 'moment';
import { monthFormat } from '../../../../../constants/DateTimes';
import { useSpring, animated } from 'react-spring'
import { SettingItemStatus } from '../../../../../constants/SettingItemStatus';
import './education.css';

const { Text } = Typography;

const DetaillEducation = ({ education }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });
  
  return (
    <animated.div style={props}>
      <Row justify="center" style={{textAlign: 'justify'}}>
        <Col span={23} >
          <div>
            <Text>
              {education.school.status == SettingItemStatus.NEW ? 
                <span>{education.school.name} <Text strong> (waiting for approval...)</Text></span> : 
                <span>{education.school.name}</span>}
            </Text>
            <br></br>
            <Text>
              {moment(education.fromMonth).format(monthFormat)}
            </Text>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Text>
              {moment(education.toMonth).format(monthFormat)}
            </Text>
            <br></br>
            <Text>
              •	Grade: {education.grade}
            </Text>
            <br></br>
            <Text>
              •	Qualification: {education.qualification}
            </Text>
            <br></br>
            <Text>
              •	Achievement: <pre id="achivement">{education.achievement}</pre>
            </Text></div>
        </Col>
      </Row>      
    </animated.div>
  );
};
export default DetaillEducation;
