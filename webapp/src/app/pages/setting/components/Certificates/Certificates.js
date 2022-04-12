import React, { useEffect, useState, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Button,
  Table,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import CertificateHeader from './components/CertificateHeader';
import CertificateDeleteConfirmModal from './components/CertificateDeleteConfirmModal';
import CertificateAction from './components/CertificateAction';
import { HttpStatus } from '../../../../constants/HttpStatus';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';

import {
  fetchCertificate,
  getCertificateInStore,
} from '../../../../store/slice/settingSlice';
import {  
  deleteCertificate,  
  activeAllCertificate,
  checkCertificate,
} from '../../../../api/setting';
import { filterFormat } from '../../../../utils/filterFormat';
import Loading from '../../../../components/Loading';
import { isLoadingStatus } from '../../../../store/slice/animationSlice';
import { CREATED_BY } from '../../../../constants/settings.constants';
import { SettingItemStatus } from '../../../../constants/SettingItemStatus';

const Certificates = React.forwardRef((props, ref) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dispatch = useDispatch();
  const dataSource = useSelector(getCertificateInStore);
  
  const [activeAllVisible, setActiveAllVisible] = useState(false);

  const [selectedDeleteCertificates, setSelectedDeleteCertificates] = useState(
    []
  );
  const [deleteConfirmVisible, setdeleteConfirmVisible] = useState(false);
  const [profileCertificate, setProfileCertificate] = useState([]);
  
  const isLoading = useSelector(isLoadingStatus);
  
  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchCertificate());
    }
    fetchData();
    return () => { };
  }, []);
  const clearRowSelection = () => {
    setSelectedRowKeys([]);
  };
  useImperativeHandle(ref, () => ({
    clearRowSelectionWhenOut() {
      setSelectedRowKeys([]);
    },
  }));
  const onDeleteAll = async () => {
    const body = {
      idSelectedLst: [...selectedRowKeys],
    };
    const count = checkCertificate(body);
    count.then(async function(result) {
      if(result.data > 0) {        
        setdeleteConfirmVisible(true);
        setProfileCertificate(body)
      } else {
        const response = await deleteCertificate(body);
        if (response.status === HttpStatus.OK) {
          setSelectedRowKeys([]);
          await dispatch(fetchCertificate());
          openNotification(
            Messages.SUCCESS,
            Messages.deleteSuccessMessage('Certificate'),
            ''
          );
        } else {
          openNotification(
            Messages.ERROR,
            Messages.deleteUnsuccessMessage('Certificate'),
            ''
          );
        }
      }
    });
    
  };

  const onActiveAll = async () => {
    const inActives = selectedDeleteCertificates.filter(
      (item) => item.status === SettingItemStatus.INACTIVE
    );
    const deleteCertificateId = {
      idSelectedLst: [...selectedRowKeys],
    };
    if (inActives.length !== 0) {
      const response = await activeAllCertificate(deleteCertificateId);
      // const response = false;
      if (response) {
        setSelectedRowKeys([]);
        await dispatch(fetchCertificate());
        openNotification(
          Messages.SUCCESS,
          Messages.activeAllSuccessMessage('Certificate'),
          ''
        );
      } else {
        openNotification(
          Messages.ERROR,
          Messages.activeAllUnsuccessMessage('Certificate'),
          ''
        );
      }
    }
  };

  const categoryFilters = filterFormat(dataSource, 'category');
  const certificateFilters = filterFormat(dataSource, 'name');  
  const createbyFilters = filterFormat(dataSource, 'createBy');

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: categoryFilters,
      onFilter: (value, record) => {
        return record.category === value;
      },
      sorter: (c1, c2) => {        
        const v1 = c1.category ? c1.category.trim() : '';
        const v2 = c2.category ? c2.category.trim() : '';
        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
    },
    {
      title: 'Certificate',
      dataIndex: 'name',
      key: 'name',
      filters: certificateFilters,
      onFilter: (value, record) => {
        return record.name === value;
      },
      sorter: (c1, c2) => {        
        const v1 = c1.name ? c1.name.trim() : '';
        const v2 = c2.name ? c2.name.trim() : '';
        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Active',
          value: 0
        },
        {
          text: 'Inactive',
          value: 1
        },
        {
          text: 'New',
          value: 2
        }
      ],
      onFilter: (value, record) => {
        return record.status === value;
      },
      sorter: (a, b) => {
        return a.status - b.status;
      },
      render: (text, record) => {
        return (
          <div id={record.certificateId}>
            {record.status === SettingItemStatus.ACTIVE ? (
              <Button type="link"
                style={{
                  // width: CSSConstants.BUTTON_WIDTH,
                  textAlign: 'center',
                  paddingLeft: '2px' 
                }}
                icon={<CheckCircleOutlined />}
              >
                Active
              </Button>
            ) : <div>
              {record.status === SettingItemStatus.INACTIVE ? (
                <Button type="link"
                  style={{
                    color: "#262626",
                    width: CSSConstants.BUTTON_WIDTH,
                    textAlign: 'center',
                    paddingLeft: '2px' 
                  }}
                  icon={<CloseCircleOutlined />}
                >
                  Inactive
                </Button>
              ) : (
                <Button type="link"
                  style={{
                    color: "#6CCC3C",
                    textAlign: 'center',
                    paddingLeft: '3px' 
                  }}
                  icon={<PlusCircleOutlined />}
                >
                  New
                </Button>
              )}
            </div>}
          </div>
        );
      },
    },
    {
      title: CREATED_BY,
      dataIndex: 'createBy',
      key: 'createBy',
      filters: createbyFilters,
      onFilter: (value, record) => {
        return record.createBy === value;
      },
      sorter: (c1, c2) => {        
        const v1 = c1.createBy ? c1.createBy.trim() : '';
        const v2 = c2.createBy ? c2.createBy.trim() : '';
        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
    },
    {
      title: '',
      dataIndex:'action',
      key: 'action',
      width: 200,
      render: (text, record) => {

        const onDelete = async () => {
          const deleteCertificateIdList = {
            idSelectedLst: [record.certificateId],
          };
          const count = checkCertificate(deleteCertificateIdList);
          count.then(async function(result) {
            if(result.data > 0) {
              setdeleteConfirmVisible(true);
              setProfileCertificate(deleteCertificateIdList)
            } else {
              await deleteCertificate(deleteCertificateIdList);
              await dispatch(fetchCertificate());
              openNotification(Messages.SUCCESS, Messages.deleteSuccessMessage('Certificate'),'');
            }
          });
        };

        return (
          <CertificateAction
            key={record.certificateId}
            record={record}
            clearRowSelection={clearRowSelection}
            onDelete={onDelete}
            datasource={dataSource}
          />
        );
      },
    },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedDeleteCertificates(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      const inActives = selectedRows.filter(
        (item) => item.status === 1
      );
      if (inActives.length === 0) {
        setActiveAllVisible(false);
      } else {
        setActiveAllVisible(true);
      }
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  // TODO: sau khi ứng dụng có role và permission cần fix lại giá trị của createby cho đúng

  return (
    <div>
      <Row>
        <Col span={24}>
          <CertificateHeader
            selectedDeleteCertificate={selectedRowKeys}
            onDeleteAll={onDeleteAll}
            onActiveAll={onActiveAll}
            activeAllVisible={activeAllVisible}
            clearRowSelection={clearRowSelection}
            certificateList={dataSource}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24}>
        {isLoading ? (
          <Loading/>
        ) : (
          <Table
            rowKey={(record) => record.certificateId}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              // pageSize: 20,
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
      <CertificateDeleteConfirmModal
        visible={deleteConfirmVisible}
        data={profileCertificate}
        onCancel={() => {setdeleteConfirmVisible(false)}}
        onDone={() => {
          setdeleteConfirmVisible(false);
        }}
      />
    </div>
  );
});

export default Certificates;
