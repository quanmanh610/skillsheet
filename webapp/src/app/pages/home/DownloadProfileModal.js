import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplateProfile, getTemplateProfileInStore } from '../../store/slice/settingSlice';
import { ArrowDownOutlined } from '@ant-design/icons';
import { downloadTemplateProfileWithId } from '../../api/setting';
import { UrlConstants } from '../../constants/Constants';
import { downloadProfile } from "../../api/profile";
import { HttpStatus } from '../../constants/HttpStatus';
import { convertToByteArray, downloadFile } from '../../utils/ConvertDataBinary';
import { Messages } from '../../utils/AppMessage';
import { openNotification } from '../../components/OpenNotification';

const DownloadProfileModal = (props) => {
    const { visible, onCancel, profileId, profileFullName } = props;    
    const dispatch = useDispatch();    
    
    const templates = useSelector(getTemplateProfileInStore);    
    const [selectedRows, setSelectedRows] = useState([]);

    useMemo(() => {
        async function fetchData() {
            await dispatch(fetchTemplateProfile());
        }
        fetchData();        
    }, []);

    useEffect(() => {
        if (selectedRows.length === 0 && templates.length > 0) {
            setSelectedRows([templates[0].templateId]);
        }
    });

    const handleCancel = () => {
        onCancel();
    }

    const handleOk = async () => {        
        if (!selectedRows.length) {
            return;
        }        
        const templateId = selectedRows[0];          
        const response = await downloadProfile(profileId, templateId);
        if (response && response.status === HttpStatus.OK) {
            if (!response.data.errorMessage) {
                const blob = new Blob([...convertToByteArray(atob(response.data.file))], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
                downloadFile(blob, profileFullName + ".docx");                                
              } else {                
                openNotification(Messages.ERROR, response.data.errorMessage, "");
              }
        }
        onCancel();
    }    

    const columns = [
        {            
            title: 'Template name',
            dataIndex: 'templateName',            
        },
        {
            title: '',
            render: (value, record) => {

                const onDownload = async () => {
                    const response = await downloadTemplateProfileWithId(record.templateId);                    
                    if (response && response.status === 200) {
                        window.location.href= UrlConstants.API_BASE_URL + "/api/setting/downloadTemplateProfile/" + record.templateId;
                    }
                }

                return (
                    <div>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => onDownload()}
                            icon={<ArrowDownOutlined />}>
                            Download template
                        </Button>
                    </div>
                );
            },
        }
    ];

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys, selected) => {                    
          setSelectedRows([selected[0].templateId]);
        },    
        getCheckboxProps: (record) => ({            
            name: record.templateName,
          }),    
      };

    return ( 
        <Modal title="Select profile template"
            okText="Download Profile"
            cancelText="Cancel"
            visible={visible}
            width="600px"
            onCancel={handleCancel}   
            onOk={handleOk}  
            okButtonProps={{disabled: selectedRows.length === 0}}      
            >
                <Table
                    rowKey={record => record.templateId}
                    rowSelection={{
                        type: 'radio',
                        ...rowSelection
                    }}
                    columns={columns}
                    dataSource={templates}
                />
        </Modal>
     );
}
 
export default DownloadProfileModal;