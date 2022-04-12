import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;
const AppFooter = () => {  

  return (
    <Footer style={{ paddingTop: '10px', paddingBottom: '10px' }}>
      <div style={{ textAlign: 'center', paddingLeft: "20px", opacity: 0.5 }}>
        © Copyright 2020 CMC Global. All rights reserved.
      </div>
    </Footer>
  );
};

export default AppFooter;
