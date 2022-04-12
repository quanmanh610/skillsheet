import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Input, Button, Alert } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import CMCLogo from '../../../components/CMCLogo';
import { setUserData, getAuthStatus, getCandiateStatus, fetchDuAndGroupFromDashboard, getUserData } from '../../../store/slice/authSlice';
import {
  isLoadingStatus
} from '../../../store/slice/animationSlice';
import { increaseLoginCount, login } from "../../../api/auth";
import './Login.css';
import { HttpStatus } from '../../../constants/HttpStatus';
import { fetchProfileByStaffEmail } from '../../../store/slice/profileSlice';
import { UrlConstants } from '../../../constants/Constants';
import { Config } from '../../../constants/AppConfiguration';

const LDAP = (props) => {
  const initErro = {
    display: "none",
    errorMessage: "",
  }  

  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingStatus);

  const isAuthenticated = useSelector(getAuthStatus);
  const isCandidate = useSelector(getCandiateStatus);
  const [error, setError] = useState(initErro);

  if (isAuthenticated) {
    if (isCandidate) {    
      return <Row justify="space-around" align="middle" className="login-area"><h2>Something went wrong :(</h2></Row>;  
      //props.history.push(UrlConstants.PROFILE_PATH)
    } else {
      props.history.push(UrlConstants.HOME_PATH)
    }
  }  

  const onFinish = async (values) => {

    const form = new FormData();
    const body = {
      username: values.username,
      password: values.password,
    };
    form.append('loginInfo', JSON.stringify(body));
    const resp = await login(body);    
    if (resp) {


      if (resp.status === HttpStatus.OK) {
        if (!resp.data.errorMessage) {          
          await dispatch(setUserData(resp.data));
          //await dispatch(fetchDuAndGroupFromDashboard(resp.data.user.userName));
          await dispatch(fetchProfileByStaffEmail({ staffEmail: resp.data.user.email }));

          if (resp.data.loginCount > 0) {
            await increaseLoginCount();
          }
          props.history.push(UrlConstants.HOME_PATH);
        } else {
          setError({
            display: "",
            errorMessage: resp.data.errorMessage,
          });
        }
      }
    } else {
      setError({ display: "", errorMessage: "Server does not respond" });
    }

  };
  return (

    <Row justify="space-around" align="middle" className="login-area"
    >
      <Col>
        <div style={{ position: "relative", top: "-100px", width: "330px" }}>
          <Form name="login" onFinish={onFinish} >
            <CMCLogo />
            <br />
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please enter your username',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                maxLength={Config.LOGIN_INPUT_MAX_LENGTH}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                maxLength={Config.LOGIN_INPUT_MAX_LENGTH}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Alert style={{
                textAlign: "center",
                display: error.display
              }} message={error.errorMessage} type="error" />
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                loading={isLoading}
              >
                Login
                </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row >
  );
};
export default LDAP;
