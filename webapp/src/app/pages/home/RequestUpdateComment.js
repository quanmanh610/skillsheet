import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../constants/CSSConstants';


const { TextArea } = Input;

const RequestUpdateComment = ({ visible, onReject, onCancel, data }) => {

    const [form] = Form.useForm();
    const [comment, setComment] = useState('');
    useEffect(() => {
        setComment(data.comment || "");
      }, [data]);

    const onSubmitForm = () => {      
      onReject({idSelectedLst:data, comment: comment});
      form.resetFields();
      setComment('');
      onClosePopup();
      return;
    }

    const onClosePopup = () => {
      setComment('');
      onCancel();
      form.resetFields();
    };

    const onChangeComment = (e) => {
      setComment(e.target.value);      
      form.setFieldsValue({
        comment: e.target.value,
      });
    }

  return (
    <Modal
      title="Add Comment"
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onOk={onSubmitForm}
      onCancel={onClosePopup}
      footer={[
        <Button
          key="back"
          onClick={onClosePopup}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<CloseOutlined />}
          size="default"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmitForm}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<SaveOutlined />}
          size="default"
        >
          Send
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        name="add_new_skill"      
      >
        <Form.Item
          name="comment"
          label="Comment"
        >
          {/* <div style={{ display: 'none' }}>{skill ? skill.name : ''}</div> */}
          <TextArea
            placeholder="Write your comment..."
            maxLength={500}
            value={comment}
            onChange={onChangeComment}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestUpdateComment;
