import React, { useState, useEffect } from 'react';
import { Button, Timeline } from 'antd';
import { Link } from 'react-scroll';
import './LinkBar.css';

const items = [
  {
    key: 10,
    name: 'INTRO',
    id: 'INTROPANEL',
  },
  {
    key: 1,
    name: 'OBJECTIVES',
    id: 'OBJECTIVEPANEL',
  },

  {
    key: 2,
    name: 'PROFESSIONAL SUMMARY',
    id: 'PROFESSIONALSUMMARYPANEL',
  },

  {
    key: 3,
    name: 'EDUCATION',
    id: 'EDUCATIONPANEL',
  },

  {
    key: 4,
    name: 'CERTIFICATES',
    id: 'CERTIFICATEPANEL',
  },
  {
    key: 5,
    name: 'WORK EXPERIENCE',
    id: 'WORKEXPERIENCEPANEL',
  },
  {
    key: 6,
    name: 'SKILLS',
    id: 'SKILLSPANEL',
  },

  {
    key: 7,
    name: 'LANGUAGES',
    id: 'LANGUAGESPANEL',
  },
  {
    key: 8,
    name: 'PROJECT LIST',
    id: 'PROJECTLISTPANEL',
  },
  {
    key: 9,
    name: 'PERSONAL INTERESTS',
    id: 'PERSONALINTERESTSPANEL',
  },
];

const LinkBar = ({ rootProfile }) => {
  //const [isResizeViewPersonal, setResizeViewPersonal] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState(0);

  // useEffect(() => {
  //   window.addEventListener('scroll', resizeViewPersonalOnScroll);
  // });

  // const resizeViewPersonalOnScroll = () => {
  //   console.log("")
  //   const distanceY = window.pageYOffset || document.documentElement.scrollTop;
  //   const shrinkOn = 130;
  //   if (distanceY > shrinkOn) {
  //     setResizeViewPersonal(true);
  //   } else {
  //     setResizeViewPersonal(false);
  //   }
  // };

  const _onSetActiveAnchor = (idAnchor) => {
    let _index = items.map(item => item.id).indexOf(idAnchor);
    setActiveAnchor(_index)
  }

  const isHiddenIntro = (key) => {
    return rootProfile.staff === null && key === 10;
  }

  return (
    <div className="link-bar-sticky">
      <div id="anchor-link-bar">
        <Timeline>
          {items.map((item, index) => {
            return (
              <Timeline.Item key={item.key} color={index == activeAnchor ? "#1890ff" : "black"} hidden={isHiddenIntro(item.key)}>
                <Link
                  key={item.key}
                  className="link"
                  activeClass="active"
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-60}
                  duration={500}
                  onClick={()=> setActiveAnchor(index)}
                  onSetActive={_onSetActiveAnchor}
                >
                  {/* <div className="circle"></div> */}
                  {item.name}
                </Link>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    </div>
  );
};

export default LinkBar;

{
  /* <div>
                <Link
                  key={item.key}
                  className="link"
                  activeClass="active"
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={0}
                  duration={500}
                >
                  <div className="circle"></div>
                  {item.name}
                </Link>
              </div> */
}
