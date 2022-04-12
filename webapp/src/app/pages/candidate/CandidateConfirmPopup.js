import React from 'react';
import { Modal, Button } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../constants/CSSConstants';

const SkillDeleteConfirmModal = ({ visible, onDone, onCancel, data, pagiState, onSavePopup, form, initCandidate, setCandidate, title}) => {

  const onOK = async () => {
    onSavePopup(data);
    setCandidate(initCandidate);
    form.resetFields();
    onCancel();
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
          Do it!
        </Button>,
      ]}
    >
    <p>{title === "Add New Candidate" ? "The candidate is already existing. Do you want to resend them the request email?" : "The candidate is already existing and inactive. Do you want to resend them the request email?"}</p>
    </Modal>
  );
};

export default SkillDeleteConfirmModal;
