import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Col, Row, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../constants/CSSConstants';
import TemplateProfileHeader from './components/TemplateProfileHeader';
import { deleteTemplateProfile, downloadTemplateProfileWithId } from '../../../../api/setting';
import {
  fetchTemplateProfile,
  getTemplateProfileInStore,
} from '../../../../store/slice/settingSlice';
import { Messages } from '../../../../utils/AppMessage';
import { dateFormat } from '../../../../constants/DateTimes';
import moment from 'moment';
import { openNotification } from '../../../../components/OpenNotification';
import Loading from '../../../../components/Loading';
import { isLoadingStatus } from '../../../../store/slice/animationSlice';
import TemplateProfileActions from './components/TemplateProfileActions';
import { UrlConstants } from '../../../../constants/Constants';


const TemplateProfiles = () => {
  const dispatch = useDispatch();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const isLoading = useSelector(isLoadingStatus);
  const dataSource = useSelector(getTemplateProfileInStore);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchTemplateProfile());
    }
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Template',
      dataIndex: 'templateName',
      key: 'templateName',
      width: '30%'
    },
    {
      title: 'Date Update',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: '20%',
      render: (record) => {
        return record ? moment(record).format(dateFormat) : "";
      },
    },
    {
      title: 'Editor',
      dataIndex: 'editor',
      key: 'editor',
      width: '20%',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '20%',
      render: (value, record) => {
        const onDelete = async () => {
          const deletetemplateIdList = {
            idSelectedLst: [record.templateId],
          };
          const resp = await deleteTemplateProfile(deletetemplateIdList);
          if (resp) {
            setDeleteModalVisible(false);
            dispatch(fetchTemplateProfile());
            openNotification(
              Messages.SUCCESS,
              Messages.deleteSuccessMessage('Template Profile'),
              ''
            );
          } else {
            openNotification(
              Messages.ERROR,
              Messages.deleteUnsuccessMessage('Template Profile'),
              ''
            );
          }
        };

        const onDownload = async () => {
          const tmp = downloadTemplateProfileWithId(record.templateId);
          tmp.then(function(result) {            
            if (result) {
              window.location.href= UrlConstants.API_BASE_URL + "/api/setting/downloadTemplateProfile/" + record.templateId;
            }
          });
        }

        const onUpdate = () => {
          setEditModalVisible(true);
        };   

        return (
          <div direction="horizontal" style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="link"
              size="small"
              onClick={() => {
                onDownload();
              }}
              style={{ width: CSSConstants.BUTTON_WIDTH * 1.5 }}
              icon={<ArrowDownOutlined />}
              
            >
              Download
            </Button>
            <TemplateProfileActions
              key={record.templateId}
              record={record}
              dataSource={dataSource}
            />
            <Popconfirm
              title={Messages.DELETE_CONFIRM}
              onConfirm={onDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                size="small"
                danger
                onClick={() => {
                  setDeleteModalVisible(true);
                }}
                style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm >
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Row>
        <Col span={24}>
          <TemplateProfileHeader dataSource={dataSource} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {isLoading ? (
              <Loading />
          ) : (
            <Table
              rowKey={(record) => record.templateId}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                size: "small",
              }}
              scroll={ dataSource.length >= 6 ? { y: 230 } : { } }
              size='small'
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TemplateProfiles;
