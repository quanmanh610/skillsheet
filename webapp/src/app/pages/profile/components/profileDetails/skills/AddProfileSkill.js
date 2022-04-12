import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Select, Input, DatePicker, Tag, Checkbox, AutoComplete, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { CloseOutlined, PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { Messages } from '../../../../../utils/AppMessage';
import { yearFormat } from '../../../../../constants/DateTimes';
import { ProfileSkillLevel } from '../../../../../constants/ProfileSkillLevel';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { openNotification } from '../../../../../components/OpenNotification';
//import { getProjectTitles } from '../../../../../store/slice/profileSlice';
import { useSpring, animated } from 'react-spring'
import moment from 'moment';

const AddProfileSkill = ({ profileSkill, onAddProfileSkills, onCancel }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const [form] = Form.useForm();

  const isLoading = useSelector(isLoadingStatus);

  //const isCandidate = useSelector((state) => state.auth.user.isCandidate);

  //const projectTitles = useSelector(getProjectTitles);

  const [profileSkillItem, setProfileSkillItem] = useState(profileSkill || {});

  const [disableAdd, setDisableAdd] = useState(false);

  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  useEffect(() => {
    if (profileSkill.Category.isNew) {
      form.setFieldsValue({
        profileSkills: [{}]
      });
    }
  }, [profileSkill]);

  const onFinish = () => {
    form.validateFields().then(
      (value) => {
        onAddProfileSkills({ profileSkills: value.profileSkills ? value.profileSkills : [] }, profileSkill.Category);
      }
    ).catch((error) => console.log(error));
  };

  // const handleChangeInput = (e) => {
  // };

  // const handleTitleSelectChange = (value) => {
  // };

  const handleProfileSkillSelectChange = (ps, e) => {
    const removeUndefined = form.getFieldValue("profileSkills").filter((cer) => cer);
    const usedSkill = removeUndefined.map((obj) => {
      if (obj.skill !== "")
        return obj.skill
      return obj
    });
    const newFilter = profileSkill.Skills.filter((item) => !usedSkill.includes(item.key));
    setProfileSkillItem({ ...profileSkillItem, Skills: newFilter });
  };

  // const handleDatePickerChange = (date, dateString) => {

  // };

  const validateProfileSkill = (rule, value) => {
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
      return Promise.reject(Messages.existingMessage('ProfileSkill'));
    } else if (value.indexOf(',') > -1) {
      return Promise.reject(Messages.SKILL_EXISTING_COMMA);
    } else if (value.length > 100) {
      return Promise.reject(Messages.SKILL_NAME_VALIDATE_MAX_LENGTH);
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  };

  const handleRemove = (e) => {
    const useSkills = form.getFieldValue("profileSkills").map((obj) => {
      if (obj !== undefined)
        return obj.skill
      return obj
    });
    const newFilter = profileSkill.Skills.filter((item) => !useSkills.includes(item.key));
    if (useSkills.length === 0) {
      setDisableSaveBtn(true);
    } else {
      setDisableSaveBtn(false);
    }
    setProfileSkillItem({ ...profileSkillItem, Skills: newFilter });

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

  const onChangeCheckBox = (e) => {
  }

  return (
    <animated.div style={props}>
      <Row justify="center" className="margin-top-10">
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div>
                <Row justify="center">
                  <Col span={16}>
                    <Row>
                      <Tag color="#87d068"
                        style={{ minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center" }}
                      > {profileSkillItem.Category.name} </Tag>
                    </Row>
                  </Col>
                  <Col span={4}>

                  </Col>
                  <Col span={4}>
                    <Button
                      id='btnAddNewProfileSkill'
                      type="primary"
                      size="small"
                      className="fl-right"
                      onClick={(e) => {
                        document.getElementById('addNewProfileSkill').click();
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
            name="dynamic_profileSkills"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              profileSkills: profileSkillItem.Category.isNew ? [] : [{
                project: "", level: "", yearOfExperiences: "", lastUsed: "",
                bestSkill: false
              }]
            }}
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
                                name={[field.name, 'skill']}
                                label={index === 0 ? 'Skill' : ''}
                                fieldKey={[field.fieldKey, 'skill']}
                                rules={[
                                  { required: true, message: Messages.requiredMessage("Skill") },
                                  { validator: validateProfileSkill }]}
                              >
                                <AutoComplete
                                  id="skill"
                                  name="skill"
                                  style={{ width: "100%" }}
                                  placeholder="Select skill"
                                  size="small"
                                  filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                  }
                                  maxLength={50}
                                  onChange={handleProfileSkillSelectChange}
                                  options={profileSkillItem.Skills}
                                > </AutoComplete>
                              </Form.Item>
                            </Col>
                            {/* <Col span={6} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'project']}
                                label={index === 0 ? 'Project' : ''}
                                fieldKey={[field.fieldKey, 'project']}
                                rules={[{ required: true, message: Messages.requiredMessage("Project") }]}
                                className="margin-left-10"
                              >
                                {isCandidate ? <Input name="project" size="small"
                                  onChange={handleChangeInput}
                                  placeholder={"Project..."}
                                  maxLength={500}
                                /> :
                                  <AutoComplete name="project" style={{ width: "100%" }} placeholder="Select or enter new.."
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
                          <Col span={4} >
                              <Form.Item
                                {...field}
                                name={[field.name, 'level']}
                                label={index === 0 ? 'Level' : ''}
                                fieldKey={[field.fieldKey, 'level']}
                                rules={[
                                  { required: true, message: Messages.requiredMessage("Level") }]}
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
                            <Col span={6} >
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
                                className="margin-left-10">
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
                                className="margin-left-10"
                              >
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
                                className="margin-left-10">
                                <div style={{ position: "relative", float: "right" }}>
                                  <Button
                                    id='btbDeleteSkill'
                                    style={{
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
                          id="addNewProfileSkill"
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
              <div className="fl-right">
                <Button
                  id='btnCancel'
                  htmlType="button"
                  onClick={onCancel}
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
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>
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

export default AddProfileSkill;
