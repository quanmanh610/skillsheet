import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './RequestManagement.css';
import {
  Col,
  Row,
  Button,
  Table,
  Typography, Popconfirm, Anchor
} from 'antd';
import RequestManagementHeader from './RequestManagementHeader';
import RequestManagementComment from './RequestManagementComment';
import { isLoadingStatus } from '../../store/slice/animationSlice';
import { fecthRequestManagementList, getRequestManagementFromStore, getTotalApproveRequestElements } from '../../store/slice/requestMangementSlice';
import Loading from '../../components/Loading';
import { Messages } from '../../utils/AppMessage';
import { openNotification } from '../../components/OpenNotification';
import { CSSConstants } from '../../constants/CSSConstants';
import { HttpStatus } from '../../constants/HttpStatus';
import { Config } from '../../constants/AppConfiguration';
import { getUserData } from '../../store/slice/authSlice';
import { dateFormat } from '../../constants/DateTimes';
import moment from 'moment'
import { updateRequest, approveMultiProfiles } from '../../api/requestmanagement';
import { getProfileByVersion } from '../../api/profile';
import { deleteMultiProfiles } from '../../api/version';
import { useSpring, animated } from 'react-spring';
import { fecthProfileVersionList } from "../../../app/store/slice/versionSlice";
import { updateStoreProfile } from "../../../app/store/slice/profileSlice";
import { getActivityKey, isAuthorizedUser } from '../../utils/PoaUtil';
import { UrlConstants } from '../../constants/Constants';
import { Redirect } from 'react-router-dom';
import './../../styles.css';
import { ActivityKeyConstants } from '../../constants/ActivityKeyConstants';

const { Text, Link } = Typography;

const RequestManagement = (props) => {

  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOf3MonthsBefore = moment(firstDayOfMonth).subtract(3, 'months');
  const today = date;

  const user = useSelector(getUserData);

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

  // const [searchGroup, setSearchGroup] = useState('');
  // const [searchDu, setSearchDu] = useState('');

  const initPagiState = {
    page: 1,
    size: 20,
    column: "requestApprovalId",
    sort: Config.ASCENDING_SORT,
    fullName: "",
    roleName: "",
    status: "Submitted",
    from: moment(firstDayOf3MonthsBefore).format("MM/DD/yyyy") + " 00:00:00",
    to: moment(today).format("MM/DD/yyyy") + " 23:59:59",
    // group: searchGroup,
    // du: searchDu,
    group: '',
    du: '',
    picEmail: user.email
  };

  const dispatch = useDispatch();

  const dataSource = useSelector(getRequestManagementFromStore);
  const tlements = useSelector(getTotalApproveRequestElements);

  const isLoading = useSelector(isLoadingStatus);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [preserveSelectedRowKeys, setPreserveSelectedRowKeys] = useState([]);
  const [totalElements, setTotalElements] = useState(1);
  const [pagiState, setPagiState] = useState(initPagiState);
  const [pagination, setPagination] = useState(initPagination);
  const [sortedInfo, setSortedInfo] = useState({});
  // const isPageAuthorized = isAuthorizedUser(user, UrlConstants.REQUEST_PATH);
  const [visibelModal, setVisibleModal] = useState(false);
  useEffect(() => {
    // if (!isPageAuthorized) {
    //   return;
    // }

    setTotalElements(tlements ? tlements : 0)
  }, [tlements]);

  useEffect(() => {
    // let group = searchGroup;
    // let du = searchDu;
    // if (user) {
    //   const keys = [
    //     ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO,
    //     ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL,
    //     ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO,
    //     ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL,
    //   ]
    //   const activityKey = getActivityKey(keys);
    //   if (activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO ||
    //     activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL) {
    //     setSearchGroup(user.group);
    //     group = user.group;
    //   } else if (activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO ||
    //     activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL) {
    //     setSearchDu(user.du);
    //     du = user.du;
    //   }
    // } else {
    //   return;
    // }

    async function fetchRequestManagementData() {
      await dispatch(fecthRequestManagementList({
        ...initPagiState,
        // group: group,
        // du: du
        group: '',
        du: '',
        picEmail: user.email
      }));
    }
    fetchRequestManagementData();
  }, []);

  // if (!isPageAuthorized) {
  //   return <Redirect to={UrlConstants.UNAUTHORIZED_PATH} />
  // }

  const approveAll = async () => {
    const resp = await approveMultiProfiles([...selectedRowKeys]);
    if (resp.status === HttpStatus.OK) {
      openNotification(Messages.SUCCESS, "All The requests have been approved successfully", "")
      dispatch(fecthRequestManagementList({ ...initPagiState }));
      setSelectedRowKeys([]);
    }
  }

  const onViewDetail = async (record) => {
    const pro = await getProfileByVersion(record.version);
    await dispatch(updateStoreProfile(pro.data));
    props.history.push("/profile?pid=" + pro.data.profileId)
  };

  const onApprove = async (record) => {
    record = {
      ...record, status: "Approved"
    }
    const pro = await updateRequest(record);
    openNotification(Messages.SUCCESS, "Request has been approved successfully", "")
    dispatch(fecthRequestManagementList({ 
      ...initPagiState,
      // group: searchGroup,
      // du: searchDu
      group: '',
      du: '',
      picEmail: user.email
    }));
  };

  const onReject = async (record) => {
    record = {
      ...record, status: "Rejected"
    }
    const pro = await updateRequest(record);
    openNotification(Messages.SUCCESS, "Request has been rejected successfully", "")
    dispatch(fecthRequestManagementList({ 
      ...initPagiState,
      // group: searchGroup,
      // du: searchDu
      group: '',
      du: '',
      picEmail: user.email
    }));
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (p1, p2) => {
        const v1 = p1.fullName ? p1.fullName : '';
        const v2 = p2.fullName ? p2.fullName : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'fullName' && sortedInfo.order,
      width: "20%",
      render: (text, record) => {
        return (

          <Link
            type="link"
            onClick={() => onViewDetail(record)}
          // value={record.fullName}
          >{record.fullName} ({record.userName})
          </Link>
        );

      }

    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (p1, p2) => {
        const v1 = p1.email ? p1.email : '';
        const v2 = p2.email ? p2.email : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      width: "15%",
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      sorter: (p1, p2) => {
        const v1 = p1.roleName ? p1.roleName : '';
        const v2 = p2.roleName ? p2.roleName : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'roleName' && sortedInfo.order,
      width: "10%",
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      sorter: (p1, p2) => {
        const v1 = p1.group ? p1.group : '';
        const v2 = p2.group ? p2.group : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'group' && sortedInfo.order,
      width: "5%",
    },
    {
      title: 'Du',
      dataIndex: 'du',
      key: 'du',
      width: "5%",
      sorter: (p1, p2) => {
        const v1 = p1.du ? p1.du : '';
        const v2 = p2.du ? p2.du : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'du' && sortedInfo.order,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: "10%",
      sorter: (p1, p2) => {
        const v1 = p1.status ? p1.status : '';
        const v2 = p2.status ? p2.status : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: "15%",
      sorter: (p1, p2) => {
        const v1 = p1.submittedDate ? p1.submittedDate : '';
        const v2 = p2.submittedDate ? p2.submittedDate : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'submittedDate' && sortedInfo.order,
      render: (text, record) => {
        return <div>
          {moment(record.submittedDate).format("DD/MM/yyyy hh:mm:ss")}
        </div>
      },
    },
    {
      title: '',
      width: "20%",
      render: (text, record) => {
        return (
          <div id={record.requestApprovalId} style={{ display: "flex", justifyContent: "space-between" }}>
            {record.status === "Submitted" ? (
              <div>
                <Button
                  size="small"
                  type="link"
                  style={{
                    textAlign: "center",
                    width: CSSConstants.BUTTON_WIDTH * 1.1
                  }}
                  onClick={() => onApprove(record)}
                  icon={<CheckOutlined />}
                >
                  Approve
            </Button>
                <Button
                  className="margin-left-10"
                  size="small"
                  type="link"
                  danger
                  style={{
                    textAlign: "center",
                    width: CSSConstants.BUTTON_WIDTH * 1.1
                  }}
                  onClick={() => setVisibleModal(true)}
                  icon={<CloseCircleOutlined />}
                >
                  Reject
          </Button>
                <RequestManagementComment
                  visible={visibelModal}
                  onReject={onReject}
                  onCancel={() => setVisibleModal(false)}
                  data={record}
                />
              </div>
            ) : (<div></div>)}

          </div>
        )
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
    getCheckboxProps: (record) => ({
      disabled: record.status !== 'Submitted'
    })
  };

  const updateParent = (data) => {
    setPagiState({ ...pagiState, fullName: data.fullName, roleName: data.roleName, status: data.status, from: data.from, to: data.to });
  }
  const onSearch = () => {
    setPagination({ ...pagination, current: 1 });
    dispatch(fecthRequestManagementList({
      ...pagiState,
      group: '',
      du: '',
      page: 1
    }));
    setSelectedRowKeys([]);
  }

  const onReset = () => {
    setPagination({ ...pagination, current: 1 });
    setPagiState({ ...pagiState, page: 1, fullName: "", roleName: "", status: "Submitted", from: moment(firstDayOf3MonthsBefore).format("MM/DD/yyyy") + " 00:00:00", to: moment(today).format("MM/DD/yyyy") + " 23:59:59" });
    dispatch(fecthRequestManagementList({ ...initPagiState }));
    setSortedInfo({});
    setSelectedRowKeys([]);
  }

  const handleTableChange = (paginationParams, filters, sorter) => {
    const shouldReload = (paginationParams.current !== pagination.current) || (paginationParams.pageSize !== pagination.pageSize);

    setPagination({ ...pagination, current: paginationParams.current, defaultPageSize: paginationParams.pageSize });

    if (shouldReload) {
      dispatch(fecthRequestManagementList({
        ...pagiState,
        group: '',
        du: '',
        column: sorter.column ? sorter.column.key : "requestApprovalId",
        page: paginationParams.current,
        size: paginationParams.pageSize,
        sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "ASC",
        staffEmail: user.email
      }));
    }

    setSortedInfo(sorter);

    setPagiState({
      ...pagiState,
      column: sorter.column ? sorter.column.key : "requestApprovalId",
      page: paginationParams.current,
      size: paginationParams.pageSize,
      sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "ASC",
    });
  };

  return (
    <animated.div style={propsAnimation} className="requestManagement-area support-for-sticky-header">
      <Row>
        <Col span={24}>
          <div className="border-bottom-solid">
            <h1>List of Requests</h1>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <RequestManagementHeader
            updateParent={updateParent}
            search={onSearch}
            onReset={onReset}
            // searchGroup={searchGroup}
            // searchDu={searchDu}
          />
          <br></br>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {isLoading ? (
            <Loading />
          ) : (<div>
            <Table
              rowKey={(record) => record.requestApprovalId}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                total: totalElements,
                current: pagination.current,
                defaultPageSize: pagination.defaultPageSize,
                showSizeChanger: true,
                size: "small",
                showTotal: (total, range) =>
                (<Row>
                  <Text className="selected-account">
                    {selectedRowKeys.length > 0 ?
                      <div>
                        {selectedRowKeys.length} {selectedRowKeys.length > 1 ? "versions" : "version"} selected
                <Popconfirm
                          title="Do you want to approve all?"
                          onConfirm={approveAll}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="link">
                            Approve All
                 </Button>
                        </Popconfirm>
                      </div>
                      : ""}
                  </Text>
                  <div> {total <= 1
                    ? `${range[0]} - ${range[1]} of ${total} account`
                    : `${range[0]} - ${range[1]} of ${total} accounts`}</div>
                </Row>)
              }}
              // scroll={{ y: 460 }}
              size='small'
              onChange={handleTableChange}
            />
          </div>)}
        </Col>
      </Row>
    </animated.div>
  );
};

export default RequestManagement;
