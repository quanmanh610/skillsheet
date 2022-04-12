import React, { useState } from 'react';
import { Input, Row, Col, Button, DatePicker } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { CSSConstants } from '../../constants/CSSConstants';
import { dateFormat } from '../../constants/DateTimes';
import moment from 'moment';

const { RangePicker } = DatePicker;

const LogHeader = ({ updateParent, search, onReset }) => {
  const date = new Date();
  const firstDayOfMonth = moment(new Date(date.getFullYear(), date.getMonth(), 1));
  const today = moment(date);

  const initSearch = {
    editor: "",
    tableName: "",
    from: moment(firstDayOfMonth).format("MM/DD/yyyy") + " 00:00:00",
    to: moment(today).format("MM/DD/yyyy") + " 23:59:59"
  }

  const [searchValues, setSearchValues] = useState(initSearch);
  const [rangePicker, setRangePicker] = useState([firstDayOfMonth, today]);

  const reset = () => {
    setSearchValues(initSearch);
    updateParent(initSearch);
    onReset();
    setRangePicker([firstDayOfMonth, today]);
  };

  const handleChangeInput = (e) => {
    const newO = {
      ...searchValues, [e.target.name]: e.target.value,
    }
    updateParent(newO);
    setSearchValues(newO);
  }

  const handleChangeRangePicker = (dates, dateStrings) => {
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
  return (
    <div>
      <Row>
        <Col span={16}>
          <Row>
            <Col span={4}> Editor </Col>
            <Col span={4} className="margin-left-20"> Table Name</Col>
            <Col span={7} className="margin-left-20"> From - To</Col>
          </Row>
        </Col>
        <Col span={8}>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Row>
            <Col span={4}>
              <Input name="editor" size="small"
                maxLength={100}
                onChange={handleChangeInput}
                onPressEnter={search}
                value={searchValues.editor} />
            </Col>
            <Col span={4} className="margin-left-20">
              <Input
                size="small"
                name="tableName"
                maxLength={100}
                onChange={handleChangeInput}
                onPressEnter={search}
                value={searchValues.tableName} />
            </Col>
            <Col span={7} className="margin-left-20">
              <RangePicker
                allowEmpty
                name="time"
                format={dateFormat}
                onChange={handleChangeRangePicker}
                value={rangePicker}
                style={{ width: "100%" }}
                size="small"
                defaultValue={[moment(firstDayOfMonth, dateFormat), moment(today, dateFormat)]}
              />
            </Col>
            <Col span={7} className="margin-left-20">
              <Button type="primary" className="margin-left-20"
                size="small"
                style={{
                  width: CSSConstants.BUTTON_WIDTH
                }}
                icon={<SearchOutlined />}
                onClick={search}
              >
                Search
              </Button> 
              &nbsp;&nbsp;&nbsp;
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
        <Col span={8}>
          <div style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
            <Row>
              
              

            </Row>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default LogHeader;
