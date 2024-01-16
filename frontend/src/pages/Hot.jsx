import React, { useState,useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { binanceCryptoIcons } from 'binance-icons';
import { NumericFormat } from 'react-number-format';
import io from'socket.io-client';
const socket = io.connect(`${window.location.hostname}:4000`);

function Hot() {
  const [long_data, setData1] = useState([]);
  const [short_data, setData2] = useState([]);
  const [requestFlag, setRequestFlag] = useState(false);
  var hasBtc = binanceCryptoIcons.has('');
  var btcIcon = binanceCryptoIcons.get('');
  const default_hasBtc = binanceCryptoIcons.has('cfx');
  const default_btcIcon = binanceCryptoIcons.get('cfx');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  var hot_data = [...long_data,...short_data];
  hot_data = hot_data.sort((a, b) => Math.abs(b._3minchange) - Math.abs(a._3minchange));
  const hot_data_sort = hot_data.map(obj => {
    if (obj._3minchange > 0) {
      obj.volume1 = "long";
    } else if (obj._3minchange < 0) {
      obj.volume1 = "short";
    }
    return obj;
  });
  socket.on('send_token', (data) => {
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="mt-[20px] w-[98%] h-[90%] mx-auto col-span-full rounded-xl xl:col-span-full bg-white dark:bg-gray-900 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
          <header className="px-5 py-4  flex flex-row justify-between dark:border-slate-700">
            <h2 className="font-semibold text-[32px] text-slate-800 dark:text-slate-300">Hot Signal</h2>
          </header>
          <div className="mx-auto mx-2 py-2 grid grid-cols-1 gap-0 lg:grid-cols-1">
          <div className="">
            <ul className="text-[16px] font-semibold grid grid-cols-6 gap-x-2">
              <li className="text-center text-slate-400 ">No</li>
              <li className="text-slate-400">Pairs</li>
              <li className="text-center text-slate-400">Price</li>
              <li className="text-center text-slate-400">Rate of change</li>
              <li className="text-center text-slate-400">Volume</li>
              <li className="text-center text-slate-400">Open</li>
            </ul>
          </div>
          <div></div>
          <div></div>
        </div>
      <div className="ml-[10px] w-[95%] h-[3px]  bg-gray-500 mb-[4px]"></div>
      <div>
        <div className="mx-auto mx-2 py-2 grid grid-cols-1 gap-0 lg:grid-cols-1">
          <div className="">
          {
              hot_data_sort.length? hot_data_sort.map((item, index) => {
                var unKnown = item.pairs;
                hasBtc = binanceCryptoIcons.has(unKnown);
                btcIcon = binanceCryptoIcons.get(unKnown);
                  return (<ul className="grid grid-cols-6 gap-x-3">
                    <li key={item} className="text-center text-slate-300 ">#{index+1}</li>
                    <li key={item} className=" text-[16px] flex flex-col md:flex-row items-center text-slate-300 uppercase">
                      {
                        hasBtc? <span dangerouslySetInnerHTML={{__html: btcIcon.replace('"32"', '"24"')}} />:
                        <span dangerouslySetInnerHTML={{__html: default_btcIcon.replace('"32"', '"24"')}} />
                      }{item.symbol}USDT
                    </li>
                    <li key={item} className="text-center text-slate-300">{item.price}</li>
                    <li key={item} className="text-center font-semibold text-emerald-500 ">{(item._3minchange > 0)?<span className='text-emerald-500'>{item._3minchange} %</span>:<span className='text-red-500'>{item._3minchange} %</span>}</li>
                    <li key={item} className="text-center text-slate-300">$ <NumericFormat displayType="text" value={item.volume} allowLeadingZeros thousandSeparator="," /></li>
                    <li key={item} className="text-center text-slate-300 font-semibold ">
                      {
                        item.volume1 =="long"?<span className='text-emerald-500 uppercase'>long</span>:<span className='text-red-500 uppercase'>short</span>  
                      }
                    </li>
                  </ul>)
              }
              ):<h1 className="text-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">No Matching Data  😭</h1>
            } 
          </div>
        </div>
      </div>
    </div>

      </div>
    </div>
  );
}

export default Hot;     