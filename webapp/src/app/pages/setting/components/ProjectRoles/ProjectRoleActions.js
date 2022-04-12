import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import { openNotification } from "../../../../components/OpenNotification";
import { Messages } from "../../../../utils/AppMessage";
import { CSSConstants } from "../../../../constants/CSSConstants";
import { fetchProjectRoles } from "../../../../store/slice/settingSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ProjectRoleModal from "./ProjectRoleModal";
import { updateProjectrole } from "../../../../api/setting";

const ProjectRoleActions = ({ record, clearRowSelection, onDelete }) => {
  const dispatch = useDispatch();
  const [editVisible, setEditVisible] = useState(false);

  const onSave = async (values) => {
    const updateProjectRoleData = {
      projectRoleId: record.projectRoleId,
      name: values.name,
      status: values.status,
      createBy: record.createBy,
      createdDate: record.createdDate ? record.createdDate : null
    };
    const response = await updateProjectrole(updateProjectRoleData);
    if (response) {
      setEditVisible(false);
      await dispatch(fetchProjectRoles());
      openNotification(
        Messages.SUCCESS,
        Messages.editSuccessMessage("Project Role"),
        ""
      );
    } else {
      openNotification(
        Messages.ERROR,
        Messages.editUnsuccessMessage("Project Role"),
        ""
      );
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        type="link"
        size="small"
        onClick={() => {
          setEditVisible(true);
          clearRowSelection();
        }}
        style={{ width: CSSConstants.BUTTON_WIDTH }}
        icon={<EditOutlined />}
      >
        Edit
      </Button>
      <ProjectRoleModal
        title="EDIT PROJECT ROLE"
        visible={editVisible}
        onSave={onSave}
        onCancel={() => {
          setEditVisible(false);
        }}
        data={record}
      />
      {/*             <Button
        type="primary"
        size="small"
        danger
        onClick={() => {
          setDeleteEditVisible(true);
        }}
      >
        Delete
      </Button> */}
      <Popconfirm
        title={Messages.DELETE_CONFIRM}
        onConfirm={onDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button
          size="small"
          type="link"
          danger
          style={{ width: CSSConstants.BUTTON_WIDTH }}
          icon={<DeleteOutlined />}
          onClick={clearRowSelection}
        >
          Delete
        </Button>
      </Popconfirm>
      {/* <DeleteConfirm
        visible={deleteVisible}
        onDelete={onDelete}
        onCancel={() => {
          setDeleteEditVisible(false);
        }}
      /> */}
    </div>
  );
};

export default ProjectRoleActions;
