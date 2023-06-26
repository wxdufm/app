import React from 'react'
import '/styles/globals.css'


const App = ({ Component, pageProps }) => {

  return (
   
      <div className='bg-black font-helvetica text-white text-base w-92 h-full m-0 pl-4 pr-4'>
          <Component {...pageProps} />
      </div>
    
  );
};

export default App;
