import { Button, Form, Input, Modal, Radio } from "antd";
import { useSelector } from "react-redux";
import { getChannelInStore } from "../../../../store/slice/settingSlice";
import React, { useEffect, useState } from "react";
import { Messages } from "../../../../utils/AppMessage";
import { CSSConstants } from "../../../../constants/CSSConstants";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Config } from "../../../../constants/AppConfiguration";

const ChannelModal = ({ visible, onSave, onCancel, data, title }) => {
    const [form] = Form.useForm();
    var initialChannel = {
        channelId: 0,
        name: '',
    };
    const [channel, updateChannel] = useState(data ? data : initialChannel);


    const onSubmitForm = () => {
        onSave(channel);
    };
    const onClosePopup = () => {
        onCancel();
        form.resetFields();
    };

    const handleChangeInput = (e) => {

        updateChannel({...channel, name: e.target.value});
        form.setFieldsValue({
            name: e.target.value
        });
    };


    return (
        <Modal
            title={title}
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
                name="add_new_project_role"
            >
                <Form.Item
                    name="name"
                    label="Channel"
                    rules={[
                        {
                            required: true,
                            message: Messages.requiredMessage('Name'),
                        },
                        /* { validator: validateProjectRole }, */
                    ]}
                >
                    <div style={{ display: 'none' }}>
                        {channel ? channel.name : ''}
                    </div>
                    <Input
                        placeholder="Channel name..."
                        maxLength={Config.INPUT_MAX_LENGTH}
                        onChange={handleChangeInput}
                        value={channel ? channel.name : 'active'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChannelModal;
