import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Button, AutoComplete, Row } from 'antd';
import { useSelector } from 'react-redux';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Messages } from '../../../../utils/AppMessage';
import { getSchoolInStore, getSchoolsCategory } from '../../../../store/slice/settingSlice';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { Config } from '../../../../constants/AppConfiguration';
import { SettingItemStatus } from '../../../../constants/SettingItemStatus';

const SchoolModal = ({ visible, onSave, onCancel, data, title }) => {
  const [form] = Form.useForm();
  const Schools = useSelector(getSchoolInStore);
  const SchoolsCategory = useSelector(getSchoolsCategory);
  const initialSchool = {
    schoolId: '',
    category: '',
    name: '',
    status: SettingItemStatus.ACTIVE,
    createBy: '',
    updateBy: '',
  };
  const [isEdit, updateIsEdit] = useState(!!data);
  const [School, updateSchool] = useState(initialSchool);
  const [SchoolBK, updateSchoolBK] = useState(initialSchool);

  const [validateStatus, updateValid] = useState('');
  const [help, updateHelp] = useState('');
  const [validateStatusSchool, updateValidSchool] = useState('');
  const [helpSchool, updateHelpSchool] = useState('');

  useEffect(() => {
    updateSchool(data || initialSchool);
    updateSchoolBK(data || initialSchool);
  }, [data]);

  const onSubmitForm = () => {
    if (School.category.trim() === '') {
      updateValid(Messages.ERROR);
      updateHelp(Messages.SCHOOL_CATEGORY_NAME_REQUIRE);
      return;
    } else if (School.category.length > 100) {
      updateValid(Messages.ERROR);
      updateHelp(Messages.SCHOOL_CATEGORY_VALIDATE_MAX_LENGTH);
      return;
    }

    if (School.name.trim() === '') {
      updateValidSchool(Messages.ERROR);
      updateHelpSchool(Messages.SCHOOL_SCHOOL_NAME_REQUIRE);
      return;
    } else if (School.name.trim().indexOf(',') > -1) {
      updateValidSchool(Messages.ERROR);
      updateHelpSchool(Messages.SCHOOL_EXISTING_COMMA);
      return;
    }

    const filteredSchool = Schools.filter(
      (pR) =>
        School.name.toUpperCase().trim() === pR.name.toUpperCase().trim() &&
        School.category.toUpperCase().trim() === pR.category.toUpperCase().trim()
    );

    if (!data && filteredSchool.length > 0) {
      updateValidSchool(Messages.ERROR);
      updateHelpSchool(Messages.SCHOOL_SCHOOL_EXISTING);
      return;
    }

    if (data && filteredSchool.length > 0 && data.name !== School.name) {
      updateValidSchool(Messages.ERROR);
      updateHelpSchool(Messages.SCHOOL_SCHOOL_EXISTING);
      return;
    }
    if (!isEdit) {
      onSave({...School, name: School.name.trim(), category: School.category.trim()});
      form.resetFields();
      updateValid('');
      updateHelp('');
      updateValidSchool('');
      updateHelpSchool('');
      onClosePopup();
      return;
    } else if (
      isEdit &&
      (data.category.toUpperCase() !== School.category.toUpperCase() ||
      data.name.toUpperCase() !== School.name.toUpperCase() ||
      data.status !== School.status)
    ) {
      onSave({...School, name: School.name.trim(), category: School.category.trim()});
      form.resetFields();
      updateValid('');
      updateHelp('');
      updateValidSchool('');
      updateHelpSchool('');
      onClosePopup();
    } else {
      onClosePopup();
    }

    if (isEdit) {
      updateSchool(SchoolBK);
    } else {
      updateSchool(initialSchool);
    }
  };
  const onClosePopup = () => {
    updateValid('');
    updateHelp('');
    updateValidSchool('');
    updateHelpSchool('');
    if (isEdit) {
      updateSchool(SchoolBK);
    } else {
      updateSchool(initialSchool);
    }

    onCancel();
    form.resetFields();
  };
  
  const onChangeRadio = (e) => {
    const newPr = {
      category: School.category,
      name: School.name,
      status: e.target.value,
    };
    updateSchool(newPr);
    form.setFieldsValue({
      category: School.category,
      name: School.name,
      status: e.target.value,
    });
  };

  const handleChangeInputSchool = (e) => {
    const newPr = {
      category: School.category,
      name: e.target.value,
      status: School.status,
    };
    updateSchool(newPr);
    form.setFieldsValue({
      category: School.category,
      name: e.target.value,
      status: School.status,
    });
  };

  const handleCategorySelectChange = (category) => {
    const newPr = {
      category,
      name: School.name,
      status: School.status,
    };
    updateSchool(newPr);
    form.setFieldsValue({
      category,
      name: School.name,
      status: School.status,
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
        name="add_new_School"
      >
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
              message: Messages.requiredMessage('Category'),
            } 
          ]}
          validateStatus={validateStatus}
          help={help}
        >
          <div style={{ display: 'none' }}>{School ? School.category : ''}</div>
          <Row span={10}>
          <AutoComplete 
            placeholder="Category..."
            value={School ? School.category : 'active'}
            onChange={handleCategorySelectChange}
            filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            options={SchoolsCategory}
            maxLength={Config.INPUT_MAX_LENGTH}
          />
          </Row>
        </Form.Item>
        <Form.Item
          name="name"
          label="School"
          rules={[
            {
              required: true,
              message: Messages.requiredMessage('School Name'),
            },            
          ]}
          validateStatus={validateStatusSchool}
          help={helpSchool}
        >
          <div style={{ display: 'none' }}>{School ? School.name : ''}</div>
          <Input
            placeholder="School..."
            maxLength={200}
            onChange={handleChangeInputSchool}
            value={School ? School.name : 'active'}
          />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <div style={{ display: 'none' }}>{School ? School.status : ''}</div>
          <Radio.Group
            onChange={onChangeRadio}
            value={School ? School.status : SettingItemStatus.ACTIVE}
          >
            <Radio value={SettingItemStatus.ACTIVE}>Active</Radio>
            <Radio value={SettingItemStatus.INACTIVE}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SchoolModal;
