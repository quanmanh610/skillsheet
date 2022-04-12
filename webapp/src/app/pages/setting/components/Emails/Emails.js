import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Table, Spin, Button } from 'antd';
import {
  fetchEmails,
  getEmailsInStore,
} from '../../../../store/slice/settingSlice';
import EmailActions from './EmailActions';
import Loading from '../../../../components/Loading';
import { isLoadingStatus } from '../../../../store/slice/animationSlice';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { updateEmail, getEmailList } from '../../../../api/setting';
import { CSSConstants } from '../../../../constants/CSSConstants';

const Emails = () => {
  const dispatch = useDispatch();
  const dataSource = useSelector(getEmailsInStore);  
  const isLoading = useSelector(isLoadingStatus);
  const [isSending, setIsSending] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const response = await getEmailList();
      if (response.data.length === 0) {
        onSave();        
      }
      //console.log(response);
      await dispatch(fetchEmails());
    }
    fetchData();
  }, []);
  
  // const response = getEmailList().then(data => {
  //   if (data.length == 0) {
  //     onSave();
  //     dispatch(fetchEmails());
  //   }
  // });

  const sending = (value) => {
    if (value) {
      setIsSending(true);
    } else {
      setIsSending(false);
    }
  };

  const onSave = async () => {
    const updateEmailData = {
      emailId: '',
      receiver: 'Staff',
      schedule: 'Monthly',
      haveRepeat: '1st',
      time: '08:00 AM',
      status: 'Inactive'
    };
    const response = await updateEmail(updateEmailData);
  };

  const columns = [
    {
      title: 'Receiver',
      dataIndex: 'receiver',
      key: 'receiver',
      width: '20%',
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      width: '20%',
    },
    {
      title: 'Day',
      key: 'day',
      width: '15%',
      render: (record) => {
        const newDay = record.haveRepeat.concat(
          ' '.concat(record.day ? record.day : '')
        );
        return newDay;
      },
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: '15%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (text, record) => {
        return (
          <div id={record.skillid}>
            {record.status === 'Active' ? (
              <Button type="link"
                style={{
                  width: CSSConstants.BUTTON_WIDTH,
                  textAlign: 'center',
                  cursor: 'auto',
                  paddingLeft: '0px' 
                }}
                icon={<CheckCircleOutlined />}
              >
                Active
              </Button>
            ) : (
                <Button type="link"
                  style={{
                    color: "#262626",
                    width: CSSConstants.BUTTON_WIDTH,
                    textAlign: 'center',
                    cursor: 'auto',
                    paddingLeft: '0px' 
                  }}
                  icon={<CloseCircleOutlined />}
                >
                  Inactive
                </Button>
              )}
          </div>
        );
      },
    },
    {
      title: '',
      key: 'action',
      render: (record) => {
        return <EmailActions record={record} sending={sending} dataSource={dataSource}/>;
      },
    },
  ];

  return (
    <div>
      <Row>
        <Col span={24}>
          {isLoading ? (
            <Loading />
          ) : (
              <Table
                rowKey={(record) => record.emailId}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size='small'
              />
            )}
        </Col>
      </Row>
      <br />
      <div
        style={{
          display: isSending ? 'flex' : 'none',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100vh',
          justifyContent: 'center',
          height: '6em',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Spin
          size="large"
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        ></Spin>
        <br />
        <span> Mail sending... </span>
      </div>
    </div>
  );
};

export default Emails;
