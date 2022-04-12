import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './ProfileTitle.css';

const { Text } = Typography;
const ProfileTitle = ({ leftIcon, rightIcon, name, onAddNew, onEdit }) => {

  const isOwner = useSelector(isOwnerProfile);
  return (
    <div className="border-bottom-solid profile-section-title">
      <Row justify="center">
        <Col span={20}>
          <span>{leftIcon}</span>
          <Text className="margin-left-10" style={{color: "white"}}>
            {name.toUpperCase()}
          </Text>
        </Col>
        <Col span={4}>
          <Button            
            //id={'btnAddEdit' + name.replaceAll(' ', '')}
            id={'btnAddEdit' + name.replace(/\s/g, '')}            
            size="small"
            className="fl-right section-buttons"
            disabled={!isOwner}
            onClick={() => {
              if (onAddNew) {
                onAddNew();
              }
              if (onEdit) {
                onEdit();
              }
            }}
            icon={rightIcon}
          >   
          {
            onAddNew ? "Add New" : onEdit ? "Edit" : ''
          }   
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileTitle;
