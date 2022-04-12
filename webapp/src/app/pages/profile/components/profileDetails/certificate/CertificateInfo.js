import React, { useState, useEffect } from 'react';
import { PlusOutlined, SafetyCertificateFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'antd';
import ProfileTitle from '../common/ProfileTitle';
import AddCategory from './AddCategory';
import ViewCertificate from './ViewCertificate';
import { fetchCertificate, getCertificateInStore } from '../../../../../store/slice/settingSlice';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import AddCertificate from './AddCertificate.js';
import { addProfileCertificate, updateProfileCertificate } from '../../../../../api/profile';
import { getUserData } from '../../../../../store/slice/authSlice';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './certificate.css';

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

const CertificateInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const dispatch = useDispatch();

  const user = useSelector(getUserData);

  const certificatesInStore = useSelector(getCertificateInStore);

  const isOwner = useSelector(isOwnerProfile);

  const compName = 'CertificateInfo';

  const [newCertificate, setNewCertificate] = useState([]);

  const [profileCertificateList, setProfileCertificateList] = useState([]);

  const [showAddCategory, setShowAddCategory] = useState(false);

  const [usedCategories, setUsedCategories] = useState([]);

  const [useableCategories, setUseableCategories] = useState([]);

  useEffect(() => {
    async function groupDate() {
      return await groupBy(rootProfile.profileCertificates, item => item.certificate.category);
    }
    if (rootProfile.profileCertificates) {
      const newGroupByCategory = [];
      groupDate().then((result) => {
        result.forEach(function (value, key) {
          newGroupByCategory.push({ Category: key, isEdit: false, isOpen: true, profileCertificates: value })
        });
        setProfileCertificateList(newGroupByCategory);
      });

      const usedCategories = rootProfile.profileCertificates.map((obj) => {
        if (obj)
          return obj.certificate.category
        return obj
      });
      setUsedCategories(usedCategories);
    }

  }, [rootProfile]);

  useEffect(() => {
    const categories = [];
    certificatesInStore.map((cer) => {
      if (cer.status == 0) {
        const newCate = {
          key: cer.category,
          value: cer.category
        }
        if ((categories.filter((cate) => cate !== undefined && cate.key == cer.category)).length === 0 && !usedCategories.includes(cer.category)) {
          categories.push(newCate);
        }
      }
    });
    setUseableCategories(categories);
  }, [certificatesInStore, usedCategories]);

  useEffect(() => {
    async function fetchCertificatesData() {
      await dispatch(fetchCertificate());
    }
    fetchCertificatesData();
  }, []);

  useEffect(() => {
    if (!editingComponent.includes(compName)) {
      setNewCertificate([]);
    };
  }, [editingComponent]);

  const onAddExistCategory = (category) => {

    const certificatesByCategory = certificatesInStore.filter((item) => item.category === category);

    const useableCertificates = certificatesByCategory.map((obj) => {
      if (obj.status === 0) {
        return { key: obj.name, value: obj.name }
      }
    })

    const certificateItem = {
      Category: { name: category, isNew: false },
      Certificates: useableCertificates.filter((obj) => obj != undefined),
    }

    setNewCertificate([certificateItem]);

    setShowAddCategory(false);
  }

  const onAddNewCategory = (category) => {
    const certificateItem = {
      Category: { name: category, isNew: true },
      Certificates: [],
    }
    setNewCertificate([certificateItem]);
    setShowAddCategory(false);
  }

  const onCancelAddCertificate = () => {
    setNewCertificate([]);
    setShowAddCategory(true);
  }

  const onCancelAddCategory = () => {
    setNewCertificate([]);
    setShowAddCategory(false);
  }

  const onAddCertificates = async (certificates, category) => {
    const resp = await addProfileCertificate({
      ProfileCertificates: certificates.certificates.map((obj) => {
        if (obj)
          return { profileCertificateId: obj.profileCertificateId ? obj.profileCertificateId : null, issuedDate: obj.issuedDate, achievement: obj.achievement }
        return obj
      }),
      Certificates: certificates.certificates.map((obj) => {
        if (obj)
          return { category: category.name, name: obj.certificate, createBy: user.email, profileCertificates: [] }
        return obj
      }),
      ProfileId: rootProfile.profileId,
    });
    dispatch(fetchCertificate());
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: rootProfile.profileId }));
      openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Profile Certificate"), "");
      setNewCertificate([]);
      setShowAddCategory(false);
      const checkArr = useableCategories.filter((obj) => obj.key === category.name);
      if (checkArr.length !== 0) {
        setUseableCategories(useableCategories.filter((obj) => obj.key !== category.name));
      }
    }

    setEditingComponent('');
  }

  const onUpdateCertificates = async (certificates, category) => {
    const resp = await updateProfileCertificate({
      ProfileCertificates: certificates.certificates.map((obj) => {
        if (obj)
          return { profileCertificateId: obj.profileCertificateId ? obj.profileCertificateId : null, issuedDate: obj.issuedDate, achievement: obj.achievement }
        return obj
      }),
      Certificates: certificates.certificates.map((obj) => {
        if (obj)
          return { category: category.name, name: obj.certificate, createBy: user.email, profileCertificates: [] }
        return obj
      }),
      Category: category.name,
      ProfileId: rootProfile.profileId,

    });
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: rootProfile.profileId }));
      openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Profile Certificate"), "");
      await dispatch(fetchCertificate());
    }

    setEditingComponent('');
  }

  const onOpenView = (category) => {
    const filter = profileCertificateList.map((obj) => {
      if (obj.Category === category)
        return { ...obj, isOpen: !obj.isOpen }
      return obj
    })
    setProfileCertificateList(filter);
  }

  const onEditView = (category) => {
    if (editingComponent === compName + 'New') {
      setShowAddCategory(false);
      setNewCertificate([]);
    }
    setEditingComponent(compName + category);
    const filter = profileCertificateList.map((obj) => {
      if (obj.Category === category){
        return { ...obj, isEdit: !obj.isEdit, isOpen: true }
      }

      if (obj.Category !== category){
        obj = { ...obj, isEdit: false };
      }
      return obj
    })
    setProfileCertificateList(filter);
  }

  const onCancelEditCertificate = (category) => {
    setEditingComponent('');
    const filter = profileCertificateList.map((obj) => {
      if (obj.Category === category)
        return { ...obj, isEdit: !obj.isEdit, isOpen: true }
      return obj
    })
    setProfileCertificateList(filter);
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
    <div id="CERTIFICATEPANEL" className="border-bottom-solid">
      <ProfileTitle
        name="certificates"
        leftIcon={<SafetyCertificateFilled />}
        rightIcon={<PlusOutlined />}
        onAddNew={onAddNew}
      />
      {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
        <Col span={23}>
          <Button size="small" type="primary" onClick={onAddNew}>
            <PlusOutlined /> Add New Certificate
          </Button>
        </Col>
      </Row> */}

      <ViewCertificate profileCertificateList={profileCertificateList}
        onOpenView={onOpenView}
        onEditView={onEditView}
        onAddCertificates={onUpdateCertificates}
        onCancelEditCertificate={onCancelEditCertificate}
        useableCategories={useableCategories}
        onDeleteSuccess={onDeleteSuccess}
        editingComponent={editingComponent}
      />

      {(showAddCategory && editingComponent === compName + 'New') ? <AddCategory onAddExistCategory={onAddExistCategory} onAddNewCategory={onAddNewCategory} onCancel={onCancelAddCategory} useableCategories={useableCategories} /> : ""}
      <Row justify="center">
        <Col span={23} >
          {(newCertificate.length > 0 && editingComponent === compName + 'New') ? <AddCertificate profileCertificate={newCertificate[0]} onAddCertificates={onAddCertificates} onCancel={onCancelAddCertificate} /> : ""}
        </Col>
      </Row>

    </div>
  );
};

export default CertificateInfo;
