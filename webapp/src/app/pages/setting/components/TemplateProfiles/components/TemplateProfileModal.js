import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { Messages } from '../../../../../utils/AppMessage';

const TemplateProfileModal = ({ visible, onSave, onCancel, title, dataSource }) => {

  const [form] = Form.useForm();

  const [hasFile, setHasFile] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const onHandleData = () => {
    form.validateFields().then(
      (value) => {
        onSave(selectedFile);
        setHasFile(false);
        form.resetFields();
      }
    ).catch((error) => {
      console.log(error);
    });

  };

  const onCancels = () => {
    form.setFieldsValue({
      file: ""
    });
    form.resetFields();
    onCancel();
    setHasFile(false);
  };

  const onFileChangeHandler = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
    setHasFile(true);
  }

  const validateFile = (rule, value) => {
    let name = value.split('\\');
    let isExist = false;
    dataSource.forEach(e => {
      if (e.templateName == name[name.length - 1]) {
        isExist = true;
      }
    });
    const suffix_4 = value.substring(value.length - 4, value.length);
    const suffix_3 = value.substring(value.length - 3, value.length);
    if ("docx" !== suffix_4 && "xlsx" !== suffix_4 && "xls" !== suffix_3 && "doc" !== suffix_3) {
      return Promise.reject("You can only upload docx, doc, xls, xlsx file.");
    } else if (isExist == true) {
      return Promise.reject(Messages.TEMPLATE_PROFILE_EXISTING);
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  }

  return (
    <Modal title={title} visible={visible} onOk={onHandleData} onCancel={onCancels}
      footer={[
        <Button
          size="small"
          key="back"
          onClick={onCancel}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<CloseOutlined />}
          size="default"
        >
          Cancel
      </Button>,
        <Button
          size="small"
          key="submit"
          type="primary"
          onClick={onHandleData}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<SaveOutlined />}
          size="default"
          disabled={!hasFile}
        >
          Save
      </Button>,
      ]}
    >
      <Form
        size="small"
        form={form}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
        layout="horizontal"
        name="add_new_template"
      >
        <Form.Item name="file"
          rules={[
            { validator: validateFile }
          ]}
          size="small"
        >
          <Input
            name="file"
            type="file"
            size="small"
            onChange={onFileChangeHandler}
            accept=".docx, .xlsx, .doc, .xls"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateProfileModal;
