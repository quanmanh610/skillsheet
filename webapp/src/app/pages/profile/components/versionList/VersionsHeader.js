import React, { useState } from 'react';
import { Input, Row, Col, Button, Menu, Dropdown } from 'antd';
import { SearchOutlined, RedoOutlined, DownOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../../../constants/CSSConstants';

const VersionsHeader = ({ updateParent, search, onReset }) => {
  const initSearch = {
    versionName: "",
    versionType: "",
  }

  const [searchValues, setSearchValues] = useState(initSearch);
  const [showVersionType, setShowVersionType] = useState('');

  const reset = () => {
    setSearchValues(initSearch);
    setShowVersionType('')
    updateParent(initSearch);
    onReset();
  };

  const handleChangeInput = (e) => {
    const newO = {
      ...searchValues, [e.target.name]: e.target.value,
    }    
    updateParent(newO);
    setSearchValues(newO);
  }

  const generateVersionTypeInputElement = () => {
    const version_type = ["Main", "Temporary", "All"];
    const menu = (
      <Menu onClick={handleVersionTypeMenuClick}>
        {
          version_type.map(e => <Menu.Item key={e}>{e}</Menu.Item>)
        }
      </Menu>
    );
    return (
      <Dropdown id="versionTypeList" overlay={menu} trigger={['click']}>
        <Button size="small" id="btnVersionTypeList" style={{ width: "100%", textAlign: "right" }}>
          <span style={{ float: "left" }}>{showVersionType}</span><DownOutlined />
        </Button>
      </Dropdown>
    );
  } 

  const handleVersionTypeMenuClick = (e) => {
    let version_type = e.key;
    setShowVersionType(version_type);
    if (version_type.toUpperCase() === "ALL") {
      version_type = '';
    }
    const values = {
      ...searchValues, versionType: version_type,
    }
    updateParent(values);
    setSearchValues(values);
  }

  return (
    <div>
      <Row>
        <Col span={16}>
          <Row>
            <Col span={8}> Version Name</Col>
            <Col span={5}> Type</Col>
            <Col span={11}></Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Row>
            <Col span={8}>
              <Input 
                name="versionName" 
                size="small"
                maxLength={100}
                style={{ width: "95%" }}
                onChange={handleChangeInput}
                onPressEnter={search}
                value={searchValues.versionName} />
            </Col>
            <Col span={5}>
              {generateVersionTypeInputElement()}
            </Col>
            <Col span={11}>
              <Row>
                <Button 
                  type="primary" 
                  className="margin-left-20"
                  size="small"
                  style={{
                    width: CSSConstants.BUTTON_WIDTH
                  }}
                  icon={<SearchOutlined />}
                  onClick={search}
                >
                  Search
                </Button>
                <Button
                  className="margin-left-20 reset-button"
                  type="primary"
                  size="small"
                  onClick={reset}
                  icon={<RedoOutlined />}
                >
                  Reset
                </Button>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default VersionsHeader;
