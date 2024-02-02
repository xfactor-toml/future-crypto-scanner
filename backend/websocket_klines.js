const axios = require('axios');

exports.getRealTimeData =async (getData) => {

  var longTokens = [];
  var shortTokens = [];

  const changePercent = (a, b) => {
    return Number(( ( b - a ) * 100 / a ).toFixed(4));
  }

  //-----------------------------------------------first request for all ticker's symbols-----------------------------------------//
  const tickerPriceList = await axios.get('https://fapi.binance.com/fapi/v2/ticker/price')
  const tokensBetween = tickerPriceList.data.filter(item => Number(item.price) >= 0.01 && Number(item.price) <= 2);

  const WebSocket = require('ws');
  //------------------------------------------------websocket part for every ticker-----------------------------------------//
  Promise.allSettled(tokensBetween.map(async item => {
    const websocketThread = () => {
      //---------------------------------------------if data is confirm to test condition, push it.-----------------------------------------//
      const testData = async ( data ) => {
        if( Math.abs( changePercent( data.openPrice, data.closePrice ) ) >= 1.5 ) {
          const kline1d = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${data.symbol}&interval=1d&limit=1`)      //    a day kline
          if( Number(kline1d?.data[0][7]) >= 1000000 ) {
            const kline1h = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${data.symbol}&interval=1h&limit=1`);   //    a hour kline
            if( data.openPrice < data.closePrice ) {
              putData( data, longTokens, kline1d, kline1h);
            }
            else {
              putData( data, shortTokens, kline1d, kline1h);
            }
          }
        }
      }
      //-------------------------------------------if data is not confirm to test condition, push it.-----------------------------------------//
      const putData = async ( item, tokens, kline1d, kline1h ) => {
        let realdata = {};
        realdata.symbol = item.symbol;
        realdata.openTime = (new Date( Number( item.openTime ) )).toString().slice(4,21);
        realdata.closeTime = (new Date( Number( item.closeTime ) )).toString().slice(4,21);
        realdata.openPrice = item.openPrice;
        realdata.closePrice = item.closePrice;
        realdata.change = changePercent( item.openPrice, item.closePrice );
        realdata.volume = Number(kline1d?.data[0][7]);
        realdata.high = Number(kline1h?.data[0][2]);
        realdata.low = Number(kline1h?.data[0][3]);
        
          if( tokens.find( (t) => t.symbol === item.symbol ) ) {
            if( tokens[tokens.findIndex( (t) => t.symbol === item.symbol )].openTime.toString() === realdata.openTime.toString() ){
              tokens.splice(tokens.findIndex((t) => t.symbol === item.symbol), 1, realdata)
            }
            else{
              if(tokens.length >= 100){
                tokens.shift();
                tokens.push(realdata);
              }
              else{
                tokens.push(realdata);
              }
            }
          }
          else{
            if(tokens.length >= 100){
              tokens.shift();
              tokens.push(realdata);
            }
            else{
              tokens.push(realdata);
            }
          }
          getData({
            'longTokens' : longTokens,
            'shortTokens' : shortTokens,
            'status' : 'ok',
          });
        
      }

      //---------------------------------------------websocket construction for every ticker-----------------------------------------//
      var socket = new WebSocket(`wss://fstream.binance.com/ws/${item.symbol.toLowerCase()}@kline_1m`);
      //---------------------------------------------websocket connection for every ticker-----------------------------------------//
      socket.onopen = () => {
        console.log(`${item.symbol} connect`);
      }
      
      var tokenHistory;
      var temp;
      //---------------------------------------------websocket message handeler for every ticker-----------------------------------------//
      socket.onmessage = (event) => {
        const dataFromBinance = JSON.parse(event.data).k;                                        
        const data = {
              symbol:         dataFromBinance.s,
              openPrice:      Number(dataFromBinance.o),
              closePrice:     Number(dataFromBinance.c),
              openTime:       Number(dataFromBinance.t),
              closeTime:      Number(dataFromBinance.T) + 1,
              // realstate:      Number(dataFromBinance.c) > Number(dataFromBinance.o) ? 'increase': (Number(dataFromBinance.c) === Number(dataFromBinance.o) ? 'constant': 'decrease'),
              state:          Math.abs(changePercent(Number(dataFromBinance.o), Number(dataFromBinance.c))) < 0.0015 ? 'constant': ( Number(dataFromBinance.c) > Number(dataFromBinance.o) ? 'increase' : 'decrease')
        }

        if( !temp ){//------------------------------------------------------------------------------ at first, temp and tokenHistory is empty.                                                            
          temp = data; 
        }
        else {
          if( temp.openTime === data.openTime ){//-------------------------------------------------- at first, until temp is full data, overwrite temp.
            temp = data;
          }
          else {//--------------------------------------------------------------------------------- after a minute, put full data into tokenHistory.
            if(!tokenHistory){// -------------------------------------------------------------------at first, tokenHistory is empty.
              tokenHistory = temp;
              testData( tokenHistory );
            }
            else{
              if( temp.state === 'constant' ){ //------------------------------------------------------ current state is constant.
                tokenHistory.closeTime = temp.closeTime;//-------------------------------------------- only update closeTime.
                tokenHistory.closePrice = temp.closePrice;// ------------------------------------------update closePrice.
                //if
                testData( tokenHistory );
              }
              else{
                if( tokenHistory.state === 'constant' ){//--------------------------------------------- origin state is constant. modify origin state and closeTime and closePrice.
                  tokenHistory.state = temp.state;
                  tokenHistory.closeTime = temp.closeTime;
                  tokenHistory.closePrice = temp.closePrice;
                  //if
                  testData( tokenHistory );
                }
                else {//-------------------------------------------------------------------------------- origin state is not constant. 
                  if( tokenHistory.state === temp.state ){//-------------------------------------------- orign state is same with current state. modify origin closeTime and closePrice.
                    tokenHistory.closeTime = temp.closeTime;
                    tokenHistory.closePrice = temp.closePrice;
                    //if
                    testData( tokenHistory );
                  }
                  else {//------------------------------------------------------------------------------- orign state is not same with current state. overwrite origin data.
                    tokenHistory = temp;
                    //if
                    testData( tokenHistory );
                  }
                }
              }
            }
            temp = data;//------------------------------------------------------------------------------- put data into temp.
          }
        }
      }
      //---------------------------------------------websocket error handeler for every ticker-----------------------------------------//
      socket.onerror = error => {
        console.log(`${item.symbol} error, so reconnect`);
        socket = null;
        setTimeout(websocketThread, 1000);
      }
      //---------------------------------------------websocket close handeler for every ticker-----------------------------------------//
      socket.onclose = () => {
        console.log(`${item.symbol} closed, so reconnect`);
        socket = null;
        setTimeout(websocketThread, 1000);
      }
    }

    websocketThread();

  }));
}
