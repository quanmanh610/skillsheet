import React, { useState, useEffect } from 'react';
import { Row, Col, Button, AutoComplete, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getSkillsInStore } from '../../../../../../store/slice/settingSlice';
import AddProjectSkill from './AddProjectSkill';
import ViewProjectSkill from './ViewProjectSkill';
import { openNotification } from '../../../../../../components/OpenNotification';
import { Messages } from '../../../../../../utils/AppMessage';
import { CSSConstants } from '../../../../../../constants/CSSConstants';
import { getUserData } from '../../../../../../store/slice/authSlice';
import { SettingItemStatus } from '../../../../../../constants/SettingItemStatus';

const ProjectListSkillsInfo = ({ projectListSKill, crud, bestSkill, usedCategory }) => {
  const [form] = Form.useForm();

  const user = useSelector(getUserData);

  const [projectSkills, setProjectSkills] = useState([]);

  const skillsInStore = useSelector(getSkillsInStore);

  const [skillList, setSkillList] = useState([]);

  const [categoryList, setCategoryList] = useState([]);

  const [category, setCategory] = useState("");

  const [selectedValue, setSelectedValue] = useState([]);

  

  const getSkillList = (category) => {
    return skillsInStore.filter((s) => s.category === category && s.status === SettingItemStatus.ACTIVE).map((skill) => {
      if (skill) {
        return {
          key: skill.name,
          value: skill.name
        }
      }
    }
    );
  }

  useEffect(() => {
    if (projectListSKill) {
      setProjectSkills(projectListSKill);
    }
  }, [projectListSKill]);

  useEffect(() => {
    if (skillsInStore) {
      const categorys = [];
      const noDup = projectSkills.map((obj) => {
        if (obj.Category !== "") {
          return obj.Category
        } else {
          return obj
        }
      })
      skillsInStore.map((skill) => {
        if (skill.status === 0) {
          const newCate = {
            key: skill.category,
            value: skill.category
          }
          if (categorys.filter((cate) => cate.key === skill.category).length === 0 && !noDup.includes(skill.category)) {
            categorys.push(newCate);
          }
        }
      })
      setCategoryList(categorys);
    }
  }, [skillsInStore]);

  const onChangeSelectCategory = (e) => {
    setSkillList(getSkillList(e));
    setCategory(e);
    form.setFieldsValue({
      category: e
    });
  }

  const handleAddCategory = () => {
    const newC = {
      Category: category,
      Skills: [],
      isEdit: false,
      isAdd: true
    }
    setProjectSkills([...projectSkills, newC]);
  }

  const onDelete = (projectSkill) => {
    const newprojectSkills = projectSkills.filter(obj => obj.Category !== projectSkill.Category);
    setProjectSkills(newprojectSkills);
    setCategoryList([...categoryList, { key: projectSkill.Category, value: projectSkill.Category }]);
    crud(JSON.stringify(newprojectSkills));
  }

  const onCanCel = (projectSkill) => {
    setProjectSkills(projectSkills.map(obj => {
      if (obj.Category === projectSkill.Category)
        return {
          ...projectSkill, isEdit: false
        }
      return obj
    }));
  }

  const onSave = (projectSkill) => {
    if (projectSkill.Skills.length === 0) {
      openNotification(Messages.WARNING, "Please each category choose at least one skill!", "");
      return;
    }

    const newprojectSkills = projectSkills.map(obj => {
      if (obj.Category === projectSkill.Category)
        return {
          ...projectSkill, isEdit: false
        }
      return obj
    })

    setProjectSkills(newprojectSkills);
    crud(JSON.stringify(newprojectSkills));
  }

  const onEdit = (cate) => {
    // console.log(projectSkills);
    // const filer = { ...projectSkills.filter((item) => item.Category === cate)[0], isEdit: true, isAdd: true };
    // const newprojectSkills = projectSkills.map(obj => {
    //   if (obj.Category === cate)
    //     return {
    //       ...filer
    //     }
    //   return obj
    // })
    // setProjectSkills(newprojectSkills);
    // crud(JSON.stringify(newprojectSkills));
  }

  const onAddNew = (children) => {
    // console.log(children);
    // const newprojectSkills = projectSkills.map(obj => {
    //   if (obj.Category === category)
    //     return {
    //       ...obj, isAdd: false, Skills: children
    //     }
    //   return obj
    // });
    // setProjectSkills(newprojectSkills);
    // setCategoryList(categoryList.filter((obj) => obj.value !== category));

    // crud(JSON.stringify(newprojectSkills));
    // setCategory("");
  }

  const onCanCelAddNew = () => {
    setProjectSkills(projectSkills.filter(obj => !obj.isAdd));
    setCategory("");
  }

  const onFinish = () => {
    form.validateFields().then(
      (value) => {
        handleAddCategory();
      }
    ).catch((error) => console.log(error));
  };

  const validateDuplicateCategorySkill = (rule, value) => {
    if (usedCategory.includes(value.toUpperCase().trim()) === true) {
      return Promise.reject(Messages.existingMessage('Category'));
    } else if (value !== '' && value.trim() === '') {
      return Promise.reject('Category cannot contain only whitespace characters.');
    } else {
      return Promise.resolve(() => form.resetFields());
    };
  };

  const handleChange = (value) => {
    for (let i = 0; i < value.length; i++) {
      if (value[i].includes(",")) {
        openNotification(Messages.ERROR, 'Skill cannot contain comma characters.');
        break;
      };
    }
    setSelectedValue(value);
    const newprojectSkills = projectSkills.map(obj => {
      if (obj.Category === category)
        return {
          ...obj, Skills: value, isAdd: true
        }
      return obj
    });
    crud(JSON.stringify(newprojectSkills));
  }

  const handleCategory = (cate, value) => {
    for (let i = 0; i < value.length; i++) {
      if (value[i].includes(",")) {
        openNotification(Messages.ERROR, 'Skill cannot contain comma characters.');
        break;
      };
    }
    const newprojectSkills = projectSkills.map(obj => {
      if (obj.Category === cate)
        return {
          ...obj, Skills: value, isEdit: true
        }
      return obj
    });
    crud(JSON.stringify(newprojectSkills));
  }


  return (
    <Row justify="center">
      <Col span={24} >

        <Row>
          {projectSkills.filter((pS) => !pS.isAdd).map((projectSkill, index) =>
            <Col span={24} key={projectSkill.Category}>
              <ViewProjectSkill
                projectSkillFromPa={projectSkill}
                onEdit={onEdit}
                onSave={onSave}
                onDelete={onDelete}
                onCanCel={onCanCel}
                index={index}
                bestSkill={bestSkill}
                selectedValue={selectedValue}
                handleChangeEdit={(e) => {
                  handleCategory(projectSkill.Category, e)
                }}
              >
              </ViewProjectSkill>
            </Col>
          )}
        </Row>

        <Row>
          <Col span={24}>

            {projectSkills[projectSkills.length - 1] && projectSkills[projectSkills.length - 1].isAdd ? <AddProjectSkill category={category} selectedValue={selectedValue}
              skillList={skillList} onSave={onAddNew} onCanCel={onCanCelAddNew}
              onDelete={onDelete}
              bestSkill={bestSkill}
              handleChange={handleChange}
              >
            </AddProjectSkill> :
              <Row className="margin-bottom-20">
                <Col span={20}>
                  <Form
                    form={form}
                    name="categorys"
                    layout="vertical"
                    onFinish={onFinish}
                  >
                    <Form.Item
                      name="category"
                      // label="Select existing skill's category or enter new one ..."
                      rules={[
                        { required: true, message: Messages.requiredMessage("Category") },
                        { validator: validateDuplicateCategorySkill }]}
                      className="margin-left-10"
                    >
                      <Row>
                        <Col span={15}>
                          <AutoComplete name="category" placeholder="Select existing skill's category or enter new one  ..."
                            size="small"
                            filterOption={(inputValue, option) =>
                              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            maxLength={255}
                            onChange={onChangeSelectCategory}
                            options={categoryList}
                            rules={[{ required: true, message: Messages.requiredMessage("Category") }]}
                          >
                          </AutoComplete>
                        </Col>
                        <Col span={8}>
                          <Button
                            htmlType="submit"
                            type="primary"
                            size="small"
                            className="margin-left-10"
                            icon={<PlusOutlined />}
                            style={{ width: CSSConstants.BUTTON_WIDTH }}
                          >
                            Add
                      </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>


                </Col>
                <Col span={4}>
                </Col>
              </Row>
            }
          </Col>


        </Row>


      </Col>
    </Row >
  );
};
export default ProjectListSkillsInfo;
