import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Form,
  Select,
  DatePicker, Popconfirm, AutoComplete
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fetchSchool, getSchoolInStore } from '../../../../../store/slice/settingSlice';
import { monthFormat } from '../../../../../constants/DateTimes';
import { Messages } from '../../../../../utils/AppMessage';
import { DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { useSpring, animated } from 'react-spring';
import { getUserData } from '../../../../../store/slice/authSlice';
import { Config } from '../../../../../constants/AppConfiguration';
import { SettingItemStatus } from '../../../../../constants/SettingItemStatus';


const { Text } = Typography;

const { TextArea } = Input;

const EditEducation = ({ educationFromParent, onSaveInParent, onCancelInParent, onDeleteInParent }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const initSchool = {
    schoolId: ""
  }

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const isLoading = useSelector(isLoadingStatus);

  const schoolInStore = useSelector(getSchoolInStore);

  const [schoolList, setSchoolList] = useState([]);

  const [education, setEducation] = useState(educationFromParent);

  const [school, setSchool] = useState(educationFromParent.school || initSchool);

  const [inputSchoolName, setInputSchoolName] = useState('');

  const [isChangeInSchool, setChangeInSchool] = useState(false);

  const userData = useSelector(getUserData);

  useEffect(() => {
    if (schoolInStore) {
      const scho = schoolInStore.filter((s) => s.status === 0).map((obj) => {
        if (obj)
          return { key: obj.schoolId, value: obj.name }
        return obj
      })
      setSchoolList(scho ? scho : []);
    }
  }, [schoolInStore]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchSchool());
    }
    fetchData();
  }, []);

  const onFinish = async () => {
    let schoolName = '';
    if (education.school.name != "") {
      if (isChangeInSchool == true) {
        schoolName = inputSchoolName.trim();
      } else {
        schoolName = education.school.name.trim();
      }
    } else {
      schoolName = inputSchoolName.trim();
    }
    form.setFieldsValue({
      school: schoolName
    });

    const filteredSchool = await schoolInStore.filter(
      (e) =>
        schoolName.toUpperCase().trim() === e.name.toUpperCase().trim()
    );

    if (filteredSchool.length == 0) {
      const tmp = {
        ...education, school: {
          category: 'Unknown',
          name: schoolName,
          status: SettingItemStatus.NEW,
          createBy: userData.isCandidate ? userData.email : userData.userName,
          createdDate: new Date()
        }, achievement: education.achievement.trim()
      };
      await onSaveInParent(tmp);
    } else {
      const tmpSchool = schoolInStore.filter((s) => s.name === schoolName)[0];
      if (tmpSchool.status == 1) {
        const tmpInactiveSchool = {
          schoolId: tmpSchool.schoolId,
          category: tmpSchool.category,
          name: tmpSchool.name,
          status: SettingItemStatus.NEW,
          createBy: tmpSchool.createBy,
          createdDate: tmpSchool.createdDate
        }
        const tmpEducation = {
          ...education, school: tmpInactiveSchool, achievement: education.achievement.trim()
        };
        onSaveInParent(tmpEducation);
      } else {
        const tmpEducation = {
          ...education, school: tmpSchool, achievement: education.achievement.trim()
        };
        onSaveInParent(tmpEducation);
      }

    }
  };

  const onFinishFailed = () => {
  };
  const checkDate = (rule, value) => {
    if (moment(value).isBefore(moment(education.fromMonth))) {
      return Promise.reject("Incorrect time range.")
    }
    else {
      return Promise.resolve();
    }
  }

  const onDelete = () => {
    form.resetFields();
    onDeleteInParent(education);
  };

  const onCancel = () => {
    form.resetFields();
    onCancelInParent(education.educationId);
  };

  const handleChangeInput = (e) => {
    if (e.target.value.trim().length === 0) {
      form.setFieldsValue({
        [e.target.name]: e.target.value.trim()
      });
    }
    else {
      const newEducaition = {
        ...education, [e.target.name]: e.target.value.trim()
      }
      setEducation(newEducaition);
      form.setFieldsValue({
        [e.target.name]: e.target.value
      });
    }

  };

  const handleAchievementChange = (e) => {
    const newEducaition = {
      ...education, [e.target.name]: e.target.value
    }
    setEducation(newEducaition);
    form.setFieldsValue({
      [e.target.name]: e.target.value
    });
  };

  const handleDatePickerChangeFrom = (date, dateString) => {
    const newEducaition = {
      ...education, fromMonth: date.format("MMM - YYYY")
    };
    setEducation(newEducaition);
    form.setFieldsValue({
      fromMonth: date
    });
  };
  const handleDatePickerChangeTo = (date, dateString) => {
    const newEducaition = {
      ...education, toMonth: date.format("MMM - YYYY")
    };
    setEducation(newEducaition);
    form.setFieldsValue({
      toMonth: date
    });
  };

  const handleSchoolChange = (e) => {
    const newSchool = {
      ...school, name: e
    };
    setSchool(newSchool);
    setInputSchoolName(e);
    setChangeInSchool(true);
    form.setFieldsValue({
      school: e
    });
  };

  const validateSchoolName = (rule, value) => {
    if (value.indexOf(',') > -1) {
      return Promise.reject(Messages.SCHOOL_EXISTING_COMMA);
    } else if (value.length > 200) {
      return Promise.reject(Messages.SCHOOL_VALIDATE_MAX_LENGTH);
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  }

  return (
    <animated.div style={props} className="border-bottom-solid">
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Form
            form={form}
            name="education"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="small"
            initialValues={{
              subject: education.subject,
              school: education.school ? education.school.name : '',
              fromMonth: moment(education.fromMonth),
              toMonth: moment(education.toMonth),
              grade: education.grade,
              achievement: education.achievement,
              qualification: education.qualification,
            }}
          >
            <Row>
              <Col span={11} className="margin-right-10">
                <Form.Item
                  name="subject"
                  label="Major"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Major"),
                    },
                  ]}
                >
                  <Input name="subject" size="small"
                    onChange={handleChangeInput}
                    value={education.subject}
                    maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={11} className="margin-right-10">
                <Form.Item
                  size="small"
                  name="school"
                  label="School"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("School"),
                    },
                    {
                      validator: validateSchoolName
                    }
                  ]}
                >
                  <Row>
                    <AutoComplete
                      placeholder=""
                      value={school.name}
                      onChange={(e) => setInputSchoolName(e)}
                      onChange={(e) => handleSchoolChange(e)}
                      filterOption={(input, option) =>
                        option.value.toUpperCase().indexOf(input.toString().toUpperCase()) !== -1}
                      options={schoolList}
                      maxLength={Config.INPUT_MAX_LENGTH}
                    />
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11} className="margin-right-10">
                <Form.Item
                  name="fromMonth"
                  label="From month"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("From Month"),
                    },
                  ]}
                >
                  <DatePicker onChange={handleDatePickerChangeFrom}
                    size="small"
                    value={moment(education.fromMonth)}
                    format={monthFormat}
                    allowClear={false}
                    picker="month" />
                </Form.Item>
              </Col>
              <Col span={11} className="margin-right-10">
                <Form.Item
                  size="small"
                  name="toMonth"
                  label="To month"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("To Month"),
                    },
                    {
                      validator : checkDate
                    }
                  ]}
                >
                  <DatePicker onChange={handleDatePickerChangeTo}
                    size="small"
                    value={moment(education.toMonth)}
                    format={monthFormat}
                    allowClear={false}
                    // defaultValue={today}
                    //className="ip-w-200"
                    picker="month" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11} className="margin-right-10">
                <Form.Item
                  name="grade"
                  label="Grade"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Grade"),
                    },
                  ]}
                >
                  <Input name="grade" size="small"
                    onChange={handleChangeInput}
                    value={education.grade}
                    maxLength={200}
                  />
                </Form.Item>
              </Col>
              <Col span={11} className="margin-right-10">
                <Form.Item
                  size="small"
                  name="qualification"
                  label="Qualification"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Qualification"),
                    },
                  ]}
                >
                  <Input name="qualification" size="small"
                    onChange={handleChangeInput}
                    value={education.qualification}
                    maxLength={200}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24} className="margin-right-10">
                <Form.Item label="Achievements">
                  <TextArea name="achievement" rows={5} onChange={handleAchievementChange}
                    value={education.achievement}
                    maxLength={2000}
                  />
                  <Text type="secondary">{education.achievement ? 2000 - education.achievement.length : 2000} characters remaining</Text>
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
                    style={{ width: CSSConstants.BUTTON_WIDTH, display: education.educationId ? "" : "none" }}>
                    Delete
                </Button>
                </Popconfirm>
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
                <Button htmlType="button" onClick={onCancel}
                  size="small"
                  icon={<CloseOutlined />}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}
                  loading={isLoading}
                >

                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="margin-left-10"
                  size="small"
                  icon={<SaveOutlined />}
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

export default EditEducation;
