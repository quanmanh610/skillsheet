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
import SchoolModal from './SchoolModal';
import { fetchSchool } from '../../../../store/slice/settingSlice';
import { addNewSchool } from '../../../../api/setting';
import { getUserData } from '../../../../store/slice/authSlice';
import { Messages } from '../../../../utils/AppMessage';
import { openNotification } from '../../../../components/OpenNotification';
import { Config } from '../../../../constants/AppConfiguration';
import { CSSConstants } from '../../../../constants/CSSConstants';

const SchoolHeader = ({
  selectedDeleteSchool,
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
    const newSchoolData = {
      category: null,
      name: null,
      status: null,
      createBy: userData ? userData.userName : 'admin',
    };
    Object.assign(newSchoolData, values);
    const response = await addNewSchool(newSchoolData);
    if (response) {
      await dispatch(fetchSchool());
      setVisible(false);
      openNotification(
        Messages.SUCCESS,
        Messages.addSuccessMessage('School'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.addUnsuccessMessage('School'),
        ''
      );
    }
  };

  return (
    <Space direction="horizontal">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddNew}
        size="small"
        style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
      >
        Add New
      </Button>
      {selectedDeleteSchool.length > 0 ? (
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
      <SchoolModal
        title="ADD NEW School"
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </Space>
  );
};

export default SchoolHeader;
