import React from 'react';
import { Layout } from 'antd';
import './Components.css';

const { Content } = Layout;

const AppContent = (props) => {
  return <Content className="app-content">{props.children}</Content>;
};

export default AppContent;
