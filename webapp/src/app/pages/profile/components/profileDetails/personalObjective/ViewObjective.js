import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

const ViewObjective = ({ rootProfile }) => {  
  return (
    <div className="border-bottom-solid" style={{ display: rootProfile.objective ? "" : "none", textAlign: "justify" }}>
      <Row justify="center" className={['margin-top-10', 'margin-bottom-10']}>
        <Col span={23}>
          <Text style={{ whiteSpace: "pre-wrap" }}>{rootProfile.objective}</Text>
        </Col>
      </Row>
    </div>
  );
};
export default ViewObjective;
