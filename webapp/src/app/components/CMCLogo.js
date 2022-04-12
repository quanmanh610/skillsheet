import React from 'react';
import { Row, Col } from 'antd';

const CMCLogo = () => {
  return (
    <div>
      <Row justify="center">
        <Col>
          <img style={{ height: 90 }} src="imgs/cmcglobal.png" alt="logo"/>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <h4>Skills Management System</h4>
        </Col>
      </Row>
    </div>
  );
};

export default CMCLogo;
