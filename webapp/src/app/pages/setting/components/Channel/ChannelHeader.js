import React, { useState } from 'react';
import { Space, Button, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    PlusOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {fetchChannel} from '../../../../store/slice/settingSlice';
import { addNewChannel } from '../../../../api/setting';
import { getUserData } from '../../../../store/slice/authSlice';
import { Messages } from '../../../../utils/AppMessage';
import { openNotification } from '../../../../components/OpenNotification';
import { CSSConstants } from '../../../../constants/CSSConstants';
import ChannelModal from "./ChannelModal";

const ChannelHeader = ({
                               selectedDeleteProjectRole,
                               onDeleteAll,
                               onActiveAll,
                               activeAllVisible,
                               clearRowSelection,
                           }) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const onAddNew = () => {
        setVisible(true);
        clearRowSelection();
    };

    const onSave = async (values) => {
        const newChannel = {
            name: "",
           
        };
        Object.assign(newChannel, values);
        const response = await addNewChannel(newChannel);
        if (response) {
            await dispatch(fetchChannel());
            setVisible(false);
            openNotification(
                Messages.SUCCESS,
                Messages.addSuccessMessage('Channel'),
                ''
            );
        } else {
            openNotification(
                Messages.ERROR,
                Messages.addUnsuccessMessage('Channel'),
                ''
            );
        }
    };

    return (
        <Space direction="horizontal">
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddNew}
                size="small"
                style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
            >
                Add New
            </Button>
            {selectedDeleteProjectRole.length > 0 ? (
                <div>
                    <Popconfirm
                        title={Messages.DELETE_CONFIRM}
                        onConfirm={onDeleteAll}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            type="primary"
                            danger
                            style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                    &nbsp;&nbsp;
                    {activeAllVisible ? (
                        <Popconfirm
                            title={Messages.ACTIVE_CONFIRM}
                            onConfirm={onActiveAll}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                size="small"
                                type="primary"
                                style={{
                                    backgroundColor: CSSConstants.COLOR_GREEN,
                                    borderColor: CSSConstants.COLOR_GREEN,
                                    width: CSSConstants.BUTTON_WIDTH * 1.2,
                                }}
                                icon={<CheckCircleOutlined />}
                            >
                                Activate
                            </Button>
                        </Popconfirm>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                ''
            )}
            <ChannelModal
                title="ADD NEW CHANNEL"
                visible={visible}
                onSave={onSave}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </Space>
    );
};

export default ChannelHeader;
