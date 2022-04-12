import React, { useState } from 'react';
import { Space, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';

import SkillModal from './SkillModal';
import { fetchSkills } from '../../../../../store/slice/settingSlice';
import { addNewSkill, deleteSkill } from '../../../../../api/setting';
import DeleteConfirm from '../../../../../components/DeleteConfirm';

const SkillHeader = ({ skillIdLst, deleteBtnDisable }) => {
  const dispatch = useDispatch();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const onAddNew = () => {
    setAddModalVisible(true);
  };

  const onDeleteAll = () => {
    setDeleteModalVisible(true);
  };

  // TODO: sau khi ứng dụng có role và permission cần fix lại giá trị của createby cho đúng
  const onSave = async (values) => {
    const newSkillData = {
      category: null,
      name: null,
      status: null,
      createby: 'admin',
    };
    Object.assign(newSkillData, values);
    setAddModalVisible(false);
    await addNewSkill(newSkillData);
    dispatch(fetchSkills());
  };

  return (
    <Space direction="horizontal">
      <Button size="small" type="primary" onClick={onAddNew}>
        <PlusOutlined /> Add New
      </Button>
      <SkillModal
        title="ADD NEW SKILL"
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
          await deleteSkill(skillIdLst);
          dispatch(fetchSkills());
        }}
        onCancel={() => {
          setDeleteModalVisible(false);
        }}
      />
    </Space>
  );
};

export default SkillHeader;
