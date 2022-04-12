import React, { useMemo, useState } from 'react';
import { Input, Row, Col, Button, Select, DatePicker, InputNumber, Spin } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../constants/CSSConstants';
import AdvancedSearch from './AdvancedSearch';
import { getProfileListSuggestions } from '../../api/profile';
import { useSelector } from 'react-redux';
import { getProfileListInStore } from '../../store/slice/profileSlice';

const HomeHeader = ({ updateParent, search, onReset, onSaveHeader, searchGroup, searchDu, setTableHeightOffset }) => {  

  const { Option } = Select;  
  const dataSource = useSelector(getProfileListInStore);  
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advBtnTitle, setAdvBtnTitle] = useState("More conditions");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [roleSuggestions, setRoleSuggestions] = useState([]);
  const [fullNameSuggestions, setFullNameSuggestions] = useState([]);
  const [languageSuggestions, setLanguageSuggestions] = useState([]);
  const [certificateSuggestions, setCertificateSuggestions] = useState([]);
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [duSuggestions, setDuSuggestions] = useState([]);    
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initSearch = {
    fullName: "",
    roleName: "",
    skill: "",
    language: "",
    certificate: "",
    group: searchGroup,
    du: searchDu,
    type: "",
    profileStatus: "",    
    availableTo: '',
    yearsOfExperience: 0,
  }

  const [searchValues, setSearchValues] = useState(initSearch);

  const getFieldSuggestions = async (type, searchValue, setSuggestions) => {
    setIsLoading(true);
    if (type === 'group' && searchGroup) {
      const items = [];
      items.push(<Option key={searchGroup}>{searchGroup}</Option>)
      setSuggestions(items);
    } else if (type === 'du' && searchDu) {
      const items = [];
      items.push(<Option key={searchDu}>{searchDu}</Option>)
      setSuggestions(items);
    } else {
      const response = await getProfileListSuggestions(type, searchValue);
      if (response && response.data) {
        const items = [];
        response.data.map(x => {
          if (x) {
            items.push(<Option key={x}>{x}</Option>)
          }
        })
        setSuggestions(items);
      } else {
        setSuggestions([]);
      }
    }

    setIsLoading(false);
  }

  useMemo(() => {
    if (fullNameSuggestions.length === 0 && dataSource.length > 0) {
      const items = [];
      const fullNameList = [];
      for (let i = 0; i < dataSource.length; i++) {
        const fullName = dataSource[i].fullName + "|" + dataSource[i].account;
        if (!fullNameList.includes(fullName)) {
          fullNameList.push(fullName);
          items.push(
            <Option key={fullName}>
              {dataSource[i].fullName + ' (' + dataSource[i].account + ')'}
            </Option>)
        }
      }
      setFullNameSuggestions(items);
    }

    if (searchGroup) {
      const newValues = {
        ...searchValues,
        group: searchGroup,
      }
      updateParent(newValues);
      setSearchValues(newValues);
    }

    if (searchDu) {
      const newValues = {
        ...searchValues,
        du: searchDu,
      }
      updateParent(newValues);
      setSearchValues(newValues);
    }
  }, []);

  const reset = () => {  
    setYearsOfExperience(0)
    setSearchValues(initSearch);
    setAdvBtnTitle("More conditions");
    setShowAdvancedSearch(false);
    updateParent(initSearch);
    onReset();
  };  

  const handleSelectChange = (e, name) => {
    updateSearchValues(name, e.join(','));
  }

  const updateSearchValues = (name, value) => {
    const newO = {
      ...searchValues, [name]: value,
    }
    updateParent(newO);
    setSearchValues(newO);
  }

  const handleChangeYearsOfExperience = (value) => {
    setYearsOfExperience(value ? value : 0);
    updateSearchValues('yearsOfExperience', value ? value : 0);
  }

  const handleAdvancedSearch = (e) => {
    const isShowing = !showAdvancedSearch;
    setShowAdvancedSearch(!showAdvancedSearch);
    if (isShowing) {
      setAdvBtnTitle("Less conditions");
      setTableHeightOffset(480);
    } else {
      setAdvBtnTitle("More conditions")
      const newValues = {
        ...searchValues,
        fullName: "",        
        type: '',
        group: searchGroup,
        du: searchDu,
        language: ''        
      }
      updateParent(newValues);
      setSearchValues(newValues);
      setTableHeightOffset(350);
    }
  }

  const handleFocus = (e) => {    
    if (e.target.id === 'skill') {
        if (skillSuggestions.length === 0) {
        getFieldSuggestions('skill', '', setSkillSuggestions);
      }
    } else if (e.target.id === 'roleName') {
        if (roleSuggestions.length === 0) {
        getFieldSuggestions('role', '', setRoleSuggestions);
      }
    } else if (e.target.id === 'certificate') {
        if (certificateSuggestions.length === 0) {
        getFieldSuggestions('certificate', '', setCertificateSuggestions);
      }
    }
  }

  return (
    <div id='home-header'>
      <Row>
        <Col span={4}>Skill</Col>
        <Col span={4} className="margin-left-20">Years of Experience (at least)</Col>
        <Col span={4}>Role</Col>
        <Col span={4}>Certificate</Col>
        <Col span={8}> </Col>
      </Row>
      <Row>
        <Col span={4}>
          <Select
            id='skill'
            className="search-field"
            mode="multiple"
            size="middle"
            onChange={(e) => handleSelectChange(e, "skill")}
            value={searchValues.skill ? searchValues.skill.split(',') : []}            
            allowClear={true}
            onFocus={handleFocus}
            notFoundContent={isLoading ? <Spin size="small" /> : null}
          >
            {skillSuggestions}
          </Select>          
        </Col>
        <Col span={4} className="padding-left-20">
          <InputNumber
            id='yearsOfExperience'
            style={{width: "100%"}}
            min={0}
            value={yearsOfExperience}
            onChange={handleChangeYearsOfExperience}            
          />
        </Col>
        <Col span={4} className="padding-left-20">
          <Select
            id='roleName'
            className="search-field"
            name="roleName"
            mode="multiple"
            size="middle"
            onChange={(e) => handleSelectChange(e, "roleName")}
            value={searchValues.roleName ? searchValues.roleName.split(',') : []}
            allowClear={true}
            onFocus={handleFocus}
            notFoundContent={isLoading ? <Spin size="small" /> : null}
          >
            {roleSuggestions}
          </Select>          
        </Col>
        <Col span={4} className="padding-left-20">
          <Select
            id='certificate'          
            className="search-field"
            mode="multiple"
            size="middle"
            onChange={(e) => handleSelectChange(e, "certificate")}
            value={searchValues.certificate ? searchValues.certificate.split(',') : []}
            allowClear={true}
            onFocus={handleFocus}
            notFoundContent={isLoading ? <Spin size="small" /> : null}
          >
            {certificateSuggestions}
          </Select>
        </Col>
        <Col span={8} className="padding-left-20">
          <Button 
            id='btnSearchProfile'
            type="primary"
            size="middle"
            style={{
              width: CSSConstants.BUTTON_WIDTH
            }}
            icon={<SearchOutlined />}
            onClick={search}
          >
            Search
          </Button>

          <Button
            id='btnReset'
            type="primary"
            size="middle"
            onClick={reset}
            style={{
              marginLeft: "20px",
              backgroundColor: "#8c8c8c",
              borderColor: "#8c8c8c",
              width: CSSConstants.BUTTON_WIDTH
            }}
            icon={<RedoOutlined />}
          >
            Reset
          </Button>

          <Button
            id='btnAdvancedSearch'
            type="link"
            size="small"
            style={{
              marginLeft: "20px",
              maxWidth: CSSConstants.BUTTON_WIDTH
            }}
            onClick={handleAdvancedSearch}>
            {advBtnTitle}
          </Button>
        </Col>

      </Row>
      <div>
        {showAdvancedSearch
          ? <AdvancedSearch
            searchValues={searchValues}            
            handleSelectChange={handleSelectChange}
            languageSuggestions={languageSuggestions}
            fullNameSuggestions={fullNameSuggestions}
            groupSuggestions={groupSuggestions}
            duSuggestions={duSuggestions}
            searchGroup={searchGroup}
            searchDu={searchDu}
            setFullNameSuggestions={setFullNameSuggestions}
            updateParent={updateParent}
            setSearchValues={setSearchValues}
            getFieldSuggestions={getFieldSuggestions}
            setLanguageSuggestions={setLanguageSuggestions}
            setFullNameSuggestions={setFullNameSuggestions}
            setGroupSuggestions={setGroupSuggestions}
            setDuSuggestions={setDuSuggestions}
          />
          : null}
      </div>
    </div>
  );
};

export default HomeHeader;
