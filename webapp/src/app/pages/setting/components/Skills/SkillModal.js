import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Button, AutoComplete, Row } from 'antd';
import { useSelector } from 'react-redux';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Messages } from '../../../../utils/AppMessage';
import { getSkillsInStore, getSkillsCategory } from '../../../../store/slice/settingSlice';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { Config } from '../../../../constants/AppConfiguration';
import { SettingItemStatus } from '../../../../constants/SettingItemStatus';

const SkillModal = ({ visible, onSave, onCancel, data, title }) => {
  const [form] = Form.useForm();
  const skills = useSelector(getSkillsInStore);
  const skillsCategory = useSelector(getSkillsCategory);
  const initialSkill = {
    skillId: '',
    category: '',
    name: '',
    status: SettingItemStatus.ACTIVE,
    createBy: '',
    updateBy: '',
  };
  const [isEdit, updateIsEdit] = useState(!!data);
  const [skill, updateSkill] = useState(initialSkill);
  const [skillBK, updateSkillBK] = useState(initialSkill);

  const [validateStatus, updateValid] = useState('');
  const [help, updateHelp] = useState('');
  const [validateStatusSkill, updateValidSkill] = useState('');
  const [helpSkill, updateHelpSkill] = useState('');

  useEffect(() => {
    updateSkill(data || initialSkill);
    updateSkillBK(data || initialSkill);
  }, [data]);

  const onSubmitForm = () => {
    if (skill.category.trim() === '') {
      updateValid(Messages.ERROR);
      updateHelp(Messages.SKILL_CATEGORY_NAME_REQUIRE);
      return;
    } else if (skill.category.length > 100) {
      updateValid(Messages.ERROR);
      updateHelp(Messages.SKILL_CATEGORY_VALIDATE_MAX_LENGTH);
      return;
    }

    if (skill.name.trim() === '') {
      updateValidSkill(Messages.ERROR);
      updateHelpSkill(Messages.SKILL_SKILL_NAME_REQUIRE);
      return;
    } else if (skill.name.trim().indexOf(',') > -1) {
      updateValidSkill(Messages.ERROR);
      updateHelpSkill(Messages.SKILL_EXISTING_COMMA);
      return;
    }

    const filteredSkill = skills.filter(
      (pR) =>
        skill.name.toUpperCase().trim() === pR.name.toUpperCase().trim() &&
        skill.category.toUpperCase().trim() === pR.category.toUpperCase().trim()
    );

    if (!data && filteredSkill.length > 0) {
      updateValidSkill(Messages.ERROR);
      updateHelpSkill(Messages.SKILL_SKILL_EXISTING);
      return;
    }

    if (data && filteredSkill.length > 0 && data.name !== skill.name) {
      updateValidSkill(Messages.ERROR);
      updateHelpSkill(Messages.SKILL_SKILL_EXISTING);
      return;
    }
    if (!isEdit) {
      onSave({...skill, name: skill.name.trim(), category: skill.category.trim()});
      form.resetFields();
      updateValid('');
      updateHelp('');
      updateValidSkill('');
      updateHelpSkill('');
      onClosePopup();
      return;
    } else if (
      isEdit &&
      (data.category.toUpperCase() !== skill.category.toUpperCase() ||
      data.name.toUpperCase() !== skill.name.toUpperCase() ||
      data.status !== skill.status)
    ) {
      onSave({...skill, name: skill.name.trim(), category: skill.category.trim()});
      form.resetFields();
      updateValid('');
      updateHelp('');
      updateValidSkill('');
      updateHelpSkill('');
      onClosePopup();
    } else {
      onClosePopup();
    }

    if (isEdit) {
      updateSkill(skillBK);
    } else {
      updateSkill(initialSkill);
    }
  };
  const onClosePopup = () => {
    updateValid('');
    updateHelp('');
    updateValidSkill('');
    updateHelpSkill('');
    if (isEdit) {
      updateSkill(skillBK);
    } else {
      updateSkill(initialSkill);
    }

    onCancel();
    form.resetFields();
  };
  
  const onChangeRadio = (e) => {
    const newPr = {
      category: skill.category,
      name: skill.name,
      status: e.target.value,
    };
    updateSkill(newPr);
    form.setFieldsValue({
      category: skill.category,
      name: skill.name,
      status: e.target.value,
    });
  };

  const handleChangeInputSkill = (e) => {
    const newPr = {
      category: skill.category,
      name: e.target.value,
      status: skill.status,
    };
    updateSkill(newPr);
    form.setFieldsValue({
      category: skill.category,
      name: e.target.value,
      status: skill.status,
    });
  };

  const handleCategorySelectChange = (category) => {
    const newPr = {
      category,
      name: skill.name,
      status: skill.status,
    };
    updateSkill(newPr);
    form.setFieldsValue({
      category,
      name: skill.name,
      status: skill.status,
    });
  };

  return (
    <Modal
      title={title}
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onOk={onSubmitForm}
      onCancel={onClosePopup}
      footer={[
        <Button
          key="back"
          onClick={onClosePopup}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<CloseOutlined />}
          size="default"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmitForm}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<SaveOutlined />}
          size="default"
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        name="add_new_skill"      
      >        
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
              message: Messages.requiredMessage('Category'),
            },            
          ]}
          validateStatus={validateStatus}
          help={help}
        >
          <div style={{ display: 'none' }}>{skill ? skill.category : ''}</div>
          <Row span={10}>
            <AutoComplete
              placeholder="Category..."
              value={skill ? skill.category : 'active'}
              onChange={handleCategorySelectChange}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              options={skillsCategory}
              maxLength={Config.INPUT_MAX_LENGTH}
            />
          </Row>
        </Form.Item>
        <Form.Item
          name="name"
          label="Skill"
          rules={[
            {
              required: true,
              message: Messages.requiredMessage('Skill Name'),
            } 
          ]}
          validateStatus={validateStatusSkill}
          help={helpSkill}
        >
          <div style={{ display: 'none' }}>{skill ? skill.name : ''}</div>
          <Input
            placeholder="Skill..."
            maxLength={Config.INPUT_MAX_LENGTH}
            onChange={handleChangeInputSkill}
            value={skill ? skill.name : 'active'}
          />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <div style={{ display: 'none' }}>{skill ? skill.status : ''}</div>
          <Radio.Group
            onChange={onChangeRadio}
            value={skill ? skill.status : SettingItemStatus.ACTIVE}
          >
            <Radio value={SettingItemStatus.ACTIVE}>Active</Radio>
            <Radio value={SettingItemStatus.INACTIVE}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SkillModal;
