import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Space, Button, Tooltip, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getUserData } from '../store/slice/authSlice';
import './Components.css';
import { getAuthStatus, getCandiateStatus } from '../store/slice/authSlice';
import { Link, useHistory } from "react-router-dom";
import { UserSwitchOutlined, LogoutOutlined, IdcardOutlined } from '@ant-design/icons';
import { getMenuByName } from '../utils/PoaUtil';
import logo from './../../assets/imgs/logo_cmc.png';
import { fetchProfileByStaffEmail } from '../store/slice/profileSlice';

const { Header } = Layout;

const AppHeader = (props) => {

  const initialUser = {
    dateOfBirth: '',
    email: '',
    firstName: '',
    fullName: '',
    id: -1,
    lastName: '',
    phone: '',
    roles: [],
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated = useSelector(getAuthStatus);
  const isCandi = useSelector(getCandiateStatus);
  const userInfo = useSelector(getUserData) || initialUser;
  const [isCandiState, setCandiState] = useState();
  const [isVisible, setVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(window.location.pathname);

  useEffect(() => {
    setCandiState(isCandi ? isCandi : false);  
  }, [isCandi]);

  if (currentMenu !== window.location.pathname) {
    setCurrentMenu(window.location.pathname);
  }

  const confirmOK = () => {
    setVisible(false);
    logout();
    dispatch(logout());
    history.push("/login")
  }

  const hideModal = () => {
    setVisible(false);
  }
  // const showConfirm = () => {
  //   setVisible(true);
  // }

  if (!isAuthenticated) {
    return null;
  }

  let displayName = userInfo.fullName ? userInfo.fullName.toUpperCase() : userInfo.userName.toUpperCase();
  const menu = getMenuByName("Home");

  const handleMenuClick = (item) => {
    setCurrentMenu(item.key);
    //history.push(item.key);
  }

  const handleClickMyProfile = async (e) => {
    history.push('/profile');
    setCurrentMenu('/profile');
    dispatch(fetchProfileByStaffEmail({ staffEmail: userInfo.email }));
  }

  return (

    <div>
      <Header className="app-header" id="CMC_LOGO">
        <div className="header-left">
          <div className="header-left-logo" >
            {isAuthenticated ? (<img className="logo" src={logo} alt="logo" style={{ height: "30px", cursor: "pointer" }} onClick={(e) => {
              e.preventDefault();
              isCandiState ? setCurrentMenu('/profile') : setCurrentMenu('/home');
              isCandiState ? history.push("/profile") : history.push("/home");
            }} />) : ""}
          </div>
          <div className="navbar-nav">
            {isAuthenticated ? (
              //  <ul className="navbar-nav">
              //   {menu.map((element,index)=>(
              //          <li className="menu-item" key={index} style={{ display: isCandiState ? "none" : "" }}>
              //          <NavLink
              //            to={element.link}
              //            className="nav-link nav-menu"
              //            activeClassName="active active-menu"
              //          >
              //            <Tooltip title={element.name}  >
              //            <span className="text-warning"><i className={element.icon}></i></span>                           
              //            </Tooltip>
              //   <span className="menu-name">&nbsp;{element.name.toUpperCase()}</span>
              //          </NavLink>
              //        </li>
              //   ))}                
              // </ul> 
              <Menu mode="horizontal" className="navbar-nav"
                onClick={handleMenuClick}
                selectedKeys={[currentMenu]}
              >
                {
                  menu.map((element, index) => {
                    return (
                      <Menu.Item 
                        className="menu-item"
                        key={element.link} 
                        //id={'mnu' + element.name.replaceAll(' ', '')}
                        id={'mnu' + element.name.replace(/\s/g, '')}
                      >
                        <div className="menu-item">                          
                          <Link to={element.link} className='menu-item'><span className="text-warning"><i className={element.icon}></i></span> {element.name.toUpperCase()}</Link>
                          {/* <span className="menu-name">&nbsp;{element.name.toUpperCase()}</span> */}
                        </div>
                      </Menu.Item>
                    )
                  })
                }
              </Menu>
            ) : ""}
          </div>
        </div>

        <div className="header-right" style={{ display: isCandiState ? "none" : "" }}>
          {isAuthenticated ? (<div className="header-right">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <Button
                      id='mnuMyProfile'
                      icon={<IdcardOutlined />}
                      style={{     
                        textAlign: "left",                   
                        color: "#338bf8", width: "200px",
                        fontSize: "12px"
                      }}
                      type="text"
                      size="small"
                      onClick={handleClickMyProfile}
                    >
                      MY PROFILE
                  </Button>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item>
                    <Button
                      id='mnuLogout'
                      icon={<LogoutOutlined />}
                      style={{
                        textAlign: "left",
                        color: "#338bf8", width: "200px",
                        fontSize: "12px"
                      }}
                      type="text"
                      size="small"
                      onClick={confirmOK}
                    >
                      LOGOUT
                  </Button>
                  </Menu.Item>
                </Menu>
              }
            >
              <div className="user-menu">
                <Space direction="horizontal">
                  {/* <Avatar size={20} icon={<UserOutlined />} style={{ color: '#ffc900', backgroundColor: '#87d068' }}></Avatar> */}
                  <Tooltip title={displayName} placement="left" >
                    <span className="menu-login-user-icon"><UserSwitchOutlined /> </span>
                  </Tooltip>

                  <span id='mnuUserName' className="menu-name" style={{ color: "white", fontSize: "12px" }}>{displayName}</span>
                </Space>
              </div>
            </Dropdown></div>) : ""}
          <Modal
            title="Modal"
            visible={isVisible}
            onOk={confirmOK}
            onCancel={hideModal}
            okText="Ok"
            cancelText="Cancel"
          >
            <p>Are you want to log out?</p>
          </Modal>
        </div>

      </Header>
    </div>
  );
};

export default AppHeader;
