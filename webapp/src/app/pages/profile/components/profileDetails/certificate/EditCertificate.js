import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, AutoComplete, Input, DatePicker, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { CloseOutlined, PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCertificateInStore } from '../../../../../store/slice/settingSlice';
import { Messages } from '../../../../../utils/AppMessage';
import { dateFormat } from '../../../../../constants/DateTimes';
import { deleteProfileCertificate } from '../../../../../api/profile';
import { fetchProfileById, getProfileIdFromStore } from '../../../../../store/slice/profileSlice';
import { openNotification } from '../../../../../components/OpenNotification';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { getUserData } from '../../../../../store/slice/authSlice';
import { useSpring, animated } from 'react-spring';
import moment from 'moment';

const EditCertificate = ({ profileCertificate, onAddCertificates, onCancel, onDeleteSuccess }) => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const isLoading = useSelector(isLoadingStatus);

  const user = useSelector(getUserData);

  const profileId = useSelector(getProfileIdFromStore);

  const certificatesInStore = useSelector(getCertificateInStore || []);

  const [disableAdd, setDisableAdd] = useState(false);

  const [useableCertificates, setUseableCertificates] = useState([]);

  const [certificatesBK, setCertificatesBK] = useState([]);

  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  useEffect(() => {

    form.setFieldsValue({
      certificates: profileCertificate.ProfileCertificates,
    });
    const usedCertificates = profileCertificate.ProfileCertificates.map((obj) => obj.certificate);

    const certificatesByCategory = certificatesInStore.filter((obj) => obj.category === profileCertificate.Category.name);

    const useableCertifices = certificatesByCategory.map((obj) => {
      if (obj.status === 0) {
        return { key: obj.name, value: obj.name }
      }
    }).filter((item) => (item !== undefined && !usedCertificates.includes(item.key)))

    setCertificatesBK(certificatesByCategory.map((obj) => {
      // if (obj.status === 0 || obj.createBy.includes(user.email) || ("" !== user.userName && obj.createBy.includes(user.userName))) {
      //   return { key: obj.name, value: obj.name }
      // }
      if (obj.status === 0) {
        return { key: obj.name, value: obj.name }
      }
    }));
    setUseableCertificates(useableCertifices);

  }, [profileCertificate, certificatesInStore]);

  const onFinish = () => {
    form.validateFields().then(
      (value) => {
        onAddCertificates({ certificates: value.certificates ? value.certificates : [] }, profileCertificate.Category);
      }
    ).catch((error) => console.log(error));
  };

  const handleChangeInput = (e) => {
  };

  const handleCertificateSelectChange = (certificate, e) => {
    const useCer = form.getFieldValue("certificates").filter((obj) => obj !== undefined).map((item) => item.certificate);
    if (useCer.length === 0) {
      setUseableCertificates(certificatesBK);
    } else {
      setUseableCertificates(certificatesBK.filter((obj) => obj != undefined && !useCer.includes(obj.key)));
    }
  };

  const handleDatePickerChange = (date, dateString) => {

  };

  const validateCertificate = (rule, value) => {
    const formValues = form.getFieldValue("certificates");
    const removeUndefined = formValues.filter(
      (cer) => cer !== undefined
    );
    const checkArr = removeUndefined.filter(
      (cer) => cer.certificate.toUpperCase() === value?.toUpperCase()
    );
    if (value !== undefined && value !== "" && value?.trim() === "") {
      return Promise.reject('Certificate cannot contain only white space characters.');
    } else if (value !== undefined && value.indexOf(',') > -1) {
      return Promise.reject(Messages.CERTIFICATE_EXISTING_COMMA);
    } else if (value !== undefined && value.trim() !== "" && checkArr && checkArr.length > 1) {
      return Promise.reject(Messages.existingMessage('Certificate'));
    } else if (value !== undefined && value.length > 100) {
      return Promise.reject(Messages.CERTIFICATE_NAME_VALIDATE_MAX_LENGTH);
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  };

  const validateAchievement = (rule, value) => {
    if (value !== undefined && value !== "" && value.trim() === "") {
      return Promise.reject('Achievement cannot contain only white space characters.');
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  }

  const onCancels = () => {
    onCancel(profileCertificate.Category.name);
  }

  const handleRemove = (e) => {
    // const useCer = form.getFieldValue("certificates").filter((obj) => obj !== undefined).map((item) => item.certificate);
    const useCer = form.getFieldValue("certificates").map((obj) => {
      if (obj !== undefined)
        return obj.certificate
      return obj
    });
    if (useCer.length === 0) {
      setDisableSaveBtn(true);      
    } else {
      setDisableSaveBtn(false);      
    }
    setUseableCertificates(certificatesBK.filter((obj) => (obj !== undefined && !useCer.includes(obj.key))));
  }

  const onDelete = async () => {
    const deleteId = form.getFieldValue("certificates").filter((obj) =>
      obj.profileCertificateId
    ).map((obj) => {
      if (obj)
        return obj.profileCertificateId
      return obj
    });

    const resp = await deleteProfileCertificate({ deleteIds: deleteId });
    if (resp.data === "DELETED") {
      onDeleteSuccess(profileCertificate.Category);
      dispatch(fetchProfileById({ profileId: profileId }));
      openNotification(Messages.SUCCESS, Messages.deleteSuccessMessage("Profile Certificate"), "");
    }
  }

  const onFieldsChange = (changedFields, allFields) => {
    if (form.getFieldValue("certificates").length > 0) {
      setDisableSaveBtn(false);
    }
    if (form.getFieldValue("certificates").length > 15) {
      setDisableAdd(true);
      openNotification(Messages.WARNING, "You added too many certificates!", "")
    } else {
      setDisableAdd(false);
    }
  }

  return (
    <animated.div style={props}>
      <Row justify="center" className="margin-top-10">
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className="border-bottom-solid">
                <Row justify="center">
                  <Col span={16}>
                    {/* <Row>
                      {profileCertificate.Category.name === "" ? "" : <Tag color="#87d068"
                        style={{ minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center" }}
                      > {profileCertificate.Category.name} </Tag>}
                    </Row> */}
                  </Col>
                  <Col span={4}>

                  </Col>
                  <Col span={4}>
                    <Button
                      type="link"
                      size="small"
                      className="fl-right"
                      onClick={(e) => {
                        document.getElementById('addCertificate').click();
                        e.stopPropagation();
                      }}
                      icon={<PlusOutlined />}
                      style={{ minWidth: CSSConstants.BUTTON_WIDTH }}
                    >
                      Add New Certificate
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row className="margin-top-10"></Row>
          <Form
            form={form}
            name="dynamic_certificates"
            layout="vertical"
            onFinish={onFinish}
            // initialValues={{
            //   certificates: profileCertificate,
            // }}
            onFieldsChange={onFieldsChange}
          >
            <div>
              <Form.List name="certificates">
                {(fields, { add, remove }) => {                  
                  return (
                    <div>
                      {fields.map((field, index) => (
                        <Col span={24} key={index} style={{ marginBottom: 8 }} >
                          <Row >
                            <Col span={12}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'profileCertificateId']}
                                label={index === 0 ? 'ProfileCertificateId' : ''}
                                fieldKey={[field.fieldKey, 'profileCertificateId']}
                                style={{ display: "none" }}
                              >
                                <Input size="small"
                                  placeholder="Select ..."
                                  name='profileCertificateId'
                                  defaultValue={profileCertificate.ProfileCertificates[field.fieldKey] ? profileCertificate.ProfileCertificates[field.fieldKey].profileCertificateId : ""}
                                >
                                </Input>
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, 'certificate']}
                                label={index === 0 ? 'Certificate' : ''}
                                fieldKey={[field.fieldKey, 'certificate']}
                                rules={[
                                  { required: true, message: Messages.requiredMessage("Certificate") },
                                  { validator: validateCertificate }]}
                              >
                                <AutoComplete
                                  defaultValue={profileCertificate.ProfileCertificates[field.fieldKey] ? profileCertificate.ProfileCertificates[field.fieldKey].certificate : ""}
                                  name="certificate"
                                  style={{ width: "100%" }}
                                  placeholder="Enter certificate's name here ..."
                                  size="small"
                                  maxLength={50}
                                  filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                  }
                                  onChange={handleCertificateSelectChange}
                                  options={useableCertificates}
                                >
                                </AutoComplete>
                              </Form.Item>
                            </Col>
                            <Col span={5} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'issuedDate']}
                                label={index === 0 ? 'Issued Date' : ''}
                                fieldKey={[field.fieldKey, 'issuedDate']}
                                rules={[
                                  { required: true, message: Messages.requiredMessage("Issued Date") },
                                  {
                                    validator: (_, value) => {
                                      if (moment(value).isAfter()) {
                                        return Promise.reject('Incorrect value.');
                                      } else {
                                        return Promise.resolve();
                                      }
                                    }
                                  }
                                ]}
                                className="margin-left-10">
                                <DatePicker onChange={handleDatePickerChange}
                                  size="small"
                                  value={"20-01-2020"}
                                  format={dateFormat}
                                  allowClear={false}
                                  style={{ width: "100%" }}
                                  picker="date" />
                              </Form.Item>
                            </Col>                            
                            <Col span={6} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'achievement']}
                                label={index === 0 ? 'Achievement' : ''}
                                fieldKey={[field.fieldKey, 'achievement']}
                                rules={[
                                  { 
                                    required: true, 
                                    message: Messages.requiredMessage("Achievement") 
                                  },
                                  {
                                    validator: validateAchievement
                                  }]}
                                className="margin-left-10"
                                >
                                <Input name="achievement" size="small"
                                  onChange={handleChangeInput}
                                  placeholder={"2000 character remaining..."}
                                  maxLength={2000}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={1}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'close']}
                                label={index === 0 ? ' ' : ''}
                                fieldKey={[field.fieldKey, 'close']}
                                className="margin-left-10">
                                <div style={{ position: "relative", float: "right" }}>
                                  <Button style={{
                                    color: "red",
                                  }}
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    type="link"
                                    onClick={() => {
                                      remove(field.name);
                                      handleRemove(field.name);
                                    }}
                                  >
                                  </Button></div>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      ))}

                      <Form.Item style={{ display: "none" }}>
                        <Button
                          id="addCertificate"
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ display: "none" }}
                          disabled={disableAdd}
                        >
                          <PlusOutlined /> Certificate
                      </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
            </div>
            <Form.Item>
              <div className="fl-left">
                <Popconfirm
                  title={Messages.DELETE_CONFIRM}
                  onConfirm={onDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger"
                    loading={isLoading}
                    size="small" icon={<DeleteOutlined />}
                    style={{ width: CSSConstants.BUTTON_WIDTH }}>
                    Delete
                </Button></Popconfirm>
              </div>
              <div className="fl-right">
                <Button onClick={onCancels}
                  size="small"
                  icon={<CloseOutlined />}
                  loading={isLoading}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="margin-left-10"
                  size="small"
                  icon={<SaveOutlined />}
                  disabled={disableSaveBtn}
                  loading={isLoading}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}
                >
                  Save
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </animated.div>
  );
};

export default EditCertificate;
