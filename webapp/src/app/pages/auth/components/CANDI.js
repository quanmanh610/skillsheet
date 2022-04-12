import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Alert, Input } from 'antd';
import {
  isLoadingStatus
} from '../../../store/slice/animationSlice';
import { useLocation } from "react-router-dom";
import { setUserData, getAuthStatus, getCandiateStatus } from '../../../store/slice/authSlice';
import CMCLogo from '../../../components/CMCLogo';
import { HttpStatus } from '../../../constants/HttpStatus';
import { loginCandidateApi } from "../../../api/auth";
import './Login.css';

const CANDI = (props) => {
  const initErro = {
    display: "none",
    errorMessage: "",
  }
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoading = useSelector(isLoadingStatus);
  const isAuthenticated = useSelector(getAuthStatus);
  const isCandidate = useSelector(getCandiateStatus);
  const [accessCode, setAccessCode] = useState();
  if (isAuthenticated) {
    if (isCandidate) {
      props.history.push("/profile")
    } else {
      props.history.push("/home")
    }
  }

  const params = new URLSearchParams(location.search);
  const accessToken = params.get("at");
  // const candidateId = params.get("candidateId");
  // const fullName = params.get("fullName");
  // const acc = params.get("acc");

  const [error, setError] = useState(initErro);

  const onFinish = async () => {
    if (!accessToken) {
      setError({
        display: "",
        errorMessage: "Invalid link",
      })
      return;
    } else {
      setError(initErro);
    }   
    const body = {
      accessToken: accessToken,
      accessCode: accessCode,
    };    
    const resp = await loginCandidateApi(body);        
    if (resp && resp.status === HttpStatus.OK) {
      if (resp.data.errorMessage) {
        setError({
          display: "",
          errorMessage: resp.data.errorMessage,
        });
        return;
      }

      await dispatch(setUserData(resp.data));
      //await dispatch(fetchProfileByCandidateEmail({ candidateEmail: resp.data.user.email }));
      //props.history.push("/profile")
    }
  };

  return (
    <Row justify="center" align="middle" className="login-area">
      <Col>
        <div style={{ position: "relative", top: "-100px" }}>
          <Form name="login" onFinish={onFinish} >
            <CMCLogo />
            <br />
            <Form.Item>
              <div style={{
                display: "flex",
                flexDirection: "column",
                width: "300px"
              }}>
                <span
                  style={{
                    fontSize: "20px",
                    color: "#338bf8",
                    width: "300px",
                    textAlign: "center"
                  }}
                >WELCOME</span>
                <br></br>
                <Input placeholder="Access code"
                onChange={(e) => setAccessCode(e.target.value)}/>
              </div>
              <Alert style={{
                textAlign: "center",
                display: error.display
              }} message={error.errorMessage} type="error" />
            </Form.Item>
            <Form.Item>
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
    </Row>
  );
};
export default CANDI;
