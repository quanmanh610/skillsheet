import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Form,
  Radio, Popconfirm, Select
} from 'antd';
import { Messages } from '../../../../../utils/AppMessage';
import { DeleteOutlined, SaveOutlined, CloseOutlined, } from '@ant-design/icons';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { Languages } from '../../../../../constants/Languages';

const { Text } = Typography;

const { TextArea } = Input;

const EditLanguage = ({ languageFromParent, onSaveInParent, onCancelInParent, onDeleteInParent, languages }) => {

  const [form] = Form.useForm();

  const [language, setLanguage] = useState(languageFromParent);

  const onFinish = (values) => {
    form.validateFields().then(() => {
      onSaveInParent(language);
    }).catch((error) => console.log(error))
  };

  const onDelete = () => {
    form.resetFields();
    onDeleteInParent(language);
  };

  const onCancel = () => {
    form.resetFields();
    onCancelInParent(language.languageId);
  };

  const handleChangeInput = (e) => {
    const newEducaition = {
      ...language, [e.target.name]: e.target.value
    }
    setLanguage(newEducaition);
    form.setFieldsValue({
      [e.target.name]: e.target.value
    });
  };

  const handleLevelChange = (e) => {
    const newL = {
      ...language, level: e.target.value
    };
    setLanguage(newL);
  };

  const validateDuplicateLanguageName = (rule, value) => {

    const checkArr = languages.filter(((cer) => cer.name === value))

    if (checkArr && checkArr.length > 0) {
      if ((!languageFromParent.name && value !== '') || (languageFromParent.name && languageFromParent.name !== value)) {
        return Promise.reject(Messages.existingMessage('Language'));
      } else {
        return Promise.resolve(() => form.resetFields());
      }
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  }

  const handleLanguageSelectChange = (category) => {
    const newL = {
      ...language, name: category
    };
    setLanguage(newL);
  };

  return (
    <div className="border-bottom-solid">
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Form
            form={form}
            name="language"
            layout="vertical"
            onFinish={onFinish}
            size="small"
            initialValues={{
              name: language.name,
              level: language.level,
              note: language.note,
            }}
          >
            <Row>
              <Col span={13} className="margin-right-10">
                <Form.Item
                  name="name"
                  label="Name"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Name"),
                    },
                    {
                      validator: validateDuplicateLanguageName
                    }
                  ]}
                  className="margin-left-10"
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    size="small"
                    placeholder="Select language..."
                    onChange={handleLanguageSelectChange}
                    options={Languages}
                  >
                  </Select>
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col span={23} className="margin-right-10">
                <Form.Item
                  className="margin-left-10"
                  name="level" label="Level"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Level"),
                    },
                  ]}
                >
                  <Radio.Group size="small"
                    onChange={handleLevelChange}
                    value={language.level}>
                    <Radio value="Beginner">Beginner</Radio>
                    <Radio value="Intermediate">Intermediate</Radio>
                    <Radio value="Advanced">Advanced</Radio>
                    <Radio value="Native">Native</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className="margin-right-10">
                <Form.Item
                  label="Note"
                  size="small"
                  rules={[
                    {
                      required: true,
                      message: Messages.requiredMessage("Note"),
                    },
                  ]}
                  className="margin-left-10"
                >
                  <TextArea name="note" rows={3} size="small" value={language.note}
                    onChange={handleChangeInput}
                    maxLength={2000}
                  />
                  <Text type="secondary">{language.note ? 2000 - language.note.length : 2000} characters remaining</Text>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <div className="fl-left">
                <Popconfirm
                  title={Messages.DELETE_CONFIRM}
                  onConfirm={onDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="danger"
                    size="small" icon={<DeleteOutlined />}
                    style={{ width: CSSConstants.BUTTON_WIDTH, display: language.languageId ? "" : "none" }}>
                    Delete
                </Button></Popconfirm>
                {/* <Button
                  type="primary"
                  className="margin-left-10"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={onAddNew}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>
                  New
                </Button> */}
              </div>
              <div className="fl-right">
                <Button htmlType="button" onClick={onCancel}
                  size="small"
                  icon={<CloseOutlined />}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>

                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="margin-left-10"
                  size="small"
                  icon={<SaveOutlined />}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>
                  Save
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default EditLanguage;
