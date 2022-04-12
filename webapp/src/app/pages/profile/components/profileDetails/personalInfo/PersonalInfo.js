import { Row } from 'antd';
import React from 'react';
import Intro from './IntroInfo';
import ViewPersonal from './ViewPersonal';

const PersonalInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {
  return (
    <div >
      <Row className='left-panel'>
        <div id="view-personal">
          <ViewPersonal
            rootProfile={rootProfile}
            editingComponent={editingComponent}
            setEditingComponent={setEditingComponent}
          />
        </div>   
      </Row>   
      {/* <Row className='left-panel'>
        <div className="border-bottom-solid container" id="intro">
          <Intro rootProfile={rootProfile} />
        </div>
      </Row> */}
    </div>
  );
};

export default PersonalInfo;
