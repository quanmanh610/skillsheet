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

const EditProfessionalSummary = ({ rootProfile, onSaveinView, onCancelinView }) => {

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
      openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Persional Summary"), "");
      onSaveinView();
    }
  };

  const onCancel = () => {
    onCancelinView();
  };

  const handleChangeProfessionalSummary = (e) => {
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
            name="professionalSummary"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              professionalSummary: profile.professionalSummary
            }}
          >
            <Form.Item label="Describe your professional summary"
              rules={[
                {
                  required: true,
                  message: Messages.requiredMessage("Professional Summary"),
                },
              ]}>
              <div style={{ display: 'none' }}>
                {profile ? profile.professionalSummary : ''}
              </div>
              <TextArea name="professionalSummary" rows={5} value={profile.professionalSummary}
                onChange={handleChangeProfessionalSummary}
                maxLength={2000}
              />
              <Text type="secondary">{profile.professionalSummary ? 2000 - profile.professionalSummary.length : 2000} characters remaining</Text>
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
    </animated.div >
  );
};
export default EditProfessionalSummary;
