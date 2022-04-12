import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Select, Button, Tag, Popconfirm } from 'antd';
import { SaveOutlined, DeleteOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { Messages } from '../../../../../../utils/AppMessage';
import { useSelector } from 'react-redux';
import { CSSConstants } from '../../../../../../constants/CSSConstants';
import { AntdColor } from '../../../../../../constants/AntdColor';
import { getUserData } from '../../../../../../store/slice/authSlice';
import { Option } from 'antd/lib/mentions';

const { Text } = Typography;

const getSkill = (skills, email, userName) => {

  return skills.filter((skill) => skill.status === 0);

}

const ViewProjectSkill = ({ projectSkillFromPa, onDelete, onEdit, onSave, onCanCel, index, bestSkill, handleChangeEdit }) => {

  const user = useSelector(getUserData);

  const skillsInStore = useSelector((state) => getSkill(state.setting.skills, user.email, user.userName));

  const [children, setChildren] = useState([])

  const [projectSkill, setProjectSkill] = useState(projectSkillFromPa || {});

  useEffect(() => {
    setProjectSkill(projectSkillFromPa || []);
  }, [projectSkillFromPa]);

  useEffect(() => {

    const child = [];
    skillsInStore.map((item) => {
      if (item.category === projectSkillFromPa.Category) {
        child.push(<Option key={item.name}>{item.name}</Option>);
      }
    })
    setChildren(child);

  }, []);

  const onEdits = () => {
    onEdit(projectSkill.Category);
    const filer = { ...projectSkill, isEdit: true};
    setProjectSkill(filer);
  }

  const onSaves = () => {
    onSave(projectSkill);
  }

  const onDeletes = () => {
    onDelete(projectSkill);
  }

  const onCanCels = () => {
    onCanCel({ ...projectSkill, Skills: projectSkillFromPa.Skills });
  }

  const tagRender = (props) => {

    const { label, value, closable, onClose } = props;

    return (
      <Tag color={ bestSkill.includes(label) ? AntdColor[0] : AntdColor[55] } closable={closable} onClose={onClose} style={{ marginRight: 3, minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center", marginBottom: '5px' }}>
        {label}
      </Tag>
    );
  }

  // const handleChange = (value) => {
  //   setProjectSkill({ ...projectSkill, Skills: value })
  // }

  // const mgs = (value) => {
  //   if ()
  // }

  return (
    <div>
      <Row className="margin-bottom-20">
        <Col span={6} >
          <Text> {projectSkill.Category} </Text>
        </Col>
        <Col span={14} >
          {projectSkill.isEdit ?

            <Select
              mode="tags"
              placeholder="Select skill ..."
              defaultValue={projectSkill.Skills}
              style={{ width: '100%' }}
              size="small"
              tagRender={tagRender}
              onChange={handleChangeEdit}
            >
              {children}
            </Select>

            :
            <div>
              {projectSkill.Skills.map((skill) =>
                <Tag key={skill} color={ bestSkill.includes(skill) ? AntdColor[0] : AntdColor[55] } style={{ minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center", marginBottom: '5px' }}>{skill}</Tag>
              )}</div>
          }
        </Col>
        <Col span={4} >
          {/* {projectSkill.isEdit ?  */}
          {/* <div className="fl-right">
            <Button
              style={{ color: "#2db7f5", backgroundColor: "#fafafa" }}
              type="dash"
              size="small"
              icon={<SaveOutlined />}
              onClick={onSaves}
              className="margin-left-10"
            >
            </Button>
              &nbsp;&nbsp;
              <Button
              style={{ color: "red", backgroundColor: "#fafafa" }}
              size="small"
              icon={<CloseOutlined />}
              onClick={onCanCels}
              type="dash"
            >
            </Button>
          </div> : */}
            <div className="fl-right">
              <Popconfirm
                title={Messages.DELETE_CONFIRM}
                onConfirm={onDeletes}
                okText="Yes"
                cancelText="No"
                  className="margin-left-10"
              >
                <Button
                  size="small"
                  type="dash"
                  icon={<DeleteOutlined />}
                  style={{ color: "red", backgroundColor: "#fafafa" }}
                >
                </Button>
              </Popconfirm>
                {/* &nbsp;&nbsp;
                <Button
                type="dash"
                size="small"
                icon={<EditOutlined />}
                onClick={onEdits}
                style={{ backgroundColor: "#fafafa" }}
              >
              </Button> */}
            </div>
          {/* } */}
        </Col>
      </Row>
    </div>
  );
};
export default ViewProjectSkill;
