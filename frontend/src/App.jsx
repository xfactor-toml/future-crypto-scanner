import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

// Import pages
import Dashboard from './pages/Dashboard';
import Hot from './pages/Hot';
import Long from './pages/Long';
import Short from './pages/Short';
import SettingLong from './pages/SettingLong';
import SettingShort from './pages/SettingShort';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); 

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/hot" element={<Hot />} />
        <Route exact path="/long" element={<Long />} />
        <Route exact path="/short" element={<Short />} />
        <Route exact path="/setting/long" element={<SettingLong />} />
        <Route exact path="/setting/short" element={<SettingShort />} />
      </Routes>
    </>
  );
}

export default App;
