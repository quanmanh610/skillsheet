import React from 'react';
import { Layout } from 'antd';

import CMCLogo from './CMCLogo';
import AppHeader from './AppHeader';
import AppContent from './AppContent';
import AppFooter from './AppFooter';

const TestComponent = () => {
  return (
    <Layout>
      <AppHeader />
      <AppContent>
        <CMCLogo />
      </AppContent>
      <AppFooter />
    </Layout>
  );
};

export default TestComponent;
