import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

const ViewProfessional = ({ rootProfile }) => {

  return (
    <div className="border-bottom-solid" style={{ textAlign: "justify" }}>
      <Row justify="center" className={['margin-top-10', 'margin-bottom-10']}>
        <Col span={23}>
          <Text style={{ whiteSpace: "pre-wrap" }}>{rootProfile.professionalSummary}</Text>
        </Col>
      </Row>
    </div>
  );
};
export default ViewProfessional;
