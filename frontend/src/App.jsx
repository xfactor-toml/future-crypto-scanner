import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';
import io from 'socket.io-client';
var socket = io.connect(`${window.location.hostname}:4000`);

// Import pages
import Dashboard from './pages/Dashboard';
import Hot from './pages/Hot';
import Long from './pages/Long';
import Short from './pages/Short';
import History from './pages/History';
import SettingLong from './pages/SettingLong';
import SettingShort from './pages/SettingShort';

function App() {

  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [temp_1, setTemp_1] = useState([]);
  const [temp_2, setTemp_2] = useState([]);

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  // const startWebsocket = () => {
  //   socket.on('token1min',(data) =>{
  //     if(data.status == "ok"){
  //       if(data.longTokens){
  //         setTemp_1(data.longTokens);
  //       }else{
  //           setTemp_1([]);
  //       }
  //       if(data.shortTokens){
  //           setTemp_2(data.shortTokens);
  //         }
  //         else{
  //           setTemp_2([]);
  //         }
  //       setHistory([...temp_1,...temp_2]);
  //     }else{
  //       console.log('status : error');
  //     }
  //   })
  //   socket.onclose = () => {
  //     socket = null;
  //     setTimeout(startWebsocket, 5000);
  //   };
  //   socket.onerror = (error) => {
  //     socket = null;
  //     setTimeout(startWebsocket, 1000);
  //   };
  // }
  // startWebsocket();
  const startWebsocket = () => {
    socket.on('token1min',(data) =>{
      if(data.status == "ok"){
        if(data.history){
          setHistory(data.history);
        }else{
          setHistory({});
        }
      }else{
        console.log('status : error');
      }
    })
    socket.onclose = () => {
      socket = null;
      setTimeout(startWebsocket, 5000);
    };
    socket.onerror = (error) => {
      socket = null;
      setTimeout(startWebsocket, 1000);
    };
  }
  startWebsocket();
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/hot" element={<Hot />} />
        <Route exact path="/long" element={<Long />} />
        <Route exact path="/short" element={<Short />} />
        <Route exact path="/history" element={<History history={history} />} />
        <Route exact path="/setting/long" element={<SettingLong />} />
        <Route exact path="/setting/short" element={<SettingShort />} />
      </Routes>
    </>
  );
}

export default App;
