import React from "react";
import { useSelector } from 'react-redux';
import { Route, Redirect } from "react-router-dom";
import { UrlConstants } from "../constants/Constants";
import { getAuthStatus, getCandiateStatus, getUserData } from '../store/slice/authSlice';
import { getMenuByName } from "../utils/PoaUtil";

export const ProtectedRoute = ({ component: Component,
  ...rest
}) => {
  const isAuthenticate = useSelector(getAuthStatus);
  const isCandidate = useSelector(getCandiateStatus);
  const user = useSelector(getUserData);

  const hasPermission = (pathname) => {
    const parts = pathname.split('/');    
    if (!user) {
      return false;
    }
    
    for (let i = 0; i < user.roles.length; i++) {
      const role = user.roles[i];
      for (let j = 0; j < role.permissions.length; j++) {
        const permission = role.permissions[j];
        if (permission.key === ('/' + parts[1]) && permission.enabled && role.enabled) {
          return true;
        }
      }
    }

    return false;
  }

  return (
    <Route
      {...rest}
      render={props => {
        // console.log('ProrectedRoute', props);
        // console.log('ProrectedRoute. User', user);

        const menuTabs = getMenuByName("Home");
        const containsHome = menuTabs.some(m => m.link === UrlConstants.HOME_PATH);  

        if (isCandidate) {
          if (props.location.pathname === "/profile") {
            return <Component {...props} />;
          } else {
            return (
              <Redirect
                to={{
                  pathname: "/profile",
                  state: {
                    from: props.location
                  }
                }}
              />
            );
          }
        }
        if (isAuthenticate) {
          if (props.location.pathname === '/') {
            if (!containsHome) {
              if (menuTabs.length > 0) {
                return <Redirect to={menuTabs[0].link} />
              } else {
                return (
                  <Redirect to={UrlConstants.UNAUTHORIZED_PATH}/>
                );
              }
            } else {
              return <Redirect to="/home"/>
            }          
          } else if (hasPermission(props.location.pathname)) {
            return <Component {...props} />;
          } else {
            if (menuTabs.length > 0) {
              return <Redirect to={menuTabs[0].link} />
            } else {
              return (
                <Redirect to={UrlConstants.UNAUTHORIZED_PATH}/>
              );
            }            
          }
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};
