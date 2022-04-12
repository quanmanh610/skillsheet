import { notification } from 'antd';
export const openNotification = (type, mess, des) => {
  notification.config({
    duration: 6,
    placement: 'bottomRight',
  });
  notification[type]({
    message: mess,
    description: des,
  });
};
