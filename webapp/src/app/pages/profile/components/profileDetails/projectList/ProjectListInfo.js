import React, { useState, useEffect } from 'react';
import { PlusOutlined, ProjectFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import ProfileTitle from '../common/ProfileTitle';
import ViewProjectList from './ViewProjectList';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import { updateProfile, deleteProject } from '../../../../../api/profile';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import { Messages } from '../../../../../utils/AppMessage';
import { openNotification } from '../../../../../components/OpenNotification';
import { monthFormat } from '../../../../../constants/DateTimes';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';
import './projectList.css';

const today = moment().format(monthFormat);
const initProjectRole = {
  projectRoleId: "",
  name: "",
}
const initProject = {
  title: "",
  createdDate: "",
  projectId: null,
  fromMonth: today,
  client: "",
  teamSize: "",
  description: "",
  responsibilities: "",
  toMonth: today,
  updatedDate: "",
  arraySkillNames: "",
  projectRole: initProjectRole,
  isEdit: true,
  isOpen: true
}
const ProjectListInfo = ({ rootProfile, editingComponent, setEditingComponent }) => {

  const dispatch = useDispatch();

  const isOwner = useSelector(isOwnerProfile);

  const compName = 'ProjectListInfo';

  const [profile, setProfile] = useState(rootProfile);

  const [projects, setProjects] = useState([]);

  const [bestSkill, setBestSkill] = useState([]);

  useEffect(() => {
    if (rootProfile.profileSkills) {      
      setBestSkill(
        rootProfile.profileSkills.filter((obj) => obj.bestSkill === "1").map((item) => {
          if (item)
            return item.skill.name
          return item
        })
      );
    }
  }, [rootProfile]);

  useEffect(() => {
    setProfile(rootProfile ? rootProfile : {});
    setProjects(rootProfile.projects ? rootProfile.projects.map(obj => ({ ...obj, isEdit: false, isOpen: true })).sort((a, b) => {
      if (a.toMonth != b.toMonth) {
        return (moment(a.toMonth) > moment(b.toMonth)) ? -1 : 1;
      } else {
        return (moment(a.fromMonth) > moment(b.fromMonth)) ? -1 : 1;
      }
    }) : []);
  }, [rootProfile]);

  useEffect(() => {
    if (!editingComponent.includes(compName) && editingComponent !== '') {
      const news = projects.map(obj => obj.projectId === null ? ({ ...obj, isEdit: false, isOpen: true }) : ({ ...obj })).filter((obj) => obj.projectId);
      setProjects(news);
    }
  }, [editingComponent]);

  const onSave = async (projectpa) => {
    const skills = JSON.parse(projectpa.arraySkillNames);
    for (let i = 0; i < skills.length; i++) {
      for (let j = 0; j < skills[i].Skills.length; j++) {
        if (skills[i].Skills[j].includes(",")) {
          openNotification(Messages.ERROR, 'Skill cannot contain comma characters.');
          return;
        }
      }
    }
    const project = { ...projectpa }
    if (project.projectId) {
      const newProjects = projects.map(obj => {
        if (obj.projectId === project.projectId) {
          project.arraySkillNames = JSON.stringify(JSON.parse(project.arraySkillNames).filter((skill) => skill.Skills.length !== 0));
          return {
            ...project
          }
        }
        return obj
      });
      setProjects(newProjects);
      setProfile({
        ...profile, projects: projects.map(obj => {
          if (obj.projectId === project.projectId)
            return {
              ...project
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          projects: projects.map(obj => {
            if (obj.projectId === project.projectId)
              return {
                ...project
              }
            return obj
          })
        } : profile);
      if (!resp?.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        // openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Project"), "");
      }
    } else {
      setProjects(projects.map(obj => {
        if (!obj.projectId)
          return {
            ...project
          }
        return obj
      }));
      setProfile({
        ...profile, projects: projects.map(obj => {
          if (!obj.projectId)
            return {
              ...project
            }
          return obj
        })
      });

      const resp = await updateProfile(typeof profile.avatar === "string" ?
        {
          ...profile, avatar: convertDataURIToBinary(profile.avatar),
          projects: projects.map(obj => {
            if (!obj.projectId)
              return {
                ...project
              }
            return obj
          })
        } : profile);
      if (!resp.errorMessage) {
        dispatch(fetchProfileById({ profileId: profile.profileId }));
        openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Project"), "");
      }
    }

    setEditingComponent('');
  }

  const onOpen = (id) => {
    const news = projects.map(obj => obj.projectId === id ? ({ ...obj, isOpen: !obj.isOpen }) : ({ ...obj }));
    setProjects(news);
  }
  const onEdit = (id) => {
    let news = projects.map(obj => obj.projectId === id ? ({ ...obj, isEdit: !obj.isEdit, isOpen: true }) : ({ ...obj }));
    if (editingComponent === compName + 'New') {
      news = projects.map(obj => obj.projectId === null ? ({ ...obj, isEdit: false, isOpen: true }) : ({ ...obj })).filter((obj) => obj.projectId);
    }
    setEditingComponent(compName + id);
    setProjects(news);
  }

  const onCancel = (id) => {
    const news = projects.map(obj => obj.projectId === id ? ({ ...obj, isEdit: false, isOpen: true }) : ({ ...obj })).filter((obj) => obj.projectId);
    setEditingComponent('');
    setProjects(news);
  }

  const onDelete = async (project) => {
    const resp = await deleteProject(project);
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: profile.profileId }));
      openNotification(Messages.SUCCESS, Messages.deleteSuccessMessage("Project"), "");
    }

  }

  const onAddNew = (id) => {
    setEditingComponent(compName + 'New');
    const check = projects.filter((obj) => !obj.projectId);
    if (check.length > 0) {
      openNotification(Messages.WARNING, "Save information first!", "");
      return;
    }
    const news = [...projects, initProject]
    setProjects(news);
  }

  return (
    <div id="PROJECTLISTPANEL" className="border-bottom-solid">
      <ProfileTitle
        name="project"
        leftIcon={<ProjectFilled />}
        rightIcon={<PlusOutlined />}
        onAddNew={onAddNew}
        name={"PROJECTS"}
      />
      <div >
        {/* <Row justify="center" className={['margin-top-10', 'margin-bottom-10']} hidden={!isOwner}>
          <Col span={23}>
            <Button size="small" type="primary" onClick={onAddNew}>
              <PlusOutlined /> Add New Project
            </Button>
          </Col>
        </Row> */}
        <ViewProjectList
          key={projects.length}
          projectsFromParent={projects}
          onOpen={onOpen}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onAddNew={onAddNew}
          bestSkill={bestSkill}
          editingComponent={editingComponent}
        />
      </div>

    </div>
  );
};

export default ProjectListInfo;
