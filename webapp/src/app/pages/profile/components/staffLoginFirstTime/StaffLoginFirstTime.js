import React, { useState } from 'react';
import { Row, Col, Button, Input, Typography, Alert } from 'antd';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { useDispatch, useSelector } from 'react-redux';
import { isLoadingStatus } from '../../../../store/slice/animationSlice';
import { getUserData, firstStaffProfileCreated as firstStaffProfileCreated } from '../../../../store/slice/authSlice';
import { createFirstStaffProfile as createFirstStaffProfile, copyCandidateProfile as copyCandidateProfile } from '../../../../api/profile';
import { HttpStatus } from '../../../../constants/HttpStatus';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';
import { updateStoreProfile } from '../../../../store/slice/profileSlice';
import { increaseLoginCount } from '../../../../api/auth';
import './StaffLoginFirstTime.css';
import logo from './../../../../../assets/imgs/cmc-global-logo-blue.png';

const { Text } = Typography;

const StaffLoginFirstTime = (props) => {

  const initErro = {
    display: "none",
    errorMessage: "",
  }

  const dispatch = useDispatch()

  const isLoading = useSelector(isLoadingStatus);

  const user = useSelector(getUserData);

  const [candidateEmail, setCandidateEmail] = useState();

  const [error, setError] = useState(initErro);

  const handleChangeCandidateEmail = (e) => {
    setCandidateEmail(e.target.value);
  }


  const handleCreateNew = async () => {

    const resp = await createFirstStaffProfile(user);
    if (resp && resp.status === HttpStatus.OK) {
      const response = await increaseLoginCount();

      if (response) {
        dispatch(firstStaffProfileCreated(response.data));
      }
      openNotification(Messages.SUCCESS, "Created staff profile", "");
      props.history.push("/profile");
      window.location.reload();
    }

  }

  const handleCopyCandidateProfile = async () => {
    setError(initErro);

    if (!candidateEmail) {
      setError({
        display: "",
        errorMessage: "Email is required!",
      });
      return;
    }
    else {
      const resp = await copyCandidateProfile({
        candidateEmail: candidateEmail,
        userName: user.userName,
        staffEmail: user.email
      });
      if (resp && resp.status === HttpStatus.OK) {
        const response = await increaseLoginCount();

        if (resp.data.errorMessage) {
          setError({
            display: "",
            errorMessage: resp.data.errorMessage,
          });
          return;
        }

        if (response) {
          dispatch(firstStaffProfileCreated(response.data));
        }

        openNotification(Messages.SUCCESS, "Imported candidate profile", "");
        dispatch(updateStoreProfile(resp.data));
        props.history.push("/profile");
      }
    }

  }
  return (
    <div>
      <Row>
        <Col span={8}></Col>
        <Col span={8}>
          <div id='staff-login-form'>
            <Row justify="center">
              <img className="logo" src={logo} alt="logo" style={{ width: "120px", marginTop: '50px', marginBottom: '50px' }} />
            </Row>

            <Row justify="center">
              <Text id="info">Enter your Candidate email to copy the profile</Text>
              <Alert size="small" style={{ textAlign: "center" }}
                message={error.errorMessage} type="error" style={{ display: error.display }} />
              <br></br>
            </Row>
            <Row justify="center" className="margin-bottom-20">
              <Input
                id="email"                
                name="email"
                placeholder="Email..."
                onChange={handleChangeCandidateEmail}
                maxLength={200}
              />
            </Row>
            <Row justify="center" className="margin-bottom-20">
              <Button
                type="primary"
                style={{ width: CSSConstants.BUTTON_WIDTH * 2 }}
                loading={isLoading}
                onClick={handleCopyCandidateProfile}
              >
                Confirm
                </Button>
            </Row>
            <Row justify="center" style={{marginTop: '150px'}}>
              <Col span={24}>
                <Row justify="center">
                  <Col span={11} id="hr-left"><hr/></Col>
                  <Col span={1}>or</Col>
                  <Col span={11} id="hr-right"><hr/></Col>                  
                </Row>
                <Row justify="center">
                  <Button
                    type="link"
                    size="small"
                    style={{ width: CSSConstants.BUTTON_WIDTH * 3 }}
                    loading={isLoading}
                    onClick={handleCreateNew}
                  >
                    Create new profile
                </Button>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={8}></Col>
      </Row>
    </div>

    // <div style={{ display: "flex", justifyContent: "center" }}>
    //   <Col span={24} >
    //     <Row style={{ height: "150px" }}></Row>
    //     <Row justify="center" >
    //       <Col span={12} >
    //         <Row justify="center" className="margin-bottom-20">
    //           <Avatar shape="square" size={200} icon={<UserOutlined />} />
    //         </Row>
    //         <Row justify="center" className="margin-bottom-20">
    //           <Text>If you want to create new profile, click here </Text>
    //         </Row>
    //         <Row justify="center" className="margin-bottom-20">
    //           <Button
    //             type="primary"
    //             size="small" icon={<ToolOutlined />}
    //             style={{ width: CSSConstants.BUTTON_WIDTH * 3 }}
    //             loading={isLoading}
    //             onClick={handleCreateNew}
    //           >
    //             Create new profile
    //             </Button></Row>
    //       </Col>

    //       <Col span={12}>
    //         <Row justify="center" className="margin-bottom-20" style={{ width: "50%" }}>
    //           <Text>If you have a candidate account and want to copy all imformation of candidate's profile.
    //         Enter email and click "Confirm" </Text>
    //         </Row>
    //         <Row justify="center" className="margin-bottom-20" style={{ width: "50%" }}>
    //           <Alert size="small" style={{
    //             textAlign: "center"
    //           }} message={error.errorMessage} type="error" style={{ display: error.display }} />
    //           <br></br>
    //         </Row>
    //         <Row justify="center" className="margin-bottom-20" style={{ width: "50%" }}>
    //           <Input name="email" size="small"
    //             placeholder="Enter email here ..."
    //             onChange={handleChangeCandidateEmail}
    //             maxLength={200}
    //           />
    //         </Row>
    //         <Row justify="center" className="margin-bottom-20" style={{ width: "50%" }}>
    //           <Button
    //             type="primary"
    //             size="small" icon={<SafetyCertificateOutlined />}
    //             style={{ width: CSSConstants.BUTTON_WIDTH * 3 }}
    //             loading={isLoading}
    //             onClick={handleCopyCandidateProfile}
    //           >
    //             Confirm
    //             </Button>
    //         </Row>
    //       </Col>

    //     </Row>

    //   </Col>
    // </div>
  );
};

export default StaffLoginFirstTime;
