import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import { openNotification } from "../../../../components/OpenNotification";
import { Messages } from "../../../../utils/AppMessage";
import { CSSConstants } from "../../../../constants/CSSConstants";
import {fetchChannel, fetchProjectRoles} from "../../../../store/slice/settingSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { updateChannel } from "../../../../api/setting";
import ChannelModal from "./ChannelModal";

const ChannelAction = ({ record, clearRowSelection, onDelete }) => {
    const dispatch = useDispatch();
    const [editVisible, setEditVisible] = useState(false);

    const onSave = async (values) => {
        const updateChannelData = {
            channelId: record.id,
            name: values.name,
        };
        console.log("111111", values)
        const response = await updateChannel(updateChannelData);
        if (response) {
            setEditVisible(false);
            await dispatch(fetchChannel());
            openNotification(
                Messages.SUCCESS,
                Messages.editSuccessMessage("Channel"),
                ""
            );
        } else {
            openNotification(
                Messages.ERROR,
                Messages.editUnsuccessMessage("Channel"),
                ""
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
            <ChannelModal
                title="Edit Channel"
                visible={editVisible}
                onSave={onSave}
                onCancel={() => {
                    setEditVisible(false);
                }}
                data={record}
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

export default ChannelAction;
