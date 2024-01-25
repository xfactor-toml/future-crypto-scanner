import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import LongSignal from '../partials/dashboard/LongSignal';
import ShortSignal from '../partials/dashboard/ShortSignal';
import HotSignal from '../partials/dashboard/HotSignal';
import io from'socket.io-client';
var socket = io.connect(`${window.location.hostname}:4000`);

function Dashboard() {
  const [long_data, setData1] = useState([]);
  const [short_data, setData2] = useState([]);
  const [hot_data, setData3] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const startWebsocket = () => {
    socket.on('realTimeTokens',(data) =>{
      if(data.status == "ok"){
        if(data.realTimeTokens){
          setData3(data.realTimeTokens);
        }else{
          setData3([]);
        }
      }else{
        console.log('status : Error');
      }
    })
    socket.on('token1min', (data) => {
      if(data.shortTokens){
        setData2(data.shortTokens);
      }
      else{
        setData2([]);
      }
      if(data.longTokens){
        setData1(data.longTokens);
      }
      else{
        setData1([]);
      }
    });
    socket.onclose = () => {
      socket = null;
      setTimeout(startWebsocket, 1000);
    };
    socket.onerror = (error) => {
      socket = null;
      setTimeout(startWebsocket, 1000);
    };
  }
  startWebsocket();
  return (
    <div className="relative flex overflow-hidden h-full">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className=" relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="grid grid-col-1 gap-[30px] ">
          <HotSignal hot={hot_data}/>
          <LongSignal long={long_data}/>
          <ShortSignal short={short_data}/>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;