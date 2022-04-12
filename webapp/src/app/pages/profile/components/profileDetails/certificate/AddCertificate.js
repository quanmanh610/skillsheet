import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Input, DatePicker, Tag, AutoComplete } from 'antd';
import { useSelector } from 'react-redux';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { CloseOutlined, PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { Messages } from '../../../../../utils/AppMessage';
import { dateFormat } from '../../../../../constants/DateTimes';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { useSpring, animated } from 'react-spring';
import { openNotification } from "../../../../../../app/components/OpenNotification";

const AddCertificate = ({ profileCertificate, onAddCertificates, onCancel }) => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const [form] = Form.useForm();

  const isLoading = useSelector(isLoadingStatus);

  const [certificateItem, setCertificateItem] = useState(profileCertificate || {});

  const [disableAdd, setDisableAdd] = useState(false);

  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  useEffect(() => {
    if (profileCertificate.Category.isNew) {
      form.setFieldsValue({
        certificates: [{}]
      });
    }
  }, [profileCertificate]);

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
    const removeUndefined = form.getFieldValue("certificates").filter((cer) => cer);
    const usedCertificate = removeUndefined.map((obj) => {
      if (obj.certificate !== "")
        return obj.certificate
      return obj
    });
    const newFilter = profileCertificate.Certificates.filter((item) => !usedCertificate.includes(item.key));
    setCertificateItem({ ...certificateItem, Certificates: newFilter });
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

  const handleRemove = (e) => {
    const useCer = form.getFieldValue("certificates").map((obj) => {
      if (obj !== undefined && obj.certificate !== "")
        return obj.certificate
      return obj
    });
    if (useCer.length === 0) {
      setDisableSaveBtn(true);
    } else {
      setDisableSaveBtn(false);
    }
    const newFilter = profileCertificate.Certificates.filter((item) => !useCer.includes(item.key));
    setCertificateItem({ ...certificateItem, Certificates: newFilter });
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
              <div >
                <Row justify="center">
                  <Col span={16}>
                    <Row>
                      <Tag color="#87d068"
                        style={{ textAlign: "center" }}
                      > {certificateItem.Category.name} </Tag>
                    </Row>
                  </Col>
                  <Col span={4}>

                  </Col>
                  <Col span={4}>
                    <Button
                      type="primary"
                      size="small"
                      className="fl-right"
                      onClick={(e) => {
                        document.getElementById('addExistCertificateAddCompo').click();
                        e.stopPropagation();
                      }}
                      icon={<PlusOutlined />}
                      style={{ minWidth: CSSConstants.BUTTON_WIDTH }}
                    >
                      Add
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
            initialValues={{
              certificates: certificateItem.Category.isNew ? [] : [{ certificate: "", issuedDate: "", achievement: "" }],
            }}
            onFieldsChange={onFieldsChange}
          >
            <div>
              <Form.List name="certificates">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field, index) => (
                        <Col span={22} key={field.key} style={{ marginBottom: 8 }} >
                          <Row className="margin-top-10">
                            <Col span={12}>
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
                                  name="certificate"
                                  style={{ width: "100%" }}
                                  placeholder="Enter certificate's name here ..."
                                  size="small"
                                  filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                  }
                                  maxLength={100}
                                  onChange={handleCertificateSelectChange}
                                  options={certificateItem.Certificates}
                                >
                                </AutoComplete>
                              </Form.Item>
                            </Col>
                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'issuedDate']}
                                label={index === 0 ? 'Issued Date' : ''}
                                fieldKey={[field.fieldKey, 'issuedDate']}
                                rules={[{ required: true, message: Messages.requiredMessage("Issued Date") }]}
                                className="margin-left-10"
                              >
                                <DatePicker onChange={handleDatePickerChange}
                                  size="small"
                                  value={"20-01-2020"}
                                  format={dateFormat}
                                  allowClear={false}
                                  style={{ width: "100%" }}
                                  picker="date" />
                              </Form.Item>
                            </Col>
                            <Col span={4} >
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
                                  value={""}
                                  placeholder={"2000 character remaining..."}
                                  maxLength={2000}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={1} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'close']}
                                label={index === 0 ? ' ' : ''}
                                fieldKey={[field.fieldKey, 'close']}
                                className="margin-left-10"
                              >
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
                          id="addExistCertificateAddCompo"
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ display: "none" }}
                          disabled={disableAdd}
                        >
                          <PlusOutlined /> Certifice
                      </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
            </div>

            <Form.Item>
              <div className="fl-right">
                <Button
                  htmlType="button"
                  onClick={onCancel}
                  size="small"
                  icon={<CloseOutlined />}
                  loading={isLoading}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}
                >
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

export default AddCertificate;
