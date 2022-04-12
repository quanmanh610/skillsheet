import {useDispatch} from "react-redux";
import {deleteProfileRole, deleteProfileSchool, deleteProjectrole, deleteSchool} from "../../../../api/setting";
import {fetchChannel, fetchProjectRoles, fetchSchool} from "../../../../store/slice/settingSlice";
import {openNotification} from "../../../../components/OpenNotification";
import {Messages} from "../../../../utils/AppMessage";
import {Button, Modal} from "antd";
import {CSSConstants} from "../../../../constants/CSSConstants";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";
import React from "react";

const ChannelDeleteConfirmModal = ({ visible, onDone, onCancel, data,}) => {

    const dispatch = useDispatch();

    const onOK = async () => {
        await deleteProjectrole(data);
        await dispatch(fetchChannel());
        onDone();
        openNotification(
            Messages.SUCCESS,
            Messages.deleteSuccessMessage('Channel'),
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
            <p> Do you really want to delete it?</p>
        </Modal>
    );
};

export default ChannelDeleteConfirmModal;