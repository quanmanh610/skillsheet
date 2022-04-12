import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Form,
  DatePicker, Popconfirm,
  Checkbox
} from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { monthFormat } from '../../../../../constants/DateTimes';
import { Messages } from '../../../../../utils/AppMessage';
import { DeleteOutlined, SaveOutlined, CloseOutlined, } from '@ant-design/icons';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { useSpring, animated } from 'react-spring';
import './workExperience.css';

const { Text } = Typography;

const { TextArea } = Input;

const EditWorkExperience = ({ workExperienceFromParent, onSaveInParent, onCancelInParent, onDeleteInParent, onAddNewInParent }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const isLoading = useSelector(isLoadingStatus);

  const [form] = Form.useForm();

  const [workExperience, setWorkExperience] = useState(workExperienceFromParent);

  const [isDisableToMonth, setIsDisableToMonth] = useState(workExperience.now ? workExperience.now : false);

  const onFinish = () => {
    onSaveInParent({ ...workExperience, description: workExperience.description.trim() });
  };

  const onFinishFailed = () => {
  };

  const onDelete = () => {
    form.resetFields();
    onDeleteInParent(workExperience);
  };

  const onCancel = () => {
    form.resetFields();
    onCancelInParent(workExperience.workExperienceId);
  };

  const handleChangeInput = (e) => {
    const newEducaition = {
      ...workExperience, [e.target.name]: e.target.value.trim()
    }
    setWorkExperience(newEducaition);
    form.setFieldsValue({
      [e.target.name]: e.target.value
    });
  };

  const handleDescriptionChange = (e) => {
    const newEducaition = {
      ...workExperience, [e.target.name]: e.target.value
    }
    setWorkExperience(newEducaition);
    form.setFieldsValue({
      [e.target.name]: e.target.value
    });
  };

  const handleDatePickerChangeFrom = (date, dateString) => {
    const newEducaition = {
      ...workExperience, fromMonth: moment(date).format(monthFormat)
    };
    setWorkExperience(newEducaition);
    form.setFieldsValue({
      fromMonth: date
    });
  };
  const handleDatePickerChangeTo = (date, dateString) => {
    const newEducaition = {
      ...workExperience, toMonth: moment(date).format(monthFormat)
    };
    setWorkExperience(newEducaition);
    form.setFieldsValue({
      toMonth: date
    });
  };

  const changeNowCheckBox = (e) => {
    if (e.target.checked == true) {
      workExperience.now = true;
      setIsDisableToMonth(true);
    } else {
      workExperience.now = false;
      setIsDisableToMonth(false)
    }
  }

  return (
    <animated.div style={props} className="border-bottom-solid">
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Form
            form={form}
            name="workExperience"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="small"
            initialValues={{
              company: workExperience.company,
              position: workExperience.position,
              fromMonth: moment(workExperience.fromMonth),
              toMonth: moment(workExperience.toMonth),
              description: workExperience.description,
              now: workExperience.now
            }}
          >
            <Row>
              <Col span={23} className="margin-right-10">
                <Form.Item
                  name="company"
                  label="Company"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Company"),
                    },
                    {
                      validator: (_, value) => {
                        if (value !== "" && value.trim() === "") {
                          return Promise.reject('Company cannot contain only white space characters.');
                        } else {
                          return Promise.resolve();
                        }
                      }
                    }
                  ]}
                >
                  <Input name="company" size="small"
                    onChange={handleChangeInput}
                    value={workExperience.company}
                    maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={23} className="margin-right-10">
                <Form.Item
                  name="position"
                  label="Position"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Position"),
                    },
                    {
                      validator: (_, value) => {
                        if (value !== "" && value.trim() === "") {
                          return Promise.reject('Position cannot contain only white space characters.');
                        } else {
                          return Promise.resolve();
                        }
                      }
                    }
                  ]}
                >
                  <Input name="position" size="small"
                    onChange={handleChangeInput}
                    value={workExperience.position}
                    maxLength={100}
                  />
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col span={8} className="margin-right-10">
                <Form.Item
                  name="fromMonth"
                  label="From month"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("From Month"),
                    },
                    {
                      validator: (_, value) => {
                        if (workExperience.now) {
                          if (moment(value).isAfter()) {
                            return Promise.reject('Incorrect time range.');
                          } else {
                            return Promise.resolve();
                          }
                        } else if (moment(value).isAfter(workExperience.toMonth) || moment(value).isAfter()) {
                          return Promise.reject('Incorrect time range.');
                        } else {
                          return Promise.resolve();
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker onChange={handleDatePickerChangeFrom}
                    size="small"
                    value={workExperience.fromMonth ? moment(workExperience.fromMonth) : moment("")}
                    format={monthFormat}
                    allowClear={false}
                    // defaultValue={today}
                    picker="month" />
                </Form.Item>
              </Col>
              <Col span={8} className="margin-right-10">
                <Form.Item
                  size="small"
                  name="toMonth"
                  label="To month"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!workExperience.now) {                        
                        if (moment(workExperience.fromMonth).isAfter(value) || moment(value).isAfter()) {
                        return Promise.reject('Incorrect time range.');
                        } else {
                          return Promise.resolve();
                        }
                      }
                      else {
                        return Promise.resolve();
                      }
                    }
                  }
                ]}
                >
                  <DatePicker onChange={handleDatePickerChangeTo}
                    size="small"
                    value={workExperience.toMonth ? moment(workExperience.toMonth) : moment("")}
                    format={monthFormat}
                    allowClear={false}
                    disabled={isDisableToMonth}
                    // defaultValue={today}
                    //className="ip-w-200"
                    picker="month" />
                </Form.Item>
              </Col>
              <Col span={4} className="now-checkbox">
                <Form.Item
                  size="small"
                  name="now"
                  label=""
                ><Checkbox
                  checked={workExperience.now ? workExperience.now : 0}
                  onChange={changeNowCheckBox}
                >Now</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24} className="margin-right-10">
                <Form.Item label="Description">
                  <TextArea name="description" rows={5} onChange={handleDescriptionChange}
                    value={workExperience.description}
                    maxLength={2000}
                  />
                  <Text type="secondary">{workExperience.description ? 2000 - workExperience.description.length : 2000} characters remaining</Text>
                </Form.Item>
              </Col>
            </Row>

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
                    style={{ width: CSSConstants.BUTTON_WIDTH, display: workExperience.workExperienceId ? "" : "none" }}>
                    Delete
                </Button></Popconfirm>
                {/* <Button
                  type="primary"
                  className="margin-left-10"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={onAddNew}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>
                  New
                </Button> */}
              </div>
              <div className="fl-right">
                <Button
                  onClick={onCancel}
                  size="small" icon={<CloseOutlined />}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}
                  loading={isLoading}>
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="margin-left-10"
                  size="small" icon={<SaveOutlined />}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}
                  loading={isLoading}>
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

export default EditWorkExperience;
