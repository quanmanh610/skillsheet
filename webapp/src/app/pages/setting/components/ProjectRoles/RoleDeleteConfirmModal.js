import React from 'react';
import { Modal, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';

import {
  fetchProjectRoles,
} from '../../../../store/slice/settingSlice';

import {
  deleteProjectrole,
  deleteProfileRole,
} from '../../../../api/setting';
const RoleDeleteConfirmModal = ({ visible, onDone, onCancel, data,}) => {

  const dispatch = useDispatch();
  
  const onOK = async () => {    
    await deleteProfileRole(data);
    await deleteProjectrole(data);
    await dispatch(fetchProjectRoles());
    onDone();
    openNotification(
    Messages.SUCCESS,
    Messages.deleteSuccessMessage('Role'),
    ''
  );
  }
  
  return (
    <Modal
      title="Confirmation"
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onOk={onOK}
      onCancel={onCancel}
      footer={[
        <Button
          key="back"
          onClick={onCancel}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<CloseOutlined />}
          size="default"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onOK}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<SaveOutlined />}
          size="default"
        >
          Delete
        </Button>,
      ]}
    >
    <p>The role is being used in some profiles. This will delete those profile role. Do you really want to delete it?</p>
    </Modal>
  );
};

export default RoleDeleteConfirmModal;
