import React, { useState } from 'react';
import { Col, DatePicker, Row, Select, Spin } from 'antd';
import { getProfileListSuggestions } from '../../api/profile';
import moment from 'moment';
import './Home.css';

const AdvancedSearch = (props) => {
    const {
        searchValues,
        handleSelectChange,
        languageSuggestions,
        fullNameSuggestions,
        groupSuggestions,
        duSuggestions,
        searchGroup,
        searchDu,
        updateParent,
        setSearchValues,
        getFieldSuggestions,
        setLanguageSuggestions,
        setFullNameSuggestions,
        setGroupSuggestions,
        setDuSuggestions,
    } = props;
    
    const [fullNameInput, setFullNameInput] = useState();
    const dateFormat = 'MM/YYYY';
    const [availableTo, setAvailableTo] = useState();
    const [isLoading, setIsLoading] = useState(false);

    let timer = null;

    const getFullNameSuggestions = async (searchValue) => {
        setIsLoading(true);

        const response = await getProfileListSuggestions('fullName', searchValue);
        if (response && response.data) {
            const items = [];
            for (let i = 0; i < response.data.length; i++) {
                const fullName = response.data[i];
                const parts = fullName.split('|');
                if (parts.length === 2) {
                    items.push(
                        <Option key={fullName}>
                            {parts[0] + ' (' + parts[1] + ')'}
                        </Option>)
                }
            }
            setFullNameSuggestions(items);
        } else {
            setFullNameSuggestions([]);
        }

        setIsLoading(false);
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

    const handleAvailableTimeChange = (datePicker) => {
        if (datePicker !== null) {
            const newO = {
                ...searchValues,
                availableTo: moment.utc(moment(datePicker._d).endOf('month')).format()
            }
            updateParent(newO);
            setSearchValues(newO);
            setAvailableTo(datePicker);
        } else {
            const newO = {
                ...searchValues, availableTo: ""
            }
            updateParent(newO);
            setSearchValues(newO);
            setAvailableTo('');
        }
    }

    const handleFocus = (e) => {        
        if (e.target.id === 'group') {
            if (groupSuggestions.length === 0) {
            getFieldSuggestions('group', '', setGroupSuggestions);
          }
        } else if (e.target.id === 'du') {
            if (duSuggestions.length === 0) {
            getFieldSuggestions('du', '', setDuSuggestions);
          }
        } else if (e.target.id === 'language') {
            if (languageSuggestions.length === 0) {
            getFieldSuggestions('language', '', setLanguageSuggestions);
          }
        } 
      }

    const { Option } = Select;

    const profileTypes = [];
    profileTypes.push(<Option key='Main Profile'>Main Profile</Option>);
    profileTypes.push(<Option key='Temporary Profile'>Temporary Profile</Option>);
    profileTypes.push(<Option key='Candidate'>Candidate</Option>);

    return (
        <div>
            <div>
                <Row className="margin-top-20">
                    <Col span={4}>Full Name</Col>
                    <Col span={4} className="margin-left-20">Group</Col>
                    <Col span={4}>DU</Col>
                    <Col span={4}>Available Time</Col>
                    <Col span={8}> </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <Select
                            id='fullName'
                            className="search-field"
                            mode="multiple"
                            size="middle"
                            onChange={(e) => handleSelectChange(e, "fullName")}
                            value={searchValues.fullName ? searchValues.fullName.split(',') : []}
                            onSearch={handleFullNameSearch}
                            filterOption={false}
                            allowClear={true}
                            onFocus={handleFocus}                            
                            notFoundContent={isLoading ? <Spin size="small" /> : null}
                        >
                            {fullNameSuggestions}
                        </Select>
                    </Col>
                    <Col span={4} className="padding-left-20">
                        <Select
                            id='group'
                            className="search-field"
                            name="group"
                            mode="multiple"
                            size="middle"
                            allowClear={true}
                            onChange={(e) => handleSelectChange(e, "group")}
                            value={searchValues.group ? searchValues.group.split(',') : []}
                            disabled={!!searchGroup}
                            onFocus={handleFocus}
                            notFoundContent={isLoading ? <Spin size="small" /> : null}
                        >
                            {groupSuggestions}
                        </Select>
                    </Col>
                    <Col span={4} className="padding-left-20">
                        <Select
                            id='du'
                            className="search-field"
                            name="du"
                            mode="multiple"
                            size="middle"
                            allowClear={true}
                            onChange={(e) => handleSelectChange(e, "du")}
                            value={searchValues.du ? searchValues.du.split(',') : []}
                            disabled={!!searchDu}
                            onFocus={handleFocus}
                            notFoundContent={isLoading ? <Spin size="small" /> : null}
                        >
                            {duSuggestions}
                        </Select>
                    </Col>
                    <Col span={4} className="padding-left-20">
                        <DatePicker
                            id='availableTime'
                            style={{ width: "100%" }}
                            format={dateFormat}
                            onChange={handleAvailableTimeChange}
                            value={availableTo}
                            picker="month"
                        />
                    </Col>
                </Row>
            </div>
            <div className="margin-top-10">
                <Row>
                    <Col span={4}>Profile Type</Col>
                    <Col span={4} className="margin-left-20">Language</Col>
                    <Col span={26}></Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <Select
                            id='profileType'
                            className="search-field"
                            mode="multiple"
                            size="middle"
                            allowClear={true}
                            onChange={(e) => handleSelectChange(e, "type")}
                            value={searchValues.type ? searchValues.type.split(',') : []}
                            onFocus={handleFocus}
                        >
                            {profileTypes}
                        </Select>
                    </Col>
                    <Col span={4} className="padding-left-20">
                        <Select
                            id='language'
                            className="search-field"
                            name="language"
                            mode="multiple"
                            size="middle"
                            allowClear={true}
                            onChange={(e) => handleSelectChange(e, "language")}
                            value={searchValues.language ? searchValues.language.split(',') : []}
                            onFocus={handleFocus}
                            notFoundContent={isLoading ? <Spin size="small" /> : null}
                        >
                            {languageSuggestions}
                        </Select>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default AdvancedSearch;