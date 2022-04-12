import React, { useState, useEffect } from 'react';
import { PlusOutlined, ReadFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import ProfileTitle from '../common/ProfileTitle';
import ViewEducation from './ViewEducation';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import { updateProfile, deleteEducation } from '../../../../../api/profile';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import { Messages } from '../../../../../utils/AppMessage';
import { openNotification } from '../../../../../components/OpenNotification';
import { monthFormat } from '../../../../../constants/DateTimes';
import moment from 'moment';
import { Row, Col, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './education.css';

const today = moment().format(monthFormat);
const initSchool = {
  choolId: "",
  category: "",
  name: "",
  status: "",
  createBy: ""
}
const initEducation = {
  achievement: "",
  createdDate: "",
  educationId: null,
  fromMonth: today,
  grade: "",
  qualification: "",
  school: initSchool,
  subject: "",
  toMonth: today,
  updatedDate: "",
  isEdit: true,
  isOpen: true
}

const EducationInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const dispatch = useDispatch();

  const compName = 'EducationInfo';

  const [profile, setProfile] = useState(rootProfile);

  const [educations, setEducations] = useState([]);

  useEffect(() => {
    setProfile(rootProfile ? rootProfile : {});
    setEducations(rootProfile.educations ? rootProfile.educations.map(obj => ({ ...obj, isEdit: false, isOpen: true })).sort((a, b) => {
      if (a.toMonth != b.toMonth) {
        return (moment(a.toMonth) > moment(b.toMonth)) ? -1 : 1;
      } else {
        return (moment(a.fromMonth) > moment(b.fromMonth)) ? -1 : 1;
      }
    }) : []);
  }, [rootProfile]);

  useEffect(() => {
    if (!editingComponent.includes(compName) && editingComponent !== '') {
      const news = educations.map(obj => obj.educationId === null ? ({ ...obj, isEdit: false, isOpen: false }) : ({ ...obj })).filter((obj) => obj.educationId);
      setEducations(news);
    }
  }, [editingComponent]);

  const onSaveinView = () => {}

  const onSave = async (education) => {
    if (education.educationId) {
      const newEdus = educations.map(obj => {
        if (obj.educationId === education.educationId)
          return {
            ...education
          }
        return obj
      });
      setEducations(newEdus);
      setProfile({
        ...profile, educations: educations.map(obj => {
          if (obj.educationId === education.educationId)
            return {
              ...education
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          educations: educations.map(obj => {
            if (obj.educationId === education.educationId)
              return {
                ...education
              }
            return obj
          })
        } : profile);
      if (!resp.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Personal Education"), "");
        onSaveinView();
      }

    } else {
      setEducations(educations.map(obj => {
        if (!obj.educationId)
          return {
            ...education
          }
        return obj
      }));
      setProfile({
        ...profile, educations: educations.map(obj => {
          if (!obj.educationId)
            return {
              ...education
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          educations: educations.map(obj => {
            if (!obj.educationId)
              return {
                ...education
              }
            return obj
          })
        } : profile);
      if (!resp.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Persional Education"), "");
        onSaveinView();
        // setEducations(news); Chưa biết để làm gì
      }
    }

    setEditingComponent('');
  }

  const onOpen = (id) => {
    const news = educations.map(obj => obj.educationId === id ? ({ ...obj, isOpen: !obj.isOpen }) : ({ ...obj }));
    setEducations(news);
  }
  const onEdit = (id) => {
    let news = educations.map(obj => obj.educationId === id ? ({ ...obj, isEdit: !obj.isEdit, isOpen: true }) : ({ ...obj }));
    if (editingComponent === compName + 'New') {
      news = educations.map(obj => obj.educationId === null ? ({ ...obj, isEdit: false, isOpen: false }) : ({ ...obj })).filter((obj) => obj.educationId);
    }
    setEditingComponent(compName + id);
    setEducations(news);
  }

  const onCancel = (id) => {
    const news = educations.map(obj => obj.educationId === id ? ({ ...obj, isEdit: false, isOpen: true }) : ({ ...obj })).filter((obj) => obj.educationId);
    setEditingComponent('');
    setEducations(news);
  }

  const onDelete = async (education) => {
    const resp = await deleteEducation(education);
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: profile.profileId }));
      openNotification(Messages.SUCCESS, Messages.deleteSuccessMessage("Personal Education"), "");
      onSaveinView();
    }

  }

  const onAddNew = (id) => {
    setEditingComponent(compName + 'New');
    const check = educations.filter((obj) => !obj.educationId);
    if (check.length > 0) {
      openNotification(Messages.WARNING, "Save information first!", "");
      return;
    }
    const news = [...educations, initEducation]
    setEducations(news);
  }

  const isOwner = useSelector(isOwnerProfile);

  return (
    <div id="EDUCATIONPANEL" className="border-bottom-solid">
      <ProfileTitle
        name="education"
        leftIcon={<ReadFilled />}
        rightIcon={<PlusOutlined />}
        onAddNew={onAddNew}
        name={"Education"}
      />
      <div>
        {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
          <Col span={23}>
            <Button size="small" type="primary" onClick={onAddNew}>
              <PlusOutlined /> Add New School
            </Button>
          </Col>
        </Row> */}
        <ViewEducation
          key={educations.length}
          educationsFromParent={educations}
          onOpen={onOpen}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onAddNew={onAddNew}
          editingComponent={editingComponent}
        />
      </div>
    </div>
  );
};

export default EducationInfo;
