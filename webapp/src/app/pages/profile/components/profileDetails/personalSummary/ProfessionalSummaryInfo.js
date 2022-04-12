import React, { useState } from 'react';
import { PushpinFilled, PlusOutlined, EditOutlined, EditFilled } from '@ant-design/icons';
import ProfileTitle from '../common/ProfileTitle';
import EditProfessional from './EditProfessional';
import ViewProfessional from './ViewProfessional';
import { Row, Col, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './personalSummary.css';

const ProfessionalSummaryInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const [isEdit, setIsedit] = useState(false);

  const isOwner = useSelector(isOwnerProfile);
  
  const compName = 'ProfessionalSummaryInfo';

  const onEdit = () => {
    setEditingComponent(compName);
    // setIsedit(!isEdit);
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
    <div id="PROFESSIONALSUMMARYPANEL">
      <ProfileTitle
        name={"Professional Summary"}
        leftIcon={<PushpinFilled />}
        rightIcon={<EditFilled />}
        onEdit={onEdit}
      /> 
      {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
        <Col span={23}>
          <Button size="small" type="primary" onClick={onEdit}>
            <EditOutlined /> Edit Professional Summary
          </Button>
        </Col>
      </Row> */}
      {editingComponent === compName ? <EditProfessional rootProfile={rootProfile} onSaveinView={onSaveinView} onCancelinView={onCancelinView} /> : <ViewProfessional rootProfile={rootProfile} />}
    </div>
  );
};

export default ProfessionalSummaryInfo;
