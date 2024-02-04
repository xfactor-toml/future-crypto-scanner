import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { binanceCryptoIcons } from 'binance-icons';
import { NumericFormat } from 'react-number-format';

function History(history) {
  const history_data = history.history;
  var cnt = 0;
  var hasBtc = binanceCryptoIcons.has('');
  var btcIcon = binanceCryptoIcons.get('');
  const default_hasBtc = binanceCryptoIcons.has('cfx');
  const default_btcIcon = binanceCryptoIcons.get('cfx');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {
        Object.keys(history_data).length ? 
        <div className="min-h-[90vh] mt-[20px] w-[98%] mb-[10px] pb-[20px] mx-auto col-span-full overflow-y-scroll rounded-xl xl:col-span-ful dark:bg-gray-900 shadow-lg border border-slate-200 dark:border-slate-700">
          <header className="px-5 py-4  flex flex-row justify-between dark:border-slate-700">
            <h2 className="font-semibold text-[32px] text-slate-800 dark:text-slate-300">History</h2>
          </header>
          <div className="mx-auto py-2 grid grid-cols-1 gap-0 lg:grid-cols-1">
            <div className="">
              <ul className="text-[16px] font-semibold grid grid-cols-5">
                <li className="text-center text-slate-400 ">No</li>
                <li className="sm:ml-[20%] text-slate-400">Pairs</li>
                <li className="text-center text-slate-400">Open Time</li>
                <li className="text-center text-slate-400">Close Time</li>
                <li className="text-center text-slate-400">Change</li>
              </ul>
            </div>
            <div></div>
            <div></div>
          </div>
          <div className="m-auto w-[95%] h-[3px]  bg-gray-500 mb-[4px]"></div>
          <div>
            <div className="h-[100%] mx-auto py-2 grid grid-cols-1 gap-0 lg:grid-cols-1">
              <div className="">
                {
                  Object.keys(history_data).length ? Object.keys(history_data).map((keyName) => {
                    cnt++;
                    const cryptoItem = history_data[keyName];
                    var unKnown = keyName.slice(0, -4).toLowerCase();
                    hasBtc = binanceCryptoIcons.has(unKnown);
                    btcIcon = binanceCryptoIcons.get(unKnown);
                    
                    return (<ul key={keyName} className="grid grid-cols-5 gap-x-3 mb-[5px]">
                      <li className="text-center text-slate-300 ">#{cnt}</li>
                      <li className="text-center sm:ml-[20%] text-[16px] flex flex-col md:flex-row  text-slate-300 uppercase">
                        {
                          hasBtc ? <span dangerouslySetInnerHTML={{ __html: btcIcon.replace('"32"', '"24"') }} /> :
                            <span dangerouslySetInnerHTML={{ __html: default_btcIcon.replace('"32"', '"24"') }} />
                        }{keyName}
                      </li>
                      <li className="text-center text-slate-400">{cryptoItem.reverse().map((item, index) => <ul key={index}><li>{item.openTime}</li></ul>)}</li>
                      <li className="text-center text-slate-400">{cryptoItem.reverse().map((item, index) => <ul key={index}><li key={index}>{item.closeTime}</li></ul> )}</li>
                      <li className="text-center text-slate-300">{cryptoItem.reverse().map((item, index) => <ul key={index}>{Number(item.change) > 0 ?<li key={index} className='text-emerald-500'>{Number(item.change).toFixed(4)}</li>:<li key={index} className='text-red-500'>{Number(item.change).toFixed(4)}</li>}</ul>)}</li>
                    </ul>)
                  }
                  ) : <h1 className="text-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">No Matching Data  😭</h1>
                }
              </div>
            </div>
          </div>
        </div>
        :
        <div className="mt-[20px] w-[98%] h-full  mb-[10px] mx-auto col-span-full rounded-xl xl:col-span-full bg-white dark:bg-gray-900 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
          <header className="px-5 py-4  flex flex-row justify-between dark:border-slate-700">
            <h2 className="font-semibold text-[32px] text-slate-800 dark:text-slate-300">History</h2>
          </header>
          <div className="mx-auto mx-2 py-2 grid grid-cols-1 gap-0 lg:grid-cols-1">
            <div className="">
              <ul className="text-[16px] font-semibold grid grid-cols-4">
                <li className="text-center text-slate-400 ">No</li>
                <li className="ml-[20%] text-slate-400">Open Time</li>
                <li className="text-center text-slate-400">Close Time</li>
                <li className="text-center text-slate-400">Change</li>
              </ul>
            </div>
            <div></div>
            <div></div>
          </div>
          <div className="m-auto ml-[10px] w-[95%] h-[3px]  bg-gray-500 mb-[4px]"></div>
          <h1 className="mt-[200px] text-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">No Matching Data  😭</h1>      
        </div>}
      </div>

    </div>
  );
}

export default History;     