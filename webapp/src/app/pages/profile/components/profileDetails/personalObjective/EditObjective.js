import React, { useState } from 'react';
import { Row, Col, Typography, Input, Button, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import { updateProfile } from '../../../../../api/profile';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { useSpring, animated } from 'react-spring'

const { Text } = Typography;

const { TextArea } = Input;

const EditObjective = ({ rootProfile, onSaveinView, onCancelinView }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const isLoading = useSelector(isLoadingStatus);

  const [profile, setProfile] = useState(rootProfile);

  const onFinish = async (values) => {
    const resp = await updateProfile(typeof profile.avatar === "string" ? { ...profile, avatar: convertDataURIToBinary(profile.avatar) } : profile);
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: profile.profileId }));
      openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Persional Objective"), "");
      onSaveinView();
    }
  };

  const onCancel = () => {
    onCancelinView();
  };

  const handleChangeObjective = (e) => {
    const newProfile = { ...profile, [e.target.name]: e.target.value }
    setProfile(newProfile);
    form.setFieldsValue({
      [e.target.name]: e.target.value
    });

  };

  return (
    <animated.div style={props} className="border-bottom-solid">
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Form
            form={form}
            name="objective"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              objective: profile.objective
            }}
          >
            <Form.Item label="Describe your career objectives"
              rules={[
                {
                  required: true,
                  message: Messages.requiredMessage("Persional Objective"),
                },
              ]}>
              <div style={{ display: 'none' }}>
                {profile ? profile.objective : ''}
              </div>
              <TextArea name="objective" rows={5} value={profile.objective}
                onChange={handleChangeObjective}
                maxLength={500}
              />
              <Text type="secondary">{profile.objective ? 500 - profile.objective.length : 500} characters remaining</Text>
            </Form.Item>

            <Form.Item>
              <div className="fl-right">
                <Button htmlType="button" onClick={onCancel} size="small" icon={<CloseOutlined />}>
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="small"
                  className="margin-left-10"
                  loading={isLoading}
                  icon={<SaveOutlined />}
                >
                  Save
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </animated.div>
  );
};
export default EditObjective;
