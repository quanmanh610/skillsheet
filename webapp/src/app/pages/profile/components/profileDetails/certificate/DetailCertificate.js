import React, { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import moment from 'moment';
import { dateFormat } from '../../../../../constants/DateTimes';
import { useSelector } from 'react-redux';
import { getCertificateInStore } from '../../../../../store/slice/settingSlice';
import { useSpring, animated } from 'react-spring'
import { SettingItemStatus } from '../../../../../constants/SettingItemStatus';

const { Text } = Typography;

const DetailCertificate = ({ profileCertificates, index }) => {

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 }
  });

  const certificateSInStore = useSelector(getCertificateInStore);

  const [pCs, setPcs] = useState(profileCertificates)
  useEffect(() => {
    if (profileCertificates) {
      setPcs(profileCertificates.map((obj) => {
        if (obj)
          return { ...obj, certificate: certificateSInStore.filter((item) => item.name === obj.certificate)[0] }
        return undefined
      }).sort((a, b) => a.issuedDate > b.issuedDate ? -1 : 1));
    }
  }, [profileCertificates, certificateSInStore]);

  return (
    <animated.div style={props}>
      <Row justify="center" className="margin-top-10">
        <Col span={23}>
          <Row>
            <Col span={23}>
              <Row className="margin-bottom-10">
                <Col span={9} >  <Text strong className="margin-top-10">Certificate</Text> </Col>
                <Col span={5} >   <Text strong className="margin-top-10">Issued Date</Text></Col>
                <Col span={9} >   <Text strong className="margin-top-10">Achievement</Text></Col>
              </Row>
              {pCs.map((profileCertificate) =>
                <Row className="margin-bottom-10" key={profileCertificate.profileCertificateId}>
                  <Col span={9} >
                    <Row>
                      <div>
                        {profileCertificate.certificate
                          ? <Text>{profileCertificate.certificate.name}
                            <Text strong>{profileCertificate.certificate.status === SettingItemStatus.NEW ? " (waiting for approval...)" : ""}</Text>
                          </Text>
                          : null
                        }
                      </div>
                    </Row>
                  </Col>
                  <Col span={5} >   <Text className="margin-top-10">{moment(profileCertificate.issuedDate).format(dateFormat)}</Text></Col>
                  <Col span={9} style={{textAlign: "justify"}}>   <Text className="margin-top-10">{profileCertificate.achievement}</Text></Col>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
      </Row>      
    </animated.div>
  );
};

export default DetailCertificate;
