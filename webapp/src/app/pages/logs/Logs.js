import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, PlusOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import './Log.css';
import {
  Col,
  Row,
  Table,
  Tag,
} from 'antd';
import LogHeader from './LogHeader';
import {
  fetchLogs,
  getLogsInStore,
  getTotalElements,
} from '../../store/slice/logSlice';

import { isLoadingStatus } from '../../store/slice/animationSlice';
import Loading from '../../components/Loading';
import { CSSConstants } from '../../constants/CSSConstants';
import { Config } from '../../constants/AppConfiguration';
import { getUserData } from '../../store/slice/authSlice';
import { useSpring, animated } from 'react-spring'
//import { isAuthorizedUser } from '../../utils/PoaUtil';
import { UrlConstants } from '../../constants/Constants';
import { Redirect } from 'react-router-dom';
import './../../styles.css';
import moment from 'moment';

const Logs = () => {

  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const today = date;

  const props = useSpring({
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
    column: "changeHistoryId",
    sort: Config.DESCENDING_SORT,
    editor: "",
    tableName: "",
    from: moment(firstDayOfMonth).format("MM/DD/yyyy") + " 00:00:00",
    to: moment(today).format("MM/DD/yyyy") + " 23:59:59"
  };
  const dispatch = useDispatch();

  const user = useSelector(getUserData);

  const dataSource = useSelector(getLogsInStore);
  const tlements = useSelector(getTotalElements);
  const isLoading = useSelector(isLoadingStatus);

  const [totalElements, setTotalElements] = useState(0);
  const [pagiState, setPagiState] = useState(initPagiState);
  const [pagination, setPagination] = useState(initPagination);
  const [sortedInfo, setSortedInfo] = useState({});

  //const isPageAuthorized = isAuthorizedUser(user, UrlConstants.LOGS_PATH);

  useEffect(() => {
    // if (!isPageAuthorized) {
    //   return;
    // }

    setTotalElements(tlements ? tlements : 0)
  }, [tlements]);

  useEffect(() => {
    // if (!isPageAuthorized) {
    //   return;
    // }

    async function fetchLogsData() {
      await dispatch(fetchLogs(initPagiState));
    }
    fetchLogsData();
  }, []);

  // if (!isPageAuthorized) {
  //   return <Redirect to={UrlConstants.UNAUTHORIZED_PATH}/>
  // }

  const columns = [
    {
      title: 'Editor',
      dataIndex: 'editor',
      key: 'editor',
      width: "10%",
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'editor' && sortedInfo.order,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: "10%",
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'action' && sortedInfo.order,
      render: (text, record) => {
        return (
          <div id={record.changeHistoryId}>
            {record.action === 'Create' ? (
              <Tag
                color="blue"
                style={{
                  width: CSSConstants.BUTTON_WIDTH,
                  textAlign: 'center',
                }}
                icon={<PlusOutlined />}
              >
                Add
              </Tag>
            ) : record.action === 'Update' ? (
              <Tag
                color="success"
                style={{
                  width: CSSConstants.BUTTON_WIDTH,
                  textAlign: 'center',
                }}
                icon={<EditOutlined />}
              >
                Update
              </Tag>
            ) : record.action === 'Delete' ? (<Tag
              color="red"
              style={{
                width: CSSConstants.BUTTON_WIDTH,
                textAlign: 'center',
              }}
              icon={<DeleteOutlined />}
            >
              Delete
            </Tag>) : (
                    <Tag
                      color="orange"
                      style={{
                        width: CSSConstants.BUTTON_WIDTH,
                        textAlign: 'center',
                      }}
                      icon={<MailOutlined />}
                    >
                      Mail
                    </Tag>
                  )
            }
          </div>
        );
      },
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: "10%",
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'time' && sortedInfo.order,
      render: (text, record) => {
        return (
          <div id={record.changeHistoryId}>
            {moment(record.time).format("DD/MM/yyyy hh:mm:ss")}
          </div>
        );
      }
    },
    {
      title: 'Table',
      dataIndex: 'table',
      key: 'table',
      width: "10%",
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'table' && sortedInfo.order,
    },
    {
      title: 'New Value',
      dataIndex: 'newValue',
      key: 'newValue',
      width: "30%",
    },
    {
      title: 'Old Value',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: "30%",
    },
  ];

  const updateParent = (data) => {
    setPagiState({ ...pagiState, editor: data.editor, tableName: data.tableName, from: data.from, to: data.to });
  }

  const onSearch = () => {
    setPagination({ ...pagination, current: 1 });
    dispatch(fetchLogs({
      ...pagiState,
      page: 1,
    }));
  }

  const onReset = () => {
    setPagination({ ...pagination, current: 1 });
    setPagiState({ ...pagiState, page: 1, editor: "", tableName: "", from: "", to: "" });
    dispatch(fetchLogs(initPagiState));
    setSortedInfo({});
  }

  const handleTableChange = (pagination, filters, sorter) => {

    setPagination({ ...pagination, current: pagination.current, defaultPageSize: pagination.pageSize });

    dispatch(fetchLogs({
      ...pagiState,
      column: sorter.column ? sorter.column.key : "changeHistoryId",
      page: pagination.current,
      size: pagination.pageSize,
      sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "DESC",
    }));

    setSortedInfo(sorter);

    setPagiState({
      ...pagiState,
      column: sorter.column ? sorter.column.key : "changeHistoryId",
      page: pagination.current,
      size: pagination.pageSize,
      sort: sorter.column ? sorter.order.substring(0, 3).toUpperCase() : "DESC",
    });
  };

  const onChangePagination = (page, pageSize) => {
  }

  const onShowSizeChange = (current, size) => {
  }

  return (
    <animated.div className="log-area support-for-sticky-header" style={props}>
      <Row>
        <Col span={24}>
          <div className="border-bottom-solid">
            <h1>List Logs</h1>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <LogHeader updateParent={updateParent} search={onSearch} onReset={onReset} />
          <br></br>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {isLoading ? (
            <Loading />
          ) : (<div>
            <Table
              rowKey={(record) => record.changeHistoryId}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                total: totalElements,
                current: pagination.current,
                defaultPageSize: pagination.defaultPageSize,
                showSizeChanger: true,
                size: "small",
                onChange: onChangePagination,
                onShowSizeChange: onShowSizeChange,
                showTotal: (total, range) => (<Row>
                  <div>{total == 0 ? "" : 
                    <div>{total == 1
                      ? `${range[0]} - ${range[1]} of ${total} item`
                      : `${range[0]} - ${range[1]} of ${total} items`}
                    </div>}
                  </div>
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

export default Logs;
