import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Space, Popconfirm } from 'antd';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { fetchSchool } from '../../../../store/slice/settingSlice';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import SchoolModal from './SchoolModal';
import { updateSchool } from '../../../../api/setting';

const SchoolActions = ({ record, clearRowSelection, onDelete }) => {
  const dispatch = useDispatch();
  const [editVisible, setEditVisible] = useState(false);

  const onSave = async (values) => {
    const updateSchoolData = {
      schoolId: record.schoolId,
      category: values.category,
      name: values.name,
      status: values.status,
      createBy: record.createBy,
      createdDate: record.createdDate ? record.createdDate : null
    };
    const response = await updateSchool(updateSchoolData);
    if (response) {
      setEditVisible(false);
      await dispatch(fetchSchool());
      openNotification(
        Messages.SUCCESS,
        Messages.editSuccessMessage('School'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.editUnsuccessMessage('School'),
        ''
      );
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        type="link"
        size="small"
        onClick={() => {
          setEditVisible(true);
          clearRowSelection();
        }}
        style={{ width: CSSConstants.BUTTON_WIDTH }}
        icon={<EditOutlined />}
      >
        Edit
      </Button>
      <SchoolModal
        title="EDIT School"
        visible={editVisible}
        onSave={onSave}
        onCancel={() => {
          setEditVisible(false);
        }}
        data={record}
      />
      <Popconfirm
        title={Messages.DELETE_CONFIRM}
        onConfirm={onDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button
          size="small"
          type="link"
          danger
          style={{ width: CSSConstants.BUTTON_WIDTH }}
          icon={<DeleteOutlined />}
          onClick={clearRowSelection}
        >
          Delete
        </Button>
      </Popconfirm>
    </div>
  );
};

export default SchoolActions;
