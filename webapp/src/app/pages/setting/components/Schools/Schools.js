import React, { useEffect, useState, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Table, Tag, Spin, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';
import { filterFormat } from '../../../../utils/filterFormat';
import { Config } from '../../../../constants/AppConfiguration';
import { CSSConstants } from '../../../../constants/CSSConstants';
import {
  fetchSchool,
  getSchoolInStore,
  sortSchools,
  getSchoolsBKInStore,
} from '../../../../store/slice/settingSlice';
import SchoolHeader from './SchoolHeader';
import SchoolActions from './SchoolActions';
import SchoolDeleteConfirmModal from './SchoolDeleteConfirmModal'
import { deleteSchool, activeAllSchool, checkSchool } from '../../../../api/setting';
import Loading from '../../../../components/Loading';

import { isLoadingStatus } from '../../../../store/slice/animationSlice';
import { HttpStatus } from '../../../../constants/HttpStatus';
import { CREATED_BY } from '../../../../constants/settings.constants';
import { SettingItemStatus } from '../../../../constants/SettingItemStatus';
import './School.css';

const Schools = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const dataSource = useSelector(getSchoolInStore);
  const dataSourceBK = useSelector(getSchoolsBKInStore);
  const [activeAllVisible, setActiveAllVisible] = useState(false);
  const [selectedDeleteSchools, setSelectedDeleteSchools] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const categoryFilters = filterFormat(dataSource, 'category');
  const nameFilters = filterFormat(dataSource, 'name');
  const statusFilters = filterFormat(dataSource, 'status');
  const createbyFilters = filterFormat(dataSource, 'createBy');
  const isLoading = useSelector(isLoadingStatus);
  const [deleteConfirmVisible, setdeleteConfirmVisible] = useState(false);
  const [profileSchool, setProfileSchool] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchSchool());
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
      setSelectedDeleteSchools(selectedRows);
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

  const onDeleteAll = async () => {
    const form = new FormData();
    const body = {
      idSelectedLst: [...selectedRowKeys],
    };
    const count = checkSchool(body);
    count.then(async function(result) {
      if(result.data > 0) {
        setdeleteConfirmVisible(true);
        setProfileSchool(body);
      } else {
        const response = await deleteSchool(body);
        if (response.status === HttpStatus.OK) {
          setSelectedRowKeys([]);
          await dispatch(fetchSchool());
          openNotification(
            Messages.SUCCESS,
            Messages.deleteSuccessMessage('School'),
            ''
          );
        } else {
          openNotification(
            Messages.ERROR,
            Messages.deleteUnsuccessMessage('School'),
            ''
          );
        }
      }
    });
  };

  const onActiveAll = async () => {
    const inActives = selectedDeleteSchools.filter(
      (item) => item.status === SettingItemStatus.INACTIVE
    );
    const deleteSchoolId = {
      idSelectedLst: [...selectedRowKeys],
    };
    if (inActives.length !== 0) {
      const response = await activeAllSchool(deleteSchoolId);
      if (response) {
        setSelectedRowKeys([]);
        await dispatch(fetchSchool());
        openNotification(
          Messages.SUCCESS,
          Messages.activeAllSuccessMessage('School'),
          ''
        );
      } else {
        openNotification(
          Messages.ERROR,
          Messages.activeAllUnsuccessMessage('School'),
          ''
        );
      }
    }
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: categoryFilters,
      onFilter: (value, record) => record.category === value,
      sorter: (s1, s2) => {        
        const v1 = s1.category ? s1.category.trim() : '';
        const v2 = s2.category ? s2.category.trim() : '';
        return v1.localeCompare(v2, undefined, { sensitivity: 'accent' });
      },
    },
    {
      title: 'School',
      dataIndex: 'name',
      key: 'name',
      filters: nameFilters,
      onFilter: (value, record) => record.name === value,
      sorter: (s1, s2) => {        
        const v1 = s1.name ? s1.name.trim() : '';
        const v2 = s2.name ? s2.name.trim() : '';
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
      sorter: (s1, s2) => {        
        return s1.status - s2.status;        
      },
      onFilter: (value, record) => (record.status === value),
      render: (text, record) => {
        return (
          <div id={record.Schoolid}>
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
      title: 'Created By',
      dataIndex: 'createBy',
      key: 'createBy',
      filters: createbyFilters,
      onFilter: (value, record) => record.createBy === value,
      sorter: (s1, s2) => {        
        const v1 = s1.createBy ? s1.createBy.trim() : '';
        const v2 = s2.createBy ? s2.createBy.trim() : '';
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
          const deleteSchoolIdList = {
            idSelectedLst: [record.schoolId],
          };
          const count = checkSchool(deleteSchoolIdList);
          count.then(async function(result) {
            if(result.data > 0) {
              setdeleteConfirmVisible(true);
              setProfileSchool(deleteSchoolIdList);
            } else {
              const resp = await deleteSchool(deleteSchoolIdList);
              if (resp) {
                // setDeleteEditVisible(false);
                await dispatch(fetchSchool());
                openNotification(Messages.SUCCESS, Messages.DELETE_SCHOOL_SUCCESS, '');
              } else {
                openNotification(Messages.ERROR, Messages.DELETE_SCHOOL_UNSUCCESS, '');
              }
            }
          });
        };
        return (
          <SchoolActions
            key={record.Schoolid}
            record={record}
            clearRowSelection={clearRowSelection}
            onDelete={onDelete}
          />
        );
      },
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    function compare(a, b) {
      if (a[sorter.field] > b[sorter.field])
        return sorter.order === 'ascend' ? 1 : -1;
      if (b[sorter.field] > a[sorter.field])
        return sorter.order === 'ascend' ? -1 : 1;
      return 0;
    }
    const sorted = [...dataSource].sort(compare);
    if (sorter.order) {
      dispatch(sortSchools(sorted));
    } else {
      dispatch(sortSchools(dataSourceBK));
    }
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <SchoolHeader
            selectedDeleteSchool={selectedRowKeys}
            onDeleteAll={onDeleteAll}
            onActiveAll={onActiveAll}
            activeAllVisible={activeAllVisible}
            clearRowSelection={clearRowSelection}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24}>
          {/* <div>{selectedDeleteSchoolKey}</div> */}
          {isLoading ? (
            <Loading />
          ) : (
              <Table
                rowKey={(record) => record.schoolId}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                  /*  defaultPageSize: Config.MENU_SETTING_PAGINATION, */
                  showSizeChanger: true,
                  defaultPageSize: 20,
                  size: "small",
                }}
                scroll={{ y: 240 }}
                onChange={handleTableChange}
                size='small'
                rowClassName={(record, index) => (record.status === SettingItemStatus.NEW ? 'highlight' : '')}
              />
            )}
        </Col>
      </Row>
      <SchoolDeleteConfirmModal
        visible={deleteConfirmVisible}
        data={profileSchool}
        onCancel={() => {setdeleteConfirmVisible(false)}}
        onDone={() => {
          setdeleteConfirmVisible(false);
        }}
      />
    </div>
  );
});

export default Schools;
