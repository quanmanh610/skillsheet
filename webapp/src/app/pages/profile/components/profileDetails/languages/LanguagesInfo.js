import React, { useState, useEffect } from 'react';
import { PlusOutlined, DribbbleCircleFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import ProfileTitle from '../common/ProfileTitle';
import ViewLanguage from './ViewLanguage';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import { updateProfile, deleteLanguage } from '../../../../../api/profile';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import { Messages } from '../../../../../utils/AppMessage';
import { openNotification } from '../../../../../components/OpenNotification';
import { monthFormat } from '../../../../../constants/DateTimes';
import moment from 'moment';
import { Col, Row, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './languages.css';

const today = moment().format(monthFormat);

const initLanguage = {
  name: "",
  level: "",
  languageId: null,
  note: "",
  isEdit: true,
  isOpen: true
}
const LanguageInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const dispatch = useDispatch();

  const isOwner = useSelector(isOwnerProfile);

  const compName = 'LanguageInfo';

  const [profile, setProfile] = useState(rootProfile);

  const [languages, setlanguages] = useState([]);

  useEffect(() => {
    setProfile(rootProfile ? rootProfile : {});
    setlanguages(rootProfile.languages ? rootProfile.languages.map(obj => ({ ...obj, isEdit: false, isOpen: false })) : []);
  }, [rootProfile]);

  useEffect(() => {
    if (!editingComponent.includes(compName) && editingComponent !== '') {
      const news = languages.map(obj => obj.languageId === null ? ({ ...obj, isEdit: false, isOpen: false }) : ({ ...obj })).filter((obj) => obj.languageId);
      setlanguages(news);
    }
  }, [editingComponent]);

  const onSaveinView = () => {
    // TODO: chưa biết để làm gì
  }

  const onSave = async (language) => {
    if (language.languageId) {
      const newWorkExp = languages.map(obj => {
        if (obj.languageId === language.languageId)
          return {
            ...language
          }
        return obj
      });
      setlanguages(newWorkExp);
      setProfile({
        ...profile, languages: languages.map(obj => {
          if (obj.languageId === language.languageId)
            return {
              ...language
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          languages: languages.map(obj => {
            if (obj.languageId === language.languageId)
              return {
                ...language
              }
            return obj
          })
        } : profile);
      if (!resp.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Language"), "");
      }

    } else {
      setlanguages(languages.map(obj => {
        if (!obj.languageId)
          return {
            ...language
          }
        return obj
      }));
      setProfile({
        ...profile, languages: languages.map(obj => {
          if (!obj.languageId)
            return {
              ...language
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          languages: languages.map(obj => {
            if (!obj.languageId)
              return {
                ...language
              }
            return obj
          })
        } : profile);
      if (!resp.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Language"), "");
        //setlanguages(news); // Chưa biết để làm gì
      }
    }

    setEditingComponent('');

  }

  const onOpen = (id) => {
    const news = languages.map(obj => obj.languageId === id ? ({ ...obj, isOpen: !obj.isOpen }) : ({ ...obj }));
    setlanguages(news);
  }
  const onEdit = (id) => {
    let news = languages.map(obj => obj.languageId === id ? ({ ...obj, isEdit: !obj.isEdit, isOpen: true }) : ({ ...obj }));
    if (editingComponent === compName + 'New') {
      news = languages.map(obj => obj.languageId === null ? ({ ...obj, isEdit: false, isOpen: false }) : ({ ...obj })).filter((obj) => obj.languageId);
    }
    setEditingComponent(compName + id);
    setlanguages(news);
  }

  const onCancel = (id) => {
    const news = languages.map(obj => obj.languageId === id ? ({ ...obj, isEdit: false, isOpen: false }) : ({ ...obj })).filter((obj) => obj.languageId);
    setEditingComponent('');
    setlanguages(news);
  }

  const onDelete = async (language) => {
    const resp = await deleteLanguage(language);
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: profile.profileId }));
      openNotification(Messages.SUCCESS, Messages.deleteSuccessMessage("Language"), "");
      onSaveinView();
    }

  }

  const onAddNew = (id) => {
    setEditingComponent(compName + 'New');
    const check = languages.filter((obj) => !obj.languageId);
    if (check.length > 0) {
      openNotification(Messages.WARNING, "Save information first!", "");
      return;
    }
    const news = [...languages, initLanguage]
    setlanguages(news);
  }

  return (
    <div id="LANGUAGESPANEL">
      <ProfileTitle
        leftIcon={<DribbbleCircleFilled />}
        rightIcon={<PlusOutlined />}
        onAddNew={onAddNew}
        name={"Languages"}
      />
      <div>
        {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
          <Col span={23}>
            <Button size="small" type="primary" onClick={onAddNew}>
              <PlusOutlined /> Add New Language
            </Button>
          </Col>
        </Row> */}
        <ViewLanguage
          key={languages.length}
          languagesFromParent={languages}
          onOpen={onOpen}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onAddNew={onAddNew}
          rootProfile={rootProfile}
          editingComponent={editingComponent}
        />
      </div>

    </div>
  );
};

export default LanguageInfo;
