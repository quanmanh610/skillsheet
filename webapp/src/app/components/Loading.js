import React from 'react';
import { Spin } from 'antd';
const Loading = () => {
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100vh',
        display: 'flex',
        justifyContent: 'center',
        height: '10em',
        alignItems: 'center',
      }}
    >
      <Spin tip="Loading..."></Spin>
    </div>
  );
};

export default Loading;
