import React, { useState } from 'react';
import { Button } from 'antd';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { EditOutlined } from '@ant-design/icons';
import EditTemplateProfileModal from '../components/EditTemplateProfileModal';
import { addNewTemplateProfile, deleteTemplateProfile } from '../../../../../api/setting';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../../../../store/slice/authSlice';
import { fetchTemplateProfile } from '../../../../../store/slice/settingSlice';

const TemplateProfileActions = ({ record, dataSource }) => {
    const dispatch = useDispatch();
    const [editVisible, setEditVisible] = useState(false);
    const user = useSelector(getUserData);
  
    const onSave = async (templateId, data) => {
        const deletetemplateIdList = {
            idSelectedLst: [templateId],
          };
        const delete_response = await deleteTemplateProfile(deletetemplateIdList);
        if (delete_response) {
            const add_response = await addNewTemplateProfile(data, user.userName);
            if (add_response) {
                await dispatch(fetchTemplateProfile());
                await setEditVisible(false);
                openNotification(
                    Messages.SUCCESS,
                    Messages.editSuccessMessage('Template Profile'),
                    ''
                );
            } else {
                openNotification(
                    Messages.ERROR,
                    Messages.editUnsuccessMessage('Template Profile'),
                    ''
                );
            }
        }
    };
  
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="link"
            onClick={() => {
                setEditVisible(true);
            }}
            style={{ width: CSSConstants.BUTTON_WIDTH }}
        >
            Edit
        </Button>
        <EditTemplateProfileModal
            title="Edit Template Profile"
            visible={editVisible}
            dataSource={dataSource}
            record={record}
            onSave={onSave}
            onCancel={() => {
                setEditVisible(false);
            }}
        />
      </div>
    );
  };
  
  export default TemplateProfileActions;
  