import React, { useEffect, useState, useMemo } from 'react';
import {Input, Row, Col, Button, Menu, Dropdown, AutoComplete, Select, Upload, Space, message} from 'antd';
import {SearchOutlined, PlusOutlined, RedoOutlined, DownOutlined, UploadOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import CandidateModal from './CandidateModal';
import CandidateErrorPopup from './CandidateErrorPopup';
import { CSSConstants } from '../../constants/CSSConstants';
import './CandidateHeader.css';
import { resendRequest, updateCandidate, addNewCandidate, findCandidateByEmailAndRole, getCandidateSuggestions, findCandidateByEmail, getChannel } from "../../api/candidate";
import { getUserData } from '../../store/slice/authSlice';
import { HttpStatus } from '../../constants/HttpStatus';
import { Messages } from '../../utils/AppMessage';
import { openNotification } from '../../components/OpenNotification';
import { Config } from '../../constants/AppConfiguration';
import { fetchCandidates, getCandidatesInStore,} from '../../store/slice/candidateSlice';
import './CandidateHeader.css';
import store from "../../store/store";
import axios from "axios";
import UploadFileModal from "./UploadFileModal";

const CandidateHeader = ({ updateParent, search, onReset, fetchCandidatesData }) => {
  // duong fix
  const state = store.getState();
  const sendingToken = state.auth.user.token || "";
  const handleUpload = async options =>{
    const {onSuccess, onError, file, onProgress} = options;
    const fmData = new FormData();
    const config = {
      headers: {'Authorization': 'Bearer ' + sendingToken, "Content-Type": "application/json", 'activityKey':'AC4' }
    };
    try {
    fmData.append("file", file);
      const res = await axios.post(
          process.env.REACT_APP_API_BASE_URL +"/api/candidate/uploadMaster",
          fmData,
          config
      );
      onSuccess("ok")
    } catch (err) {
      onError({ err });
    }
  };

  const propsConfigUpload = (info) => {
      if (info.file.status === 'done') {
        message.success(`Success!`, 3)
      } else if (info.file.status === 'error') {
        message.error(`Error!`,
            3)
    }
  }

  const initSearch = {
    fullName: "",
    roleName: "",
    status: "New,Active,Inactive",
  }
  const initPagiState = {
    page: 1,
    size: 20,
    column: "candidateId",
    sort: Config.ASCENDING_SORT,
    fullName: "",
    roleName: "",
    status: 'new,active,inactive',
  };

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [uploadModalVisible, setUpModalVisible] = useState(false);
  const [searchValues, setSearchValues] = useState(initSearch);

  const onAddNew = () => {
    setAddModalVisible(true);
  };

  const onUploadFile = () => {
    setUpModalVisible(true)
  }

  const [notiPopupVisible, setNotiPopupVisible] = useState(false);
  const [resendPopupVisible, setResendPopupVisible] = useState(false);
  const [tmpCandidate, setTmpCandidate] = useState([]);
  const user = useSelector(getUserData);
  const dispatch = useDispatch();
  const [pagiState, setPagiState] = useState(initPagiState);
  const [roleSuggestions, setRoleSuggestions] = useState([]);
  const [fullNameSuggestions, setFullNameSuggestions] = useState([]);
  const [fullNameInput, setFullNameInput] = useState();
  const [init, setInit] = useState(true);
  const dataSource = useSelector(getCandidatesInStore);

  const { Option } = Select;
  let timer = null;

  const statusItems = [];
  statusItems.push(<Option key='New'>New</Option>);
  statusItems.push(<Option key='Active'>Active</Option>);
  statusItems.push(<Option key='Inactive'>Inactive</Option>);
  statusItems.push(<Option key='Contracted'>Contracted</Option>);


  const getFieldSuggestions = async (type, searchValue, setSuggestions) => {
    const response = await getCandidateSuggestions(type, searchValue);
    if (response && response.data) {
      const items = [];
      const roles = []
      const rolesInSearchingInput = [];
      response.data.map(x => {
        if(x != null) {
          if (x.includes(',')) {
            x.split(',').map((role) => roles.push(role));
          } else {
            roles.push(x);
          }
        }
      })
      roles.map((role) => {
        if (rolesInSearchingInput.includes(role) === false) {
          items.push(<Option key={role}>{role}</Option>);
          rolesInSearchingInput.push(role);
        }
      })
      setSuggestions(items);
    } else {
      setSuggestions([]);
    }
  }

  const getFullNameSuggestions = async (searchValue) => {
    const response = await getCandidateSuggestions('fullName', searchValue);
    if (response && response.data) {
      const items = [];
      for (let i = 0; i < response.data.length; i++) {
        const fullName = response.data[i];
        const parts = fullName.split('|');
        if (parts.length === 2) {
          items.push(
            <Option key={i + "_" + parts[1]}>
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
        const fullName = dataSource[i].fullName + "|" + dataSource[i].email;        
        if (!fullNameList.includes(fullName)) {
          fullNameList.push(fullName);
          items.push(
            <Option key={dataSource[i].candidateId + "_" + dataSource[i].email}>
              {dataSource[i].fullName + ' (' + dataSource[i].email + ')'}
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
  };

  const onSaveHeader = async (values) => {
    const formData = new FormData();
    const body = {
      ...values, createBy: user.userName
    };
    formData.append('candidate', JSON.stringify(body));

    const res = findCandidateByEmail(body);    
    const r = Promise.resolve(res).then(async function(value) {      
      const can = value.data;
      if(can) {

        if(can.status === "inactive" || can.status === "new") {
          setNotiPopupVisible(true);
        } else {
          setResendPopupVisible(true);
          setTmpCandidate(can);
        };
      } else {
        const resp = await addNewCandidate(body);
        if (resp.status === HttpStatus.OK) {
          openNotification(Messages.SUCCESS, Messages.addSuccessMessage("Candidate"), "");
          await dispatch(fetchCandidates(pagiState));
        } else {
          openNotification(Messages.ERROR, Messages.addUnsuccessMessage("Candidate"), "");
        }
      };
      return can.status ? can.status : "";
    }
    );
    return r;
  }

  const onSavePopup = async (data) => {
    data.status = "new";
    const formData = new FormData();
    const body = {
      ...data
    };
    const id = { idSelectedLst: [data.candidateId] };
    formData.append('candidate', JSON.stringify(body));
    formData.append('candidate', JSON.stringify(id));
    await resendRequest(id);
    await updateCandidate(body);
    await dispatch(fetchCandidates(pagiState));
    // onCancel();
    setResendPopupVisible(false);
    setAddModalVisible(false);
    openNotification(
    Messages.SUCCESS,
    "Resent request to candidate successfully",
    ''
  );
  }

  const onSave = async (values, form, setCandidate, initCandidate) => {
    const status = onSaveHeader(values);    
    Promise.resolve(status).then(function(value) {
      if(value !== ""){
        return;
      } else {
         return false;
      }
    });
    return status;
  };

  const onConfirm = async () => {
    //upload file to server
    //call api
    fetchCandidatesData();
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
        <Col span={16}>
          <Row>
            <Col span={6}> Full name</Col>
            <Col span={5} className="margin-left-20"> Role</Col>
            <Col span={5} className="margin-left-20"> Status</Col>
            <Col span={6} className="margin-left-20"> </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Row>
            <Col span={6}>
            <Select
                className="search-field"
                name="fullName"
                mode="multiple"
                size="small"
                onChange={(e) => handleSelectChange(e, 'fullName')}
                value={searchValues.fullName ? searchValues.fullName.split(',') : []}
                onSearch={handleFullNameSearch}
                filterOption={false}
                allowClear={true}
              >
                {fullNameSuggestions}
              </Select>
            </Col>
            <Col span={5} className="margin-left-20">
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
            <Col span={5} className="margin-left-20">
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
            <Col span={6} className="margin-left-20">
              <Row>
                <Button type="primary"
                  size="small"
                  style={{
                    width: CSSConstants.BUTTON_WIDTH
                  }}
                  icon={<SearchOutlined />}
                  onClick={search}
                >
                  Search
            </Button>
                <Button className="margin-left-20"
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
              </Row>
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
            <Space style={{ width: '100%' }} size="large">
              {/* <Upload accept = ".xlsx, .xls" customRequest={handleUpload} onChange={propsConfigUpload}>
               <Button icon={<UploadOutlined />}>Upload Excel</Button>
              </Upload> */}
                <Button icon={<UploadOutlined />} onClick={onUploadFile}>Upload Excel file</Button>
            </Space>
            <Button type="primary" onClick={onAddNew}
              size="small"
              style={{ width: CSSConstants.BUTTON_WIDTH * 1.3 }}
              icon={<PlusOutlined />}
            >
              Add New
            </Button>
          </div>
        </Col>

      </Row>

      <CandidateModal
        title="Add New Candidate"
        visible={addModalVisible}
        onSave={onSave}
        onCancel={() => {
          setAddModalVisible(false);
        }}
        resendPopupVisible={resendPopupVisible}
        tmpCandidate={tmpCandidate}
        setResendPopupVisible={setResendPopupVisible}
        pagiState={pagiState}
        onSavePopup={onSavePopup}
      />
      <CandidateErrorPopup
        visible={notiPopupVisible}
        onDone={()=>{setNotiPopupVisible(false)}}
        message="The email existed."
      ></CandidateErrorPopup>

      <UploadFileModal
          title={"Upload Excel file"}
          visible={uploadModalVisible}
          onSave={fetchCandidatesData}
          onCancel={() => {
            setUpModalVisible(false);
          }}
          setResendPopupVisible={setResendPopupVisible}
          fetchCandidatesData={fetchCandidatesData}
      ></UploadFileModal>

    </div>
  );
};

export default CandidateHeader;
