import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, Button, Select, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { getEmailsInStore } from '../../../../store/slice/settingSlice';
import { CSSConstants } from '../../../../constants/CSSConstants';
import {
  hourFormat,
  minuteList,
  hourList,
  weekDayList,
  orderofDayList,
  dayList,
  schedule
} from '../../../../constants/DateTimes';

import {
  status
} from '../../../../constants/Status';

import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
const EmailModal = ({ visible, onSave, onCancel, data, title }) => {
  const [form] = Form.useForm();
  const emails = useSelector(getEmailsInStore);
  const initialEmailForm = {
    emailId: '',
    receiver: 'Staff',
    schedule: 'Monthly',
    haveRepeat: '',
    radio: 'first',
    stofDay: '1st',
    orderofDay: 'First',
    weekDay: 'Monday',
    time: '',
    hour: '01',
    minute: '00',
    hourFormat: 'AM',
    status: 'Inactive'
  };
  const [isEdit, updateIsEdit] = useState(data ? true : false);
  const [email, updateEmail] = useState(initialEmailForm);
  const [emailBK, updateEmailBK] = useState(initialEmailForm);

  useEffect(() => {
    function mapData() {
      if (data) {
        const weekDays = weekDayList.map(function (item) {
          return item['value'];
        });
        if (data.day || weekDays.includes(data.day)) {
          const hour = data.time ? data.time.substring(0, 2) : '01';
          const minute = data.time ? data.time.substring(3, 5) : '00';
          const hourFormat = data.time ? data.time.substring(6, 8) : 'AM';
          const newEmail = {
            emailId: data.emailId,
            receiver: data.receiver,
            schedule: data.schedule,
            haveRepeat: data.haveRepeat,
            radio: 'second',
            stofDay: '1st',
            orderofDay: data.haveRepeat,
            weekDay: data.day,
            time: data.time,
            hour: hour,
            minute: minute,
            hourFormat: hourFormat,
            status: data.status
          };
          updateEmail(newEmail);
          updateEmailBK(newEmail);
        } else {
          const hour = data.time ? data.time.substring(0, 2) : '01';
          const minute = data.time ? data.time.substring(3, 5) : '00';
          const hourFormat = data.time ? data.time.substring(6, 8) : 'AM';
          const newEmail = {
            emailId: data.emailId,
            receiver: data.receiver,
            schedule: data.schedule,
            haveRepeat: data.haveRepeat,
            radio: 'first',
            stofDay: data.haveRepeat,
            orderofDay: 'First',
            weekDay: 'Monday',
            time: data.time,
            hour: hour,
            minute: minute,
            hourFormat: hourFormat,
            status: data.status
          };
          updateEmail(newEmail);
          updateEmailBK(newEmail);
        }
      } else {
        updateEmail(initialEmailForm);
        updateEmailBK(initialEmailForm);
      }
    }
    mapData();
  }, [data]);

  const onSubmitForm = () => {
    if (isEdit) {
      const newEmail = {
        emailId: email.emailId,
        receiver: email.receiver,
        schedule: email.schedule,
        haveRepeat: email.radio === 'first' ? email.stofDay : email.orderofDay,
        day: email.radio === 'first' ? '' : email.weekDay,
        time: email.hour + ':' + email.minute + ' ' + email.hourFormat,
        status: email.status
      };
      onSave(newEmail);
      onClosePopup();
    } else {
      const newEmail = {
        receiver: 'Staff',
        schedule: email.schedule,
        haveRepeat: email.radio === 'first' ? email.stofDay : email.orderofDay,
        day: email.radio === 'first' ? '' : email.weekDay,
        time: email.hour + ':' + email.minute + ' ' + email.hourFormat,
      };
      onSave(newEmail);
      onClosePopup();
    }
  };
  const onClosePopup = () => {
    if (isEdit) {
      updateEmail(emailBK);
    } else {
      updateEmail(initialEmailForm);
    }
    onCancel();
  };

  const onChangeRadio = (e) => {
    updateEmail(mappingData(email, e.target.value, 'radio'));
  };

  const updateSchedule = (e) => {
    updateEmail(mappingData(email, e, 'schedule'));
  };

  const updateStofDay = (e) => {
    updateEmail(mappingData(email, e, 'stofDay'));
  };

  const updateWeekDay = (e) => {
    updateEmail(mappingData(email, e, 'weekDay'));
  };

  const updateOrderofDay = (e) => {
    updateEmail(mappingData(email, e, 'orderofDay'));
  };

  const updateHour = (e) => {
    updateEmail(mappingData(email, e, 'hour'));
  };

  const updateMinute = (e) => {
    updateEmail(mappingData(email, e, 'minute'));
  };
  const updateHourFormat = (e) => {
    updateEmail(mappingData(email, e, 'hourFormat'));
  };

  const updateStatus = (e) => {
    updateEmail(mappingData(email, e, 'status'));
  }

  function mappingData(email, e, name) {
    const newEmail = {
      emailId: email.emailId,
      receiver: email.receiver,
      schedule: email.schedule,
      haveRepeat: email.haveRepeat,
      radio: email.radio,
      stofDay: email.stofDay,
      orderofDay: email.orderofDay,
      weekDay: email.weekDay,
      time: email.time,
      hour: email.hour,
      minute: email.minute,
      hourFormat: email.hourFormat,
      status: email.status
    };
    return Object.assign(newEmail, { [name]: e });
  }

  return (
    <Modal
      style={{ width: '800px' }}
      title={title}
      okText="Save"
      cancelText="Cancel"
      visible={visible}
      onOk={onSubmitForm}
      onCancel={onClosePopup}
      span={8}
      footer={[
        <Button
          key="back"
          onClick={onClosePopup}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<CloseOutlined />}
          size="default"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmitForm}
          style={{ width: CSSConstants.BUTTON_WIDTH * 1.2 }}
          icon={<SaveOutlined />}
          size="default"
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 25 }}
        labelAlign="left"
        layout="horizontal"
        name="add_new_email"
      >
        <Form.Item label="Schedule">
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          >
            <Tooltip title="">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </Tooltip>
            <Select
              size="small"
              style={{ width: 100 }}
              name="day"
              allowClear={false}
              options={schedule}
              value={email.schedule}
              onChange={updateSchedule}
            />
          </div>
        </Form.Item>

        <Form.Item label="Interval" style={{ marginBottom: 0 }}>
          <Radio.Group onChange={onChangeRadio} value={email.radio}>
            <Form.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'center',
                }}
              >
                <Radio value="first"></Radio>
                <Select
                  size="small"
                  style={{ width: 70 }}
                  name="stofDay"
                  allowClear={false}
                  options={dayList}
                  value={email.stofDay}
                  onChange={updateStofDay}
                />
                <Tooltip title="">
                  <span>day of every month/quarter/half-year</span>
                </Tooltip>
              </div>
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'center',
                }}
              >
                <br></br>
                <Radio value="second"></Radio>
                <Select
                  size="small"
                  style={{ width: 70 }}
                  name="orderofDay"
                  allowClear={false}
                  options={orderofDayList}
                  value={email.orderofDay}
                  onChange={updateOrderofDay}
                />
                <Select
                  size="small"
                  style={{ width: 100 }}
                  name="weekDay"
                  allowClear={false}
                  options={weekDayList}
                  value={email.weekDay}
                  onChange={updateWeekDay}
                />
                <Tooltip title="">
                  <span>of every month/quarter/half-year</span>
                </Tooltip>
              </div>
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                  }}
                >
                  <Tooltip title="">
                    <span>at&nbsp;&nbsp;&nbsp;</span>
                  </Tooltip>
                  <Select
                    size="small"
                    style={{ width: 100 }}
                    name="hour"
                    allowClear={false}
                    options={hourList}
                    value={email.hour}
                    defaultValue={email.hour}
                    onChange={updateHour}
                  />
                  <Select
                    size="small"
                    style={{ width: 100 }}
                    name="minute"
                    allowClear={false}
                    options={minuteList}
                    value={email.minute}
                    defaultValue={email.minute}
                    onChange={updateMinute}
                  />
                  <Select
                    size="small"
                    style={{ width: 100 }}
                    name="hourFormat"
                    allowClear={false}
                    options={hourFormat}
                    value={email.hourFormat}
                    defaultValue={email.hourFormat}
                    onChange={updateHourFormat}
                  />
                </div>
              </div>
            </Form.Item>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Status">
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          >
            <Tooltip title="">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </Tooltip>
            <Select
              size="small"
              style={{ width: 100 }}
              name="status"
              allowClear={false}
              options={status}
              value={email.status}
              defaultValue={email.status}
              onChange={updateStatus}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmailModal;
