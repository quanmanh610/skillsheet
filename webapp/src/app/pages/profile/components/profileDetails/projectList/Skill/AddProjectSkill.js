import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Select, Button, Tag } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { AntdColor } from '../../../../../../constants/AntdColor';
import { CSSConstants } from '../../../../../../constants/CSSConstants';

const { Text } = Typography;

const { Option } = Select;

const AddProjectSkill = ({ category, skillList, onSave, onCanCel, bestSkill, handleChange, selectedValue }) => {

  const [children, setChildren] = useState([])

  // const [selectedValue, setSelectedValue] = useState([]);

  useEffect(() => {
    if (skillList) {
      const child = [];
      skillList.map((item) => {
        child.push(<Option key={item.key}>{item.value}</Option>);
      })
      setChildren(child);
    }
  }, [skillList]);

  const onSaves = () => {

    onSave(selectedValue);

  }

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    return (
      <Tag color={ bestSkill.includes(label) ? AntdColor[0] : AntdColor[55] } closable={closable} onClose={onClose} style={{ marginRight: 3, minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center" }}>
        {label}
      </Tag>
    );
  }

  // const handleChange = (value) => {
  //   setSelectedValue(value);
  // }

  return (
    <div>
      <Row className="margin-bottom-20" >
        <Col span={6}>
          <Text>{category}</Text>
        </Col>
        <Col span={14} >
          <Select
            mode="tags"
            placeholder="Select skill ..."
            style={{ width: '100%' }}
            size="small"
            tagRender={tagRender}
            onChange={handleChange}
          >
            {children}
          </Select>
        </Col>
        <Col span={4}>
          <div className="fl-right">
            {/* <Button
              style={{ color: "#2db7f5", backgroundColor: "#fafafa" }}
              type="dash"
              size="small"
              icon={<SaveOutlined />}
              onClick={onSaves}
            >
            </Button> */}
            <Button
              style={{ color: "red", backgroundColor: "#fafafa" }}
              size="small"
              icon={<CloseOutlined />}
              onClick={onCanCel}
              type="dash"
              className="margin-left-10"
            >
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default AddProjectSkill;
