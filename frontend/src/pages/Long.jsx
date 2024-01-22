import React, { useState,useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { binanceCryptoIcons } from 'binance-icons';
import io from'socket.io-client';
var socket = io.connect(`${window.location.hostname}:4000`);

function Long() {
  const [data, setData] = useState([]);
  var hasBtc = binanceCryptoIcons.has('');
  var btcIcon = binanceCryptoIcons.get('');
  const default_hasBtc = binanceCryptoIcons.has('cfx');
  const default_btcIcon = binanceCryptoIcons.get('cfx');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const startWebsocket = () => {
    socket.on('token3min', (data) => {
      if(data.longTokens){
        setData(data.longTokens);
      }else{
        setData([]);
      }
    });
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="mt-[20px] w-[98%] min-h-[90vh] mx-auto col-span-full rounded-xl xl:col-span-full bg-white dark:bg-gray-900 
                          shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4  flex flex-row justify-between dark:border-slate-700">
              <h2 className="font-semibold text-[32px] text-slate-800 dark:text-slate-300">Long Signal</h2>
            </header>
            <div className="mx-auto py-2 grid grid-cols-1 gap-0 lg:grid-cols-1">
              <div className="">
                <ul className="text-[16px] font-semibold grid grid-cols-7 gap-x-2">
                  <li className="text-center text-slate-400">No</li>
                  <li className="text-slate-400">Pairs</li>
                  <li className="text-center text-slate-400">Price</li>
                  <li className="text-center text-slate-400">Last 3min</li>
                  <li className="text-center text-slate-400">1h high</li>
                  <li className="text-center text-slate-400">1h low</li>
                  <li className="text-center text-slate-400">Open</li>
                </ul>
                </div>
                <div></div>
                <div></div>
              </div>
              <div className="ml-[10px] w-[95%] h-[3px]  bg-gray-500 mb-[4px]"></div>
            <div>
              <div className="mx-auto py-2 grid grid-cols-1 gap-0 lg:grid-cols-1">
                <div className="">
                {
                    data.length? data.map((item, index) => {
                      var unKnown = item.symbol.slice(0, -4).toLowerCase();
                      hasBtc = binanceCryptoIcons.has(unKnown);
                      btcIcon = binanceCryptoIcons.get(unKnown);
                        return (<ul key={index} className="grid grid-cols-7 gap-x-3">
                          <li className="text-center text-slate-300">#{index+1}</li>
                          <li className=" text-[16px] flex flex-col md:flex-row items-center text-slate-300">
                            {
                              hasBtc? <span dangerouslySetInnerHTML={{__html: btcIcon.replace('"32"', '"24"')}} />:
                              <span dangerouslySetInnerHTML={{__html: default_btcIcon.replace('"32"', '"24"')}} />
                            }{item.symbol}
                          </li>
                          <li className="text-center text-slate-300">{Number(item.price).toFixed(4)}</li>
                          <li className="text-center font-semibold text-emerald-500">{Number(item._3minchange).toFixed(4)} %</li>
                          <li className="text-center text-slate-300">{Number(item._1hHige).toFixed(4)}</li>
                          <li className="text-center text-slate-300">{Number(item._1hLow).toFixed(4)}</li>
                          <li className="text-center font-semibold text-emerald-500">long</li>
                        </ul>)
                    }
                    ):<h1 className="text-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
                                     No Matching Data  😭</h1>
                  } 
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Long;     