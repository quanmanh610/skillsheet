import React, { useState, useEffect } from 'react';
import { PlusOutlined, BulbFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'antd';
import ProfileTitle from '../common/ProfileTitle';
import AddProjectSkillCategory from './AddProjectSkillCategory';
import ViewProfileSkill from './ViewProfileSkill';
import { fetchSkills, getSkillsInStore } from '../../../../../store/slice/settingSlice';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import AddProfileSkill from './AddProfileSkill.js';
import { addProfileSkill, updateProfileSkill } from '../../../../../api/profile';
import { getUserData } from '../../../../../store/slice/authSlice';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';
//import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './skills.css';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const ProfileSKillInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const dispatch = useDispatch();

  const user = useSelector(getUserData);

  const compName = 'SkillInfo';

  const skillsInStore = useSelector(getSkillsInStore);

  //const isOwner = useSelector(isOwnerProfile);

  const [newProfileSkill, setNewProfileSkill] = useState([]);

  const [profileSkillList, setProfileSkillList] = useState([]);

  const [showAddCategory, setShowAddCategory] = useState(false);

  const [usedCategories, setUsedCategories] = useState([]);

  const [useableCategories, setUseableCategories] = useState([]);

  useEffect(() => {

    async function groupDate() {
      return await groupBy(rootProfile.profileSkills, item => item.skill.category);
    }

    if (rootProfile.profileSkills) {
      const newGroupByCategory = [];
      groupDate().then((result) => {
        result.forEach(function (value, key) {
          newGroupByCategory.push({ Category: key, isEdit: false, isOpen: true, profileSkills: value })
        });
        setProfileSkillList(newGroupByCategory);
      });

      const usedCategories = rootProfile.profileSkills.map((obj) => {
        if (obj)
          return obj.skill.category
        return obj
      });
      setUsedCategories(usedCategories);
    }
  }, [rootProfile]);

  useEffect(() => {
    const categories = [];
    skillsInStore.map((cer) => {
      if (cer.status === 0) {
        const newCate = {
          key: cer.category,
          value: cer.category
        }
        if (categories.filter((cate) => cate !== undefined && cate.key === cer.category).length === 0 && !usedCategories.includes(cer.category)) {
          categories.push(newCate);
        }
      }
    })
    setUseableCategories(categories);
  }, [skillsInStore, usedCategories]);

  useEffect(() => {
    async function fetchSkillsData() {
      await dispatch(fetchSkills());
    }
    fetchSkillsData();
  }, []);

  useEffect(() => {
    if (!editingComponent.includes(compName)) {
      setNewProfileSkill([]);
    };
  }, [editingComponent]);

  const onAddExistCategory = (category) => {
    const skillsByCategory = skillsInStore.filter((item) => item.category === category);
    const useableSKills = skillsByCategory.map((obj) => {
      if (obj.status === 0) {
        return { key: obj.name, value: obj.name }
      }
    }).filter((item) => item);
    const profileSkillItem = {
      Category: { name: category, isNew: false },
      Skills: useableSKills,
    }
    setNewProfileSkill([profileSkillItem]);

    setShowAddCategory(false);
  }

  const onAddNewCategory = (category) => {
    const skillItem = {
      Category: { name: category, isNew: true },
      Skills: [],
    }
    setNewProfileSkill([skillItem]);
    setShowAddCategory(false);
  }

  const onCancelAddSkill = () => {
    setNewProfileSkill([]);
    setShowAddCategory(true);
  }

  const onCancelAddCategory = () => {
    setNewProfileSkill([]);
    setShowAddCategory(false);
  }

  const onAddSkills = async (skills, category) => {
    const resp = await addProfileSkill({
      ProfileSkills: skills.profileSkills.map((obj) => {
        if (obj)
          return {
            profileSkillId: obj.profileSkillId ? obj.profileSkillId : null, project: obj.project, level: obj.level, yearOfExperiences: obj.yearOfExperiences, lastUsed: obj.lastUsed.format("YYYY"),
            bestSkill: obj.bestSkill ? 1 : 0
          }
        return obj
      }),
      Skills: skills.profileSkills.map((obj) => {
        if (obj) {
          return { category: category.name, name: obj.skill, createBy: user.userName, profileSkills: [] }
        }
          
        return obj
      }),
      ProfileId: rootProfile.profileId,
    });
    dispatch(fetchSkills());
    if (resp && !resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: rootProfile.profileId }));
      openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Profile Skill"), "");
      setNewProfileSkill([]);
      setShowAddCategory(false);
      const checkArr = useableCategories.filter((obj) => obj.key === category.name);
      if (checkArr.length !== 0) {
        setUseableCategories(useableCategories.filter((obj) => obj.key !== category.name));
      }
    }

    setEditingComponent('');
  }

  const onUpdateSkills = async (skills, category) => {
    const resp = await updateProfileSkill({
      ProfileSkills: skills.profileSkills.map((obj) => {
        if (obj)
          return {
            profileSkillId: obj.profileSkillId ? obj.profileSkillId : null, project: obj.project, level: obj.level, yearOfExperiences: obj.yearOfExperiences, lastUsed: obj.lastUsed.format("YYYY"),
            bestSkill: obj.bestSkill ? 1 : 0
          }
        return obj
      }),
      Skills: skills.profileSkills.map((obj) => {
        if (obj)
          return { category: category.name, name: obj.skill, createBy: user.userName, profileSkills: [] }
        return obj
      }),
      Category: category.name,
      ProfileId: rootProfile.profileId,
    });
    dispatch(fetchSkills())
    if (!resp?.errorMessage) {
      dispatch(fetchProfileById({ profileId: rootProfile.profileId }));
      openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Profile Skill"), "");
    }

    setEditingComponent('');
  }
  
  const onOpenView = (category) => {
    const filter = profileSkillList.map((obj) => {
      if (obj.Category === category)
        return { ...obj, isOpen: !obj.isOpen }
      return obj
    })
    setProfileSkillList(filter);
  }

  const onEditView = (category) => {
    if (editingComponent === compName + 'New') {
      setShowAddCategory(false);
      setNewProfileSkill([]);
    }
    setEditingComponent(compName + category);
    const filter = profileSkillList.map((obj) => {
      if (obj.Category === category){
        obj = { ...obj, isEdit: !obj.isEdit, isOpen: true };
      }
 
      if (obj.Category !== category){
        obj = { ...obj, isEdit: false };
      }        
      return obj
    })
    setProfileSkillList(filter);
  }

  const onCancelEditSkill = (category) => {
    setEditingComponent('');
    const filter = profileSkillList.map((obj) => {
      if (obj.Category === category)
        return { ...obj, isEdit: !obj.isEdit, isOpen: true }
      return obj
    })
    setProfileSkillList(filter);
  }

  const onAddNew = () => {
    setEditingComponent(compName + 'New');
    // setShowAddCategory(!showAddCategory);
    setShowAddCategory(true);
  }

  const onDeleteSuccess = (category) => {
    const checkArr = useableCategories.filter((obj) => obj.key === category.name);
    if (checkArr.length === 0) {
      setUseableCategories([...useableCategories, { key: category.name, value: category.name }]);
    }
  }

  return (
    <div id="SKILLSPANEL" className="border-bottom-solid">
      <ProfileTitle        
        name="skills"
        leftIcon={<BulbFilled />}
        rightIcon={<PlusOutlined />}
        onAddNew={onAddNew}
      />
      {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
        <Col span={23}>
          <Button size="small" type="primary" onClick={onAddNew}>
            <PlusOutlined /> Add New Skill
          </Button>
        </Col>
      </Row> */}

      <ViewProfileSkill profileSkillList={profileSkillList}
        onOpenView={onOpenView}
        onEditView={onEditView}
        onEditProfileSkills={onUpdateSkills}
        onCancelEditProfileSkill={onCancelEditSkill}
        useableCategories={useableCategories}
        onDeleteSuccess={onDeleteSuccess}
        editingComponent={editingComponent}
      />

      {(showAddCategory && editingComponent === compName + 'New') ? <AddProjectSkillCategory onAddExistCategory={onAddExistCategory} onAddNewCategory={onAddNewCategory} onCancel={onCancelAddCategory} useableCategories={useableCategories} /> : ""}
      <Row justify="center">
        <Col span={23} >
          {(newProfileSkill.length > 0 && editingComponent === compName + 'New') ? <AddProfileSkill profileSkill={newProfileSkill[0]} onAddProfileSkills={onAddSkills} onCancel={onCancelAddSkill} /> : ""}
        </Col>
      </Row>

    </div>
  );
};

export default ProfileSKillInfo;
