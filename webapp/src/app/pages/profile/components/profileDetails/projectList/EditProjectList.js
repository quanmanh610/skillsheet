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
import { fetchSchool, fetchSkills, getProjectRolesInStore } from '../../../../../store/slice/settingSlice';
import { monthFormat } from '../../../../../constants/DateTimes';
import { Messages } from '../../../../../utils/AppMessage';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import ProjectListSkillsInfo from './Skill/ProjectListSkillsInfo';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { getUserData } from '../../../../../store/slice/authSlice';
import { getProjectTitles } from '../../../../../store/slice/profileSlice';
import { useSpring, animated } from 'react-spring'
import { SettingItemStatus } from '../../../../../constants/SettingItemStatus';

const { Text } = Typography;

const { TextArea } = Input;

const EditProjectList = ({ projectFromParent, onSaveInParent, onCancelInParent, onDeleteInParent, onAddNewInParent, bestSkill }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const isLoading = useSelector(isLoadingStatus);

  const user = useSelector(getUserData);

  const projectTitles = useSelector(getProjectTitles);

  const isCandidate = useSelector((state) => state.auth.user.isCandidate);

  const projectRolesInStore = useSelector(getProjectRolesInStore);

  const [projectRoleList, setProjectRoleList] = useState([]);

  const [project, setProject] = useState(projectFromParent);
  const [usedCategory, setUsedCategory] = useState(project.arraySkillNames ?
    JSON.parse(project.arraySkillNames).map((skill) => {
      if (skill.Category !== "") {
        return skill.Category.toUpperCase().trim();
      }
    }) : []);

  useEffect(() => {
    if (projectRolesInStore) {
      setProjectRoleList(projectRolesInStore.map((obj) => {
        if (obj.status === 0)
          return { key: obj.projectRoleId, value: obj.name }
        return undefined
      }).filter(item => item !== undefined))
    }
  }, [projectRolesInStore]);

  useEffect(() => {
    async function fetchSchoolData() {
      await dispatch(fetchSchool());
    }

    async function fetchSkillData() {
      await dispatch(fetchSkills());
    }
    fetchSchoolData();
    fetchSkillData();
  }, []);

  const onFinish = (values) => {
    onSaveInParent(project);
  };

  const onDelete = () => {
    form.resetFields();
    onDeleteInParent(project);
  };

  const onCancel = () => {
    form.resetFields();
    onCancelInParent(project.projectId);
  };

  const handleChangeInput = (e) => {
    setProject({
      ...project, [e.target.name]: e.target.value
    });

    form.setFieldsValue({
      [e.target.name]: e.target.value
    });
  };

  const handleTitleSelectChange = (value) => {
    setProject({
      ...project, title: value
    });

    form.setFieldsValue({
      title: value
    });
  };


  const handleDatePickerChangeFrom = (date, dateString) => {
    const newEducaition = {
      ...project, fromMonth: moment(date).format(monthFormat)
    };
    setProject(newEducaition);
    form.setFieldsValue({
      fromMonth: date
    });
  };
  const handleDatePickerChangeTo = (date, dateString) => {
    const newEducaition = {
      ...project, toMonth: moment(date).format(monthFormat)
    };
    setProject(newEducaition);
    form.setFieldsValue({
      toMonth: date
    });
  };

  const handleProjectRoleChange = (name) => {
    const projectR = projectRolesInStore.filter(obj => obj.name == name);
    if (projectR.length != 0) {
      setProject({ ...project, projectRole: projectR[0] });
      form.setFieldsValue({
        projectRoleId: projectR[0].name
      });
    } else {
      setProject({ ...project, projectRole: { projectRoleId: 0, name: name, status: SettingItemStatus.NEW, createBy: user.email } });
      form.setFieldsValue({
        projectRoleId: name
      });
    }
  };

  const onCrudSkills = (data) => {
    setUsedCategory(JSON.parse(data).map((data) => (data.Category).toUpperCase().trim()));
    setProject({ ...project, arraySkillNames: data });
    form.setFieldsValue({
      arraySkillNames: data
    });
  };

  const validateContainComma = (rule, value) => {
    if (value.indexOf(',') > -1) {
      return Promise.reject(Messages.PROJECTROLE_EXISTING_COMMA);
    } else if (value.trim() === '' && value !== '') {
      return Promise.reject('Project role cannot contain only whitespace characters.')
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  }
  return (
    <animated.div style={props}>
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Form
            form={form}
            name="projectlist"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              title: project.title,
              fromMonth: moment(project.fromMonth),
              client: project.client,
              teamSize: project.teamSize,
              description: project.description,
              responsibilities: project.responsibilities,
              toMonth: moment(project.toMonth),
              arraySkillNames: project.arraySkillNames,
              projectRoleName: project.projectRole ? project.projectRole.name : ""
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="Title"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Title"),
                    },
                  ]}
                >
                  {isCandidate ? <Input name="title" size="small"
                    onChange={handleChangeInput}
                    value={project.title}
                    maxLength={100} /> :

                    <AutoComplete name="title" style={{ width: "100%" }} placeholder="Select existing title or enter new one  ..."
                      size="small"
                      filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      value={project.title}
                      maxLength={100}
                      onChange={handleTitleSelectChange}
                      options={projectTitles}
                    >
                    </AutoComplete>}

                </Form.Item>
              </Col>
              <Col span={11} offset={1}>
                <Form.Item
                  name="client"
                  label="Client"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Client"),
                    },
                  ]}
                >
                  <Input name="client" size="small"
                    onChange={handleChangeInput}
                    value={project.client}
                    maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={13}>
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
                        if (moment(value).isAfter(project.toMonth)) {
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
                    value={project.fromMonth ? moment(project.fromMonth) : moment("")}
                    format={monthFormat}
                    allowClear={false}
                    // defaultValue={today}
                    picker="month" />
                </Form.Item>
              </Col>
              <Col span={11}>
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
                      validator: (_, value) => {
                        if (moment(project.fromMonth).isAfter(value)) {
                          return Promise.reject('Incorrect time range.');
                        } else {
                          return Promise.resolve();
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker onChange={handleDatePickerChangeTo}
                    size="small"
                    value={project.toMonth ? moment(project.toMonth) : moment("")}
                    format={monthFormat}
                    allowClear={false}
                    // defaultValue={today}
                    //className="ip-w-200"
                    picker="month" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="projectRoleName"
                  label="Project Role"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Project Role"),
                    },
                    {
                      validator: validateContainComma
                    }
                  ]}
                >
                  <AutoComplete
                    name="projectRoleName"
                    style={{ width: "100%" }}
                    placeholder="Select existing role or enter new one ..."
                    size="small"
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    maxLength={50}
                    onChange={handleProjectRoleChange}
                    options={projectRoleList}
                    value={project.projectRole ? project.projectRole.name : ""}
                  >
                  </AutoComplete>
                </Form.Item>
              </Col>

              <Col span={5} offset={1}>
                <Form.Item
                  name="teamSize"
                  label="Team Size"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Team Size"),
                    },
                    {
                      validator: (_, value) => {                        
                        if (value > 0) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('Team size must be greater than 0.');
                        }
                      }
                    }
                  ]}
                >
                  <Input name="teamSize" size="small"
                    onChange={handleChangeInput}
                    value={project.teamSize}
                    maxLength={200}
                    type="number"                    
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Description"),
                    },
                  ]}
                >
                  <TextArea rows={5} name="description" size="small"
                    onChange={handleChangeInput}
                    value={project.description}
                    maxLength={1000}
                  />
                  <Text type="secondary">{project.description ? 1000 - project.description.length : 1000} characters remaining</Text>
                </Form.Item>
              </Col>
            </Row>
            <Row className="margin-top-10">
              <Col span={24}>
                <Form.Item
                  label="Responsibilities"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Responsibilities"),
                    },
                  ]}
                >
                  <TextArea rows={5} name="responsibilities" size="small"
                    onChange={handleChangeInput}
                    value={project.responsibilities}
                    maxLength={1500}
                  />
                  <Text type="secondary">{project.responsibilities ? 1500 - project.responsibilities.length : 1500} characters remaining</Text>
                </Form.Item>
              </Col>
            </Row>
            <Row className="margin-top-10">
              <Col span={24}>
                <Form.Item
                  name="arraySkillNames"
                  label="Skill"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Skill"),
                    },
                  ]}
                >
                  <ProjectListSkillsInfo projectListSKill={project.arraySkillNames ?
                    JSON.parse(project.arraySkillNames).map((skill) => {
                      if (skill.Category !== "") {
                        return {
                          ...skill, isEdit: true, isAdd: false
                        }
                      }
                    }
                    )
                    : []} crud={onCrudSkills}
                    bestSkill={bestSkill}
                    usedCategory={usedCategory}></ProjectListSkillsInfo>
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
                    style={{ width: CSSConstants.BUTTON_WIDTH, display: project.projectId ? "" : "none" }}>
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
                <Button htmlType="button" onClick={onCancel}
                  size="small"
                  loading={isLoading}
                  icon={<CloseOutlined />}
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="small"
                  className="margin-left-10"
                  icon={<SaveOutlined />}
                  loading={isLoading}
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

export default EditProjectList;
