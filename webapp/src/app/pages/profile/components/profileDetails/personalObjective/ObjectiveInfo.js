import React, { useState } from 'react';
import { EyeFilled, EditOutlined, EditFilled } from '@ant-design/icons';
import EditObjective from './EditObjective';
import ViewObjective from './ViewObjective';
import ProfileTitle from '../common/ProfileTitle';
import { Row, Col, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './personalObjective.css';

const ObjectiveInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const [isEdit, setIsedit] = useState(false);

  const isOwner = useSelector(isOwnerProfile);

  const compName = 'ObjectiveInfo';

  const onEdit = () => {
    // setIsedit(!isEdit);
    setEditingComponent(compName);
  }

  const onSaveinView = () => {
    // setIsedit(!isEdit);
    setEditingComponent('');
  }

  const onCancelinView = () => {
    // setIsedit(!isEdit);
    setEditingComponent('');
  }

  return (
    <div id="OBJECTIVEPANEL">
      
      <ProfileTitle
        name={"Objectives"}
        leftIcon={<EyeFilled />}
        rightIcon={<EditFilled />}
        onEdit={onEdit}
      />
      {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
        <Col span={23}>
          <Button size="small" type="primary" onClick={onEdit}>
            <EditOutlined /> Edit Objective
          </Button>
        </Col>
      </Row> */}
      {editingComponent === compName ? <EditObjective rootProfile={rootProfile} onSaveinView={onSaveinView} onCancelinView={onCancelinView} /> : <ViewObjective rootProfile={rootProfile} />}
    </div>
  );
};

export default ObjectiveInfo;
