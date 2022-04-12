import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useSelector } from 'react-redux';
import { isOwnerProfile } from '../../../../../store/slice/profileSlice';

const { Text } = Typography;

const SubTitle = ({ rightIcon, leftIcon, identify, onOpen, onEdit, title, fromMtoM }) => {

    const isOwner = useSelector(isOwnerProfile);

    return (
        <Row justify="center">
            <Col span={24}>
                <Row>
                    <Col span={1}>
                        <Button
                            //id={'btnExpand' + title.replaceAll(' ', '')}
                            id={'btnExpand' + title.replace(/\s/g, '')}
                            style={{ color: "black" }}
                            type="link"
                            size="small"
                            className="fl-right"
                            onClick={(e) => {
                                onOpen(identify);
                                e.stopPropagation();
                            }}
                            icon={leftIcon}
                        >
                        </Button>
                    </Col>
                    <Col span={23}>
                        <Text strong
                            className="margin-left-0"
                            onClick={(e) => {
                                onOpen(identify);
                                e.stopPropagation();
                            }}
                            style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}>
                            {title}
                        </Text>
                        <Button
                            //id={'btnEdit' + title.replaceAll(' ', '')}
                            id={'btnEdit' + title.replace(/\s/g, '')}
                            type="link"
                            size="small"
                            //className="fl-right"
                            hidden={!isOwner}
                            onClick={(e) => {
                                onEdit(identify);
                                e.stopPropagation();
                            }}
                            icon={rightIcon}                            
                        >
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default SubTitle;
