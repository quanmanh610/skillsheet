import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

const ViewPersonalInterests = ({ rootProfile }) => {

  return (
    <div className="border-bottom-solid" style={{ display: rootProfile.persionalInteresting ? "" : "none" }}>
      <Row justify="center" className={['margin-top-10', 'margin-bottom-10']}>
        <Col span={23}>
        {
          rootProfile.persionalInteresting
          ?  rootProfile.persionalInteresting
              .split('\n')
              .map((line, index) => <div key={index}><Text>{line.trim()}</Text><br/></div>)
          : null      
          }
          {/* <Text style={{ whiteSpace: "pre" }}>{rootProfile.persionalInteresting}</Text> */}
        </Col>
      </Row>
    </div>
  );
}
export default ViewPersonalInterests;
