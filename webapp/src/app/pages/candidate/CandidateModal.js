import React, { useState, useEffect } from 'react';
import { Modal, DatePicker, Form, Input, Select, Upload, Button, Space, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getProjectRolesInStore } from '../../store/slice/settingSlice';
import { Messages } from '../../utils/AppMessage';
import CandidateConfirmPopup from './CandidateConfirmPopup';
import { SettingItemStatus } from '../../constants/SettingItemStatus';
import { getUserData } from '../../store/slice/authSlice';
import { RegularExpressions } from '../../utils/RegularExpressions';
import {getChannel} from "../../api/candidate";

const CandidateModal = ({ visible, onSave, onCancel, data, title, resendPopupVisible, tmpCandidate, setResendPopupVisible, pagiState, onSavePopup }) => {

  const [form] = Form.useForm();

  const user = useSelector(getUserData);

  const locationList = [{key : 1, value : "Hà Nội"}, {key: 2, value:"Đà Nẵng"}, {key : 3, value : "Hồ Chí Minh"}]

  const sexList = [
    {key : 1, value: "Male"},{key : 2, value : "Female"}
  ]

  const levelList = [{key : 1, value: "Junior"},{key : 2, value: "Midle"},{key : 3, value: "Senior"}]

  const expList = [
    {key : 1, value: "1 year"},{key : 2, value : "2 years"},{ key : 3, value : "3 years"},{key : 4, value : "4 years"},{key : 6, value : "6 years"},{key : 7, value : "7 years"},{key : 8, value : "8 years"},{key : 9, value : "9 years"},{key : 10, value : "10 years"},{key : 11, value : "10 years+"}
  ]

  const initCandidate = {
    candidateId: null,
    createddate: "",
    email: "",
    fullName: "",
    roleName: "",
    phone: "",
    language:"",
    sendDate: "",
    status: "new",
    updatedDate: "",
    createBy: user.userName,
    step: 0
  };

  const pR = useSelector(getProjectRolesInStore);
  const [channelList, setChannelList] = useState([])

  const [candidate, setCandidate] = useState(data || initCandidate);
  const [candidateBK, setCandidateBK] = useState(initCandidate);
  const [projectRoles, setProjectRoles] = useState(pR ? pR : []);

  useEffect(() => {
    async function _getChannel() {
      let res = await getChannel()
      let channelArray = []
      res.data.channellList.forEach(e => {
        let element = {
          key: e.id,
          value: e.name
        }
        channelArray.push(element)
      })

      setChannelList(channelArray)
    }
    _getChannel();
  }, [])

  useEffect(() => {
    if (data) {
      setCandidate(data) ;
      setCandidateBK(data);
    } else {
      setCandidate(initCandidate);
      setCandidateBK(initCandidate);
    }
  }, [data]);

  useEffect(() => {
    if (pR) {
      setProjectRoles(pR.filter((item) => item.status === SettingItemStatus.ACTIVE));
    }
  }, [pR]);

  const checkEqualChannel = () => {
    channelList.forEach(e => {
      if (e.key === data.channel){
        return e.value;
      }
      return ''
    })
  }

  const onOK = async () => {
    form
      .validateFields()
      .then(() => {
        if (data) {
          onSave(candidate, form, setCandidate, initCandidate);
          setCandidate(candidate);
          form.resetFields();
        } else {
          const status = onSave(candidate,form, setCandidate, initCandidate);
          Promise.resolve(status).then(function(value) {
            if(value === "" ) {
              setCandidate(initCandidate);
              form.resetFields();
            }
          });
        }
      })
      .catch((info) => {
        console.log(info);
      });
  };

  const onChangeBirthDay = (date,dateString) => {
    const newC = {
      ...candidate, birthDay: dateString
    };
    setCandidate(newC);
    console.log(newC)
  }

  const onChangeApply = (date, dateString) => {
    const newC = {
      ...candidate, applySince: dateString
    };
    setCandidate(newC);
    console.log(newC)
  }

  const handleSelectSex = (value) => {
    const newC = {
      ...candidate, sex : value
    };
    setCandidate(newC);
    form.setFieldsValue(newC);
  }

  const handleExpChange = (value) => {
    const newC = {
      ...candidate, experience: value
    };
    setCandidate(newC);
    form.setFieldsValue(newC);
  }

  const handleLocationChange = (value) => {
    const newC = {
      ...candidate, location: value
    };
    setCandidate(newC);
    form.setFieldsValue(newC);
  }

  const handleChannelChange = (value) => {
    const newC = {
      ...candidate, channel: value
    };
    console.log(newC)
    setCandidate(newC);
    form.setFieldsValue(newC);
  }

  const handleSelectLevel = (value) => {
    const newC = {
      ...candidate, level: value
    };
    setCandidate(newC);
    form.setFieldsValue(newC);
  }

  const handleCancel = () => {
    form.resetFields();
    if (data) {
      setCandidate(candidateBK);
    } else {
      setCandidate(initCandidate);
    }
    onCancel();
  };

  const changeInput = (e) => {
    const newC = {
      ...candidate, [e.target.name]: e.target.value
    };
    setCandidate(newC);
    form.setFieldsValue(newC);
  };

  // duong fix
  const propsConfigUpload = {
    name: 'file',
    maxCount : 1,
    action: process.env.REACT_APP_API_BASE_URL+"/upload?bucketName=skillset&fileType=CV",
    onChange(info) {
      if (info.file.status === 'done') {
        info.fileList.forEach(element => {
          const newCandy = {
            ...candidate, "linkCv": element.response.previewUrl
          };
          setCandidate(newCandy);
        });
        message.success(`Success!`, 3)
      } else if (info.file.status === 'error') {
        message.error(`Error!`, 3)
      }
    },
  }
  

  const handleRoleNameChange = (value) => {
    let chosenRoles = "";
    value?.map((role, index) => {
      if (role !== "" && index !== 0) {
        chosenRoles = chosenRoles + "," + role;
      } else {
        chosenRoles = chosenRoles + role;
      }
    })
    const newC = {
      candidateId: candidate.candidateId,
      createdDate: candidate.createdDate,
      email: candidate.email,
      fullName: candidate.fullName,
      roleName: chosenRoles,
      sendDate: candidate.sendDate,
      status: candidate.status,
      updatedDate: candidate.updatedDate,
      createBy: candidate.createBy,
    };
    setCandidate(newC);
    form.setFieldsValue(newC);
  };

  const checkContainingOnlySpace = (rule, value) => {
    if (value.trim() === '' && value != '') {
      return Promise.reject("Cannot contain only whitespace characters.")
    } else {
      return Promise.resolve();
    }
  }

  return (
    <div>
    <Modal
      title={title}
      width={1000}
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onOk={onOK}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        name="add_new_candidate"
        initialValues={{
          fullName: data ? data.fullName : "",
          email: data ? data.email : "",
          roleName: data ? data.roleName : "",
          phone : data ? data.phone : "",
          language : data ? data.language : "",
          address : data ? data.address : "",
          job : data ? data.job : "",
          sex : data ? data.sex : "",
          level : data ? data.level : "",
          experience : data ? data.experience : "",
          channel : data ? checkEqualChannel : "",
          introducer : data ? data.introducer : "",
          school :  data ? data.school : "",
          skill : data ? data.skill : "",
          location : data ? data.location : "",
          // applySince : data ? data.applySince : "09-01-2021",
          // birthDay : data ? data.birthDay : "09-01-2021"
        }}
      >
      <Row align="middle" gutter={[0, 32]}>
        <Col span={12}>
        <Form.Item
          name="fullName"
          label="Full name"
          rules={[
            {
              required: true,
              message: Messages.FULL_NAME_REQUIRE,
            },
            {
              validator: checkContainingOnlySpace
            },
          ]}
        >
          <div style={{ display: 'none' }}>
            {candidate.fullName}
          </div>
          <Input
            name="fullName"
            maxLength={254}
            value={candidate.fullName}
            onChange={changeInput}
            placeholder="Full name..."
          />
        </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col span={10}>
        <Form.Item
          name="roleName"
          label="Role"
          mode="multiple"
          rules={[
            {
              required: true,
              message: Messages.ROLE_NAME_REQUIRE,
            },
          ]}
        >
          <div style={{ display: 'none' }}>
            {candidate.roleName}
          </div>
          <Select            
            style={{ width: "100%" }}
            onChange={handleRoleNameChange}
            value={candidate.roleName ? candidate.roleName.split(',') : []}
            allowClear={true}
            mode="tags"
          >
            {projectRoles.map(pr => (
              <Select.Option key={pr.name}>{pr.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
      </Row>
      <Row align="middle" gutter={[0, 32]}>
        <Col span={12}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: Messages.EMAIL_REQUIRE,
            },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <div style={{ display: 'none' }}>
            {candidate.email}
          </div>
          <Input
            name="email"
            maxLength={45}
            value={candidate.email}
            onChange={changeInput}
            placeholder="Email ..."
          />
        </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col span={10}>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[ {
            required: true,
            message: Messages.PHONE_REQUIRE,
          },
            {
              validator: (_, value) => {
                if (value !== '' && !RegularExpressions.VN_PHONE_NUMBER.test(value) && value !== null) {
                  return Promise.reject('Phone number is not valid.')
                } else {
                  return Promise.resolve();
                }
              }
            },
          ]}
          >
          <div style={{ display: 'none' }}>
            {candidate.phone}
          </div>
          <Input
            name="phone"
            maxLength={25}
            value={candidate.phone}
            onChange={changeInput}
            placeholder="Phone ..."
          />
        </Form.Item>
        </Col>
      </Row>
      <Row align="middle" gutter={[0, 32]}>
      <Col span={12}>
        <Form.Item
          name="language"
          label="Language"
          mode="multiple"
        >
          <div style={{ display: 'none' }}>
            {candidate.language}
          </div>
          <Input
            name="language"
            maxLength={254}
            value={candidate.language}
            onChange={changeInput}
            placeholder="Language..."
          />
        </Form.Item>
        </Col>
        <Col span={2}> </Col>
        <Col span={10}>
        <Form.Item
          name="job"
          label="Job"
        >
          <Input
            name="job"
            maxLength={254}
            value={candidate.job}
            onChange={changeInput}
            placeholder="Job..."
          />
        </Form.Item>
        </Col>
      </Row>
      <Row align="middle" gutter={[0, 32]}>
      <Col span={6}>
        <Form.Item
          name="sex"
          label="Sex"
        >
          <Select
            name = "sex"         
            style={{ width: "100%" }}
            onChange={(e)=>handleSelectSex(e)}
            value={candidate.sex ? candidate.sex : ""}
            allowClear={true}
          >
            {sexList.map(pr => (
              <Select.Option key={pr.value}>{pr.value}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
        <Col span={1}></Col>
        <Col span={5}>
        <Form.Item
          name="level"
          label="Level"
        >
         <Select            
            style={{ width: "100%" }}
            onChange={handleSelectLevel}
            value={candidate.level ? candidate.level : ""}
            allowClear={true}
          >
            {levelList.map(pr => (
              <Select.Option key={pr.value}>{pr.value}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
        <Col span={2}> </Col>
        <Col span={4}>
        <Form.Item
          name="experience"
          label="Exp"
        >
          <Select            
            style={{ width: "100%" }}
           onChange={handleExpChange}
            value={candidate.experience ? candidate.experience : ""}
            allowClear={true}
          >
            {expList.map(pr => (
              <Select.Option key={pr.value}>{pr.value}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
        <Col span={1}> </Col>
        <Col span={5}>
          {channelList[0] != undefined &&

          <Form.Item
          name="channel"
          label="Channel"
        >
          <Select
              style={{ width: "100%" }}
              onChange={handleChannelChange}
              value={candidate.channel ? candidate.channel : ""}
              allowClear={true}
          >
            {channelList.map(channel => (
                <Select.Option key={channel.key}>{channel.value}</Select.Option>
            ))}
          </Select>
        </Form.Item>
            }

            </Col>
      </Row>  
      <Row align="middle" gutter={[0, 32]}>
        <Col span={12}>
        <Form.Item
          name="introducer"
          label="Introducer"
        >
         <Input
            name="introducer"
            maxLength={25}
            value={candidate.introducer}
            onChange={changeInput}
            placeholder="Introducer ..."
          />
        </Form.Item>
        </Col>
        <Col span={2}> </Col>
        <Col span={10}>
        <Form.Item
          name="school"
          label="School"
        >
         <Input
            name="school"
            maxLength={25}
            value={candidate.school}
            onChange={changeInput}
            placeholder="School ..."
          />
        </Form.Item>
        </Col>
      </Row>
      <Row align="middle" gutter={[0, 32]}>
        <Col span={12}>
        <Form.Item
          name="skill"
          label="Skill"
        >
          <Input
            name="skill"
            maxLength={100}
            value={candidate.skill}
            onChange={changeInput}
            placeholder="Skill ..."
          />
        </Form.Item>
        </Col>
        <Col span={2}> </Col>
        <Col span={10}>
        <Form.Item
          name="location"
          label="Location"
        >
          <Select             
            style={{ width: "100%" }}
            onChange={handleLocationChange}
            value={candidate.location ? candidate.location : ""}
            allowClear={true}
          >
            {locationList.map(pr => (
              <Select.Option key={pr.value}>{pr.value}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
      </Row>
      <Row align="middle" gutter={[0, 32]}>
        <Col span={6}>
        <Form.Item
          name="applySince"
          label="Apply"
        >
          <div><DatePicker onChange={(date, dateString) => onChangeApply(date,dateString)} format="DD-MM-YYYY" /></div>
        </Form.Item>
        </Col>
        <Col span={1}></Col>
        <Col span={5}>
        <Form.Item
          name="birthday"
          label="Birthday"
        >
          <div><DatePicker onChange={(date, dateString)=> onChangeBirthDay(date,dateString)} format="DD-MM-YYYY" /></div>
        </Form.Item>
        </Col>
        <Col span={2}> </Col>
        <Col span={10}>
        <Form.Item
          name="address"
          label="Address"
          mode="multiple"
        >
          <Input
            name="address"
            maxLength={255}
            value={candidate.address}
            onChange={changeInput}
            placeholder="Address ..."
          />
        </Form.Item>
        </Col>
      </Row>
      <Row align="middle" gutter={[0, 32]}>
        <Col span={12}>
        <Form.Item
          name="upload"
          label="Upload CV"
          >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Upload
            {...propsConfigUpload}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          </Space>
        </Form.Item>
      </Col> 
      <Col span={2}> </Col>
      {/* <Col span={10}>
        <Form.Item
          name="note"
          label="Note"
        >
          <Input
            name="note"
            maxLength={255}
            value={candidate.note}
            onChange={changeInput}
            placeholder="Note ..."
          />
        </Form.Item>
        </Col> */}
      </Row> 
      </Form>  
    </Modal>

    <CandidateConfirmPopup
        visible={resendPopupVisible}
        data={tmpCandidate}
        onCancel={()=>{setResendPopupVisible(false)}}
        pagiState={pagiState}
        onSavePopup={onSavePopup}
        form={form}
        initCandidate={initCandidate}
        setCandidate={setCandidate}
        title={title}
      ></CandidateConfirmPopup>

    </div>
  );
};

export default CandidateModal;
