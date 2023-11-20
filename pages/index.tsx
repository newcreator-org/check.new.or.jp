/** @format */

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
var imageAddr = "/31120037-5mb.jpg";
var downloadSize = 4995374; //bytes

const numberStyle = { fontVariantNumeric: "lining-nums" };

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
  const [readmore, setReadmore] = useState(false);

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
  const counter = (value: any, type: any) => (
    <>
      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 1.6rem; // Here we enlarge the font size to 1.6 rem for better accessibility
          color: #333; // Space for improving color contrast
        }
        .indicator {
          height: 45px;
        }
        .value,
        .type {
          margin-left: 1rem;
        }
        .loading {
          height: 2rem;
          margin-top: 3rem;
        }
      `}</style>

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
        <sup className='type'>{type}</sup>
      </div>
    </>
  );

  return (
    <div className='container'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div
        className='flex flex-col items-center justify-center w-screen h-screen text-2xl'
        style={{ color: "#333333", backgroundColor: "#FFFFFF" }}>
        <>
          <div className='flex flex-col items-center justify-center text-center'>
            <h5 className='mb-2 text-2xl'>Your download speed:</h5>
            {counter(result.mbs, "Mbps")}
            {(readmore && result.kbps !== initialResult.kbps) ||
              (result.bps !== initialResult.bps && (
                <>
                  {counter(result.kbps, "Kbps")}
                  {counter(result.bps, "Bps")}
                </>
              ))}
            <div
              onClick={() => setReadmore((flag) => !flag)}
              onTouchStart={() => setReadmore((flag) => !flag)}
              className='text-2xl text-blue-800 cursor-pointer hover:text-blue-900'
              tabIndex='0'
              role='button'
              aria-label={
                (readmore ? "less details" : "more details") + ", button"
              }>
              {readmore ? "Less details" : "More details"}
            </div>
          </div>
        </>

        <button
          type='button'
          onClick={runSpeedTest}
          onTouchStart={runSpeedTest}
          className='px-8 py-3 mt-4 mb-1 mr-1 text-base font-bold text-white uppercase transition-all bg-blue-700 rounded shadow-md outline-none active:bg-blue-800 hover:shadow-lg focus:outline-none hover:bg-blue-900'
          tabIndex={0}
          aria-label='Run Speed Test, button'>
          Run Speed Test
        </button>
      </div>
    </div>
  );
};

export default Home;
