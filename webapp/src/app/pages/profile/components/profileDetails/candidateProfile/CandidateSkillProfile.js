import React from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Col, Input, Row, Form, Button, Select } from 'antd';
import Text from 'antd/lib/typography/Text';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { updateCandidate } from '../../../../../api/candidate';
import { addProfileSkill, updateProfile } from '../../../../../api/profile';
import { openNotification } from '../../../../../components/OpenNotification';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { Languages } from '../../../../../constants/Languages';
import { ProfileLanguageLevel } from '../../../../../constants/ProfileLanguageLevel';
import { getUserData, setUserData } from '../../../../../store/slice/authSlice';
import {
  fetchSkills,
  getSkillsInStore,
} from '../../../../../store/slice/settingSlice';
import { Messages } from '../../../../../utils/AppMessage';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import './CandidateProfile.css';

const CandidateSkillProfile = ({ rootProfile }) => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchSkillsData() {
      await dispatch(fetchSkills());
    }
    fetchSkillsData();
  }, []);

  const [form] = Form.useForm();

  const user = useSelector(getUserData);

  const skillsInStore = useSelector(getSkillsInStore);

  const [useableSkills, setUseableSkills] = useState([]);

  const [usedSkills, setUsedSkills] = useState([]);

  const [disableAdd, setDisableAdd] = useState(false);

  useEffect(() => {
    const skills = [];
    skillsInStore.map((skill) => {
      if (skill.status === 0) {
        const newSkill = {
          key: skill.name,
          value: skill.name,
        };
        if (!usedSkills.includes(newSkill.value)) {
          skills.push(newSkill);
        }
      }
    });
    setUseableSkills(skills);
  }, [skillsInStore]);

  const handleChangeInput = (e) => {};

  const validateProfileSkill = (rule, value) => {
    const formValues = form.getFieldValue('profileSkills');
    const removeUndefined = formValues.filter((skill) => skill !== undefined);
    const checkArr = removeUndefined.filter(
      (skill) => skill.skill.toUpperCase() === value.toUpperCase()
    );
    if (checkArr && checkArr.length > 1) {
      return Promise.reject(Messages.existingMessage('Skill'));
    } else if (value.indexOf(',') > -1) {
      return Promise.reject(Messages.SKILL_EXISTING_COMMA);
    } else if (value.length > 100) {
      return Promise.reject(Messages.SKILL_NAME_VALIDATE_MAX_LENGTH);
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  };

  const validateDuplicateProfileLanguage = (rule, value) => {
    const formValues = form.getFieldValue('profileLanguages');
    const removeUndefined = formValues.filter(
      (language) => language !== undefined
    );
    const checkArr = removeUndefined.filter(
      (language) => language.language.toUpperCase() === value.toUpperCase()
    );
    if (checkArr && checkArr.length > 1) {
      return Promise.reject(Messages.existingMessage('Language'));
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  };

  const handleRemoveSkill = (e) => {
    const used = form
      .getFieldValue('profileSkills')
      ?.map((skill) => skill?.skill);
    setUsedSkills(used);
    const skills = [];
    skillsInStore.map((skill) => {
      if (skill.status === 0) {
        const newSkill = {
          key: skill.name,
          value: skill.name,
        };
        if (!used.includes(newSkill.value)) {
          skills.push(newSkill);
        }
      }
    });
    setUseableSkills(skills);
  };

  const handleRemoveLanguage = (e) => {};

  const onFieldsChange = (changedFields, allFields) => {
    const skills = form.getFieldValue('profileSkills');
    if (
      skills !== undefined &&
      form.getFieldValue('profileSkills').length > 15
    ) {
      setDisableAdd(true);
      openNotification(Messages.WARNING, 'You added two much skills!', '');
    } else {
      setDisableAdd(false);
    }
  };

  const handleProfileSkillSelectChange = (ps, e) => {
    const used = form
      .getFieldValue('profileSkills')
      ?.map((skill) => skill?.skill);
    setUsedSkills(used);
    const skills = [];
    skillsInStore.map((skill) => {
      if (skill.status === 0) {
        const newSkill = {
          key: skill.name,
          value: skill.name,
        };
        if (!used.includes(newSkill.value)) {
          skills.push(newSkill);
        }
      }
    });
    setUseableSkills(skills);
  };

  const onFinish = async () => {
    const skills = form.getFieldValue('profileSkills');
    const languages = form.getFieldValue('profileLanguages');
    if (skills === undefined || languages === undefined) {
      openNotification(
        Messages.WARNING,
        'You must fill at least one skill and one language.'
      );
    } else {
      
      await addProfileSkill({
        ProfileSkills: skills.map((obj) => {
          if (obj)
            return {
              profileSkillId: obj.profileSkillId ? obj.profileSkillId : null,
              project: null,
              level: null,
              yearOfExperiences: obj.yearOfExperiences,
              lastUsed: null,
              bestSkill: '0',
            };
          return obj;
        }),
        Skills: skills.map((obj) => {
          if (obj) {
            return {
              category: null,
              name: obj.skill,
              createBy: user.userName,
              profileSkills: [],
            };
          }
          return obj;
        }),
        ProfileId: rootProfile.profileId,
      });
      
      await updateProfile(
        typeof rootProfile.avatar === 'string'
          ? {
              ...rootProfile,
              avatar: convertDataURIToBinary(rootProfile.avatar),
              languages: languages.map((language) => {
                if (language) {
                  return {
                    name: language.language,
                    level: language.level,
                  };
                }
              }),
            }
          : {
              ...rootProfile,
              languages: languages.map((language) => {
                if (language) {
                  return {
                    name: language.language,
                    level: language.level,
                  };
                }
              }),
            }
      );

      await updateCandidate({
        ...rootProfile.candidate,
        step: 1,
      });

      dispatch(setUserData(
        {
          ...user,
          step: 1,
        }
      ))

      window.location.reload();      
    }
  };

  return (
    <animated.div style={props}>
      <Row>
        <Col span={24}>
          <Form
            form={form}
            name="candidate_skill_profile"
            layout="vertical"
            onFinish={onFinish}
            onFieldsChange={onFieldsChange}
          >
            <div className="margin-bottom-10"><Text className="candidate_profile_title">Languages</Text></div>
            <Form.List name="profileLanguages">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <Row key={field.key} style={{ marginBottom: -3 }}>
                        <Col span={10} className="margin-right-10">
                          <Form.Item
                            {...field}
                            label="Language"
                            name="language"
                            name={[field.name, 'language']}
                            label={index === 0 ? 'Language' : ''}
                            fieldKey={[field.fieldKey, 'language']}
                            rules={[
                              {
                                required: true,
                                message: Messages.requiredMessage('Language'),
                              },
                              {
                                validator: validateDuplicateProfileLanguage,
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Select language..."
                              options={Languages}
                            ></Select>
                          </Form.Item>
                        </Col>
                        <Col span={10} className="margin-right-10">
                          <Form.Item
                            {...field}
                            name={[field.name, 'level']}
                            label={index === 0 ? 'Level' : ''}
                            fieldKey={[field.fieldKey, 'level']}
                            rules={[
                              {
                                required: true,
                                message: Messages.requiredMessage('Level'),
                              },
                            ]}
                          >
                            <Select
                              placeholder="Level"
                              options={ProfileLanguageLevel}
                            ></Select>
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'close']}
                            label={index === 0 ? ' ' : ''}
                            fieldKey={[field.fieldKey, 'close']}
                          >
                            <div
                              style={{
                                position: 'relative',
                                float: 'right',
                              }}
                            >
                              <Button
                                style={{
                                  color: 'red',
                                }}
                                icon={<DeleteOutlined />}
                                size="small"
                                type="link"
                                onClick={() => {
                                  remove(field.name);
                                  handleRemoveLanguage(field.name);
                                }}
                              ></Button>
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item style={{ display: 'none' }}>
                      <Button
                        id="addNewProfileLanguage"
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        style={{ display: 'none' }}
                      >
                        <PlusOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
            {/* </Row> */}
            <Row>
              <Col span={10}>
                <Button
                  type="dashed"
                  style={{
                    width: '100%',
                    borderColor: '#3789F8',
                    color: '#3789F8',
                  }}
                  className="fl-right"
                  onClick={(e) => {
                    document.getElementById('addNewProfileLanguage').click();
                    e.stopPropagation();
                  }}
                  icon={<PlusOutlined />}
                >
                  Add New
                </Button>
              </Col>
            </Row>
            <div>
              <br />
              <hr style={{ border: '1px solid #C4C4C4' }} />
            </div>
            <div className="margin-bottom-10"><Text className="candidate_profile_title">Skills</Text></div>
            <Form.List name="profileSkills">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <Row key={field.key} style={{ marginBottom: -3 }}>
                        <Col span={10} className="margin-right-10">
                          <Form.Item
                            {...field}
                            label="Skill"
                            name="skill"
                            name={[field.name, 'skill']}
                            label={index === 0 ? 'Skill' : ''}
                            fieldKey={[field.fieldKey, 'skill']}
                            rules={[
                              {
                                required: true,
                                message: Messages.requiredMessage('Skill'),
                              },
                              {
                                validator: validateProfileSkill
                              },
                            ]}
                          >
                            <AutoComplete
                              name="skill"
                              style={{ width: '100%' }}
                              placeholder="Select or enter new one"
                              maxLength={100}
                              options={useableSkills}
                              filterOption={(inputValue, option) =>
                                option.value
                                  .toUpperCase()
                                  .indexOf(inputValue.toUpperCase()) !== -1
                              }
                              onChange={handleProfileSkillSelectChange}
                            ></AutoComplete>
                          </Form.Item>
                        </Col>
                        <Col span={10} className="margin-right-10">
                          <Form.Item
                            {...field}
                            name={[field.name, 'yearOfExperiences']}
                            label={index === 0 ? 'Years of Experience' : ''}
                            fieldKey={[field.fieldKey, 'yearOfExperiences']}
                            rules={[
                              {
                                required: true,
                                message: Messages.requiredMessage(
                                  'Years of experience'
                                ),
                              },
                              // {
                              //   validator: (_, value) => {
                              //     if (value <= 0 && value) {
                              //       return Promise.reject(
                              //         'Team size must be greater than 0.'
                              //       );
                              //     } else {
                              //       return Promise.resolve();
                              //     }
                              //   },
                              // },
                            ]}
                          >
                            <Input
                              type="number"
                              width="100%"
                              placeholder="Year of experiences"
                              maxLength={30}
                              onChange={handleChangeInput}
                              min={1}
                            ></Input>
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'close']}
                            label={index === 0 ? ' ' : ''}
                            fieldKey={[field.fieldKey, 'close']}
                          >
                            <div
                              style={{
                                position: 'relative',
                                float: 'right',
                              }}
                            >
                              <Button
                                style={{
                                  color: 'red',
                                }}
                                icon={<DeleteOutlined />}
                                size="small"
                                type="link"
                                onClick={() => {
                                  remove(field.name);
                                  handleRemoveSkill(field.name);
                                }}
                              ></Button>
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item style={{ display: 'none' }}>
                      <Button
                        id="addNewProfileSkill"
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        style={{ display: 'none' }}
                      >
                        <PlusOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
            <Row>
              <Col span={10}>
                <Button
                  type="dashed"
                  style={{
                    width: '100%',
                    borderColor: '#3789F8',
                    color: '#3789F8',
                  }}
                  className="fl-right"
                  onClick={(e) => {
                    document.getElementById('addNewProfileSkill').click();
                    e.stopPropagation();
                  }}
                  hidden={disableAdd}
                  icon={<PlusOutlined />}
                >
                  Add New
                </Button>
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={20}></Col>
              <Col span={4}>
                <Form.Item>
                  <div className="fl-right">
                    <Button
                      htmlType="submit"
                      type="primary"
                      className="margin-left-10"
                      style={{
                        width: CSSConstants.BUTTON_WIDTH,
                        float: 'right',
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </animated.div>
  );
};

export default CandidateSkillProfile;
