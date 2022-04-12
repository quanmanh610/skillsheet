import React, {useEffect, useImperativeHandle, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchChannel,
    fetchProjectRoles, getChannelInStore,
    getProjectRolesBKInStore,
    getProjectRolesInStore, sortProjectRoles
} from "../../../../store/slice/settingSlice";
import {isLoadingStatus} from "../../../../store/slice/animationSlice";
import {filterFormat} from "../../../../utils/filterFormat";
import {SettingItemStatus} from "../../../../constants/SettingItemStatus";
import {activeAllProjectrole, checkRole, deleteChannel, deleteProjectrole} from "../../../../api/setting";
import {HttpStatus} from "../../../../constants/HttpStatus";
import {openNotification} from "../../../../components/OpenNotification";
import {Messages} from "../../../../utils/AppMessage";
import {Button, Col, Row, Table} from "antd";
import ProjectRoleActions from "../ProjectRoles/ProjectRoleActions";
import Loading from "../../../../components/Loading";
import RoleDeleteConfirmModal from "../ProjectRoles/RoleDeleteConfirmModal";
import ChannelHeader from "./ChannelHeader";
import ChannelDeleteConfirmModal from "./ChannelDeleteConfirmModal";
import ChannelAction from "./ChannelAction";

const Channel = React.forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const dataSource = useSelector(getChannelInStore);
    const [selectedDeleteChannel, setSelectedDeleteChannel] = useState(
        []
    );
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const isLoading = useSelector(isLoadingStatus);
    const [deleteConfirmVisible, setdeleteConfirmVisible] = useState(false);
    const [channel, setChannel] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await dispatch(fetchChannel());
        }
        fetchData();
    }, []);

    const clearRowSelection = () => {
        setSelectedRowKeys([]);
    };
    useImperativeHandle(ref, () => ({
        clearRowSelectionWhenOut() {
            setSelectedRowKeys([]);
        },
    }));
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedDeleteChannel(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const onDeleteAll = async () => {
        const body = {
            idSelectedLst: [...selectedRowKeys],
        };
        const count = checkRole(body);
        count.then(async function(result) {
            if(result.data > 0) {
                setdeleteConfirmVisible(true);
                setChannel(body);
            } else {
                const response = await deleteChannel(body);
                if (response.status === HttpStatus.OK) {
                    setSelectedRowKeys([]);
                    await dispatch(fetchChannel());
                    openNotification(
                        Messages.SUCCESS,
                        Messages.deleteSuccessMessage('Channel'),
                        ''
                    );
                } else {
                    openNotification(
                        Messages.ERROR,
                        Messages.deleteUnsuccessMessage('Channel'),
                        ''
                    );
                }
            }
        });

    };

    const columns = [
        {
            title: 'IDs',
            dataIndex: 'id',
            key: 'id',
            onFilter: (value, record) => record.id === value,
            sorter: (r1, r2) => {
                const v1 = r1.id ? r1.id : '';
                const v2 = r2.id ? r2.id : '';
                return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
            },
        },
        {
            title: 'Channel',
            dataIndex: 'name',
            key: 'name',
            onFilter: (value, record) => record.name === value,
            sorter: (r1, r2) => {
                const v1 = r1.name ? r1.name.trim() : '';
                const v2 = r2.name ? r2.name.trim() : '';
                return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
            },
        },
        {
            title: 'Created By',
            dataIndex: 'createBy',
            key: 'createBy',
            onFilter: (value, record) => record.createBy === value,
            sorter: (r1, r2) => {
                const v1 = r1.createBy ? r1.createBy.trim() : '';
                const v2 = r2.createBy ? r2.createBy.trim() : '';
                return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
            },
        },
        {
            title: '',
            key: 'action',
            width: 200,
            render: (record) => {
                const onDelete = async () => {
                    clearRowSelection();
                    let id = {
                        channelId : record.id
                    };
                    const resp = await deleteChannel(id);
                    if (resp) {
                        await dispatch(fetchChannel());
                        openNotification(Messages.SUCCESS, Messages.DELETE_CHANNEL_SUCCESS, '');
                    } else {
                        openNotification(Messages.ERROR, Messages.DELETE_CHANNEL_UNSUCCESS, '');
                    }
                };
                return (
                    <ChannelAction
                        key={record.id}
                        record={record}
                        clearRowSelection={clearRowSelection}
                        onDelete={onDelete}
                    />
                );
            },
        },
    ];


    return (
        <div>
            <Row>
                <Col span={24}>
                    <ChannelHeader
                        selectedDeleteProjectRole={selectedRowKeys}
                        onDeleteAll={onDeleteAll}
                        clearRowSelection={clearRowSelection}
                    />
                </Col>
            </Row>
            <br />
            <Row>
                <Col span={24}>
                    {isLoading && dataSource ? (
                        <Loading />
                    ) : (
                        <Table
                            rowKey={(record) => record.channelId}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={dataSource.channellList}
                            pagination={{
                                showSizeChanger: true,
                                defaultPageSize: 20,
                                size: "small",
                            }}
                            scroll={{ y: 240 }}
                            size='small'
                            rowClassName={(record, index) => (record.status === SettingItemStatus.NEW ? 'highlight' : '')}
                        />
                    )}
                </Col>
            </Row>
            <ChannelDeleteConfirmModal
                visible={deleteConfirmVisible}
                data={channel}
                onCancel={() => {setdeleteConfirmVisible(false)}}
                onDone={() => {
                    setdeleteConfirmVisible(false);
                }}
            />
        </div>
    );
});

export default Channel;