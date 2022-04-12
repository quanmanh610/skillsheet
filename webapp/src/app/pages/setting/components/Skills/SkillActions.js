import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Space, Popconfirm } from 'antd';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { fetchSkills } from '../../../../store/slice/settingSlice';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import SkillModal from './SkillModal';
import { updateSkill } from '../../../../api/setting';

const SkillActions = ({ record, clearRowSelection, onDelete }) => {
  const dispatch = useDispatch();
  const [editVisible, setEditVisible] = useState(false);

  const onSave = async (values) => {
    const updateSkillData = {
      skillId: record.skillId,
      category: values.category,
      name: values.name,
      status: values.status,
      createBy: record.createBy,
      createdDate: record.createdDate ? record.createdDate : null
    };
    const response = await updateSkill(updateSkillData);
    if (response) {
      setEditVisible(false);
      await dispatch(fetchSkills());
      openNotification(
        Messages.SUCCESS,
        Messages.editSuccessMessage('Skill'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.editUnsuccessMessage('Skill'),
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
      <SkillModal
        title="EDIT SKILL"
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

export default SkillActions;
