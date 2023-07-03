import React from 'react'
import '/styles/globals.css'


const App = ({ Component, pageProps }) => {

  return (
   
      <div className='bg-black font-helvetica text-white text-base w-92 h-full m-0 pl-4 pr-4'>
          <iframe src={`https://dj.wxyc.org/#/NowPlaying`} style={{border: '0px', width: '200px', height: '200px', overflow: 'hidden', marginBottom: "50px", position: "fixed", top: "0", right: "0" }} />
          <Component {...pageProps} />
      </div>
    
  );
};

export default App;
