import React, { useState, useEffect } from 'react';
import { PlusOutlined, ToolFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import ProfileTitle from '../common/ProfileTitle';
import ViewWorkExperience from './ViewWorkExperience';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import { updateProfile, deleteWorkExperience } from '../../../../../api/profile';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import { Messages } from '../../../../../utils/AppMessage';
import { openNotification } from '../../../../../components/OpenNotification';
import { monthFormat } from '../../../../../constants/DateTimes';
import moment from 'moment';
import { Col, Row, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';

const today = moment().format(monthFormat);

const initWorkExp = {
  company: "",
  position: "",
  workExperienceId: null,
  fromMonth: today,
  toMonth: today,
  description: "",
  isEdit: true,
  isOpen: true,
  now: false
}
const WorkExperienceInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const dispatch = useDispatch();

  const isOwner = useSelector(isOwnerProfile);

  const compName = 'WorkExperienceInfo';

  const [profile, setProfile] = useState(rootProfile);

  const [workExperiences, setworkExperiences] = useState([]);

  useEffect(() => {
    setProfile(rootProfile ? rootProfile : {});
    setworkExperiences(rootProfile.workExperiences ? rootProfile.workExperiences.map(obj => ({ ...obj, isEdit: false, isOpen: true })).sort((a, b) => {
      if (a.now == true && b.now == true) {
        return (moment(a.fromMonth) > moment(b.fromMonth)) ? -1 : 1;
      } else if (a.now == true) {
        return -1;
      } else if (b.now == true) {
        return 1;
      } else {
        return (moment(a.toMonth) > moment(b.toMonth)) ? -1 : 1;
      }
    }) : []);
  }, [rootProfile]);
  const onSaveinView = () => {
    // TODO: Chưa biết để làm gì
  }

  useEffect(() => {
    if (!editingComponent.includes(compName) && editingComponent !== '') {
      const news = workExperiences.map(obj => obj.workExperienceId === null ? ({ ...obj, isEdit: false, isOpen: true }) : ({ ...obj })).filter((obj) => obj.workExperienceId);
      setworkExperiences(news);
    }
  }, [editingComponent])

  const onSave = async (workExperience) => {
    if (workExperience.workExperienceId) {
      const newWorkExp = workExperiences.map(obj => {
        if (obj.workExperienceId === workExperience.workExperienceId)
          return {
            ...workExperience
          }
        return obj
      });
      setworkExperiences(newWorkExp);
      setProfile({
        ...profile, workExperiences: workExperiences.map(obj => {
          if (obj.workExperienceId === workExperience.workExperienceId)
            return {
              ...workExperience
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          workExperiences: workExperiences.map(obj => {
            if (obj.workExperienceId === workExperience.workExperienceId)
              return {
                ...workExperience
              }
            return obj
          })
        } : profile);
      if (!resp?.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Work Experiences"), "");
      }

    } else {
      setworkExperiences(workExperiences.map(obj => {
        if (!obj.workExperienceId)
          return {
            ...workExperience
          }
        return obj
      }));
      setProfile({
        ...profile, workExperiences: workExperiences.map(obj => {
          if (!obj.workExperienceId)
            return {
              ...workExperience
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          workExperiences: workExperiences.map(obj => {
            if (!obj.workExperienceId)
              return {
                ...workExperience
              }
            return obj
          })
        } : profile);
      if (resp && !resp.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Work Experiences"), "");
        // setworkExperiences(news); Chưa biết để làm gì
      }
    }
    
    setEditingComponent('');
  }

  const onOpen = (id) => {
    const news = workExperiences.map(obj => obj.workExperienceId === id ? ({ ...obj, isOpen: !obj.isOpen }) : ({ ...obj }));
    setworkExperiences(news);
  }
  const onEdit = (id) => {
    let news = workExperiences.map(obj => obj.workExperienceId === id ? ({ ...obj, isEdit: !obj.isEdit, isOpen: true }) : ({ ...obj }));
    if (editingComponent === compName + 'New') {
      news = workExperiences.map(obj => obj.workExperienceId === null ? ({ ...obj, isEdit: false, isOpen: true }) : ({ ...obj })).filter((obj) => obj.workExperienceId);
    }
    setEditingComponent(compName + id);
    setworkExperiences(news);
  }

  const onCancel = (id) => {
    const news = workExperiences.map(obj => obj.workExperienceId === id ? ({ ...obj, isEdit: false, isOpen: true }) : ({ ...obj })).filter((obj) => obj.workExperienceId);
    setEditingComponent('');
    setworkExperiences(news);
  }

  const onDelete = async (workExperience) => {
    const resp = await deleteWorkExperience(workExperience);
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: profile.profileId }));
      openNotification(Messages.SUCCESS, Messages.deleteSuccessMessage("Work Experiences"), "");
      onSaveinView();
    }

  }

  const onAddNew = (id) => {
    setEditingComponent(compName + 'New');
    const check = workExperiences.filter((obj) => !obj.workExperienceId);
    if (check.length > 0) {
      openNotification(Messages.WARNING, "Save information first!", "");
      return;
    }
    const news = [...workExperiences, initWorkExp]
    setworkExperiences(news);
  }

  return (
    <div id="WORKEXPERIENCEPANEL" className="border-bottom-solid">
      <ProfileTitle
        name="Work Experience"
        leftIcon={<ToolFilled />}
        rightIcon={<PlusOutlined />}
        onAddNew={onAddNew}
        name={"Work Experience"}
      />
      <div>
        {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
          <Col span={23}>
            <Button size="small" type="primary" onClick={onAddNew}>
              <PlusOutlined /> Add New Work Experience
            </Button>
          </Col>
        </Row> */}
        <ViewWorkExperience
          key={workExperiences.length}
          workExperiencesFromParent={workExperiences}
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

export default WorkExperienceInfo;
