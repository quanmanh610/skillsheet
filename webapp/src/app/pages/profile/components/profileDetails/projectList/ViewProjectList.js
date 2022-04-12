import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import SubTitle from '../common/SubTitle';
import EditProjectList from './EditProjectList';
import DetailProjectList from './DetailProjectList';
import moment from 'moment';
import { monthFormat } from '../../../../../constants/DateTimes';

const ViewProjectList = ({
  projectsFromParent,
  onOpen,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAddNew,
  bestSkill,
  editingComponent,
}) => {

  const compName = 'ProjectListInfo';

  const [showMoreBtn, setShowMoreBtn] = useState(
    projectsFromParent.length > 3
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

  const isHiddenEditItem = (project, index) => {
    if (index <= 2) {
      return false;
    } else if (project.projectId === null) {
      return false;
    } else {
      return showMoreBtn;
    }
  };

  const isHiddenShowMoreOrLessButton = () => {
    if (projectsFromParent.length <= 3) {
      return true;
    } else if (projectsFromParent.length === 4 && projectsFromParent[3].projectId === null) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      <Row justify="center">
        <Col span={23}>
          {projectsFromParent.map((project, index) => (
            <div key={project.projectId}>
              {project.projectId ? (
                <div hidden={isHiddenItem(index)}>
                  <SubTitle
                    onOpen={onOpen}
                    onEdit={onEdit}
                    identify={project.projectId}
                    leftIcon={
                      project.isOpen ? (
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
                    fromMtoM={
                      ' From: ' +
                      moment(project.fromMonth).format(monthFormat) +
                      ' To: ' +
                      moment(project.toMonth).format(monthFormat)
                    }
                    title={project.title + ' (From: ' +
                      moment(project.fromMonth).format(monthFormat) +
                      ' - To: ' +
                      moment(project.toMonth).format(monthFormat) + ')'}
                  ></SubTitle>
                </div>
              ) : (
                ''
              )}
              {project.isOpen ? (
                <div>
                  {(editingComponent === compName + project.projectId || (editingComponent === compName + 'New' && project.projectId === null)) ? (
                    <div hidden={isHiddenEditItem(project, index)}>
                      <EditProjectList
                        projectFromParent={project}
                        onSaveInParent={onSave}
                        onCancelInParent={onCancel}
                        onDeleteInParent={onDelete}
                        onAddNewInParent={onAddNew}
                        bestSkill={bestSkill}
                      ></EditProjectList>
                    </div>
                  ) : (
                    <div hidden={isHiddenItem(index)}>
                      <DetailProjectList
                        project={project}
                        bestSkill={bestSkill}
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
export default ViewProjectList;
