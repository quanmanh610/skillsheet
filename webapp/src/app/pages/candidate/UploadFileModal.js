import React from 'react';
import { Modal, Upload, Button, message} from 'antd';
import {UploadOutlined} from "@ant-design/icons";
import store from "../../store/store";
import axios from "axios";

const UploadFileModal = ({visible, onCancel, title, fetchCandidatesData}) => {

    const state = store.getState();
    const sendingToken = state.auth.user.token || "";
    const handleUpload = async options =>{
        const {onSuccess, onError, file} = options;
        const fmData = new FormData();
        const config = {
            headers: {'Authorization': 'Bearer ' + sendingToken, "Content-Type": "application/json", 'activityKey':'AC4' }
        };
        try {
            fmData.append("file", file);
            const res = await axios.post(
                process.env.REACT_APP_API_BASE_URL+"/api/candidate/uploadMaster",
                fmData,
                config
            );
            onSuccess("ok")
            fetchCandidatesData();
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

    return (
        <div>
            <Modal
                title={title}
                width={1000}
                okText="Confirm"
                cancelText="Cancel"
                visible={visible}
                onOk={() => onCancel()}
                onCancel={() => {onCancel()}}
            >
                <Upload accept = ".xlsx, .xls" customRequest={handleUpload} onChange={propsConfigUpload}>
                    <Button icon={<UploadOutlined />}>Click here to select the file</Button>
                </Upload>
            </Modal>
        </div>
    );
};

export default UploadFileModal;
