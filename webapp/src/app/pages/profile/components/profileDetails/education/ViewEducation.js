import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import SubTitle from '../common/SubTitle';
import EditEducation from './EditEducation';
import DetaillEducation from './DetaillEducation';
import './education.css';

const ViewEducation = ({ educationsFromParent, onOpen, onEdit, onSave, onCancel, onDelete, onAddNew, editingComponent }) => {
  const [showMoreBtn, setShowMoreBtn] = useState(educationsFromParent.length > 3);

  const compName = 'EducationInfo';

  const onShowMoreItems = () => {
    setShowMoreBtn(!showMoreBtn);
  }

  const isHiddenItem = (index) => {
    if (index <= 2) {
      return false;
    } else {
      return showMoreBtn;
    }
  }

  const isHiddenEditItem = (education, index) => {
    if (index <= 2) {
      return false;
    } else if (education.educationId === null) {
      return false;
    } else {
      return showMoreBtn;
    }
  }

  const isHiddenShowMoreOrLessButton = () => {
    if (educationsFromParent.length <= 3) {
      return true;
    } else if (educationsFromParent.length === 4 && educationsFromParent[3].educationId === null) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      <Row justify="center">
        <Col span={23} >
          {educationsFromParent.map((education, index) =>
            <div key={education.educationId}>
              {education.educationId ? <div hidden={isHiddenItem(index)}><SubTitle
                onOpen={onOpen}
                onEdit={onEdit}
                identify={education.educationId}
                leftIcon={(education.isOpen) ? <RightOutlined style={{ transform: "rotate(90deg)", transition: "0.5s", fontSize: "12px" }} /> : <RightOutlined style={{ transform: "rotate(0deg)", transition: "0.5s", fontSize: "12px" }} />}
                rightIcon={<EditOutlined />}
                title={education.subject}
              >
              </SubTitle></div> : ""}
              {education.isOpen ? <div>

                {editingComponent === compName + education.educationId || (education.educationId === null && editingComponent === compName + 'New') ? <div hidden={isHiddenEditItem(education, index)}><EditEducation
                  educationFromParent={education} onSaveInParent={onSave} onCancelInParent={onCancel}
                  onDeleteInParent={onDelete}
                  onAddNewInParent={onAddNew}
                ></EditEducation></div> : <div hidden={isHiddenItem(index)}>
                    <DetaillEducation education={education} />
                    <hr/>
                  </div>}
              </div> : ""}
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "center", marginBottom: "10px" }}>
          <Button type="primary" shape="round" size="small" style={{ backgroundColor: "#FF7A00", borderColor: "#FF7A00" }} onClick={onShowMoreItems} hidden={isHiddenShowMoreOrLessButton()}>
            {showMoreBtn ? 'Show more' : 'Show less'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default ViewEducation;
