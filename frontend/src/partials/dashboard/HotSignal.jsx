import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { binanceCryptoIcons} from 'binance-icons';
import { NumericFormat } from 'react-number-format';
import "../../css/additional-styles/animate.css"

function HotSignal(hot) {
  const data = hot.hot;
  var data_update = data.filter(item => item.volume > 1000000).sort((a, b) => Number(b.volume) - Number(a.volume));
  // console.log(data_update);
  var hasBtc = binanceCryptoIcons.has('');
  var btcIcon = binanceCryptoIcons.get('');
  const default_hasBtc = binanceCryptoIcons.has('cfx');
  const default_btcIcon = binanceCryptoIcons.get('cfx');
  return (
    <div className="animate-fade duration-1500 mt-[20px] w-[98%] h-[250px] mx-auto col-span-full rounded-xl xl:col-span-full bg-white dark:bg-gray-900 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 flex flex-row justify-between dark:border-slate-700">
        <h2 className="font-semibold text-[32px] text-slate-800 dark:text-slate-300">Hot Pairs</h2>
        <a className="mt-[10px] font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" href="/hot">
          All
        </a>
      </header>
      <div className="mx-auto mx-2 py-2 grid grid-cols-1 gap-0">
        <div className="">
          <ul className="text-[16px] font-semibold grid grid-cols-4 gap-x-2">
            <li className="text-center text-slate-400 ">No</li>
            <li className="ml-[20%] text-slate-400">Pairs</li>
            <li className="text-center text-slate-400">Price</li>
            {/* <li className="text-center text-slate-400">Rate of change</li> */}
            <li className="text-center text-slate-400">Volume</li>
            {/* <li className="text-center text-slate-400">Open</li> */}
          </ul>
        </div>
        <div></div>
        <div></div>
      </div>
      <div className="m-auto w-[95%] h-[3px]  bg-gray-500 mb-[4px]"></div>
      <div>
        <div className="mx-auto mx-2 py-2 grid grid-cols-1 gap-0">
          <div className="">
            {
              data_update.length? data_update.map((item, index) => {
                var unKnown = item.symbol;
                hasBtc = binanceCryptoIcons.has(unKnown);
                btcIcon = binanceCryptoIcons.get(unKnown);
                if(index < 5 )
                  return (<ul className="grid grid-cols-4 gap-x-3">
                    <li key={item} className="text-center text-slate-300">#{index+1}</li>
                    <li key={item} className="text-center ml-[20%] text-[16px] flex flex-col md:flex-row items-center  text-slate-300 uppercase">
                      {
                        hasBtc? <span dangerouslySetInnerHTML={{__html: btcIcon.replace('"32"', '"24"')}} />:<span dangerouslySetInnerHTML={{__html: default_btcIcon.replace('"32"', '"24"')}} />
                      }
                      {item.symbol}USDT
                    </li>
                    <li key={item} className="text-center text-slate-300">{item.price}</li>
                    {/* <li key={item} className="text-center font-semibold text-emerald-500">{(item._3minchange > 0)?<span className='text-emerald-500'>{item._3minchange} %</span>:<span className='text-red-500'>{item._3minchange} %</span>}</li> */}
                    <li key={item} className="text-center text-slate-300">$ <NumericFormat displayType="text" value={item.volume} allowLeadingZeros thousandSeparator="," /></li>
                    {/* <li key={item} className="text-center font-semibold">
                      {
                        (item._3minchange > 0)?<span className='text-emerald-500 uppercase'>long</span>:<span className='text-red-500 uppercase'>short</span>  
                      }
                    </li> */}
                  </ul>)
              }
              ):<h1 className="text-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1 mt-[40px]">No Matching Data  😭</h1>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotSignal;
