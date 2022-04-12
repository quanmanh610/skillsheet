import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TemplateProfileModal from './TemplateProfileModal';
import { addNewTemplateProfile } from '../../../../../api/setting';
import { fetchTemplateProfile } from '../../../../../store/slice/settingSlice';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { getUserData } from '../../../../../store/slice/authSlice';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';

const TemplateProfileHeader = ({ dataSource }) => {

  const dispatch = useDispatch();

  const user = useSelector(getUserData);

  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const onUpdate = () => {
    setUploadModalVisible(true);
  };

  const onSave = async (data) => {
    const response = await addNewTemplateProfile(data, user.userName);
    if (response) {
      dispatch(fetchTemplateProfile());
      setUploadModalVisible(false);
      openNotification(
        Messages.SUCCESS,
        Messages.addSuccessMessage('Template Profile'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.addUnsuccessMessage('Template Profile'),
        ''
      );
    }
  };

  return (
    <Space direction="vertical" className="margin-bottom-10">
      <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onUpdate}
        style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
      >
        Upload
      </Button>
      <TemplateProfileModal
        title="Upload Template Profile"
        visible={uploadModalVisible}
        onSave={onSave}
        onCancel={() => {
          setUploadModalVisible(false);
        }}
        dataSource={dataSource}
      />
    </Space>
  );
};

export default TemplateProfileHeader;
