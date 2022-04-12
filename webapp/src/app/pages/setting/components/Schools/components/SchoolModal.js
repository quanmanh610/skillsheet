import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const SchoolModal = ({ visible, onSave, onCancel, data, title }) => {
  const [form] = Form.useForm();
  const onOK = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
      })
      .catch((info) => {
      });
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onOk={onOK}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        name="add_new_School"
        initialValues={{
          category: data ? data.category : '',
          name: data ? data.name : '',
          status: data ? data.status : 0,
        }}
      >
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
              message: 'require !',
            },
          ]}
        >
          <Input maxLength={100} placeholder="Category name..." />
        </Form.Item>
        <Form.Item
          name="name"
          label="School"
          rules={[
            {
              required: true,
              message: 'require !',
            },
          ]}
        >
          <Input maxLength={100} placeholder="School name..." />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: 'require !',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="0">Active</Radio>
            <Radio value="1">Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SchoolModal;
