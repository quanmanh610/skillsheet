import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Button, AutoComplete, Row } from 'antd';
import { useSelector } from 'react-redux';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { Messages } from '../../../../../utils/AppMessage';
import { getCertificateCategory } from '../../../../../store/slice/settingSlice';
import { SettingItemStatus } from '../../../../../constants/SettingItemStatus';

const CertificateModal = ({ visible, onSave, onCancel, data, title, list }) => {
  const certificateCategory = useSelector(getCertificateCategory);
  const initialCer = {
    certificateId: '',
    category: '',
    name: '',
    status: SettingItemStatus.ACTIVE,
  };
  const [certificate, setCer] = useState(initialCer);
  useEffect(() => {
    if (data) {
      setCer(data);
    } else {
      setCer(initialCer);
    }
  }, [data]);

  const [form] = Form.useForm();
  const onOK = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const newValues = {
          ...values,
          category: values.category.trim(),
          name: values.name.trim(),
        }
        if (data) {
          onSave(newValues);
        } else {
          onSave(newValues);
          setCer(initialCer);
        }
      })
      .catch((info) => { });
  };

  const handleCancel = () => {
    form.resetFields();
    if (data) {
      const cancelCer = {
        certificateId: data.certificateId,
        category: data.category,
        name: data.name,
        status: data.status,
      };
      setCer(cancelCer);
    } else {
      setCer(initialCer);
    }
    onCancel();
  };

  const certificateCategoryList = list.map((json) => {
    return json[Object.keys(json)[1]].toUpperCase();
  });
  const certificateNameList = list.map((json) => {
    return json[Object.keys(json)[2]].toUpperCase();
  });
  const certificateIdList = list.map((json) => {
    return json[Object.keys(json)[0]];
  });
  const changeInput = (e) => {
    const newC = {
      certificateId: certificate.certificateId,
      category: certificate.category,
      name: e.target.value,
      status: certificate.status,
    };
    setCer(newC);
    form.setFieldsValue({
      category: certificate.category,
      name: e.target.value,
      status: certificate.status,
    });
  };

  const changeCategoryInput = (category) => {
    const newC = {
      certificateId: certificate.certificateId,
      category: category,
      name: certificate.name,
      status: certificate.status,
    };
    setCer(newC);
    form.setFieldsValue({
      category: category,
      name: certificate.name,
      status: certificate.status,
    });
  };
  const changeStatusInput = (e) => {
    const newC = {
      certificateId: certificate.certificateId,
      category: certificate.category,
      name: certificate.name,
      status: e.target.value,
    };
    setCer(newC);
    form.setFieldsValue({
      category: certificate.category,
      name: certificate.name,
      status: e.target.value,
    });
  };
  return (
    <Modal
      title={title}
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onOk={onOK}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          onClick={handleCancel}
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
        name="add_new_certificate"
        initialValues={{
          category: data ? data.category : '',
          name: data ? data.name : '',
          status: data ? data.status : SettingItemStatus.ACTIVE,
        }}
      >
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
              message: Messages.CERTIFICATE_CATEGORY_NAME_REQUIRE,
            },
            () => ({
              validator(rule, name) {
                if (name !== "" && name.trim() === "") {
                  return Promise.reject('Category cannot contain only white space characters.');
                } else if (name.length > 100) {
                  return Promise.reject(Messages.CERTIFICATE_CATEGORY_VALIDATE_MAX_LENGTH);
                }
                return Promise.resolve();
              }
            }),
          ]}
        >
          <div style={{ display: 'none' }}>
            {certificate ? certificate.category : ''}
          </div>
          <Row span={10}>
            <AutoComplete
              placeholder="Category..."
              value={certificate ? certificate.category : 'active'}
              // value={certificate.category}
              onChange={changeCategoryInput}
              filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              options={certificateCategory}
              maxLength={100}
            />
          </Row>
        </Form.Item>
        <Form.Item
          name="name"
          label="Certificate"
          rules={[
            {
              required: true,
              message: Messages.CERTIFICATE_SKILL_NAME_REQUIRE,
            },
            ({ getFieldValue }) => ({
              validator(rule, name) {                
                if (name !== "" && name.trim() === "") {
                  return Promise.reject('Certificate cannot contain only white space characters.');
                } else if (name.trim().indexOf(',') > -1) {
                  return Promise.reject(Messages.CERTIFICATE_EXISTING_COMMA);
                }
                if (
                  !name ||
                  !(
                    certificateCategoryList.includes(
                      getFieldValue('category').toUpperCase().trim()
                    ) && certificateNameList.includes(name.toUpperCase().trim())
                  ) ||
                  (certificateCategoryList[
                    certificateIdList.indexOf(certificate.certificateId)
                  ] === getFieldValue('category').toUpperCase().trim() &&
                    certificateNameList[
                    certificateIdList.indexOf(certificate.certificateId)
                    ] === name.toUpperCase().trim())
                ) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject(Messages.existingMessage(name));
              },
            }),
          ]}
        >
          <div style={{ display: 'none' }}>
            {certificate ? certificate.name : ''}
          </div>
          <Input
            maxLength={100}
            value={certificate.name}
            onChange={changeInput}
            placeholder="Certificate name..."
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: 'This field is required',
            },
          ]}
        >
          <div style={{ display: 'none' }}>
            {certificate ? certificate.status : SettingItemStatus.ACTIVE}
          </div>
          <Radio.Group value={certificate.status} onChange={changeStatusInput}>
            <Radio value={SettingItemStatus.ACTIVE}>Active</Radio>
            <Radio value={SettingItemStatus.INACTIVE}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CertificateModal;
