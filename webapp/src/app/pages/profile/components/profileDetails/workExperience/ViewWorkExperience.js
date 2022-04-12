import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import SubTitle from '../common/SubTitle';
import EditWorkExperience from './EditWorkExperience';
import DetailWorkExperience from './DetailWorkExperience';

const ViewWorkExperience = ({
  workExperiencesFromParent,
  onOpen,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAddNew,
  editingComponent,
}) => {

  const compName = 'WorkExperienceInfo';

  const [showMoreBtn, setShowMoreBtn] = useState(
    workExperiencesFromParent.length > 3
  );

  const onShowMoreItems = () => {
    setShowMoreBtn(!showMoreBtn);
  };

  const isHiddenItem = (index) => {
    if (index <= 2) {
      return false;
    } else {
      return showMoreBtn;
    }
  };

  const isHiddenEditItem = (workExperience, index) => {
    if (index <= 2) {
      return false;
    } else if (workExperience.workExperienceId === null) {
      return false;
    } else {
      return showMoreBtn;
    }
  };

  const isHiddenShowMoreOrLessButton = () => {
    if (workExperiencesFromParent.length <= 3) {
      return true;
    } else if (workExperiencesFromParent.length === 4 && workExperiencesFromParent[3].workExperienceId === null) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      <Row justify="center">
        <Col span={23}>
          {workExperiencesFromParent.map((workExperience, index) => (
            <div key={workExperience.workExperienceId}>
              {workExperience.workExperienceId ? (
                <div hidden={isHiddenItem(index)}>
                  <SubTitle
                    onOpen={onOpen}
                    onEdit={onEdit}
                    identify={workExperience.workExperienceId}
                    leftIcon={
                      workExperience.isOpen ? (
                        <RightOutlined
                          style={{
                            transform: 'rotate(90deg)',
                            transition: '0.5s',
                            fontSize: '12px',
                          }}
                        />
                      ) : (
                        <RightOutlined
                          style={{
                            transform: 'rotate(0deg)',
                            transition: '0.5s',
                            fontSize: '12px',
                          }}
                        />
                      )
                    }
                    rightIcon={<EditOutlined />}
                    title={workExperience.position}
                  ></SubTitle>
                </div>
              ) : (
                ''
              )}
              {workExperience.isOpen ? (
                <div>
                  {editingComponent === compName + workExperience.workExperienceId || (workExperience.workExperienceId === null && editingComponent === compName + 'New') ? (
                    <div hidden={isHiddenEditItem(workExperience, index)}>
                      <EditWorkExperience
                        workExperienceFromParent={workExperience}
                        onSaveInParent={onSave}
                        onCancelInParent={onCancel}
                        onDeleteInParent={onDelete}
                        onAddNewInParent={onAddNew}
                      ></EditWorkExperience>
                    </div>
                  ) : (
                    <div hidden={isHiddenItem(index)}>
                      <DetailWorkExperience
                        workExperience={workExperience}
                      />
                      <hr/>
                    </div>
                  )}
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
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
export default ViewWorkExperience;
