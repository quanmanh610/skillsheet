import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Popconfirm } from 'antd';
import { openNotification } from '../../../../components/OpenNotification';
import { Messages } from '../../../../utils/AppMessage';
import { CSSConstants } from '../../../../constants/CSSConstants';
import { fetchEmails } from '../../../../store/slice/settingSlice';
import {
  EditOutlined,
  MailOutlined,
} from '@ant-design/icons';
import EmailModal from './EmailModal';
import {
  updateEmail,
  sendUpdateRequestToStaff,
} from '../../../../api/setting';
import { HttpStatus } from '../../../../constants/HttpStatus';

const EmailActions = ({ record, sending, dataSource }) => {
  const dispatch = useDispatch();
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteEditVisible] = useState(false);

  const onSave = async (values) => {
    const updateEmailData = {
      schedule: null,
      haveRepeat: null,
      day: null,
      time: null,
    };
    Object.assign(updateEmailData, values);
    const response = await updateEmail(updateEmailData);
    if (response) {
      setEditVisible(false);
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

  const onRequestUpdate = async () => {
    if (dataSource[0].status === "Active") {
      sending(true);
      const resp = await sendUpdateRequestToStaff();
      sending(false);
      if (resp.status === HttpStatus.OK) {
        if ('UPDATE_REQUEST_TO_STAFF_FAIL' === resp.data.errorMessage) {
          openNotification(
            Messages.ERROR,
            Messages.UPDATE_REQUEST_EMAIL_UNSUCCESS,
            ''
          );
        } else {
          openNotification(
            Messages.SUCCESS,
            Messages.UPDATE_REQUEST_EMAIL_SUCCESS,
            ''
          );
        }
      } else {
        openNotification(
          Messages.SUCCESS,
          Messages.UPDATE_REQUEST_EMAIL_SUCCESS,
          ''
        );
      }
    } else {
      openNotification(
        Messages.WARNING,
        Messages.UPDATE_REQUEST_EMAIL_INACTIVE_STATUS,
        ''
      );
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        type="link"
        size="small"
        onClick={() => {
          setEditVisible(true);
        }}
        style={{ width: CSSConstants.BUTTON_WIDTH * 1.8 }}
        icon={<EditOutlined />}
      >
        Edit
      </Button>
      
      <Popconfirm
        title={Messages.UPDATE_REQUEST_CONFIRM}
        onConfirm={onRequestUpdate}
        okText="Yes"
        cancelText="No"
      >
        <Button
          size="small"
          type="link"
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.8 }}
          icon={<MailOutlined />}
        >
          Request Update
        </Button>
      </Popconfirm>
      <EmailModal
        title="Edit Email Settings"
        visible={editVisible}
        onSave={onSave}
        onCancel={() => {
          setEditVisible(false);
        }}
        data={record}
      />
    </div>
  );
};

export default EmailActions;
