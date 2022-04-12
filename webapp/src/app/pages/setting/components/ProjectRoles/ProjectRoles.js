import React, { useEffect, useState, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Table, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';
import { filterFormat } from '../../../../utils/filterFormat';
import { CSSConstants } from '../../../../constants/CSSConstants';
import {
  fetchProjectRoles,
  getProjectRolesInStore,
  sortProjectRoles,
  getProjectRolesBKInStore,
} from '../../../../store/slice/settingSlice';
import ProjectRoleHeader from './ProjectRoleHeader';
import ProjectRoleActions from './ProjectRoleActions';
import RoleDeleteConfirmModal from './RoleDeleteConfirmModal'
import {
  deleteProjectrole,
  activeAllProjectrole,
  checkRole,
} from '../../../../api/setting';
import Loading from '../../../../components/Loading';

import { isLoadingStatus } from '../../../../store/slice/animationSlice';
import { HttpStatus } from '../../../../constants/HttpStatus';
import { SettingItemStatus } from '../../../../constants/SettingItemStatus';

const ProjectRoles = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const dataSource = useSelector(getProjectRolesInStore);
  const dataSourceBK = useSelector(getProjectRolesBKInStore);
  const [activeAllVisible, setActiveAllVisible] = useState(false);
  const [selectedDeleteProjectRoles, setSelectedDeleteProjectRoles] = useState(
    []
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const isLoading = useSelector(isLoadingStatus);
  const [deleteConfirmVisible, setdeleteConfirmVisible] = useState(false);
  const [profileRole, setProfileRole] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchProjectRoles());
    }
    fetchData();
  }, []);

  const nameFilters = filterFormat(dataSource, 'name');
  const statusFilters = filterFormat(dataSource, 'status');
  const createbyFilters = filterFormat(dataSource, 'createBy');
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
      setSelectedDeleteProjectRoles(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      const inActives = selectedRows.filter(
        (item) => item.status === SettingItemStatus.INACTIVE
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
    const count = checkRole(body);
    count.then(async function(result) {
      if(result.data > 0) {
        setdeleteConfirmVisible(true);
        setProfileRole(body);
      } else {
        const response = await deleteProjectrole(body);
        if (response.status === HttpStatus.OK) {
          setSelectedRowKeys([]);
          await dispatch(fetchProjectRoles());
          openNotification(
            Messages.SUCCESS,
            Messages.deleteSuccessMessage('Project Role'),
            ''
          );
        } else {
          openNotification(
            Messages.ERROR,
            Messages.deleteUnsuccessMessage('Project Role'),
            ''
          );
        }
      }
    });
  };

  const onActiveAll = async () => {
    const inActives = selectedDeleteProjectRoles.filter(
      (item) => item.status === SettingItemStatus.INACTIVE
    );
    const deleteProjectRoleId = {
      idSelectedLst: [...selectedRowKeys],
    };
    if (inActives.length !== 0) {
      const response = await activeAllProjectrole(deleteProjectRoleId);
      if (response) {
        setSelectedRowKeys([]);
        await dispatch(fetchProjectRoles());
        openNotification(
          Messages.SUCCESS,
          Messages.activeAllSuccessMessage('Project Roles'),
          ''
        );
      } else {
        openNotification(
          Messages.ERROR,
          Messages.activeAllUnsuccessMessage('Project Roles'),
          ''
        );
      }
    }
  };

  const columns = [
    {
      title: 'Project Role',
      dataIndex: 'name',
      key: 'name',
      filters: nameFilters,
      onFilter: (value, record) => record.name === value,
      sorter: (r1, r2) => {        
        const v1 = r1.name ? r1.name.trim() : '';
        const v2 = r2.name ? r2.name.trim() : '';
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
      sorter: (r1, r2) => {        
        return r1.status - r2.status;
      },
      onFilter: (value, record) => record.status === value,
      render: (text, record) => {
        return (
          <div id={record.projectRoleId}>
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
          const deleteProjectRoleIdList = {
            idSelectedLst: [record.projectRoleId],
          };
          const count = checkRole(deleteProjectRoleIdList);
          count.then(async function(result) {
            if(result.data > 0) {
              setdeleteConfirmVisible(true);
              setProfileRole(deleteProjectRoleIdList);              
            } else {
              const resp = await deleteProjectrole(deleteProjectRoleIdList);
              if (resp) {
                // setDeleteEditVisible(false);
                await dispatch(fetchProjectRoles());
                openNotification(Messages.SUCCESS, Messages.DELETE_PROJECTROLE_SUCCESS, '');
              } else {
                openNotification(Messages.ERROR, Messages.DELETE_PROJECTROLE_UNSUCCESS, '');
              }
            }
          });
        };
        return (
          <ProjectRoleActions
            key={record.projectRoleId}
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
      dispatch(sortProjectRoles(sorted));
    } else {
      dispatch(sortProjectRoles(dataSourceBK));
    }
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <ProjectRoleHeader
            selectedDeleteProjectRole={selectedRowKeys}
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
          {/* <div>{selectedDeleteProjectRoleKey}</div> */}
          {isLoading ? (
            <Loading />
          ) : (
              <Table
                rowKey={(record) => record.projectRoleId}
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
      <RoleDeleteConfirmModal
        visible={deleteConfirmVisible}
        data={profileRole}
        onCancel={() => {setdeleteConfirmVisible(false)}}
        onDone={() => {
          setdeleteConfirmVisible(false);
        }}
      />
    </div>
  );
});

export default ProjectRoles;
