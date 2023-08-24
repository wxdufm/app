import React from 'react'
import '/styles/globals.css'
import { Layout } from '../components/Layout';


const App = ({ Component, pageProps }) => {

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col bg-black font-poppins text-white text-base w-92 max-w-screen-2xl h-full m-0 overflow-hidden'>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </div>
    </div>  
    
  );
};

export default App;
