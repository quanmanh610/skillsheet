import React, { useState } from 'react';
import { Row, Col, Typography, Input, Button, Form } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileById } from '../../../../../store/slice/profileSlice';
import { updateProfile } from '../../../../../api/profile';
import { convertDataURIToBinary } from '../../../../../utils/ConvertDataBinary';
import { openNotification } from '../../../../../components/OpenNotification';
import { Messages } from '../../../../../utils/AppMessage';
import { isLoadingStatus } from '../../../../../store/slice/animationSlice';
import { useSpring, animated } from 'react-spring'

const { Text } = Typography;
const { TextArea } = Input;

const EditPersonalInterests = ({ rootProfile, onSaveinView, onCancelinView }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const isLoading = useSelector(isLoadingStatus)

  const [profile, setProfile] = useState(rootProfile);

  const onFinish = async (values) => {
    const resp = await updateProfile(typeof profile.avatar === "string" ? { ...profile, avatar: convertDataURIToBinary(profile.avatar) } : profile);
    if (!resp.errorMessage) {
      dispatch(fetchProfileById({ profileId: profile.profileId }));
      openNotification(Messages.SUCCESS, Messages.editSuccessMessage("Persional Interesting"), "");
      onSaveinView();
    }
  };

  const onCancel = () => {
    onCancelinView();
  };

  const handleChangePersionalInteresting = (e) => {
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
            name="personalinterests"
            layout="vertical"
            onFinish={onFinish} initialValues={{
              persionalInteresting: profile.persionalInteresting
            }}
            initialValues={{
              persionalInteresting: profile.persionalInteresting
            }}
          >
            <Form.Item label="Describe your hobbies"
              rules={[
                {
                  required: true,
                  message: Messages.requiredMessage("Persional Interesting"),
                },
              ]}>
              <div style={{ display: 'none' }}>
                {profile ? profile.persionalInteresting : ''}
              </div>
              <TextArea name="persionalInteresting" rows={5} value={profile.persionalInteresting}
                onChange={handleChangePersionalInteresting}
                maxLength={500} />
              <Text type="secondary">{profile.persionalInteresting ? 500 - profile.persionalInteresting.length : 500} characters remaining</Text>
            </Form.Item>
            <Form.Item>
              <div className="fl-right">
                <Button htmlType="button" onClick={onCancel}
                  size="small"
                  icon={<CloseOutlined />}>
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  size="small"
                  type="primary"
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
export default EditPersonalInterests;
