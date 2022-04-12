import React from 'react';
import { Row, Col, Typography } from 'antd';
import moment from 'moment';
import { monthFormat } from '../../../../../constants/DateTimes';
import { useSpring, animated } from 'react-spring'

const { Text } = Typography;

const DetailWorkExperience = ({ workExperience }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  return (
    <animated.div style={props}>
      <Row justify="center">
        <Col span={23} >
          <div>
            <Text key={workExperience.company + "company"}>
              {workExperience.company}
            </Text>
            <br></br>
            <Text key={workExperience.fromMonth + "fromMonth"}>
              From: {moment(workExperience.fromMonth).format(monthFormat)}
            </Text>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {workExperience.now == 1 ? 
              <Text key={workExperience.toMonth + "now"}>
                To: Now
              </Text> :
              <Text key={workExperience.toMonth + "toMonth"}>
                To: {moment(workExperience.toMonth).format(monthFormat)}
              </Text>}
            <br></br>
            <Text key={workExperience.description + "description"} >
              Description: {workExperience.description}
            </Text>
          </div>
        </Col>
      </Row>
      <br></br>
    </animated.div>
  );
};
export default DetailWorkExperience;
