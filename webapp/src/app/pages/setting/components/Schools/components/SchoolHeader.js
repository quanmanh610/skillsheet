import React, { useState } from 'react';
import { Space, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';

import SchoolModal from './SchoolModal';
import { fetchSchool } from '../../../../../store/slice/settingSlice';
import { addNewSchool, deleteSchool } from '../../../../../api/setting';
import DeleteConfirm from '../../../../../components/DeleteConfirm';

const SchoolHeader = ({ SchoolIdLst, deleteBtnDisable }) => {
  const dispatch = useDispatch();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const onAddNew = () => {
    setAddModalVisible(true);
  };

  const onDeleteAll = () => {
    setDeleteModalVisible(true);
  };

  const onSave = async (values) => {
    const newSchoolData = {
      category: null,
      name: null,
      status: null,
      createby: 'admin',
    };
    Object.assign(newSchoolData, values);
    setAddModalVisible(false);
    await addNewSchool(newSchoolData);
    dispatch(fetchSchool());
  };

  return (
    <Space direction="horizontal">
      <Button size="small" type="primary" onClick={onAddNew}>
        <PlusOutlined /> Add New
      </Button>
      <SchoolModal
        title="ADD NEW School"
        visible={addModalVisible}
        onSave={onSave}
        onCancel={() => {
          setAddModalVisible(false);
        }}
      />
      <Button
        disabled={deleteBtnDisable}
        size="small"
        type="primary"
        danger
        onClick={onDeleteAll}
      >
        Delete
      </Button>
      <DeleteConfirm
        visible={deleteModalVisible}
        onDelete={async () => {
          setDeleteModalVisible(false);
          await deleteSchool(SchoolIdLst);
          dispatch(fetchSchool());
        }}
        onCancel={() => {
          setDeleteModalVisible(false);
        }}
      />
    </Space>
  );
};

export default SchoolHeader;
