import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  Typography,
  Avatar,
  Dropdown,
  Input,
  Select,
  Upload,
  Tooltip,
} from 'antd';
import {
  EditFilled,
  UserOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../../../../store/slice/authSlice';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { Nationality } from '../../../../../constants/Nationality';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';
import {
  updateProfile,
} from '../../../../../api/profile';
import moment from 'moment';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import { dateFormat } from '../../../../../constants/DateTimes';
import { RegularExpressions } from '../../../../../utils/RegularExpressions';
import { Constants } from '../../../../../constants/Constants';
import {
  fetchProfileById,
  isOwnerProfile,
} from '../../../../../store/slice/profileSlice';
import {
  fetchProjectRoles,
  getActiveProjectRolesInStore,
} from '../../../../../store/slice/settingSlice';
import './PersonalInfo.css';
import { MaritalStatus } from '../../../../../constants/MaritalStatus';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const { Text } = Typography;

const ViewPersonal = ({ rootProfile, editingComponent, setEditingComponent }) => {
  const dispatch = useDispatch();

  // const history = useHistory();

  const user = useSelector(getUserData);

  const isOwner = useSelector(isOwnerProfile);

  const compName = 'PersonalInfo';

  const projectRoles = useSelector(getActiveProjectRolesInStore);

  const [isEditMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState(rootProfile);

  const [imageUrl, setImageUrl] = useState(profile ? profile.avatar : '');

  const [imageUrlBK, setImageUrlBK] = useState(profile ? profile.avatar : '');
  const $ = window.$;

  useEffect(() => {
    setProfile(rootProfile ? rootProfile : {});
    setImageUrl(rootProfile ? rootProfile.avatar : '');
    setImageUrlBK(rootProfile ? rootProfile.avatar : '');
  }, [rootProfile]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchProjectRoles());
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      if (document.getElementById('verion_name_input')) {
        document.getElementById('verion_name_input').focus();
      }
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!editingComponent.includes(compName)) {
      setProfile(rootProfile);
    }
  }, [editingComponent]);

  const handleGenderChange = (e) => {
    setProfile({
      ...profile,
      gender: e.target.value,
    })
  }

  const handleNationalityChange = (e) => {
    const newProfile = {
      ...profile,
      nationality: e.target.value,
    };
    setProfile(newProfile);
  };

  const handleProjectRoleChange = (e) => {
    const newProfile = {
      ...profile,
      roleName: e.target.value,
    };
    setProfile(newProfile);
  };

  const handleMaritalStatusChange = (e) => {
    const newProfile = {
      ...profile, maritalStatus: e.target.value
    };
    setProfile(newProfile);
  };

  const handleInputChange = (e) => {
    const newProfile = {
      ...profile,
      [e.target.name]: e.target.value,
    };
    setProfile(newProfile);
  };

  const handleVersionNameChange = (e) => {
    const newProfile = {
      ...profile,
      version: { ...profile.version, versionName: e.target.value },
    };
    setProfile(newProfile);
  };

  const handleDatePickerChange = (date) => {
    if (moment(date).isValid()) {
      const newProfile = {
        ...profile,
        birthday: moment(date),
      };
      setProfile(newProfile);
    }
  };

  const onSavePersionalInfo = async () => {
    const minDateOfBirth = moment().subtract(200, 'years');
    if (
      !profile.birthday ||
      !profile.phone ||
      !profile.nationality ||
      !profile.gender ||
      !profile.maritalStatus ||
      !profile.roleName ||
      !profile.version.versionName
    ) {      
      openNotification(
        Messages.ERROR,
        'Must to fill all personal information before saving.',
        ''
      );
      return;
    }
    if (!RegularExpressions.VN_PHONE_NUMBER.test(profile.phone)) {
      openNotification(Messages.ERROR, 'Phone number is not correct.', '');
      return;
    }
    if (profile.version.versionName.trim() === "") {
      openNotification(Messages.ERROR, 'Version name cannot contain only white space characters.', '');
      return;
    }

    if (!moment(profile.birthday).isBetween(minDateOfBirth, undefined)) {
      openNotification(Messages.ERROR, 'Date of birth is not correct.', '');
      return;
    }

    const resp = await updateProfile(
      typeof profile.avatar === 'string'
        ? { ...profile, avatar: convertDataURIToBinary(profile.avatar) }
        : profile
    );

    if (!resp?.errorMessage) {
      dispatch(fetchProfileById({ profileId: profile.profileId }));
      openNotification(
        Messages.SUCCESS,
        Messages.editSuccessMessage('Personal Info'),
        ''
      );
      setEditMode(!isEditMode);
    }

    setEditingComponent('');
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg';
    if (!isJpgOrPng) {
      openNotification(Messages.ERROR, 'You can only upload JPG file!', '');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      openNotification(Messages.ERROR, 'Image must smaller than 2MB!', '');
    }
    return isJpgOrPng && isLt2M;
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChangeAvatar = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        const newProfile = {
          ...profile,
          avatar: convertDataURIToBinary(imageUrl),
        };
        setProfile(newProfile);
      });
    }
  };

  const displayRoles = () => {
    //var displayRoles = profile.roleName?.replaceAll(",", ", ");
    var displayRoles = profile.roleName?.replace(/,/g, ", ");
    return (
      <div>
        {displayRoles}
      </div>)
  }

  return (
    <>
      <Row>
        <Col span={3}></Col>
        <Col span={16} className="avatar-area">
          {profile.avatar !== Constants.BASE64_IMG_HEADER ? (
            <Avatar
              size={editingComponent === compName ? 96 : 96}
              src={imageUrl}
              icon={<UserOutlined />}
            />
          ) : (
              <Avatar size={editingComponent === compName ? 96 : 96} icon={<UserOutlined />} />
            )}
          {editingComponent === compName ? (
            <Upload
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChangeAvatar}
            >
              <Button size="middle" type="text">
                <UploadOutlined />
              </Button>
            </Upload>
          ) : (
              ''
            )}
        </Col>
        <Col span={5} className="personal-menu">
          <Button
            icon={<EditFilled />}
            type="link"
            size="small"
            hidden={!isOwner}
            onClick={() => {
              setEditMode(!isEditMode);
              setEditingComponent(compName)
              setImageUrl(imageUrlBK);
              setProfile(rootProfile);
            }}
          >
            Edit
          </Button>
        </Col>
      </Row>
      <Row hidden={user.isCandidate}>
        <Col span={2}></Col>
        <Col span={22}>
          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}><Text strong>Version</Text></Col>
            <Col span={16}>
              {editingComponent === compName ?
                <Input
                  id="verion_name_input"
                  className="personal-info-field"
                  style={{ textOverflow: "ellipsis", borderRadius: "1px", backgroundColor: profile.version ? profile.version.versionType === "Main" ? "#52c41a" : "#f0f0f0" : "", color: profile.version ? profile.version.versionType === "Main" ? "white" : "black" : "", paddingLeft: 5, paddingRight: 5, width: "200px" }}
                  name="versionName"
                  onChange={handleVersionNameChange}
                  value={profile.version.versionName}
                  size="small"
                  maxLength={254}
                /> :
                <Tooltip placement="left" color={profile && profile.version && profile.version.versionType ? profile.version.versionType === "Main" ? "#52c41a" : "orange" : ""} title={profile.version ? profile.version.versionName : ""}>
                  <Text style={{ orderRadius: "1px", backgroundColor: profile.version ? profile.version.versionType === "Main" ? "#52c41a" : "#f0f0f0" : "", color: profile.version ? profile.version.versionType === "Main" ? "white" : "black" : "", paddingLeft: 5, paddingRight: 5, paddingBottom: 1, paddingTop: 1 }}>
                    {profile.version ? " " + profile.version.versionName.length > 40 ? profile.version.versionName.substring(0, 30) + " ..." : profile.version.versionName + " " : ""}
                  </Text>
                </Tooltip>
              }
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={2}></Col>
        <Col span={22}>
          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Full Name</Text>
            </Col>
            <Col span={16}>
              <Text>
                {profile.candidate
                  ? profile.candidate
                    ? profile.candidate.fullName.split(" - ")[0]
                    : ''
                  : profile.staff
                    ? profile.staff.fullName.split(" - ")[0]
                    : ''}
              </Text>
            </Col>
          </Row>

          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Email</Text>
            </Col>
            <Col span={16}>
              <Text>
                {profile.staff
                  ? profile.staff
                    ? profile.staff.email
                    : ''
                  : profile.candidate
                    ? profile.candidate.email
                    : ''}
              </Text>
            </Col>
          </Row>

          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Role</Text>
            </Col>
            <Col span={16}>
              {editingComponent === compName ? (
                <div>
                  {profile.staff === null ? (
                    <Text>{displayRoles()}</Text>
                  ) : (
                      // <Select
                      //   className="personal-info-field"
                      //   size="small"
                      //   placeholder="Select..."
                      //   onChange={handleProjectRoleChange}
                      //   value={profile.roleName}
                      // >
                      //   {projectRoles.map((pR) => (
                      //     <Select.Option key={pR.name}>{pR.name}</Select.Option>
                      //   ))}
                      // </Select>
                      <select
                        className="select-field"
                        onChange={handleProjectRoleChange}
                        value={profile.roleName}
                      >
                        <option key="empty-role" value=""></option>
                        {projectRoles.map((pR) => (
                          <option value={pR.name} key={pR.name}>{pR.name}</option>
                        ))}
                      </select>
                    )}{' '}
                </div>
              ) : (
                  <Text>{displayRoles()}</Text>
                )}
            </Col>
          </Row>

          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Date of birth</Text>
            </Col>
            <Col span={16}>
              {editingComponent === compName ? (
                // <DatePicker                
                //   onChange={handleDatePickerChange}
                //   size="small"
                //   value={profile.birthday ? moment(profile.birthday) : ''}
                //   format="DD-MM-YYYY"
                //   allowClear={false}
                //   className="personal-info-field"
                // />
                <DatePicker
                  id="personal-date-picker"
                  dateFormat='dd-MM-yyyy'
                  selected={new Date(profile.birthday)}
                  onChange={handleDatePickerChange}
                />
              ) : (
                  <Text>
                    {profile.birthday
                      ? moment(profile.birthday).format(dateFormat)
                      : ''}
                  </Text>
                )}
            </Col>
          </Row>
          {profile.staff !== null ?
          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Group</Text>
            </Col>
            <Col span={16}>              
                <Text>{profile.staff ? profile.staff.staffGroup : ''}</Text>              
            </Col>
          </Row>
          : null
          }

          {profile.staff !== null ?
          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>DU</Text>
            </Col>
            <Col span={16}>              
                <Text>{profile.staff ? profile.staff.du : ''}</Text>              
            </Col>
          </Row>
          : null
          }

          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Phone</Text>
            </Col>
            <Col span={16}>
              {editingComponent === compName ? (
                <Input
                  name="phone"
                  onChange={handleInputChange}
                  value={profile.phone}
                  style={{ width: "90%" }}
                  size="small"
                  maxLength={20}
                />
              ) : (
                  <Text>{profile.phone}</Text>
                )}
            </Col>
          </Row>

          <Row className={['height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Gender</Text>
            </Col>
            <Col span={16}>
              {editingComponent === compName ? (
                // <Dropdown overlay={genderMenu}>
                //   <Button size="small">{profile.gender} <DownOutlined /></Button>
                // </Dropdown>
                <select
                  className="select-field"
                  onChange={handleGenderChange}
                  value={profile.gender}
                >
                  <option key="empty-gender" value=""></option>
                  <option key="Male" value="Male">Male</option>
                  <option key="Female" value="Female">Female</option>
                  <option key="Other" value="Other">Other</option>
                </select>
              ) : (
                  <Text>{profile.gender}</Text>
                )}
            </Col>
          </Row>

          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Nationality</Text>
            </Col>
            <Col span={16}>
              {editingComponent === compName ? (
                // <div>
                //   <Select
                //     size="small"
                //     placeholder="Select..."
                //     className="personal-info-field"
                //     onChange={handleNationalityChange}
                //     defaultValue="Vietnam"
                //     value={profile.nationality}
                //     showSearch
                //     options={Nationality}
                //   >
                //     {Nationality.map((nation) => (
                //       <Select.Option key={nation.value}>
                //         {nation.value}
                //       </Select.Option>
                //     ))}
                //   </Select>
                // </div>
                <select
                  className="select-field"
                  onChange={handleNationalityChange}
                  value={profile.nationality}
                >
                  <option key='empty-nationality' value=''></option>
                  {Nationality.map((nation) => (
                    <option value={nation.value} key={nation.value}>
                      {nation.value}
                    </option>
                  ))}
                </select>
              ) : (
                  <Text>{profile.nationality}</Text>
                )}
            </Col>
          </Row>
          <Row className={['margin-bottom-18', 'height-32', 'al-center']}>
            <Col span={8}>
              <Text strong>Marital Status</Text>
            </Col>
            <Col span={16}>
              {editingComponent === compName ?
                // <div>
                //   <Select
                //     className="personal-info-field"
                //     size="small"
                //     placeholder="Select..."
                //     onChange={handleMaritalStatusChange}
                //     defaultValue="Single"
                //     value={profile.maritalStatus}
                //   >
                //     {MaritalStatus.map(marital => (
                //       <Select.Option key={marital.value}>{marital.value}</Select.Option>
                //     ))}
                //   </Select>
                // </div>
                <select
                  className="select-field"
                  onChange={handleMaritalStatusChange}
                  value={profile.maritalStatus}
                >
                  <option key='empty-marial' value=''></option>
                  {MaritalStatus.map(marital => (
                    <option key={marital.value}>{marital.value}</option>
                  ))}
                </select>
                : <Text >{profile.maritalStatus}</Text>}
            </Col>
          </Row>

          {editingComponent === compName ? <div>
            <Row className={['margin-bottom-18', 'height-32', 'al-center', 'margin-top-10']}>
              <Col span={24} className="personal-menu" >

                <Button
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => {
                    setEditMode(!isEditMode);
                    setEditingComponent('');
                    setImageUrl(imageUrlBK);
                    // setProfile({ ...profile, avatar: imageUrlBK })
                    setProfile(rootProfile);
                  }}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}
                >
                  Cancel
                      </Button>
                      &nbsp;
                      <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  size="small"
                  onClick={onSavePersionalInfo}
                  style={{ width: CSSConstants.BUTTON_WIDTH }}
                >
                  Save
                      </Button>
              </Col>
            </Row>
          </div> : ""}
        </Col>
      </Row>
    </>
  );
};
export default ViewPersonal;
