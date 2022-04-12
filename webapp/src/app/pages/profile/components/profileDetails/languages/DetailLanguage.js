import React from 'react';
import { Row, Col, Typography, Tag, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../../constants/CSSConstants';
import { AntdColor } from '../../../../../constants/AntdColor';
import { useSelector } from 'react-redux';
import { getUserData } from '../../../../../store/slice/authSlice';
const { Text } = Typography;

const DetailLanguage = ({ rootProfile, language, onEdit, index }) => {

  const user = useSelector(getUserData);
  return (
    <div>
      <Col span={23} className="margin-left-20">
        <Row className="margin-bottom-10">
          <Col span={6} >
            <div>
              <Text key={language.name + "name"} className="margin-left-10" >
                <Tag size="small" color={AntdColor[56]} style={{ minWidth: CSSConstants.BUTTON_WIDTH, textAlign: "center" }}>{language.name}</Tag>
              </Text>
            </div>
          </Col>

          <Col span={6} >
            <div>
              <Text key={language.level + "level"} >
                {language.level}
              </Text>
            </div>
          </Col>

          <Col span={10} >
            <div style={{ textAlign: "justify"}}>
              <Text key={language.note + "note"}>
                {language.note}
              </Text>
            </div>
          </Col>
          <Col span={2}>

            <Button
              type="link"
              size="small"
              className="fl-right"
              icon={<EditOutlined />}
              hidden={rootProfile.email !== user.email}
              onClick={(e) => {
                onEdit(language.languageId);
                e.stopPropagation();
              }}
            >
            </Button>
          </Col>
        </Row></Col></div>
  );
};
export default DetailLanguage;
