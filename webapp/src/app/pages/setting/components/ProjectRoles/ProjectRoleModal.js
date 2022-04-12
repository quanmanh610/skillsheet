import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Button } from 'antd';
import { Messages } from '../../../../utils/AppMessage';
import { useSelector } from 'react-redux';
import { getProjectRolesInStore } from '../../../../store/slice/settingSlice';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { Config } from '../../../../constants/AppConfiguration';

import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { SettingItemStatus } from '../../../../constants/SettingItemStatus';
const ProjectRoleModal = ({ visible, onSave, onCancel, data, title }) => {
  const [form] = Form.useForm();
  const projectRoles = useSelector(getProjectRolesInStore);
  const initialProjectRole = {
    projectroleId: '',
    name: '',
    status: SettingItemStatus.ACTIVE,
    createBy: '',
    updateBy: '',
  };
  const [isEdit, updateIsEdit] = useState(data ? true : false);
  const [projectRole, updateProjectRole] = useState(initialProjectRole);
  const [projectRoleBK, updateProjectRoleBK] = useState(initialProjectRole);

  const [validateStatus, updateValid] = useState('');
  const [help, updateHelp] = useState('');

  useEffect(() => {
    updateProjectRole(data ? data : initialProjectRole);
    updateProjectRoleBK(data ? data : initialProjectRole);
  }, [data]);

  const onSubmitForm = () => {
    if (projectRole.name.trim() === '') {
      updateValid(Messages.ERROR);
      updateHelp(Messages.PROJECTROLE_NAME_REQUIRE);
      return;
    } else if (projectRole.name.trim().indexOf(',') > -1) {
      updateValid(Messages.ERROR);
      updateHelp(Messages.PROJECTROLE_EXISTING_COMMA);
      return;
    }
    var filtered = projectRoles.filter(
      (pR) => projectRole.name.toUpperCase().trim() === pR.name.toUpperCase().trim()
    );

    if (!data && filtered.length > 0) {
      updateValid(Messages.ERROR);
      updateHelp(Messages.PROJECTROLE_EXISTING);
      return;
    }
    if (data && filtered.length > 0 && data.name !== projectRole.name) {
      updateValid(Messages.ERROR);
      updateHelp(Messages.PROJECTROLE_EXISTING);
      return;
    }
    if (!isEdit) {
      onSave({...projectRole, name: projectRole.name.trim()});
      form.resetFields();
      updateValid('');
      updateHelp('');
      onClosePopup();
      return;
    } else if (
      (isEdit && data.name.toUpperCase() !== projectRole.name.toUpperCase()) ||
      data.status !== projectRole.status
    ) {
      onSave({...projectRole, name: projectRole.name.trim()});
      form.resetFields();
      updateValid('');
      updateHelp('');
      onClosePopup();
    } else {
      onClosePopup();
    }

    if (isEdit) {
      updateProjectRole(projectRoleBK);
    } else {
      updateProjectRole(initialProjectRole);
    }
  };
  const onClosePopup = () => {
    updateValid('');
    updateHelp('');
    if (isEdit) {
      updateProjectRole(projectRoleBK);
    } else {
      updateProjectRole(initialProjectRole);
    }

    onCancel();
    form.resetFields();
  };
  /* const validateProjectRole = (rule, value) => {
    var filtered = projectRoles.filter(
      (pR) => value.toUpperCase() === pR.name.toUpperCase()
    );
    if (!isEdit) {
      if (filtered.length > 0) {
        return Promise.reject(Messages.existingMessage('Project Role'));
      } else {
        return Promise.resolve(() => form.resetFields());
      }
    } else {
      if (filtered.length > 0 && data.name !== value) {
        return Promise.reject(() => {
          console.log(Messages.existingMessage('Project Role'));
          return Messages.existingMessage('Project Role');
        });
      } else {
        return Promise.resolve(() => form.resetFields());
      }
    }
  }; */
  const onChangeRadio = (e) => {
    const newPr = {
      name: projectRole.name,
      status: e.target.value,
    };
    updateProjectRole(newPr);
    form.setFieldsValue({
      name: projectRole.name,
      status: e.target.value,
    });
  };

  const handleChangeInput = (e) => {
    /*  if (e.target.value === '') {
      updateValid('error');
      updateHelp('FUCK');
    } else {
      updateValid('');
      updateHelp('');
    }
    var filtered = projectRoles.filter(
      (pR) => e.target.value.toUpperCase() === pR.name.toUpperCase()
    );

    if (!isEdit && filtered.length > 0) {
      updateValid('error');
      updateHelp('Trung');
    } else {
      updateValid('');
      updateHelp('');
    }
    if (isEdit && filtered.length > 0 && data.name !== e.target.value) {
      updateValid('error');
      updateHelp('Trung');
    } else {
      updateValid('');
      updateHelp('');
    } */
    const newPr = {
      name: e.target.value,
      status: projectRole.status,
    };
    updateProjectRole(newPr);
    form.setFieldsValue({
      name: e.target.value,
      status: projectRole.status,
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
        name="add_new_project_role"
      /*         initialValues={{
        name: projectRole ? projectRole.name : '',
        status: projectRole ? projectRole : 'active',
      }} */
      >
        {/*         <span style={{ color: 'red' }}>*</span> */}
        <Form.Item
          name="name"
          label="Project Role"
          rules={[
            {
              required: true,
              message: Messages.requiredMessage('Project Role'),
            },
            /* { validator: validateProjectRole }, */
          ]}
          validateStatus={validateStatus}
          help={help}
        >
          <div style={{ display: 'none' }}>
            {projectRole ? projectRole.name : ''}
          </div>
          <Input
            placeholder="Project role name..."
            maxLength={Config.INPUT_MAX_LENGTH}
            onChange={handleChangeInput}
            value={projectRole ? projectRole.name : 'active'}
          />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <div style={{ display: 'none' }}>
            {projectRole ? projectRole.status : ''}
          </div>
          <Radio.Group
            onChange={onChangeRadio}
            value={projectRole ? projectRole.status : SettingItemStatus.ACTIVE}
          >
            <Radio value={SettingItemStatus.ACTIVE}>Active</Radio>
            <Radio value={SettingItemStatus.INACTIVE}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectRoleModal;
