import React, { useState, useEffect } from 'react';
import { Space, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import EmailModal from './EmailModal';
import { fetchEmails } from '../../../../store/slice/settingSlice';
import { Messages } from '../../../../utils/AppMessage';
import { openNotification } from '../../../../components/OpenNotification';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { updateEmail, addNewEmail } from '../../../../api/setting';
import { HttpStatus } from '../../../../constants/HttpStatus';

const EmailHeader = ({ data }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    setConfigData(data ? data[0] : null);
  }, [data]);

  const onAddNew = () => {
    setVisible(true);
  };

  const editFromHeader = () => {
    setVisibleEdit(true);
  };
  const onSaveEdit = async (values) => {
    const updateEmailData = {
      emailId: configData.emailId,
      schedule: null,
      haveRepeat: null,
      day: null,
      time: null,
      createdDate: configData.createdDate,
    };
    Object.assign(updateEmailData, values);
    const response = await updateEmail(updateEmailData);
    if (response) {
      setVisibleEdit(false);
      await dispatch(fetchEmails());
      openNotification(
        Messages.SUCCESS,
        Messages.editSuccessMessage('Email Setting'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.editUnsuccessMessage('Email Setting'),
        ''
      );
    }
  };

  const onSave = async (values) => {
    const updateEmailData = {
      schedule: null,
      haveRepeat: null,
      day: null,
      time: null,
    };
    Object.assign(updateEmailData, values);
    const response = await addNewEmail(updateEmailData);
    if (response) {
      setVisible(false);
      await dispatch(fetchEmails());
      openNotification(
        Messages.SUCCESS,
        Messages.addSuccessMessage('Email Setting'),
        ''
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.addUnsuccessMessage('Email Setting'),
        ''
      );
    }
  };

  return (
    <Space direction="horizontal">
      {/*       <Button size="small" type="primary" onClick={onAddNew}>
        <PlusOutlined /> Add New
      </Button> */}
      {data.length == 0 ? (
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddNew}
            size="small"
            style={{ width: CSSConstants.BUTTON_WIDTH * 1.4 }}
          >
            Add Config
          </Button>

          <EmailModal
            title="ADD NEW EMAIL SETTING"
            visible={visible}
            onSave={onSave}
            onCancel={() => {
              setVisible(false);
            }}
          />
        </div>
      ) : (
          <div>
            <Button
              type="primary"
              size="small"
              onClick={editFromHeader}
              style={{ width: CSSConstants.BUTTON_WIDTH * 1.4 }}
              icon={<EditOutlined />}
            >
              Edit Config
          </Button>
            <EmailModal
              title="EDIT EMAIL SETTING"
              visible={visibleEdit}
              onSave={onSaveEdit}
              data={configData}
              onCancel={() => {
                setVisibleEdit(false);
              }}
            />
          </div>
        )}
    </Space>
  );
};

export default EmailHeader;
