import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';

import {
  fetchCertificate,
  getCertificateInStore,
} from '../../../../../store/slice/settingSlice';

import {
  deleteCertificate,
  deleteProfileCertificate,
} from '../../../../../api/setting';
const CertificateDeleteConfirmModal = ({ visible, onDone, onCancel, data,}) => {

  const dispatch = useDispatch();
  
  const onOK = async () => {    
    await deleteProfileCertificate(data);
    await deleteCertificate(data);
    await dispatch(fetchCertificate());
    onDone();
    openNotification(
    Messages.SUCCESS,
    Messages.deleteSuccessMessage('Certificate'),
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
    <p>The certificate is being used in some profiles. This will delete those profile certificate. Do you really want to delete it?</p>
    </Modal>
  );
};

export default CertificateDeleteConfirmModal;
