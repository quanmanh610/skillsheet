import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Tag } from 'antd';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { AntdColor } from '../../../../../constants/AntdColor';
import { useSpring, animated } from 'react-spring'
import { SettingItemStatus } from '../../../../../constants/SettingItemStatus';

const { Text } = Typography;

const DetailProjectList = ({ project, index, bestSkill }) => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const [skills, setSkills] = useState([])

  useEffect(() => {
    if (project) {
      setSkills(project.arraySkillNames ? JSON.parse(project.arraySkillNames) : []);
    }
  }, [project]);

  return (
    <animated.div style={props}>
      <Row justify="center" className="margin-bottom-10" style={{textAlign: 'justify'}}>
        <Col span={23} >
          <div >
            <Row>
              <Col span={6}> <Text>
                Client
          </Text></Col>
              <Col span={17}>{project.client}</Col>
            </Row>
            <Row>
              <Col span={6}> <Text>
                Description
          </Text></Col>
              <Col span={17}>
                <Text>
                 {project.description}
                </Text>
              </Col>
            </Row>
            <Row>
              <Col span={6}> <Text>
                Team size
          </Text></Col>
              <Col span={17}>{project.teamSize}</Col>
            </Row>
            <Row>
              <Col span={6}> <Text>
                Project role
          </Text></Col>
              <Col span={17}>
                <Row>
                  <Text >
                    {project.projectRole.name}
                  </Text>
&nbsp;
                <Text strong>
                    {project.projectRole.status === SettingItemStatus.NEW ? " (waiting for approval...)" : ""}
                  </Text>

                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={6}> <Text>
                Responsibilities
          </Text></Col>
              <Col span={17}>{project.responsibilities}</Col>
            </Row>

            {skills.map((skill, index) =>
              <Row key={skill.Category}>
                <Col span={6}> <Text>
                  {skill.Category}
                </Text></Col>
                <Col span={17}>{skill.Skills.map((it) =>
                  <Tag key={it} size="small" color={ bestSkill.includes(it) ? AntdColor[0] : AntdColor[55] } style={{ minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center", marginBottom: '5px' }}>{it}</Tag>
                )}</Col>
              </Row>
            )}
          </div>
        </Col>
      </Row>      
    </animated.div>
  );
};
export default DetailProjectList;
