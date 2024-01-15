
import Marquee from "react-fast-marquee";
import { binanceCryptoIcons } from 'binance-icons';

function MarqueeNav(flow_data) {
  const data = flow_data.flow_data;
  var hasBtc = binanceCryptoIcons.has('');
  var btcIcon = binanceCryptoIcons.get('');
  const default_hasBtc = binanceCryptoIcons.has('cfx');
  const default_btcIcon = binanceCryptoIcons.get('cfx');

  return (
    <div>
      <Marquee className=" mt-3 bg-gray-900 h-[36px] rounded-full px-[10px]" autoFill pauseOnHover >
        {
                data.length? data.map((item, index) => {
                  var unKnown = item.pairs;
                  hasBtc = binanceCryptoIcons.has(unKnown);
                  btcIcon = binanceCryptoIcons.get(unKnown);
                  if(index < 5)
                    return (<ul className="grid grid-cols-2 gap-x-1">
                      <li key={item} className=" text-[16px] flex flex-col md:flex-row items-center">
                      #{index+1}
                        {
                          hasBtc? <span dangerouslySetInnerHTML={{__html: btcIcon.replace('"32"', '"24"')}} />:
                          <span dangerouslySetInnerHTML={{__html: default_btcIcon.replace('"32"', '"24"')}} />
                        }
                        {item.symbol}
                      </li>
                      <li key={item} className="text-center">{item.price}</li>
                    </ul>)
                }
                ):<h1 className="text-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1"></h1>
              }
      </Marquee>
    </div>
  );
}

export default MarqueeNav;  