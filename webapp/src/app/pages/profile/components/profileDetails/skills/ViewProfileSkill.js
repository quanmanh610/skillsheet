import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import SubTitle from '../common/SubTitle';
import moment from 'moment';
import DetailProfileSkill from './DetailProfileSkill';
import EditProfileSkill from './EditProfileSkill';

const ViewProfileSkill = ({ profileSkillList, onOpenView, onEditView, onEditProfileSkills, onCancelEditProfileSkill, useableCategories, onDeleteSuccess, editingComponent }) => {

    const compName = 'SkillInfo';

    const [profileSkills, setProfileSkills] = useState(profileSkillList);

    const [showMoreBtn, setShowMoreBtn] = useState(profileSkillList.length > 3);

    const [showLessBtn, setShowLessBtn] = useState(false);

    useEffect(() => {
        if (profileSkillList) {

            setProfileSkills(profileSkillList.map((obj) => {
                if (obj)
                    return {
                        ...obj,
                        Category: { name: obj.Category, isNew: false },
                        ProfileSkills: obj.profileSkills.map((item) => {
                            if (item)
                                return {
                                    profileSkillId: item.profileSkillId, skill: item.skill.name,
                                    project: item.project, level: item.level, yearOfExperiences: item.yearOfExperiences, lastUsed: moment(item.lastUsed),
                                    bestSkill: item.bestSkill === "1"
                                }
                            return item
                        })
                    }
                return obj
            }));
            setShowMoreBtn(profileSkillList.length > 3 && showLessBtn === false);
        }

    }, [profileSkillList, useableCategories]);

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
            <Row justify="center" style={{ display: profileSkills.length == 0 ? "none" : "" }}>
                <Col span={23} >
                    {profileSkills.map((profileSkill, index) =>
                        <div key={profileSkill.Category.name} hidden={isHiddenItem(index)}>
                            <SubTitle
                                onOpen={onOpenView}
                                onEdit={onEditView}
                                identify={profileSkill.Category.name}
                                leftIcon={ (profileSkill.isOpen) ? <RightOutlined style={{ transform: "rotate(90deg)", transition: "0.5s", fontSize: "12px" }} /> : <RightOutlined style={{ transform: "rotate(0deg)", transition: "0.5s", fontSize: "12px" }} /> }
                                rightIcon={<EditOutlined />}
                                title={profileSkill.Category.name}
                            >
                            </SubTitle>
                            {profileSkill.isOpen ? <div>
                                {
                                    editingComponent === compName + profileSkill.Category.name ?
                                        <div>
                                            <EditProfileSkill
                                                profileSkill={profileSkill}
                                                onEditProfileSkills={onEditProfileSkills}
                                                onCancel={onCancelEditProfileSkill}
                                                onDeleteSuccess={onDeleteSuccess}
                                            />
                                        </div> :
                                        <div>
                                            <DetailProfileSkill index={index} profileSkills={profileSkill.ProfileSkills} />
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
export default ViewProfileSkill;
