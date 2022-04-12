import React from 'react';
import { Row, Col, Typography } from 'antd';
import EditLanguage from './EditLanguage';
import DetailLanguage from './DetailLanguage';

const { Text } = Typography;

const ViewLanguage = ({ languagesFromParent, onOpen, onEdit, onSave, onCancel, onDelete, onAddNew, rootProfile, editingComponent }) => {

  const compName = 'LanguageInfo';

  return (
    <div className="border-bottom-solid">
      <Row justify="center" className="margin-bottom-10" style={{ display: languagesFromParent.length == 0 ? "none" : "" }}>
        <Col span={23} >
          <Col span={23} className="margin-left-20">
            <Row className="margin-bottom-10">
              <Col span={6} >
                <div>
                  <Text key={"name" + "Language"} strong className="margin-left-20" >
                    Name
                  </Text>
                </div>
              </Col>

              <Col span={6} >
                <div>
                  <Text key={"level" + "Level"} strong>
                    Level
                  </Text>
                </div>
              </Col>

              <Col span={10} >
                <div>
                  <Text key={"note" + "note"} strong>
                    Note
                  </Text>
                </div>
              </Col>
              <Col span={2} >
                <div>
                  {""}
                </div>
              </Col>
            </Row>
          </Col>

          {languagesFromParent.map((language, index) =>
            <div key={language.languageId}>
              {/* {language.languageId ? <SubTitle
              key={language.languageId}
              onOpen={onOpen}
              onEdit={onEdit}
              identify={language.languageId}
              leftIcon={<DownOutlined />}
              rightIcon={<EditOutlined />}
              title={language.company}
            >
            </SubTitle> : ""} */}
              <div>
                {(editingComponent === compName + language.languageId || (editingComponent === compName + 'New' && language.languageId === null)) ? <div><EditLanguage
                  languageFromParent={language} onSaveInParent={onSave} onCancelInParent={onCancel}
                  onDeleteInParent={onDelete}
                  onAddNewInParent={onAddNew}
                  languages={languagesFromParent}
                ></EditLanguage></div> : <div><DetailLanguage rootProfile={rootProfile} index={index} language={language} onEdit={onEdit} ></DetailLanguage></div>}
              </div>


            </div>
          )}
        </Col>
      </Row></div>
  );
};
export default ViewLanguage;
