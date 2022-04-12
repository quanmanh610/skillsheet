import { MoreOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { cloneNewVersion, requestApprove, requestSubmitCandidateProfile, setMainVersion } from '../../../../../api/profile';
import { openNotification } from '../../../../../components/OpenNotification';
import { HttpStatus } from '../../../../../constants/HttpStatus';
import { POARoles } from '../../../../../constants/POARoles';
import { getUserData } from '../../../../../store/slice/authSlice';
import { isOwnerProfile, updateStoreProfile } from '../../../../../store/slice/profileSlice';
import { Messages } from '../../../../../utils/AppMessage';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import DownloadProfileModal from '../../../../home/DownloadProfileModal';
import './FunctionButtons.css';

const { Text } = Typography;

const FunctionButtons = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const isOwner = useSelector(isOwnerProfile);

  const {profile} = props;

  const isRecruiter = () => {
    if (user.roles && user.roles.find((r) => r.name === POARoles.RECRUITER)) {
      return true;
    }
    return false;
  };

  const onDownloadProfile = async () => {
    const profileId = profile.profileId;
    setShowDownloadModal(true);    
  };

  const onRequestApprove = async () => {
    const resp = await requestApprove({
      profileId: profile.profileId,
      group: user.group,
      du: user.du,
      fullName: user.fullName,
      userName: user.userName
    });
    if (resp && resp.status === HttpStatus.OK) {
      openNotification(Messages.SUCCESS, 'Request sent', '');
      dispatch(updateStoreProfile(resp.data));
    }
  };

  const onCloneNewVersion = async () => {
    const resp = await cloneNewVersion(
      typeof profile.avatar === 'string'
        ? { ...profile, avatar: convertDataURIToBinary(profile.avatar) }
        : profile
    );
    if (resp.status === HttpStatus.OK) {
      openNotification(
        Messages.SUCCESS,
        'New Version has been cloned successfully',
        ''
      );
      dispatch(updateStoreProfile(resp.data));
      //setEditMode(true);
    }
  };

  const onViewVersionList = async () => {
    history.push('/profile?v=versions');
  };

  const onSetMainVersion = async () => {
    const resp = await setMainVersion({
      profileId: profile.profileId,
      group: user.group,
      du: user.du,
      fullName: user.fullName,
      userName: user.userName
    });
    if (resp) {
      if (resp.status === HttpStatus.OK) {
        openNotification(Messages.SUCCESS, 'Set main version successfully', '');
        dispatch(updateStoreProfile(resp.data));
      }
    } else {
      openNotification(Messages.ERROR, 'Server does not respond');
    }
  };

  const menu = () => {
    return (
      <Menu>
        <Menu.Item key="0" onClick={onDownloadProfile} id='btnDownloadProfile'>
          <Text>Download</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          id='btnRequestProfileApproval'
          key="1"
          onClick={onRequestApprove}
          disabled={!isOwner || profile.status === 'Submitted'}
        >
          <Text>Request Profile Approval</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2" onClick={onCloneNewVersion} disabled={!isOwner} id='btnCloneNewVersion'>
          <Text>Clone New Version</Text>
        </Menu.Item>
        <Menu.Item key="3" onClick={onViewVersionList} disabled={!isOwner} id='btnViewListOfVersions'>
          <Text>View List Of Versions</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          id='btnSetMainVersion'
          key="4"
          onClick={onSetMainVersion}
          disabled={
            !isOwner ||
            (profile.version && profile.version.versionType === 'Main')
          }
        >
          <Text>Set As Main Version</Text>
        </Menu.Item>
      </Menu>
    );
  };

  const onSubmitCandidateProfile = async () => {
    const resp = await requestSubmitCandidateProfile({
          profileId: profile.profileId,
          group: user.group,
          du: user.du,
          fullName: user.fullName,
        }
    );
    if (resp && resp.status === HttpStatus.OK) {
      openNotification(
        Messages.SUCCESS,
        'Your request has been sent successfully',
        ''
      );
      dispatch(updateStoreProfile(resp.data));
    }
  };

  return (
    <Row justify="end" style={{width: '100%'}}>
      <Col span={24} className="personal-menu">
        {user.isCandidate ? (
          <div>
            <Row>
              <Button
                id='btnSubmitProfile'
                type="primary"                
                icon={<SendOutlined />}
                onClick={onSubmitCandidateProfile}
              >
                Submit
              </Button>
              &nbsp;&nbsp;&nbsp;
            </Row>
          </div>
        ) : isRecruiter() ? (
          <div>
            <Row>
              <Dropdown overlay={menu()} trigger={['click']}>
                <Button
                  id='btnProfileMore'
                  type="primary"                                       
                >
                  More
                </Button>
              </Dropdown>
            </Row>
          </div>
        ) : (
          <Dropdown overlay={menu()} trigger={['click']}>
              <Button
                id='btnProfileMore'
                type="primary"
              >
                More
              </Button>
            </Dropdown>
        )}

        <div>&nbsp;&nbsp;&nbsp;</div>
      </Col>
        { profile ?
        <DownloadProfileModal
          key="downloadProfileModal"
          visible={showDownloadModal}
          profileId={profile.profileId}
          profileFullName={profile.staff ? profile.staff.fullName : profile.profileId}
          onCancel={() => setShowDownloadModal(false)}
        /> :
        null
      }
    </Row>
  );
};

export default FunctionButtons;
