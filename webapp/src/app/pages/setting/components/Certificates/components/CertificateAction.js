import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Popconfirm } from 'antd';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { fetchCertificate } from '../../../../../store/slice/settingSlice';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CertificateModal from './CertificateModal';
import { updateCertificate } from '../../../../../api/setting';

const CertificateAction = ({ record, clearRowSelection, onDelete, datasource }) => {
  const dispatch = useDispatch();
  const [editVisible, setEditVisible] = useState(false);

  const onSave = async (values) => {
    const updateCertificateData = {
      certificateId: record.certificateId,
      category: values.category,
      name: values.name,
      status: values.status,
      createBy: record.createBy,
      createdDate: record.createdDate ? record.createdDate : null
    };
    const response = await updateCertificate(updateCertificateData);
    if (response) {
      setEditVisible(false);
      await dispatch(fetchCertificate());
      openNotification(
        Messages.SUCCESS,
        Messages.editSuccessMessage('Certificate'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.editUnsuccessMessage('Certificate'),
        ''
      );
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        type="link"
        size="small"
        onClick={() => {
          setEditVisible(true);
          clearRowSelection();
        }}
        style={{ width: CSSConstants.BUTTON_WIDTH }}
        icon={<EditOutlined />}
      >
        Edit
      </Button>
      <CertificateModal
        title="Edit Certificate"
        visible={editVisible}
        onSave={onSave}
        onCancel={() => {
          setEditVisible(false);
        }}
        data={record}
        list={datasource}
      />
      <Popconfirm
        title={Messages.DELETE_CONFIRM}
        onConfirm={onDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button
          size="small"
          type="link"
          danger
          style={{ width: CSSConstants.BUTTON_WIDTH }}
          icon={<DeleteOutlined />}
          onClick={clearRowSelection}
        >
          Delete
        </Button>
      </Popconfirm>
    </div>
  );
};

export default CertificateAction;
