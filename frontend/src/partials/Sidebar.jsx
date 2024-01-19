
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import logo from '../images/logo.png';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100%] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-64 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-gray-900  p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="flex flex-row items-center ">
            
            <img src={logo} className='w-[300px]'></img>
            {/* <span className="text-center text-md  dark:text-blue-100 font-bold font-[sans-serif] mb-1">Future Crypto Scanner</span> */}
          </NavLink>
        </div>

        {/* Links */}
        <div className="">
          {/* Pages group */}
          <div>
            <ul className="mt-3">
              {/* Dashboard */}
              <SidebarLinkGroup activecondition={pathname.includes('')}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {/* <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      > */}
                        <div className="flex items-center justify-between">
                          <Link to="/">
                            <div className="flex items-center">
                              <svg className="shrink-0 h-10 w-10" viewBox="0 0 24 24">
                                <path
                                  className={`fill-current ${pathname.includes('') ? 'text-indigo-300' : 'text-slate-400'}`}
                                  d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z"
                                />
                                <path
                                  className={`fill-current ${pathname.includes('') ? 'text-indigo-600' : 'text-slate-700'}`}
                                  d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z"
                                />
                                <path
                                  className={`fill-current ${pathname.includes('') ? 'text-indigo-500' : 'text-slate-600'}`}
                                  d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z"
                                />
                              </svg>
                              <span className="text-lg font-medium ml-3 duration-200">
                                Dashboard
                              </span>
                            </div>
                          </Link>
                        </div>
                      {/* </a> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              
              {/* Hot Signal */}
              <SidebarLinkGroup activecondition={pathname.includes('')}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {/* <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      > */}
                        <div className="flex items-center justify-between">
                        <Link to="/hot">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-10 w-10" viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-500' : 'text-slate-600'}`}
                                d="M20 7a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 0120 7zM4 23a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 110 1.5 1.5 1.5 0 00-1.5 1.5A.75.75 0 014 23z"
                              />
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-300' : 'text-slate-400'}`}
                                d="M17 23a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 010-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1zM7 13a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 112 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z"
                              />
                            </svg>
                            <span className="text-lg font-medium ml-3 duration-200">
                              Hot Pairs
                            </span>
                          </div>
                          </Link>
                        </div>
                      {/* </a> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            {/* Hot Signal */}
            <SidebarLinkGroup activecondition={pathname.includes('')}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {/* <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      > */}
                        <div className="flex items-center justify-between">
                        <Link to="/long">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-10 w-10" viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-500' : 'text-slate-600'}`}
                                d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z"
                              />
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-300' : 'text-slate-400'}`}
                                d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z"
                              />
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-500' : 'text-slate-600'}`}
                                d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z"
                              />
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-300' : 'text-slate-400'}`}
                                d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z"
                              />
                            </svg>
                            <span className="text-lg font-medium ml-3 duration-200">
                              Long Signal
                            </span>
                          </div>
                          </Link>
                        </div>
                      {/* </a> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* Hot Signal */}
              <SidebarLinkGroup activecondition={pathname.includes('')}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {/* <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('finance') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      > */}
                        <div className="flex items-center justify-between">
                        <Link to="/short">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-10 w-10" viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-300' : 'text-slate-400'}`}
                                d="M13 6.068a6.035 6.035 0 0 1 4.932 4.933H24c-.486-5.846-5.154-10.515-11-11v6.067Z"
                              />
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-500' : 'text-slate-700'}`}
                                d="M18.007 13c-.474 2.833-2.919 5-5.864 5a5.888 5.888 0 0 1-3.694-1.304L4 20.731C6.131 22.752 8.992 24 12.143 24c6.232 0 11.35-4.851 11.857-11h-5.993Z"
                              />
                              <path
                                className={`fill-current ${pathname.includes('') ? 'text-indigo-600' : 'text-slate-600'}`}
                                d="M6.939 15.007A5.861 5.861 0 0 1 6 11.829c0-2.937 2.167-5.376 5-5.85V0C4.85.507 0 5.614 0 11.83c0 2.695.922 5.174 2.456 7.17l4.483-3.993Z"
                              />
                            </svg>
                            <span className="text-lg font-medium ml-3">
                              Short Signal
                            </span>
                          </div>
                          </Link>
                        </div>
                      {/* </a> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup activecondition={pathname.includes('utility')}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {/* <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          pathname.includes('utility') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      > */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-10 w-10" viewBox="0 0 24 24">
                              <circle
                                className={`fill-current ${pathname.includes('utility') ? 'text-indigo-300' : 'text-slate-400'}`}
                                cx="18.5"
                                cy="5.5"
                                r="4.5"
                              />
                              <circle
                                className={`fill-current ${pathname.includes('utility') ? 'text-indigo-500' : 'text-slate-600'}`}
                                cx="5.5"
                                cy="5.5"
                                r="4.5"
                              />
                              <circle
                                className={`fill-current ${pathname.includes('utility') ? 'text-indigo-500' : 'text-slate-600'}`}
                                cx="18.5"
                                cy="18.5"
                                r="4.5"
                              />
                              <circle
                                className={`fill-current ${pathname.includes('utility') ? 'text-indigo-300' : 'text-slate-400'}`}
                                cx="5.5"
                                cy="18.5"
                                r="4.5"
                              />
                            </svg>
                            <span className="text-lg font-medium ml-3 duration-200">
                              Setting
                            </span>
                          </div>
                        </div>
                      {/* </a> */}
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/setting/long"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className="ml-[20px] text-sm font-medium duration-200">
                                Long Signal
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/setting/short"
                              className={({ isActive }) =>
                                'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                              }
                            >
                              <span className="ml-[20px] text-sm font-medium duration-200">
                                Short Signal
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>          
        </div>
      </div>
    </div>
  );
}

export default Sidebar;



