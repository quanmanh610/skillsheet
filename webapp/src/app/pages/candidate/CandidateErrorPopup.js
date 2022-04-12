import React from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../constants/CSSConstants';

const CandidateErrorPopup = ({ visible, onDone, message}) => {
  
  return (
    <Modal
      title="Notification"
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onCancel={onDone}
      footer={[
        <Button
          key="back"
          onClick={onDone}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<CloseOutlined />}
          size="default"
        >
          Close
        </Button>
      ]}
    >
    <p>{message}</p>
    </Modal>
  );
};

export default CandidateErrorPopup;
