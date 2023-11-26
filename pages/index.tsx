/** @format */

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

var imageAddr = "/31120037-5mb.jpg";
var downloadSize = 4995374; //bytes

const initialResult = {
  mbs: "0",
  kbps: "0",
  bps: "0",
};

const Home = () => {
  const [result, setResult] = useState<{
    mbs: string;
    kbps: string;
    bps: string;
  }>(initialResult);
  const [running, setRunning] = useState(false);

  const runSpeedTest = async () => {
    setRunning(true);
    setResult(initialResult);
    let startTime: number = 0;
    let endTime: number = 0;
    const download = new Image();
    download.onload = function () {
      endTime = new Date().getTime();
      showResults();
    };

    download.onerror = function (err, msg) {
      console.error(err);
      console.log(msg);
      setRunning(false);
    };

    startTime = new Date().getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;

    function showResults() {
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = downloadSize * 8;
      const speedBps = (bitsLoaded / duration).toFixed(2);
      const speedKbps = (parseInt(speedBps) / 1024).toFixed(2);
      const speedMbps = (parseInt(speedKbps) / 1024).toFixed(2);

      setResult({
        mbs: speedMbps,
        kbps: speedKbps,
        bps: speedBps,
      });
      setRunning(false);
    }
  };

  // デバイス情報の状態を追加
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    platform: "",
    language: "",
  });
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    colorDepth: 0,
  });
  const [memoryInfo, setMemoryInfo] = useState({
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0,
  });
  const [networkInfo, setNetworkInfo] = useState({
    downlink: 0,
    effectiveType: "",
    rtt: 0,
  });
  const [batteryInfo, setBatteryInfo] = useState({
    charging: false,
    level: 0,
    chargingTime: 0,
    dischargingTime: 0,
  });
  const [performanceInfo, setPerformanceInfo] = useState({
    loadTime: 0,
  });
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // デバイス情報を取得して状態を更新
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    });
    setScreenInfo({
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
    });
    if (performance && performance.memory) {
      setMemoryInfo({
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        usedJSHeapSize: performance.memory.usedJSHeapSize,
      });
    }
    if (navigator.connection) {
      setNetworkInfo({
        downlink: navigator.connection.downlink,
        effectiveType: navigator.connection.effectiveType,
        rtt: navigator.connection.rtt,
      });
    }
    navigator.getBattery().then((battery) => {
      setBatteryInfo({
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      });
    });
    setPerformanceInfo({
      loadTime:
        performance.timing.loadEventEnd - performance.timing.navigationStart,
    });
  }, []);

  const counter = (value: any) => (
    <>
      <div
        className='container'
        style={{ height: running ? "45px" : undefined }}>
        <h2>
          {running ? (
            <sup className='indicator'>
              <img alt='loading' src='/dots.svg' className='loading' />
            </sup>
          ) : (
            <span className='value'>{value}</span>
          )}
        </h2>
        {/* <sup className='type'>{type}</sup> */}
      </div>
    </>
  );

  return (
    <main className=''>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className='border-b border-gray-200 p-6'>
        <div className='container mx-auto'>
          <h1 className='text-xl font-bold'>
            デバイスのスペック
            <ruby>
              確認
              <rt>かくにん</rt>
            </ruby>
          </h1>
        </div>
      </header>
      <div className='flex flex-col text-2xl container mx-auto mt-8 space-y-8'>
        <div className='border border-gray-200 p-6 rounded-lg'>
          <h2 className='mb-2 text-2xl font-bold'>
            ネットワークの
            <ruby>
              速度
              <rt>そくど</rt>
            </ruby>
          </h2>
          <p className='mb-2 text-xl'>
            ネットワークの
            <ruby>
              速度<rt>そくど</rt>
            </ruby>
            が速ければ、インターネットで動画を見たり、ゲームをしたり、ウェブページを開いたりするのが早くなります。
            <br />
            あなたの
            <ruby>
              接続
              <rt>せつぞく</rt>
            </ruby>
            しているネットワークがどれくらい速いかを確認してみましょう！
          </p>
          <button
            type='button'
            onClick={runSpeedTest}
            onTouchStart={runSpeedTest}
            className='px-8 py-2 my-4 mb-1 mr-1 text-base font-bold text-white uppercase transition-all bg-blue-700 rounded shadow-md outline-none active:bg-blue-800 hover:shadow-lg focus:outline-none hover:bg-blue-900'
            tabIndex={0}
            aria-label='計測する'>
            {running ? (
              <>
                <ruby>
                  計測中
                  <rt>けいそくちゅう</rt>
                </ruby>
              </>
            ) : (
              <>
                <ruby>
                  計測
                  <rt>けいそく</rt>
                </ruby>
                する
              </>
            )}
          </button>
          <div className='mt-4 flex items-baseline'>
            <p className='mb-2 text-xl'>
              <ruby>
                計測結果
                <rt>けいそくけっか</rt>
              </ruby>
              :
            </p>
            <p
              className='mb-2 text-xl'
              style={{ display: running ? "none" : "block" }}></p>
            <div className='ml-2 flex items-baseline'>
              {counter(result.mbs)}
              <small className='ml-1'>Mbps</small>
            </div>
          </div>
          <div className="mt-4">
            {
              // ~5, 5~30, 30~50, 50~
              result.mbs === "0" ? (
                <p className='ml-2 text-xl'>
                  <ruby>
                    計測
                    <rt>けいそく</rt>
                  </ruby>
                  してください
                </p>
              ) : result.mbs < "5" ? (
                <p className='ml-2 text-xl'>
                  <ruby>
                    低速
                    <rt>ていそく</rt>
                  </ruby>
                  です 🐌
                </p>
              ) : result.mbs < "30" ? (
                <p className='ml-2 text-xl'>
                  <ruby>
                    普通
                    <rt>ふつう</rt>
                  </ruby>
                  です 🐢
                </p>
              ) : result.mbs < "50" ? (
                <p className='ml-2 text-xl'>
                  <ruby>
                    高速
                    <rt>こうそく</rt>
                  </ruby>
                  です 🐇
                </p>
              ) : (
                <p className='ml-2 text-xl'>
                  <ruby>
                    非常に高速
                    <rt>ひじょうにこうそく</rt>
                  </ruby>
                  です 🚀
                </p>
              )
            }
          </div>
        </div>
        <div className='border border-gray-200 p-6 rounded-lg'>
          <h2 className='mb-2 text-2xl font-bold'>
            デバイスの
            <ruby>
              情報
              <rt>じょうほう</rt>
            </ruby>
          </h2>
          <table className='w-full text-[14px] text-left text-gray-900 mt-4'>
            <thead className='text-sm text-gray-700 uppercase bg-gray-50 '>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  項目
                </th>
                <th scope='col' className='py-3 px-6'>
                  値
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='bg-white'>
                <td className='py-4 px-6'>ユーザーエージェント</td>
                <td className='py-4 px-6'>{deviceInfo.userAgent}</td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='py-4 px-6'>プラットフォーム</td>
                <td className='py-4 px-6'>{deviceInfo.platform}</td>
              </tr>
              <tr className='bg-white'>
                <td className='py-4 px-6'>
                  メモリ
                  <ruby>
                    使用量
                    <rt>しようりょう</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>
                  {memoryInfo.usedJSHeapSize} / {memoryInfo.totalJSHeapSize}
                </td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='py-4 px-6'>
                  画面
                  <ruby>
                    横幅
                    <rt>よこはば</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{screenInfo.width}</td>
              </tr>
              <tr className='bg-white'>
                <td className='py-4 px-6'>
                  画面
                  <ruby>
                    縦幅
                    <rt>たてはば</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{screenInfo.height}</td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='py-4 px-6'>
                  画面
                  <ruby>
                    色深度
                    <rt>いろふかど</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{screenInfo.colorDepth}</td>
              </tr>
              <tr className='bg-white'>
                <td className='py-4 px-6'>
                  ネットワーク
                  <ruby>
                    ダウンリンク
                    <rt>だうんりんく</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{networkInfo.downlink}</td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='py-4 px-6'>
                  ネットワーク
                  <ruby>
                    有効
                    <rt>ゆうこう</rt>
                  </ruby>
                  型
                </td>
                <td className='py-4 px-6'>{networkInfo.effectiveType}</td>
              </tr>
              <tr className='bg-white'>
                <td className='py-4 px-6'>
                  ネットワーク
                  <ruby>
                    往復
                    <rt>おうふく</rt>
                  </ruby>
                  時間
                </td>
                <td className='py-4 px-6'>{networkInfo.rtt}</td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='py-4 px-6'>
                  バッテリー
                  <ruby>
                    充電中
                    <rt>じゅうでんちゅう</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>
                  {batteryInfo.charging ? "はい" : "いいえ"}
                </td>
              </tr>
              <tr className='bg-white'>
                <td className='py-4 px-6'>
                  バッテリー
                  <ruby>
                    レベル
                    <rt>れべる</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{batteryInfo.level}</td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='py-4 px-6'>
                  バッテリー
                  <ruby>
                    充電時間
                    <rt>じゅうでんじかん</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{batteryInfo.chargingTime}</td>
              </tr>
              <tr className='bg-white'>
                <td className='py-4 px-6'>
                  バッテリー
                  <ruby>
                    放電時間
                    <rt>ほうでんじかん</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{batteryInfo.dischargingTime}</td>
              </tr>
              <tr className='bg-gray-50'>
                <td className='py-4 px-6'>
                  <ruby>
                    言語
                    <rt>げんご</rt>
                  </ruby>
                </td>
                <td className='py-4 px-6'>{deviceInfo.language}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Home;
