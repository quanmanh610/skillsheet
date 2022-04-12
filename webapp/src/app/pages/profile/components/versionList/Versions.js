import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoreOutlined, UserOutlined, CheckOutlined, LockFilled } from '@ant-design/icons';
import './Versions.css';
import {
  Col,
  Row,
  Button,
  Space,
  Table,
  Typography,
  Menu,
  Dropdown, Tag, Tooltip, Popconfirm, message
} from 'antd';
import VersionsHeader from './VersionsHeader';
import {
  fecthProfileVersionList,
  getVersionsFromStore,
  getTotalVersionElements,
} from '../../../../store/slice/versionSlice';
import { isLoadingStatus } from '../../../../store/slice/animationSlice';
import Loading from '../../../../components/Loading';
import { Messages } from '../../../../utils/AppMessage';
import { fecthProfileByVersion, updateStoreProfile } from "../../../../store/slice/profileSlice";
import { openNotification } from '../../../../components/OpenNotification';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { HttpStatus } from '../../../../constants/HttpStatus';
import { Config } from '../../../../constants/AppConfiguration';
import { getUserData } from '../../../../store/slice/authSlice';
import { dateFormat } from '../../../../constants/DateTimes';
import moment from 'moment'
import { cloneNewVersion, setMainVersion, deleteProfileVersion, downloadProfile } from '../../../../api/profile';
import { getListVersionIdOfStaff, deleteMultiProfiles } from '../../../../api/version';
import { convertDataURIToBinary, convertToByteArray, downloadFile } from '../../../../utils/ConvertDataBinary';
import DeleteConfirm from '../../../../components/DeleteConfirm';
import { useSpring, animated } from 'react-spring'
import './../../../../styles.css'

const { Text } = Typography;

const Versions = (props) => {

  const propsAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const initPagination = {
    total: 1,
    current: 1,
    defaultPageSize: 20,
  }

  const initPagiState = {
    page: 1,
    size: 20,
    column: "versionId",
    sort: Config.ASCENDING_SORT,
    versionName: "",
    versionType: "",
  };

  const dispatch = useDispatch();


  const user = useSelector(getUserData);
  const dataSource = useSelector(getVersionsFromStore);

  const tlements = useSelector(getTotalVersionElements);

  const isLoading = useSelector(isLoadingStatus);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [preserveSelectedRowKeys, setPreserveSelectedRowKeys] = useState([]);
  const [totalElements, setTotalElements] = useState(1);
  const [pagiState, setPagiState] = useState(initPagiState);
  const [pagination, setPagination] = useState(initPagination);
  const [sortedInfo, setSortedInfo] = useState({});

  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const [deleteProfile, setDeleteProfile] = useState(null);

  useEffect(() => {
    setTotalElements(tlements ? tlements : 0)
  }, [tlements]);

  useEffect(() => {
    async function fetchVersionsData() {
      await dispatch(fecthProfileVersionList({ ...initPagiState, staffEmail: user.email }));
    }
    fetchVersionsData();
  }, []);

  const deleteAll = async () => {
    const resp = await deleteMultiProfiles([...selectedRowKeys]);
    if (resp.status === HttpStatus.OK) {
      openNotification(Messages.SUCCESS, "Versions has been deleted successfully", "")
      dispatch(fecthProfileVersionList({
        ...pagiState,
        page: 1,
        staffEmail: user.email
      }));
      setSelectedRowKeys([]);
    }
  }

  const key = 'updatable';
  const openMessage = () => {
    message.loading({ content: 'Profile is dowloading...', key, duration: 0, });
  };

  const closenMessage = () => {
    message.success({ content: 'Profile is dowloaded!', key, duration: 2 });
  };

  const onDownloadProfile = async (e) => {
    const profileId = e.item.props.profile.profileId;
    openMessage();
    const resp = await downloadProfile(profileId);
    if (resp.status === HttpStatus.OK) {
      if (!resp.data.errorMessage) {
        const blob = new Blob([...convertToByteArray(atob(resp.data.file))], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        downloadFile(blob, user.fullName + "(" + e.item.props.profile.version.versionName + ")" + ".docx");
        closenMessage();
      } else {
        closenMessage();
        openNotification(Messages.ERROR, resp.data.errorMessage, "");
      }
    }
  }

  const onCloneNewVersion = async (e) => {
    const profile = e.item.props.profile;
    const resp = await cloneNewVersion(typeof profile.avatar === "string" ? { ...profile, avatar: convertDataURIToBinary("data:image/jpeg;base64," + profile.avatar) } : profile);
    if (resp.status === HttpStatus.OK) {
      openNotification(Messages.SUCCESS, "New Version has been cloned successfully", "")
      dispatch(fecthProfileVersionList({
        ...pagiState,
        page: 1,
        staffEmail: user.email
      }));
    }
  }

  const onSetMainVersion = async (e) => {
    const profile = e.item.props.profile;
    const resp = await setMainVersion({ 
      profileId: profile.profileId, 
      group: user.group, 
      du: user.du, 
      fullName: user.fullName ,
      userName: user.userName
    });

    if (resp) {
      if (resp.status === HttpStatus.OK) {
        openNotification(Messages.SUCCESS, "Set main version successfully", "");
        dispatch(fecthProfileVersionList({
          ...pagiState,
          page: 1,
          staffEmail: user.email,          
        }));
      }
    } else {
      console.log(resp);
    }
  };

  const onDelete = (e) => {
    setDeleteProfile(e.item.props.profile, "Delete profile version");
    setDeleteConfirmVisible(true);
  };

  const onCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setDeleteProfile({});
  };

  const onConfirmDelete = async () => {
    const profile = deleteProfile;
    const resp = await deleteProfileVersion(profile.version);
    if (resp && resp.status === HttpStatus.OK) {
      openNotification(Messages.SUCCESS, "Profile version has been deleted successfully", "");
      dispatch(fecthProfileVersionList({
        ...pagiState,
        page: 1,
        staffEmail: user.email
      }));
      setDeleteConfirmVisible(false);
    }
  };

  const onViewDetail = async (record) => {
    //await dispatch(fecthProfileByVersion(record));
    await dispatch(updateStoreProfile(record.profile));
    props.history.push("/profile")
  };

  const columns = [
    {
      title: 'Version Name',
      dataIndex: 'versionName',
      key: 'versionName',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'versionName' && sortedInfo.order,
      width: "35%",
      render: (text, record) => {
        return <div id={record.versionId}>
          {record.email === user.email ? (
            <Tooltip placement="right" title={record.versionName}>
              <Button
                size="small"
                type="link"
                onClick={() => onViewDetail(record)}
                icon={<UserOutlined />}
              >
                {record.versionName.length > 40 ? record.versionName.substring(0, 40) + " ..." : record.versionName}
              </Button>
            </Tooltip>
          ) : (
              <Tooltip placement="right" title={record.versionName}>
                <Button
                  size="small"
                  type="link"
                  onClick={() => onViewDetail(record)}
                  icon={<LockFilled />}
                >
                  {record.versionName.length > 40 ? record.versionName.substring(0, 40) + " ..." : record.versionName}
                </Button>
              </Tooltip>)}
        </div>
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
      width: "15%",
      render: (text, record) => {
        return <div id={record.versionId}>
          {record.createdDate ? moment(record.createdDate).format(dateFormat) : ""}
        </div>
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'updatedDate' && sortedInfo.order,
      width: "15%",
      render: (text, record) => {
        return <div id={record.versionId}>
          {record.updatedDate ? moment(record.updatedDate).format(dateFormat) : ""}
        </div>
      },
    },
    {
      title: 'Version Type',
      dataIndex: 'versionType',
      key: 'versionType',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'versionType' && sortedInfo.order,
      width: "15%",
      render: (text, record) => {
        return <div id={record.versionId}>
          {record.versionType === 'Main' ? (
            <Tag
              size="small"
              type="link"
              style={{
                backgroundColor: "#52c41a",
                textAlign: "center",
                minWidth: CSSConstants.BUTTON_WIDTH * 1.2
              }}
              onClick={() => onViewDetail(record)}
              icon={<CheckOutlined />}
            >
              {record.versionType}
            </Tag>
          ) : (<Tag
            size="small"
            type="link"
            style={{
              backgroundColor: "#f0f0f0", color: "black",
              textAlign: "center",
              minWidth: CSSConstants.BUTTON_WIDTH * 1.2
            }}
            onClick={() => onViewDetail(record)}
          >
            {record.versionType}
          </Tag>)}
        </div>
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
      width: "15%",
      render: (text, record) => {
        return <div id={record.versionId}>
          {record.profile?.status}
        </div>
      },
    },
    {
      title: 'More',
      width: "5%",
      render: (record) => {
        return (
          <Dropdown overlay={menu(record)} trigger={['click']}>
            <Tooltip placement="left" title="More">
              <Button type="dashed" size="small">
                <MoreOutlined />
              </Button>
            </Tooltip>
          </Dropdown>
        );
      },
    },
  ];

  const onSelectChange = async (selectedRowKeys, preserveSelectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys,
    onChange: onSelectChange,
    // selections: [
    //   {
    //     key: 'select',
    //     text: 'Select AllPages',
    //     onSelect: async (changableRowKeys) => {
    //       const versionIdList = await getListVersionIdOfStaff({ versionName: pagiState.versionName, versionType: pagiState.versionType, staffEmail: user.email });
    //       setSelectedRowKeys(versionIdList.data || []);
    //     },
    //   },
    //   {
    //     key: 'deselect',
    //     text: 'Deselect AllPages',
    //     onSelect: (changableRowKeys) => {
    //       setSelectedRowKeys([]);
    //     },
    //   },
    // ],
    getCheckboxProps: record => ({
      disabled: record.profile.email !== user.email,
      name: record.profile.email,
    }),
  };

  const menu = (record) => {
    return (
      <Menu>
        <Menu.Item key="4" profile={record.profile} onClick={() => onViewDetail(record)}>
          <Text>View Details</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="0" profile={record.profile} onClick={onDownloadProfile}>
          <Text>Download</Text>
        </Menu.Item>
        <Menu.Item key="1" profile={record.profile} onClick={onCloneNewVersion} disabled={record.email !== user.email}>
          <Text>Clone New Version</Text>
        </Menu.Item>
        <Menu.Item key="2" profile={record.profile} onClick={onSetMainVersion} disabled={record.email !== user.email || record.versionType.toUpperCase() === "MAIN"}>
          <Text>Set as Main Version</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" profile={record.profile} onClick={onDelete} disabled={record.email !== user.email || totalElements === 1}>
          <Text>Delete</Text>
        </Menu.Item>
      </Menu>
    )
  };
  const updateParent = (data) => {
    setPagiState({ ...pagiState, versionName: data.versionName, versionType: data.versionType });
  }
  const onSearch = () => {
    setPagination({ ...pagination, current: 1 });
    dispatch(fecthProfileVersionList({
      ...pagiState,
      page: 1,
      staffEmail: user.email
    }));
    setSelectedRowKeys([]);
  }

  const onReset = () => {
    setPagination({ ...pagination, current: 1 });
    setPagiState({ ...pagiState, page: 1, versionName: "", versionType: "" });
    dispatch(fecthProfileVersionList({ ...initPagiState, staffEmail: user.email }));
    setSortedInfo({});
    setSelectedRowKeys([]);
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({ ...pagination, current: pagination.current, defaultPageSize: pagination.pageSize });
    dispatch(fecthProfileVersionList({
      ...pagiState,
      column: sorter.column ? sorter.column.key : "versionId",
      page: pagination.current,
      size: pagination.pageSize,
      sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "ASC",
      staffEmail: user.email
    }));

    setSortedInfo(sorter);

    setPagiState({
      ...pagiState,
      column: sorter.column ? sorter.column.key : "versionId",
      page: pagination.current,
      size: pagination.pageSize,
      sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "ASC",
    });
  };

  return (
    <animated.div style={propsAnimation} className="version-area support-for-sticky-header">
      <Row>
        <Col span={24}>
          <div className="border-bottom-solid">
            <h1>List of Versions</h1>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <VersionsHeader updateParent={updateParent} search={onSearch} onReset={onReset} />
          <br></br>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {isLoading ? (
            <Loading />
          ) : (<div>
            <Table
              // onRow={(record, rowIndex) => {
              //   return {
              //     onClick: event => {
              //       onViewDetail(record, rowIndex);
              //     },

              //   };
              // }}
              // onHeaderRow={column => {
              //   return {
              //     onClick: () => { }, // click header row
              //   };
              // }}
              rowKey={(record) => record.versionId}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                total: totalElements,
                current: pagination.current,
                defaultPageSize: pagination.defaultPageSize,
                showSizeChanger: true,
                size: "small",
                showTotal: (total, range) => (
                  <Row>
                    <Text className="selected-account">
                      {selectedRowKeys.length > 0 && selectedRowKeys.length < totalElements ?
                        <div>
                          {selectedRowKeys.length} {selectedRowKeys.length > 1 ? "versions" : "version"} selected
                          <Popconfirm
                            title={Messages.DELETE_CONFIRM}
                            onConfirm={deleteAll}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button type="link">
                                Delete All
                              </Button>
                          </Popconfirm>
                        </div>
                        : ""}
                    </Text>
                    <div>
                      { total == 0 ? "" : 
                        <div>
                          {total <= 1
                            ? `${range[0]} - ${range[1]} of ${total} version`
                            : `${range[0]} - ${range[1]} of ${total} versions`}
                        </div>}
                    </div>
                  </Row>
                )
              }}
              scroll={{ y: 460 }}
              size='small'
              onChange={handleTableChange}
            />
          </div>)}
        </Col>
      </Row>
      <DeleteConfirm
        visible={deleteConfirmVisible}
        onDelete={onConfirmDelete}
        onCancel={onCancelDelete}
        confirmLoading={isLoading}
        title="Delete profile version"
      ></DeleteConfirm>
    </animated.div>
  );
};

export default Versions;
