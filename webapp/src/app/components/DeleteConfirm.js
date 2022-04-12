import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirm = (props) => { 
  const { visible, onDelete, onCancel, confirmLoading, title } = props;
  return (
    <Modal
      title= {title ? title : "Confirm"}
      visible={visible}
      okText="Delete"
      cancelText="Cancel"
      onOk={onDelete}
      onCancel={onCancel}
      centered
      size="small"
      footer={[
        <Button size="small" key="back" onClick={onCancel} loading={confirmLoading}
          icon={<CloseOutlined />} >
          Cancel
        </Button >,
        <Button size="small" key="submit" type="danger" loading={confirmLoading} onClick={onDelete}
          icon={<DeleteOutlined />}>
          Delete
        </Button>,
      ]}
    >
      <Text>Are you sure want to delete?</Text>
    </Modal >
  );
};

export default DeleteConfirm;
