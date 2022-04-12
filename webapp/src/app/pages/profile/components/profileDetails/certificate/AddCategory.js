import React from 'react';
import { Row, Col, Button, Form, AutoComplete } from 'antd';
import { useSelector } from 'react-redux';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Messages } from '../../../../../utils/AppMessage';
import { openNotification } from '../../../../../components/OpenNotification';
import { useSpring, animated } from 'react-spring'

const AddCategory = ({ onAddExistCategory, onAddNewCategory, onCancel, useableCategories }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const [form] = Form.useForm();

  const isLoading = useSelector(isLoadingStatus);

  const onFinish = () => {
    form.validateFields().then(
      (value) => {
        const checkArr = useableCategories.filter((obj) => obj.value === value.category);
        if (checkArr.length === 0) {
          openNotification(Messages.WARNING, "The new category is under review and will appear after approval.", "")
          onAddNewCategory(value.category);
        } else {
          onAddExistCategory(value.category);
        }
      }
    ).catch((error) => console.log(error));
  };

  const handleCategorySelectChange = (category) => {
    form.setFieldsValue({
      category
    });
  };
  
  const validateCertificateCategory = (rule, value) => {
    if (value !== undefined && value !== "" && value.trim() === "") {
      return Promise.reject('Category cannot contain only white space characters.');
    } else if (value !== undefined && value.length > 100) {
      return Promise.reject(Messages.CERTIFICATE_CATEGORY_VALIDATE_MAX_LENGTH);
    } else {
      return Promise.resolve(() => form.resetFields());
    }
  }
  return (
    <animated.div style={props}>
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Form
            form={form}
            name="categorys"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="category"
              label="Select existing certificate's category or enter new one ..."
              rules={[
                { 
                  required: true, 
                  message: Messages.requiredMessage("Category") 
                },
                {
                  validator: validateCertificateCategory
                }
              ]}
              className="margin-left-10"
            >
              <Row>
                <Col span={10}>
                  <AutoComplete name="category" style={{ width: "100%" }} placeholder="Input category here ..."
                    size="small"
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    maxLength={100}
                    onChange={handleCategorySelectChange}
                    options={useableCategories}
                  >
                  </AutoComplete>
                </Col>
                <Col span={10}>
                  <Button
                    className="margin-left-10"
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    loading={isLoading}
                    htmlType="submit"
                    style={{ width: CSSConstants.BUTTON_WIDTH }}
                  >
                    Add
                </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <div className="fl-right">
                <Button
                  onClick={onCancel}
                  size="small"
                  icon={<CloseOutlined />}
                  loading={isLoading}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </animated.div>
  );
};

export default AddCategory;
