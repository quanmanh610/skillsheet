import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Select, Input, DatePicker, Popconfirm, Checkbox, AutoComplete, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { CloseOutlined, PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { getSkillsInStore } from '../../../../../store/slice/settingSlice';
import { Messages } from '../../../../../utils/AppMessage';
import { yearFormat } from '../../../../../constants/DateTimes';
import { deleteProfileSkill } from '../../../../../api/profile';
import { fetchProfileById, getProfileIdFromStore } from '../../../../../store/slice/profileSlice';
import { openNotification } from '../../../../../components/OpenNotification';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { ProfileSkillLevel } from '../../../../../constants/ProfileSkillLevel';
//import { getUserData } from '../../../../../store/slice/authSlice';
//import { getProjectTitles } from '../../../../../store/slice/profileSlice';
import { useSpring, animated } from 'react-spring'
import  moment from "moment";

const EditProfileSkill = ({ profileSkill, onEditProfileSkills, onCancel, onDeleteSuccess }) => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const isLoading = useSelector(isLoadingStatus);

  // const user = useSelector(getUserData);

  // const projectTitles = useSelector(getProjectTitles);

  const profileId = useSelector(getProfileIdFromStore);

  const skillsInStore = useSelector(getSkillsInStore);

  const [disableAdd, setDisableAdd] = useState(false);

  const [useableSkills, setUseableSkills] = useState([]);

  const [skillsBK, setSkillsBK] = useState([]);

  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  useEffect(() => {
    for (let i = 0; i < profileSkill.ProfileSkills.length; i++) {
      const skill = profileSkill.ProfileSkills[i];
      if (!moment(skill.lastUsed).isValid()) {
        skill.lastUsed = moment(new Date());
      }
    }
    form.setFieldsValue({
      profileSkills: profileSkill.ProfileSkills,
    });
    
    const usedSkills = profileSkill.ProfileSkills.map((obj) => obj.skill);

    const skillsByCategory = skillsInStore.filter((obj) => obj.category === profileSkill.Category.name);

    const useableSkills = skillsByCategory.map((obj) => {
      if (obj.status === 0) {
        return { key: obj.name, value: obj.name }
      }
    }).filter((item) => (item !== undefined && !usedSkills.includes(item.key)))

    setSkillsBK(skillsByCategory.map((obj) => {
      if (obj.status === 0) {
        return { key: obj.name, value: obj.name }
      }
    }));
    setUseableSkills(useableSkills);

  }, [profileSkill, skillsInStore]);

  const onFinish = () => {
    form.validateFields().then(
      (value) => {
        onEditProfileSkills({ profileSkills: value.profileSkills ? value.profileSkills : [] }, profileSkill.Category);
      }
    ).catch((error) => console.log(error));
  };

  const handleProfileSkillSelectChange = (skill, e) => {
    const useSkills = form.getFieldValue("profileSkills").filter((obj) => obj !== undefined).map((item) => item.skill);
    if (useSkills.length == 0) {
      setUseableSkills(skillsBK);
    } else {
      setUseableSkills(skillsBK.filter((obj) => (obj != undefined && !useSkills.includes(obj.key))));
    }
  };

  const validateProfileSkill = (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    const formValues = form.getFieldValue("profileSkills");
    const removeUndefined = formValues.filter(
      (cer) => cer !== undefined
    );
    const checkArr = removeUndefined.filter(
      (cer) => cer.skill.toUpperCase() === value?.toUpperCase()
    );
    if (value !== undefined && value !== "" && value?.trim() === "") {
      return Promise.reject('Skill cannot contain only white space characters.');
    } else if (value !== undefined && value.trim() !== "" && checkArr && checkArr.length > 1) {
      return Promise.reject(Messages.existingMessage('Skill'));
    } else if (value.indexOf(',') > -1) {
      return Promise.reject(Messages.SKILL_EXISTING_COMMA);
    } else if (value.length > 100) {
      return Promise.reject(Messages.SKILL_NAME_VALIDATE_MAX_LENGTH);
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  };

  const onCancels = () => {
    onCancel(profileSkill.Category.name);
  }

  const handleRemove = (e) => {
    const useSkills = form.getFieldValue("profileSkills").map((item) => {
      if (item !== undefined) {
        return item.skill;
      }
      return item;
    });
    if (useSkills.length === 0) {
      setDisableSaveBtn(true);
    } else {
      setDisableSaveBtn(false);
    }
    setUseableSkills(skillsBK.filter((obj) => (obj !== undefined && !useSkills.includes(obj.key))));
  }

  const onDelete = async () => {
    const deleteId = form.getFieldValue("profileSkills").filter((obj) =>
      obj.profileSkillId
    ).map((obj) => {
      if (obj)
        return obj.profileSkillId
      return obj
    });
    const resp = await deleteProfileSkill({ deleteIds: deleteId });
    if (resp.data == "DELETED") {
      onDeleteSuccess(profileSkill.Category);
      dispatch(fetchProfileById({ profileId: profileId }));
      openNotification(Messages.SUCCESS, Messages.deleteSuccessMessage("Project Skill"), "");
    }
  }

  const onFieldsChange = (changedFields, allFields) => {
    if (form.getFieldValue("profileSkills").length > 0) {
      setDisableSaveBtn(false);
    }
    if (form.getFieldValue("profileSkills").length > 15) {
      setDisableAdd(true);
      openNotification(Messages.WARNING, "You added too many skills!", "")
    } else {
      setDisableAdd(false);
    }
  }

  const onChangeCheckBox = () => { }

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
                      {profileSkill.Category.name === "" ? "" : <Tag color="#87d068"
                        style={{ minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center" }}
                      > {profileSkill.Category.name} </Tag>}
                    </Row> */}
                  </Col>
                  <Col span={4}>

                  </Col>
                  <Col span={4}>
                    <Button
                      id='btnAddNewSkill'
                      type="link"
                      size="small"
                      className="fl-right"
                      onClick={(e) => {
                        document.getElementById('addNewSkill').click();
                        e.stopPropagation();
                      }}
                      icon={<PlusOutlined />}
                      style={{ minWidth: CSSConstants.BUTTON_WIDTH }}
                    >
                      Add New Skill
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row className="margin-top-10"></Row>
          <Form
            form={form}
            name="dynamic_skills"
            layout="vertical"
            onFinish={onFinish}
            onFieldsChange={onFieldsChange}
          >
            <div>
              <Form.List name="profileSkills">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field, index) => (
                        <Col span={24} key={field.key} style={{ marginBottom: 8 }} >
                          <Row className="margin-top-10">
                            <Col span={5}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'profileSkillId']}
                                label={index === 0 ? 'ProfileSkillId' : ''}
                                fieldKey={[field.fieldKey, 'profileSkillId']}
                                style={{ display: "none" }}
                              >
                                <Input 
                                  id='profileSkillId'
                                  size="small"
                                  placeholder="Select ..."
                                  name='profileSkillId'
                                  defaultValue={profileSkill.ProfileSkills[field.fieldKey] ? profileSkill.ProfileSkills[field.fieldKey].profileSkillId : ""}
                                >
                                </Input>
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, 'skill']}
                                label={index === 0 ? 'Skill' : ''}
                                fieldKey={[field.fieldKey, 'skill']}
                                rules={[
                                  { required: true, message: Messages.requiredMessage("Skill") },
                                  { validator: validateProfileSkill }]}
                              >
                                <AutoComplete
                                  id='skill'
                                  defaultValue={profileSkill.ProfileSkills[field.fieldKey] ? profileSkill.ProfileSkills[field.fieldKey].skill : ""}
                                  name="skill"
                                  style={{ width: "100%" }}
                                  placeholder="Input skill's name here ..."
                                  size="small"
                                  maxLength={50}
                                  filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                  }
                                  onChange={handleProfileSkillSelectChange}
                                  options={useableSkills}
                                >
                                </AutoComplete>
                              </Form.Item>
                            </Col>
                            {/* <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'project']}
                                label={index === 0 ? 'Project' : ''}
                                fieldKey={[field.fieldKey, 'project']}
                                rules={[{ required: true, message: Messages.requiredMessage("Project") }]}
                                className="margin-left-10">
                                {user.isCandidate ? <Input name="project" size="small"
                                  onChange={handleChangeInput}
                                  placeholder={"Project..."}
                                  maxLength={500}
                                /> :
                                  <AutoComplete name="project" style={{ width: "100%" }} placeholder="Select existing project or enter new one  ..."
                                    size="small"
                                    filterOption={(inputValue, option) =>
                                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    maxLength={100}
                                    onChange={handleTitleSelectChange}
                                    options={projectTitles}
                                  >
                                  </AutoComplete>
                                }
                              </Form.Item>
                            </Col> */}
                          <Col span={4}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'level']}
                                label={index === 0 ? 'Level' : ''}
                                fieldKey={[field.fieldKey, 'level']}
                                rules={[
                                  { required: true, message: Messages.requiredMessage("Level") } ]}
                                className="margin-left-10">
                                <Select 
                                  id='skillLevel'
                                  size="small"
                                  placeholder="Select ..."
                                  onChange={handleProfileSkillSelectChange}
                                  options={ProfileSkillLevel}
                                >
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'yearOfExperiences']}
                                label={index === 0 ? 'Experience (years)' : ''}
                                fieldKey={[field.fieldKey, 'yearOfExperiences']}
                                rules={[{ required: true, message: Messages.requiredMessage("Years Of Experience") }]}
                                className="margin-left-10">
                                <InputNumber 
                                  name="yearOfExperiences"
                                  size="small"  
                                  id='yearsOfExperience'
                                  style={{width: '100%'}}                                
                                  placeholder={"Years"}
                                  maxLength={30}                                  
                                  min={1}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={5} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'lastUsed']}
                                label={index === 0 ? 'Last Used' : ''}
                                fieldKey={[field.fieldKey, 'lastUsed']}
                                rules={[
                                  { 
                                    required: true, message: Messages.requiredMessage("Last Used") 
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (value && moment(value._d).isAfter()) {
                                        return Promise.reject('Last year used is not correct.');
                                      } else {
                                        return Promise.resolve();
                                      }
                                    }
                                  }
                                ]}
                                className="margin-left-10" >
                                <DatePicker
                                  id='lastUsed'
                                  size="small"
                                  format={yearFormat}
                                  allowClear={false}
                                  style={{ width: "100%" }}
                                  picker="year" />
                              </Form.Item>
                            </Col>
                            <Col span={3} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'bestSkill']}
                                label={index === 0 ? 'Best Skill' : ''}
                                fieldKey={[field.fieldKey, 'bestSkill']}
                                valuePropName="checked"
                                className="margin-left-10" >
                                <Checkbox
                                  id='isBestSkill'
                                  className="margin-left-20"
                                  size="small"
                                  onChange={onChangeCheckBox}
                                >
                                </Checkbox>
                              </Form.Item>
                            </Col>                                                        
                            <Col span={1} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'close']}
                                label={index === 0 ? ' ' : ''}
                                fieldKey={[field.fieldKey, 'close']}
                                className="margin-left-10" >
                                <Button style={{
                                  color: "red",
                                }}
                                  id='btnNewDelete'
                                  icon={<DeleteOutlined />}
                                  size="small"
                                  type="link"
                                  onClick={() => {
                                    remove(field.name);
                                    handleRemove(field.name);
                                  }}
                                >
                                </Button>
                              </Form.Item>

                            </Col>
                          </Row>
                        </Col>
                      ))}

                      <Form.Item style={{ display: "none" }}>
                        <Button
                          id="addNewSkill"
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ display: "none" }}
                          disabled={disableAdd}
                        >
                          <PlusOutlined /> Skill
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
                    id='btnDeleteSkillCategory'
                    loading={isLoading}
                    size="small" icon={<DeleteOutlined />}
                    style={{ width: CSSConstants.BUTTON_WIDTH }}>
                    Delete
                </Button></Popconfirm>
              </div>
              <div className="fl-right">
                <Button onClick={onCancels}
                  id='btnCancel'
                  size="small"
                  icon={<CloseOutlined />}
                  loading={isLoading}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>
                  Cancel
                </Button>
                <Button
                  id='btnSaveSkill'
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

export default EditProfileSkill;
