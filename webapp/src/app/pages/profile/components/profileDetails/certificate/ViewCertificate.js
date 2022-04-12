import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import SubTitle from '../common/SubTitle';
import moment from 'moment';
import DetailCertificate from './DetailCertificate';
import EditCertificate from './EditCertificate';

const ViewCertificate = ({ profileCertificateList, onOpenView, onEditView, onAddCertificates, onCancelEditCertificate, useableCategories, onDeleteSuccess, editingComponent }) => {

    const [profileCertificates, setProfileCertificates] = useState(profileCertificateList.sort((a, b) => {
        return (moment(a.profileCertificates.issuedDate) > moment(b.issuedDate)) ? -1 : 1;
    }));

    const compName = 'CertificateInfo';

    const [showMoreBtn, setShowMoreBtn] = useState(profileCertificateList.length > 3);

    const [showLessBtn, setShowLessBtn] = useState(false);

    useEffect(() => {
        if (profileCertificateList) {
            setProfileCertificates(profileCertificateList.map((obj) => {
                if (obj)
                    return {
                        ...obj,
                        Category: { name: obj.Category, isNew: false },
                        ProfileCertificates: obj.profileCertificates.map((item) => {
                            if (item)
                                return { profileCertificateId: item.profileCertificateId, certificate: item.certificate.name, achievement: item.achievement, issuedDate: moment(item.issuedDate) }
                            return item
                        })
                    }
                return obj
            }));
            setShowMoreBtn(profileCertificateList.length > 3 && showLessBtn === false ? true : false);
        }

    }, [profileCertificateList, useableCategories]);

    const onShowMoreItems = () => {
        setShowMoreBtn(false);
        setShowLessBtn(true);
    }

    const onShowLessItems = () => {
        setShowMoreBtn(true);
        setShowLessBtn(false);
    }

    const isHiddenItem = (index) => {
        if (index <= 2) {
        return false;
        } else {
        return showMoreBtn;
        }
    }

    return (
        <div>
            <Row justify="center" style={{ display: profileCertificates.length === 0 ? "none" : "" }}>
                <Col span={23} >
                    {profileCertificates.map((profileCertificate, index) =>
                        <div key={profileCertificate.Category.name} hidden={isHiddenItem(index)}>
                            <div><SubTitle
                                onOpen={onOpenView}
                                onEdit={onEditView}
                                identify={profileCertificate.Category.name}
                                leftIcon={ (profileCertificate.isOpen) ? <RightOutlined style={{ transform: "rotate(90deg)", transition: "0.5s", fontSize: "12px" }} /> : <RightOutlined style={{ transform: "rotate(0deg)", transition: "0.5s", fontSize: "12px" }} /> }
                                rightIcon={<EditOutlined />}
                                title={profileCertificate.Category.name}
                            >
                            </SubTitle></div>
                            {profileCertificate.isOpen ? <div>
                                {
                                    editingComponent === compName + profileCertificate.Category.name  ?
                                        <div>
                                            <EditCertificate
                                                profileCertificate={profileCertificate}
                                                onAddCertificates={onAddCertificates}
                                                onCancel={onCancelEditCertificate}
                                                onDeleteSuccess={onDeleteSuccess}
                                            />
                                        </div> :
                                        <div>
                                            <DetailCertificate index={index} profileCertificates={profileCertificate.ProfileCertificates} />
                                            <hr/>
                                        </div>
                                }

                            </div> : ""}
                        </div>

                    )}
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: "center", marginBottom: "10px" }}>
                <Button type="primary" shape="round" size="small" style={{ backgroundColor: "#FF7A00", borderColor: "#FF7A00" }} onClick={onShowMoreItems} hidden={!showMoreBtn}>Show more</Button>
                <Button type="primary" shape="round" size="small" style={{ backgroundColor: "#FF7A00", borderColor: "#FF7A00" }} onClick={onShowLessItems} hidden={!showLessBtn}>Show less</Button>
                </Col>
            </Row>
        </div>
    );
};
export default ViewCertificate;
