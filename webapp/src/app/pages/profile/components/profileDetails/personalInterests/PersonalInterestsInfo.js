import React, { useState } from 'react';
import { StarFilled, PlusOutlined, EditOutlined, EditFilled } from '@ant-design/icons';
import ProfileTitle from '../common/ProfileTitle';
import EditPersonalInterests from './EditPersonalInterests';
import ViewPersonalInterests from './ViewPersonalInterests';
import { Row, Col, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './personalInterests.css';

const PersonalInterestsInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const [isEdit, setIsedit] = useState(false);

  const isOwner = useSelector(isOwnerProfile);

  const compName = 'PersonalInterestsInfo';

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
    <div id="PERSONALINTERESTSPANEL">
      <ProfileTitle
        name={"Personal Interests"}
        leftIcon={<StarFilled />}
        rightIcon={<EditFilled />}
        onEdit={onEdit}
      />
      {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
        <Col span={23}>
          <Button size="small" type="primary" onClick={onEdit}>
            <EditOutlined /> Edit Personal Interests
          </Button>
        </Col>
      </Row> */}
      {editingComponent === compName ? <EditPersonalInterests rootProfile={rootProfile} onSaveinView={onSaveinView} onCancelinView={onCancelinView} /> : <ViewPersonalInterests rootProfile={rootProfile} />}
    </div>
  );
};

export default PersonalInterestsInfo;
