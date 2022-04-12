import React, { useState } from 'react';
import { Space, Button, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import ProjectRoleModal from './ProjectRoleModal';
import { fetchProjectRoles } from '../../../../store/slice/settingSlice';
import { addNewProjectrole } from '../../../../api/setting';
import { getUserData } from '../../../../store/slice/authSlice';
import { Messages } from '../../../../utils/AppMessage';
import { openNotification } from '../../../../components/OpenNotification';
import { Config } from '../../../../constants/AppConfiguration';
import { CSSConstants } from '../../../../constants/CSSConstants';

const ProjectRoleHeader = ({
  selectedDeleteProjectRole,
  onDeleteAll,
  onActiveAll,
  activeAllVisible,
  clearRowSelection,
}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const userData = useSelector(getUserData);
  const onAddNew = () => {
    setVisible(true);
    clearRowSelection();
  };

  const onSave = async (values) => {
    const newProjectRoleData = {
      name: null,
      status: null,
      createBy: userData ? userData.userName : 'admin',
    };
    Object.assign(newProjectRoleData, values);
    const response = await addNewProjectrole(newProjectRoleData);
    if (response) {
      await dispatch(fetchProjectRoles());
      setVisible(false);
      openNotification(
        Messages.SUCCESS,
        Messages.addSuccessMessage('Project Role'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.addUnsuccessMessage('Project Role'),
        ''
      );
    }
  };

  return (
    <Space direction="horizontal">
      {/*       <Button size="small" type="primary" onClick={onAddNew}>
        <PlusOutlined /> Add New
      </Button> */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddNew}
        size="small"
        style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
      >
        Add New
      </Button>
      {selectedDeleteProjectRole.length > 0 ? (
        <div>
          <Popconfirm
            title={Messages.DELETE_CONFIRM}
            onConfirm={onDeleteAll}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              type="primary"
              danger
              style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
          &nbsp;&nbsp;
          {activeAllVisible ? (
            <Popconfirm
              title={Messages.ACTIVE_CONFIRM}
              onConfirm={onActiveAll}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                type="primary"
                style={{
                  backgroundColor: CSSConstants.COLOR_GREEN,
                  borderColor: CSSConstants.COLOR_GREEN,
                  width: CSSConstants.BUTTON_WIDTH * 1.2,
                }}
                icon={<CheckCircleOutlined />}
              >
                Activate
              </Button>
            </Popconfirm>
          ) : (
              ''
            )}
        </div>
      ) : (
          ''
        )}
      <ProjectRoleModal
        title="ADD NEW PROJECT ROLE"
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </Space>
  );
};

export default ProjectRoleHeader;
