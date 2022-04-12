import React, { useLayoutEffect, useState } from 'react';
import store from "../store/store";
import { decryptMessage } from './EncryptionUtil';

export const getMenuByName = (name) => {
    const state = store.getState();    
    const menuTabs = state.auth.user ? state.auth.user.menuTabs : [];    
    var listMenu = [];
    let listCheck = [];
    if (Array.isArray(menuTabs) && menuTabs.length) {
        if (name === '') {
            for (let i = 0; i < menuTabs.length; i++) {
                let menu = null;
                if (Array.isArray(menuTabs[i].items) && menuTabs[i].items.length) {
                    for (let j = 0; j < menuTabs[i].items.length; j++) {
                        if (!listCheck.includes(menuTabs[i].items[j].state)) {
                            menu = { 
                                name: menuTabs[i].items[j].label, 
                                icon: menuTabs[i].items[j].icon,
                                link: menuTabs[i].items[j].state 
                            };
                            listMenu.push(menu);
                            listCheck.push(menuTabs[i].items[j].state);
                        }
                    }
                }
            }
            return listMenu;
        } else {
            for (let i = 0; i < menuTabs.length; i++) {
                if (Array.isArray(menuTabs[i].items) && menuTabs[i].items.length) {
                    for (let j = 0; j < menuTabs[i].items.length; j++) {
                        if (menuTabs[i].items[j].label.toUpperCase() === name.toUpperCase()) {
                            if (menuTabs[i].items[j].children.length > 0) {
                                let menu = null;
                                for (let k = 0; k < menuTabs[i].items[j].children.length; k++) {
                                    if (!listCheck.includes(menuTabs[i].items[j].children[k].state.split("/")[menuTabs[i].items[j].children[k].state.split("/").length - 1])) {
                                        menu = { 
                                            name: menuTabs[i].items[j].children[k].name, 
                                            icon: menuTabs[i].items[j].children[k].icon,
                                            link: "/" + menuTabs[i].items[j].children[k].state.split("/")[menuTabs[i].items[j].children[k].state.split("/").length - 1] 
                                        };
                                        listMenu.push(menu);
                                        listCheck.push(menuTabs[i].items[j].children[k].state.split("/")[menuTabs[i].items[j].children[k].state.split("/").length - 1]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return listMenu;
        }
    } else {
        return listMenu;
    }
}

export const getActivityKey = (keys) => {
    let user = null;
    const localStorageData = localStorage.getItem('skill_sheet_cache');
    if (localStorageData) {
        const data = decryptMessage(localStorageData);
        if (data !== '') {
            user = JSON.parse(data);
        }
    }
    // const user = localStorage.getItem('skill_sheet_cache') 
    //             //? JSON.parse(decodeURIComponent(escape(window.atob(localStorage.getItem('skill_sheet_cache'))))) 
    //             ? JSON.parse(decryptMessage(localStorage.getItem('skill_sheet_cache')))
    //             : null;

    if (!user) {
        return null;
    }

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        for (let i = 0; i < user.roles.length; i++) {
            const role = user.roles[i];
            if (role.enabled) {
                for (let j = 0; j < role.permissions.length; j++) {
                    const permission = role.permissions[j];
                    if (permission.enabled) {
                        for (let k = 0; k < permission.activities.length; k++) {
                            const activity = permission.activities[k];
                            if (activity.enabled && activity.key === key) {  
                                //console.log('activityKey', activity.key, role);                              
                                return activity.key;
                            }
                        }
                    }
                }
            }
        }
    }    

    return null;
}

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}