import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Input, Row, Col, Button, DatePicker, AutoComplete, Dropdown, Menu, Select } from 'antd';
import { SearchOutlined, RedoOutlined, DownOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../constants/CSSConstants';
import { dateFormat } from '../../constants/DateTimes';
import { getRequestManagementFromStore } from '../../store/slice/requestMangementSlice';
import moment from 'moment';
import { getRequestSuggestions } from '../../api/requestmanagement';
import { getUserData } from '../../store/slice/authSlice';


const { RangePicker } = DatePicker;

const RequestManagementHeader = ({ updateParent, search, onReset }) => {

  const date = new Date();
  const firstDayOfMonth = moment(new Date(date.getFullYear(), date.getMonth(), 1));
  const firstDayOf3MonthsBefore = moment(firstDayOfMonth).subtract(3, 'months');
  const today = moment(date);

  const userData = useSelector(getUserData);

  const initSearch = {
    fullName: "",
    roleName: "",
    status: "Submitted",
    from: moment(firstDayOf3MonthsBefore).format("MM/DD/yyyy") + " 00:00:00",
    to: moment(today).format("MM/DD/yyyy") + " 23:59:59",
    group: '',
    du: '',
    picEmail: userData.email
  }

  const { Option } = Select;
  const dataSource = useSelector(getRequestManagementFromStore);
  const [searchValues, setSearchValues] = useState(initSearch);
  const [roleSuggestions, setRoleSuggestions] = useState([]);
  const [fullNameSuggestions, setFullNameSuggestions] = useState([]);
  const [fullNameInput, setFullNameInput] = useState();
  const [init, setInit] = useState(true);
  const [rangePicker, setRangePicker] = useState([firstDayOf3MonthsBefore, today]);

  const statusItems = [];
  statusItems.push(<Option key='Submitted'>Submitted</Option>);
  statusItems.push(<Option key='Approved'>Approved</Option>);
  statusItems.push(<Option key='Rejected'>Rejected</Option>);

  let timer = null;

  const getFieldSuggestions = async (type, searchValue, setSuggestions) => {
    const response = await getRequestSuggestions(type, searchValue);    
    if (response && response.data) {
      const items = [];
      response.data.map(x => items.push(<Option key={x}>{x}</Option>))
      setSuggestions(items);
    } else {
      setSuggestions([]);
    }
  }

  const getFullNameSuggestions = async (searchValue) => {
    const response = await getRequestSuggestions('fullName', searchValue);
    if (response && response.data) {
      const items = [];
      for (let i = 0; i < response.data.length; i++) {
        const fullName = response.data[i];
        const parts = fullName.split('|');
        if (parts.length === 2) {
          items.push(
            <Option key={parts[1]}>
              {parts[0] + ' (' + parts[1] + ')'}
            </Option>)
        }
      }
      setFullNameSuggestions(items);
    } else {
      setFullNameSuggestions([]);
    }
  }

  useMemo(() => {
    if (fullNameSuggestions.length === 0 && dataSource.length > 0) {
      const items = [];
      const fullNameList = [];
      for (let i = 0; i < dataSource.length; i++) {
        const fullName = dataSource[i].fullName + "|" + dataSource[i].userName;
        if (!fullNameList.includes(fullName)) {
          fullNameList.push(fullName);
          items.push(
            <Option key={dataSource[i].userName}>
              {dataSource[i].fullName + ' (' + dataSource[i].userName + ')'}
            </Option>)
        }
      }
      setFullNameSuggestions(items);
    }

    if (!init) {
      return;
    } else {
      setInit(false);
      async function initFieldSuggestions() {
        getFieldSuggestions('role', '', setRoleSuggestions);
      }
      initFieldSuggestions();
    }
  }, [init, dataSource])

  const reset = () => {
    setSearchValues(initSearch);
    updateParent(initSearch);
    onReset();
    setRangePicker([firstDayOf3MonthsBefore, today]);
  };  

  const handleChangeRangePicker = (dates) => {
    if (dates !== null) {
      const newO = {
        ...searchValues, from: moment(dates[0]._d).format("MM/DD/yyyy") + " 00:00:00", to: moment(dates[1]._d).format("MM/DD/yyyy") + " 23:59:59"
      }
      updateParent(newO);
      setSearchValues(newO);
      setRangePicker(dates);
    } else {
      const newO = {
        ...searchValues, from: "", to: ""
      }
      updateParent(newO);
      setSearchValues(newO);
      setRangePicker(dates);
    }
  }  

  const updateSearchValues = (name, value) => {
    const newO = {
      ...searchValues, [name]: value,
    }
    updateParent(newO);
    setSearchValues(newO);
  }

  const handleSelectChange = (e, name) => {
    updateSearchValues(name, e.join(','));
  }

  const handleFullNameSearch = (e) => {
    if (fullNameInput !== e) {
      handleFullNameSearchSuggestions(e);
    }
  }

  const handleFullNameSearchSuggestions = (searchValue) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      setFullNameInput(searchValue);
      getFullNameSuggestions(searchValue);
    }, (200));
  }

  return (
    <div>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={6}> Full Name </Col>
            <Col span={3} className="margin-left-20"> Role</Col>
            <Col span={4} className="margin-left-20"> Status</Col>
            <Col span={4} className="margin-left-20"> From - To</Col>
            <Col span={7} className="margin-left-20"></Col>
          </Row>
        </Col>
        <Col span={8} > </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={6}>
              <Select
                className="search-field"
                name="fullName"
                mode="multiple"
                size="small"
                onChange={(e) => handleSelectChange(e, "fullName")}
                value={searchValues.fullName ? searchValues.fullName.split(',') : []}
                onSearch={handleFullNameSearch}
                filterOption={false}
                allowClear={true}
              >
                {fullNameSuggestions}
              </Select>
            </Col>
            <Col span={3} className="margin-left-20">
              <Select
                className="search-field"
                name="roleName"
                mode="multiple"
                size="small"
                onChange={(e) => handleSelectChange(e, "roleName")}
                value={searchValues.roleName ? searchValues.roleName.split(',') : []}
                allowClear={true}
              >
                {roleSuggestions}
              </Select>
            </Col>
            <Col span={4} className="margin-left-20">
              <Select
                className="search-field"
                mode="multiple"
                size="small"
                allowClear={true}
                value={searchValues.status ? searchValues.status.split(',') : []}
                onChange={(e) => handleSelectChange(e, "status")}>
                {statusItems}
              </Select>
            </Col>
            <Col span={4} className="margin-left-20">
              <RangePicker
                allowEmpty
                name="time"
                format={dateFormat}
                onChange={handleChangeRangePicker}
                value={rangePicker}
                style={{ width: "100%" }}
                size="small"
                defaultValue={[moment(firstDayOf3MonthsBefore, dateFormat), moment(today, dateFormat)]}
              />
            </Col>
            <Col span={5}>
              <Button type="primary" className="margin-left-20"
                size="small"
                style={{
                  marginRight: '20px',
                  width: CSSConstants.BUTTON_WIDTH
                }}
                icon={<SearchOutlined />}
                onClick={search}
              >
                Search
              </Button>

              <Button
                type="primary"
                size="small"
                onClick={reset}
                style={{
                  backgroundColor: "#8c8c8c",
                  borderColor: "#8c8c8c",
                  width: CSSConstants.BUTTON_WIDTH
                }}
                icon={<RedoOutlined />}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

    </div>
  );
};

export default RequestManagementHeader;
