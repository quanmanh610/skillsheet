import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MoreOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  TwitterOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import './Candidate.css';
import {
  Col,
  Row,
  Button,
  Table,
  Typography,
  Menu,
  Dropdown,
  Tag,
  Tooltip,
  Popconfirm,
} from 'antd';
import CandidateHeader from './CandidateHeader';
import CandidateModal from './CandidateModal';
import CandidateErrorPopup from './CandidateErrorPopup';
import {
  fetchCandidates,
  getCandidatesInStore,
  getTotalElements,
  deleteCandidate as deleteCandidateInStore,
} from '../../store/slice/candidateSlice';
import { fetchProjectRoles } from '../../store/slice/settingSlice';
import { isLoadingStatus } from '../../store/slice/animationSlice';
import Loading from '../../components/Loading';
import { Messages } from '../../utils/AppMessage';
import {
  resendRequest,
  activeCandidate,
  deactiveCandidate,
  deleteCandidate,
  updateCandidate,
  getListCandidateId,
  addNewCandidate,
  findCandidateByEmailAndRole,
  findCandidateByEmail,
} from '../../api/candidate';
import { openNotification } from '../../components/OpenNotification';
import { CSSConstants } from '../../constants/CSSConstants';
import { HttpStatus } from '../../constants/HttpStatus';
import { Config } from '../../constants/AppConfiguration';
import { getUserData } from '../../store/slice/authSlice';
import { useSpring, animated } from 'react-spring';
import { UrlConstants } from '../../constants/Constants';
import { Link, Redirect } from 'react-router-dom';
import './../../styles.css';
import DownloadProfileModal from '../home/DownloadProfileModal';
import {
  getProfileByCandidateEmail,
  //getProfileByCandidateId,
} from '../../api/profile';

const { Text } = Typography;

const Candidates = () => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  const initPagination = {
    total: 1,
    current: 1,
    defaultPageSize: 20,
  };

  const initPagiState = {
    page: 1,
    size: 20,
    column: 'candidateId',
    sort: Config.ASCENDING_SORT,
    fullName: '',
    roleName: '',
    status: 'new,active,inactive',
  };
  const dispatch = useDispatch();

  const user = useSelector(getUserData);

  const dataSource = useSelector(getCandidatesInStore);
  const tlements = useSelector(getTotalElements);
  const isLoading = useSelector(isLoadingStatus);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [preserveSelectedRowKeys, setPreserveSelectedRowKeys] = useState([]);
  const [totalElements, setTotalElements] = useState(1);
  const [pagiState, setPagiState] = useState(initPagiState);
  const [pagination, setPagination] = useState(initPagination);
  const [sortedInfo, setSortedInfo] = useState({});
  //const isPageAuthorized = isAuthorizedUser(user, UrlConstants.CANDIDATE_PATH);

  const [notiPopupVisible, setNotiPopupVisible] = useState(false);
  const [resendPopupVisible, setResendPopupVisible] = useState(false);
  const [tmpCandidate, setTmpCandidate] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(0);
  const [selectedProfileFullName, setSelectedProfileFullName] = useState('');

  useEffect(() => {
    // if (!isPageAuthorized) {
    //   return;
    // }

    setTotalElements(tlements ? tlements : 0);
  }, [tlements]);

  useEffect(() => {
    // if (!isPageAuthorized) {
    //   return;
    // }
    async function fetchProjectRolesData() {
      await dispatch(fetchProjectRoles());
    }
    fetchProjectRolesData();
    fetchCandidatesData();
  }, []);

  async function fetchCandidatesData() {
    await dispatch(fetchCandidates(initPagiState));
  }

  // if (!isPageAuthorized) {
  //   return <Redirect to={UrlConstants.UNAUTHORIZED_PATH} />;
  // }

  const onResendRequest = async (e) => {
    const form = new FormData();
    const body = {
      idSelectedLst: [e.item.props.candidate.candidateId],
    };
    form.append('idSelectedLst', JSON.stringify(body));
    const resp = await resendRequest(body);
    if (!resp.errorMessage) {
      openNotification(Messages.SUCCESS, Messages.RESEND_REQUEST_SUCCESS, '');
      dispatch(fetchCandidates(pagiState));
    }
  };

  const onActivate = async (e) => {
    const form = new FormData();
    const body = {
      idSelectedLst: [e.item.props.candidate.candidateId],
    };
    form.append('idSelectedLst', JSON.stringify(body));
    const resp = await activeCandidate(body);
    if (!resp.errorMessage) {
      openNotification(Messages.SUCCESS, Messages.ACTIVE_CANDIATE_SUCCESS, '');
      dispatch(fetchCandidates(pagiState));
    } else {
      openNotification(Messages.ERROR, Messages.ACTIVE_CANDIATE_UNSUCCESS, '');
    }
  };

  const onDeactivate = async (e) => {
    const form = new FormData();
    const body = {
      idSelectedLst: [e.item.props.candidate.candidateId],
    };
    form.append('idSelectedLst', JSON.stringify(body));
    const resp = await deactiveCandidate(body);
    if (!resp.errorMessage) {
      openNotification(
        Messages.SUCCESS,
        Messages.DEACTIVE_CANDIATE_SUCCESS,
        ''
      );
      dispatch(fetchCandidates(pagiState));
    } else {
      openNotification(
        Messages.ERROR,
        Messages.DEACTIVE_CANDIATE_UNSUCCESS,
        ''
      );
    }
  };

  // const onDelete = async (e) => {
  //   const form = new FormData();
  //   const body = {
  //     idSelectedLst: [e.item.props.candidate.candidateId],
  //   };
  //   form.append('idSelectedLst', JSON.stringify(body));
  //   const resp = await deleteCandidate(body);
  //   if (!resp.errorMessage) {
  //     openNotification(Messages.SUCCESS, Messages.DELETE_CANDIATE_SUCCESS, '');
  //     dispatch(deleteCandidateInStore(e.item.props.candidate.candidateId));
  //   } else {
  //     openNotification(Messages.ERROR, Messages.DELETE_CANDIATE_UNSUCCESS, '');
  //   }
  // };

  const resendAll = async () => {
    const form = new FormData();
    const body = {
      idSelectedLst: [...selectedRowKeys],
    };
    form.append('idSelectedLst', JSON.stringify(body));
    const resp = await resendRequest(body);
    if (!resp.errorMessage) {
      setSelectedRowKeys([]);
      openNotification(Messages.SUCCESS, Messages.RESEND_REQUEST_SUCCESS, '');
      dispatch(fetchCandidates(pagiState));
    }
  };

  const onCopyLink = (e) => {
    const candidate = e.item.props.candidate;
    const link =
      window.location.origin +
      '/profile?ce=' +
      window.btoa(candidate.email);
    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    openNotification(
      Messages.SUCCESS,
      Messages.LINK_CANDIDATE_COPY_SUCCESS,
      ''
    );
  };
  const handleClickMenu = (e) => { };
  const onDowload = async (e) => {
    const candidateEmail = e.item.props.candidate.email;
    const response = await getProfileByCandidateEmail(candidateEmail);
    if (response && response.status === HttpStatus.OK) {
      if (response.data) {
        const profileId = response.data.profileId;
        setSelectedProfileFullName(e.item.props.candidate.fullName);
        setSelectedProfileId(profileId);
        setShowDownloadModal(true);
      }
    }
  };
  const onEdit = () => {
    console.log("selectedRecord++",selectedRecord)
    setAddModalVisible(true);
  };
  const onSaveFromEdit = async (values) => {
    setAddModalVisible(false);
    const formData = new FormData();
    const body = {
      ...values,
    };
    const id = { idSelectedLst: [values.candidateId] };
    formData.append('candidate', JSON.stringify(body));
    formData.append('candidate', JSON.stringify(id));
    const result = findCandidateByEmail(body);
    const r = Promise.resolve(result).then(async (value) => {
      const can = value.data;      
      if (can && can.candidateId !== body.candidateId) {
        // if (can.status === 'active' || can.status === 'new') {
          setNotiPopupVisible(true);
        // } else {
        //   setResendPopupVisible(true);
        //   setTmpCandidate(can);
        // }
      } else {
        const resp = await updateCandidate(body);
        await resendRequest(id);
        if (resp.status === HttpStatus.OK) {
          // setAddModalVisible(false);
          await dispatch(fetchCandidates(pagiState));
          openNotification(
            Messages.SUCCESS,
            Messages.editSuccessMessage('Candidate'),
            ''
          );
        } else {
          openNotification(
            Messages.ERROR,
            Messages.editUnsuccessMessage('Candidate'),
            ''
          );
          // setAddModalVisible(false);
        }
      }
      return can.status ? can.status : '';
    });
    return r;

    // const resp = await updateCandidate(body);
    // if (resp.status === HttpStatus.OK) {
    //   setAddModalVisible(false);
    //   await dispatch(fetchCandidates(pagiState));
    //   openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Candidate"), "");
    // } else {
    //   openNotification(Messages.ERROR, Messages.editUnsuccessMessage("Candidate"), "");
    //   setAddModalVisible(false);
    // }
  };

  const onSavePopup = async (data) => {
    data.status = 'new';
    const formData = new FormData();
    const body = {
      ...data,
    };
    const id = { idSelectedLst: [data.candidateId] };
    formData.append('candidate', JSON.stringify(body));
    formData.append('candidate', JSON.stringify(id));
    await resendRequest(id);
    await updateCandidate(body);
    await dispatch(fetchCandidates(pagiState));
    // onCancel();
    setResendPopupVisible(false);
    setAddModalVisible(false);
    openNotification(
      Messages.SUCCESS,
      'Resent request to candidate successfully',
      ''
    );
  };

  const onSave = async (values, form, setCandidate, initCandidate) => {
    const status = onSaveFromEdit(values);
    Promise.resolve(status).then(function (value) {
      if (value !== '') {
        return;
      } else {
        setAddModalVisible(false);
      }
    });
    return status;
  };

  const columns = [
    {
      title: 'Full name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (p1, p2) => {
        const v1 = p1.fullName ? p1.fullName.trim() : '';
        const v2 = p2.fullName ? p2.fullName.trim() : '';
        console.log('v1', v1, 'v2', v2, 'compare', v1.localeCompare(v2, undefined, { sensitivity: 'accent' }));
        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'fullName' && sortedInfo.order,
      width: '20%',
      render: (text, record) => {
        const link = '/profile?ce=' + window.btoa(record.email);
        return (
          <Link className="profile-link" type="link" to={link} target="_blank" rel="noopener noreferrer">{text}</Link>
        );
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (p1, p2) => {
        const v1 = p1.email ? p1.email.trim() : '';
        const v2 = p2.email ? p2.email.trim() : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      width: '20%',
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
      width: '12%',
      render: (text, record) => {
        //var displayRoles = record.roleName.replaceAll(",", ", ");
        var displayRoles = record.roleName.replace(/,/g, ", ");
        return (
          <div>
            {displayRoles}
          </div>)
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (p1, p2) => {
        const v1 = p1.phone ? p1.phone : '';
        const v2 = p2.phone ? p2.phone : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'phone' && sortedInfo.order,
      width: '12%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      //filters: statusFilters,
      //onFilter: (value, record) => record.status.indexOf(value) === 0,
      //filteredValue: filteredInfo.status || [],
      sorter: (p1, p2) => {
        const v1 = p1.status ? p1.status : '';
        const v2 = p2.status ? p2.status : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
      width: '12%',
      render: (text, record) => {
        return (
          <div id={record.candiateId}>
            {record.status === 'active' ? (
              <Tag
                color="success"
                style={{
                  width: CSSConstants.BUTTON_WIDTH,
                  textAlign: 'center',
                }}
                icon={<CheckCircleOutlined />}
              >
                Active
              </Tag>
            ) : record.status === 'inactive' ? (
              <Tag
                color="default"
                style={{
                  width: CSSConstants.BUTTON_WIDTH,
                  textAlign: 'center',
                }}
                icon={<CloseCircleOutlined />}
              >
                Inactive
              </Tag>
            ) : record.status === 'new' ? (
              <Tag
                color="blue"
                style={{
                  width: CSSConstants.BUTTON_WIDTH,
                  textAlign: 'center',
                }}
                icon={<TwitterOutlined />}
              >
                New
              </Tag>
            ) : (
                    <Tag
                      color="orange"
                      style={{
                        width: CSSConstants.BUTTON_WIDTH,
                        textAlign: 'center',
                      }}
                      icon={<FileDoneOutlined />}
                    >
                      Contracted
                    </Tag>
                  )}
          </div>
        );
      },
    },
    {
      title: 'Sent Date',
      dataIndex: 'sendDate',
      key: 'sendDate',
      width: '12%',
      sorter: (p1, p2) => {
        const v1 = p1.sendDate ? p1.sendDate : '';
        const v2 = p2.sendDate ? p2.sendDate : '';

        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'sendDate' && sortedInfo.order,
      render: (record) => {
        return record
          ? record.substring(8, 10) +
          '-' +
          record.substring(5, 8) +
          record.substring(0, 4)
          : '';
      },
    },
    {
      title: 'More',
      width: '5%',
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
    getCheckboxProps: (record) => ({
      disabled: record.status !== 'new',
      name: record.status,
    }),
  };

  const menu = (record) => {
    return (
      <Menu onClick={handleClickMenu}>
        <Menu.Item
          key="0"
          candidate={record}
          disabled={record.status === 'inactive' || record.status === 'Contracted'}
          onClick={onResendRequest}
        >
          <Text
            style={{ color: record.status === 'inactive' ? '#d9d9d9' : '' }}
          >
            Resend Request
          </Text>
        </Menu.Item>
        <Menu.Item
          key="1"
          candidate={record}
          disabled={record.status === 'inactive' || record.status === 'Contracted'}
          onClick={onCopyLink}
        >
          <Text
            style={{ color: record.status === 'inactive' ? '#d9d9d9' : '' }}
          >
            Copy Profile Link
          </Text>
        </Menu.Item>
        {record.status === 'inactive' ? '' : <Menu.Divider />}
        <Menu.Item
          key="2" candidate={record}
          onClick={onDowload}
          disabled={record.status === 'new'}>
          <Text>Download</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          key="4"
          candidate={record}
          disabled={record.status === 'new' || record.status === 'Contracted'}
          style={{
            display:
              record.status === 'active' || record.status === 'new'
                ? 'none'
                : '',
          }}
          onClick={onActivate}
        >
          <Text style={{ color: record.status === 'new' ? '#d9d9d9' : '' }}>
            Activate
          </Text>
        </Menu.Item>
        <Menu.Item
          key="5"
          candidate={record}
          style={{ display: record.status === 'inactive' ? 'none' : '' }}
          onClick={onDeactivate}
        >
          <Text
            style={{ color: record.status === 'inactive' ? '#d9d9d9' : '' }}
          >
            Deactivate
          </Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          key="3"
          candidate={record}
          disabled={record.status === 'Contracted'}
          onClick={() => {
            onEdit();
            setSelectedRecord(record);
            console.log("record++",record)
          }}
        >
          <Text>Edit</Text>
        </Menu.Item>
        {/* <Menu.Item key="6" candidate={record} onClick={onDelete}>
          <Text>Delete</Text>
        </Menu.Item> */}
        {/* <CandidateModal
          title="UPDATE CANDIDATE"
          visible={addModalVisible}
          data={record}
          onSave={onSave}
          onCancel={() => {
            setAddModalVisible(false);
          }}
          resendPopupVisible={resendPopupVisible}
          tmpCandidate={tmpCandidate}
          setResendPopupVisible={setResendPopupVisible}
          pagiState={pagiState}
          onSavePopup={onSavePopup}
        /> */}
      </Menu>
    );
  };

  const updateParent = (data) => {
    setPagiState({
      ...pagiState,
      fullName: data.fullName,
      roleName: data.roleName,
      status: data.status,
    });
  };

  const onSearch = () => {
    setPagination({ ...pagination, current: 1 });
    dispatch(
      fetchCandidates({
        ...pagiState,
        page: 1,
      })
    );
    setSelectedRowKeys([]);
  };

  const onReset = () => {
    setPagination({ ...pagination, current: 1 });
    setPagiState({
      ...pagiState,
      page: 1,
      fullName: '',
      roleName: '',
      status: 'new,active,inactive',
    });
    dispatch(fetchCandidates(initPagiState));
    setSortedInfo({});
    setSelectedRowKeys([]);
  };

  const handleTableChange = (paginationParams, filters, sorter) => {
    const shouldReload = (paginationParams.current !== pagination.current) || (paginationParams.pageSize !== pagination.pageSize);

    setPagination({
      ...pagination,
      current: paginationParams.current,
      defaultPageSize: paginationParams.pageSize,
    });

    if (shouldReload) {
      dispatch(
        fetchCandidates({
          ...pagiState,
          column: sorter.column ? sorter.column.key : 'candidateId',
          page: paginationParams.current,
          size: paginationParams.pageSize,
          sort: sorter.column
            ? sorter.order.substring(0, 3).toUpperCase()
            : 'ASC',
        })
      );
    }

    setSortedInfo(sorter);

    setPagiState({
      ...pagiState,
      column: sorter.column ? sorter.column.key : 'candidateId',
      page: paginationParams.current,
      size: paginationParams.pageSize,
      sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : 'ASC',
    });
  };

  const onChangePagination = (page, pageSize) => { };

  const onShowSizeChange = (current, size) => { };

  return (
    <div>
      <animated.div
        className="candidate-area support-for-sticky-header"
        style={props}
      >
        <Row>
          <Col span={24}>
            <div className="border-bottom-solid">
              <h1>Candidates List</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <CandidateHeader
              updateParent={updateParent}
              search={onSearch}
              onReset={onReset}
              fetchCandidatesData={fetchCandidatesData}
            />
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {isLoading ? (
              <Loading />
            ) : (
                <div>
                  <Table
                    rowKey={(record) => record.candidateId}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      total: totalElements,
                      current: pagination.current,
                      defaultPageSize: pagination.defaultPageSize,
                      showSizeChanger: true,
                      size: 'small',
                      onChange: onChangePagination,
                      onShowSizeChange: onShowSizeChange,
                      showTotal: (total, range) => (
                        <Row>
                          <Text className="selected-account">
                            {selectedRowKeys.length > 0 ? (
                              <div>
                                {selectedRowKeys.length}{' '}
                                {selectedRowKeys.length > 1
                                  ? 'accounts'
                                  : 'account'}{' '}
                              selected
                                <Popconfirm
                                  title={Messages.RESENDALL_CONFIRM}
                                  onConfirm={resendAll}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button type="link">Resend All</Button>
                                </Popconfirm>
                              </div>
                            ) : (
                                ''
                              )}
                          </Text>
                          <div>
                            {' '}
                            {total <= 1
                              ? `${range[0]} - ${range[1]} of ${total} account`
                              : `${range[0]} - ${range[1]} of ${total} accounts`}
                          </div>
                        </Row>
                      ),
                    }}
                    scroll={{ y: 460 }}
                    size="small"
                    onChange={handleTableChange}
                  />
                </div>
              )}
          </Col>
        </Row>
      </animated.div>
      <CandidateErrorPopup
        visible={notiPopupVisible}
        onDone={() => {
          setNotiPopupVisible(false);
        }}
        message="The candidate is already existed."
      ></CandidateErrorPopup>
      <CandidateModal
        title="Update Candidate"
        visible={addModalVisible}
        data={selectedRecord}
        onSave={onSave}
        onCancel={() => {
          setAddModalVisible(false);
        }}
        resendPopupVisible={resendPopupVisible}
        tmpCandidate={tmpCandidate}
        setResendPopupVisible={setResendPopupVisible}
        pagiState={pagiState}
        onSavePopup={onSavePopup}
      />

      <DownloadProfileModal
        visible={showDownloadModal}
        profileId={selectedProfileId}
        profileFullName={selectedProfileFullName}
        onCancel={() => setShowDownloadModal(false)}
      />
    </div>
  );
};

export default Candidates;
