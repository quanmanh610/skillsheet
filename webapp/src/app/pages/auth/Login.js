import React from 'react';
import { Layout } from 'antd';
import AppContent from '../../components/AppContent';
import LDAPForm from './components/LDAP';
import './components/Login.css';

const Login = () => {
  return (
    <Layout className="login-layout">
      <AppContent>
        <LDAPForm />
      </AppContent>
    </Layout>
  );
};
export default Login;
