import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoreOutlined } from '@ant-design/icons';
import './Home.css';
import {
  Col,
  Row,
  Button,
  Table,
  Typography,
  Menu,
  Dropdown, message, Tooltip, Popconfirm, Popover
} from 'antd';
import HomeHeader from './HomeHeader';
import { isLoadingStatus } from '../../store/slice/animationSlice';
import { fetchProjectListHome, getProfileListInStore, getProfilesTotalElements } from '../../store/slice/profileSlice';
import Loading from '../../components/Loading';
import { Messages } from '../../utils/AppMessage';
import { requestUpdate, downloadProfile, getListProfileId } from "../../api/profile";
import { openNotification } from '../../components/OpenNotification';
import { HttpStatus } from '../../constants/HttpStatus';
import { Config } from '../../constants/AppConfiguration';
import { getUserData } from '../../store/slice/authSlice';
import { useSpring, animated } from 'react-spring'
import { addNewCandidate } from "../../api/candidate";
import { getActivityKey, getMenuByName, isAuthorizedUser, useWindowSize } from '../../utils/PoaUtil';
import { UrlConstants } from '../../constants/Constants';
import { Link, Redirect } from 'react-router-dom';
import './../../styles.css';
import DownloadProfileModal from './DownloadProfileModal';
import RequestUpdateComment from './RequestUpdateComment';
import { ActivityKeyConstants } from '../../constants/ActivityKeyConstants';

const { Text } = Typography;

const Home = () => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const initPagination = {
    total: 1,
    current: 1,
    defaultPageSize: 50,
  }

  const [searchGroup, setSearchGroup] = useState('');
  const [searchDu, setSearchDu] = useState('');

  const [searchSkills, setSearchSkills] = useState([]);

  const initPagiState = {
    page: 1,
    size: 50,
    column: "candidateId",
    sort: Config.ASCENDING_SORT,
    skill: "",    
    availableTo: '',
    roleName: "",
    certificate: '',
    fullName: '',
    group: searchGroup,
    du: searchDu,
    language: "",
    type: '',
    yearsOfExperience: 0,
  };
  const dispatch = useDispatch();

  const user = useSelector(getUserData);

  const dataSource = useSelector(getProfileListInStore);
  const tlements = useSelector(getProfilesTotalElements);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [preserveSelectedRowKeys, setPreserveSelectedRowKeys] = useState([]);
  const [totalElements, setTotalElements] = useState(1);
  const [pagiState, setPagiState] = useState(initPagiState);
  const [pagination, setPagination] = useState(initPagination);
  const [sortedInfo, setSortedInfo] = useState({});
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(0);
  const [selectedProfileFullName, setSelectedProfileFullName] = useState('');
  const [windowWidth, windowHeight] = useWindowSize();
  const [tableHeightOffset, setTableHeightOffset] = useState(350);  
  const limitSkillsDisplay = 3;

  useEffect(() => {    
    setTotalElements(tlements ? tlements : 0)

  }, [tlements, user]);

  useEffect(() => {
    let group = searchGroup;
    let du = searchDu;
    if (user) {
      const keys = [
        ActivityKeyConstants.VIEW_LIST_STAFF_PROFILE,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO,
        ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL,
      ]
      const activityKey = getActivityKey(keys);
      if (activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_ALL_INFO ||
        activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_G_NO_PHONE_EMAIL) {
        setSearchGroup(user.group);
        group = user.group;
      } else if (activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_ALL_INFO ||
        activityKey === ActivityKeyConstants.VIEW_STAFF_PROFILE_BY_DU_NO_PHONE_EMAIL) {
        setSearchDu(user.du);
        du = user.du;
      }
    }

    async function fetchHomeData() {
      setIsLoading(true);
      await dispatch(fetchProjectListHome({
        ...initPagiState,
        group: group,
        du: du,
      }));

      setIsLoading(false);
    }

    fetchHomeData();
  }, []);

  if (!user.userName) {
    return <Redirect to="/login" />
  }

  const menuTabs = getMenuByName("Home");
  const containsHome = menuTabs.some(m => m.link === UrlConstants.HOME_PATH);

  if (!containsHome) {
    if (menuTabs.length > 0) {
      return <Redirect to={menuTabs[0].link} />
    }
  }

  const onSaveHeader = async (values) => {

    const formData = new FormData();
    const body = {
      ...values, createBy: user.skill + "," + user.email
    };
    formData.append('candidate', JSON.stringify(body));
    const resp = await addNewCandidate(body);
    if (resp.status === HttpStatus.OK) {
      openNotification(Messages.SUCCESS, Messages.addSuccessMessage("Candidate"), "");
      await dispatch(fetchProjectListHome(pagiState));
    } else {
      openNotification(Messages.ERROR, Messages.addUnsuccessMessage("Candidate"), "");
    }
  }

  const onMuitiRequestUpdate = async (data) => {
    const form = new FormData();
    // const body = {
    //   idSelectedLst: [...selectedRowKeys],
    //   comment: comment
    // };
    const body = {
      ...data
    }
    form.append('idSelectedLst', JSON.stringify(body));
    const resp = await requestUpdate(body);
    if (!resp.errorMessage) {
      setSelectedRowKeys([]);
      openNotification(
        Messages.SUCCESS,
        Messages.RESEND_REQUEST_SUCCESS,
        ""
      );
      setSelectedRowKeys([]);
    }
  }

  const onDowload = async (e) => {
    const profileId = e.item.props.profile.profileId;
    setSelectedProfileFullName(e.item.props.profile.fullName);
    setSelectedProfileId(profileId);
    setShowDownloadModal(true);
  }  

  const generateSkillsContent = (data, record) => {    
    const profileId = record.profileId;    
    const skills = data ? data.split('/') : [];
    const bestSkills = record.bestSkills ? record.bestSkills.split('|') : [];    
    const length = limitSkillsDisplay > skills.length ? skills.length : limitSkillsDisplay;

    const displaySkills = [];
    for (let i = 0; i < length; i++) {
      displaySkills.push(skills[i]);
    }

    let summaryContent = displaySkills.map(skill => {        
      if (bestSkills.includes(skill.trim())) {
        if (skills.indexOf(skill) === skills.length - 1) {
          return <span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill best-skill" : "best-skill"}>{skill}</span>
        } else {
          return <><span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill best-skill" : "best-skill"}>{skill}</span>/</>
        }
      } else {
        if (skills.indexOf(skill) === skills.length - 1) {
          return <span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill" : ""}>{skill}</span>
        } else {
          return <><span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill" : ""}>{skill}</span>/</>
        }
      }
    });

    if (length < skills.length) {
      summaryContent = <>{summaryContent} ...</>
    }

    summaryContent = <div style={{cursor: "pointer"}}>{summaryContent}</div>

    let content = skills.map(skill => {        
        if (bestSkills.includes(skill.trim())) {
          if (skills.indexOf(skill) === skills.length - 1) {
            return <span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill best-skill" : "best-skill"}>{skill}</span>
          } else {
            return <><span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill best-skill" : "best-skill"}>{skill}</span>/</>
          }
        } else {
          if (skills.indexOf(skill) === skills.length - 1) {
            return <span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill" : ""}>{skill}</span>
          } else {
            return <><span className={searchSkills.includes(skill.split('(')[0].trim()) ? "search-skill" : ""}>{skill}</span>/</>
          }
        }
      });

      content = <div style={{maxWidth: "400px"}}>{content}</div>
      return (
      <div id={"skills-" + record.profileId}>        
        <Popover key={"skills-summary" + record.profileId} title={"Skills of " + record.fullName} content={content} trigger="click">{summaryContent}</Popover>
      </div>);
  }

  const columns = [
    {
      title: 'Full name',
      dataIndex: 'fullName',
      key: 'fullName',      
      sorter: (p1, p2) => {
        const n1 = p1.fullName ? p1.fullName : '';
        const n2 = p2.fullName ? p2.fullName : '';

        return n1.localeCompare(n2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'fullName' && sortedInfo.order,
      width: 120,
      fixed: 'left',
      render: (value, record) => {
        const parts = value ? value.split('-') : [''];
        return (
          <div>
            <Link className="profile-link" to={`/profile?pid=${window.btoa(record.profileId)}`} target="_blank">
              {parts[0]} ({record.account})
            </Link>
          </div>
        );
      }
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 75,
      render: (value) => {
        //return value ? value.replaceAll(',', ', ') : '';
        return value ? value.replace(/,/g, ', ') : '';
      }
    },
    {
      title: 'Skills (years of experience)',
      dataIndex: 'groupSkills',
      key: 'groupSkills',
      width: 150,
      render: (data, record) => {        
        return (
          generateSkillsContent(data, record)
        )
      }
    },
    {
      title: 'Language',
      dataIndex: 'groupLanguages',
      key: 'groupLanguages',
      width: 120,
    },
    {
      title: 'Certificates',
      dataIndex: 'groupCertificates',
      key: 'groupCertificates',
      width: 180,
    },
    {
      title: 'Available time',
      dataIndex: 'availableTime',
      key: 'availableTime',
      width: 100,
    },
    {
      title: 'Booked project',
      dataIndex: 'bookedProject',
      key: 'bookedProject',
      width: 120,
    },
    {
      title: 'Start date - End date',
      dataIndex: 'bookedFromTo',
      key: 'bookedFromTo',
      width: 180,
    },
    {
      title: 'Group',
      dataIndex: 'profileGroup',
      key: 'profileGroup',
      width: 60,
      sorter: (p1, p2) => {
        const g1 = p1.profileGroup ? p1.profileGroup : '';
        const g2 = p2.profileGroup ? p2.profileGroup : '';

        return g1.localeCompare(g2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'profileGroup' && sortedInfo.order,
    },
    {
      title: 'Du',
      dataIndex: 'du',
      key: 'du',
      width: 60,
      sorter: (p1, p2) => {
        const du1 = p1.du ? p1.du : '';
        const du2 = p2.du ? p2.du : '';
        return du1.localeCompare(du2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'du' && sortedInfo.order,
    },
    {
      title: 'Profile Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      sorter: (p1, p2) => {
        const t1 = p1.type ? p1.type : '';
        const t2 = p2.type ? p2.type : '';

        return t1.localeCompare(t2, undefined, { sensitivity: 'accent' });
      },
      sortOrder: sortedInfo.columnKey === 'type' && sortedInfo.order,
    },
    {
      title: 'More',
      width: 60,
      fixed: 'right',
      render: (record) => {
        return (
          <Dropdown overlay={menu(record)} trigger={['click']} >
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
      disabled: record.type === 'Candidate'
    })
  };

  const menu = (record) => {
    return (
      <Menu>
      <Menu.Item key={"0_" + record.profileId} profile={record} onClick={onDowload}>
          <Text>Dowload Profile</Text>
        </Menu.Item>
        <Menu.Item key={"1_" + record.profileId} profile={record}
          onClick={() => {            
            setShowCommentModal(true);
            setSelectedRowKeys([record.profileId])
          }}
          disabled={record.type === 'Candidate'}>
          <Text>Request Update</Text>
        </Menu.Item>
      </Menu>
    )
  };

  const updateParent = (data) => {
    setPagiState({
      ...pagiState,
      fullName: data.fullName,
      skill: data.skill,
      roleName: data.roleName,
      language: data.language,
      certificate: data.certificate,
      type: data.type,
      group: searchGroup ? searchGroup : data.group,
      du: searchDu ? searchDu : data.du,
      profileStatus: data.profileStatus,      
      availableTo: data.availableTo,
      yearsOfExperience: data.yearsOfExperience ? data.yearsOfExperience : 0,
    });
  }

  const onSearch = () => {
    setPagination({ ...pagination, current: 1 });
    dispatch(fetchProjectListHome({
      ...pagiState,
      page: 1,
    }));
    setSelectedRowKeys([]);
    setSearchSkills(pagiState?.skill ? pagiState.skill.split(',') : []);
  }

  const onReset = () => {
    setPagination({ ...pagination, current: 1 });
    setPagiState({
      ...pagiState,
      page: 1,
      skill: "",      
      availableTo: '',
      roleName: "",
      certificate: '',
      fullName: '',
      group: searchGroup,
      du: searchDu,
      language: "",
      type: '',
      yearsOfExperience: 0
    });    
    dispatch(fetchProjectListHome(initPagiState));
    setSortedInfo({});
    setSelectedRowKeys([]);
    setSearchSkills([]);
  }

  const handleTableChange = async (paginationParams, filters, sorter) => {
    const shouldReload = (paginationParams.current !== pagination.current) || (paginationParams.pageSize !== pagination.pageSize);

    setPagination({ ...paginationParams, current: paginationParams.current, defaultPageSize: paginationParams.pageSize });

    if (shouldReload) {
      setIsLoading(true);
      await dispatch(fetchProjectListHome({
        ...pagiState,
        column: sorter.column ? sorter.column.key : "candidateId",
        page: paginationParams.current,
        size: paginationParams.pageSize,
        sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "ASC",
      }));
      setIsLoading(false);
    }

    setSortedInfo(sorter);

    setPagiState({
      ...pagiState,
      column: sorter.column ? sorter.column.key : "candidateId",
      page: paginationParams.current,
      size: paginationParams.pageSize,
      sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "ASC",
    });
  };

  return (
    <div>
      <animated.div className="home-area support-for-sticky-header" style={props}>
        <Row>
          <Col span={24}>
            <div className="border-bottom-solid">
              <h1>Profiles List</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <HomeHeader
              updateParent={updateParent}
              search={onSearch}
              onReset={onReset}
              onSaveHeader={onSaveHeader}
              searchGroup={searchGroup}
              searchDu={searchDu}              
              setTableHeightOffset={setTableHeightOffset}
            />
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {isLoading ? (
              <Loading key="profiles-list-loading" />
            ) : (
                <Table
                  rowKey={(record) => record.profileId}
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
                          {selectedRowKeys.length > 0 ?
                            <div>
                              {selectedRowKeys.length} {selectedRowKeys.length > 1 ? "accounts" : "account"} selected
                          <Popconfirm
                                title={Messages.RESENDALL_CONFIRM}
                                onConfirm={() => setShowCommentModal(true)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button type="link">
                                  Request Update
                          </Button>
                              </Popconfirm>
                            </div>
                            : ""}
                        </Text>

                        <div>
                          {total <= 1
                            ? `${range[0]} - ${range[1]} of ${total} account`
                            : `${range[0]} - ${range[1]} of ${total} accounts`}
                        </div>
                      </Row>
                    )
                  }}
                  scroll={{ y: windowHeight - tableHeightOffset }}
                  size="small"
                  onChange={handleTableChange}
                />
              )}
          </Col>
        </Row>
      </animated.div>
      <DownloadProfileModal
        visible={showDownloadModal}
        profileId={selectedProfileId}
        profileFullName={selectedProfileFullName}
        onCancel={() => setShowDownloadModal(false)}
      />
      <RequestUpdateComment
        visible={showCommentModal}
        onCancel={() => {
          setShowCommentModal(false);
          setSelectedRowKeys([]);
        }}
        onReject={onMuitiRequestUpdate}
        data={selectedRowKeys}
      />
    </div>
  );
};

export default Home;
