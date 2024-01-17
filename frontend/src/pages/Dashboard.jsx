import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import LongSignal from '../partials/dashboard/LongSignal';
import ShortSignal from '../partials/dashboard/ShortSignal';
import HotSignal from '../partials/dashboard/HotSignal';
import MarqueeNav  from '../partials/MarqueeNav';
import io from'socket.io-client';
const socket = io.connect(`${window.location.hostname}:4000`);

function Dashboard() {
  const [long_data, setData1] = useState([]);
  const [short_data, setData2] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  var hot_data = [...long_data,...short_data];
  hot_data = hot_data.sort((a, b) => Math.abs(b._3minchange) - Math.abs(a._3minchange)).slice(0, 5);
  const hot_data_sort = hot_data.map(obj => {
    if (obj._3minchange > 0) {
      obj.volume = "long";
    } else if (obj._3minchange < 0) {
      obj.volume = "short";
    }
    return obj;
  });

  socket.on('send_token', (data) => {
    if(data.longTokens){
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
  console.log(long_data, short_data);
  return (
    <div className=" relative flex overflow-hidden h-full">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className=" relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <div className=""> */}
        {/* <MarqueeNav flow_data={hot_data_sort}/>    */}
        {/* </div> */}
        <div className="grid grid-col-1 gap-[30px] ">
          <HotSignal hot={hot_data_sort}/>
          <LongSignal long={long_data}/>
          <ShortSignal short={short_data}/>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;