import React from 'react'
import '/styles/globals.css'
import { Layout } from '../components/Layout';


const App = ({ Component, pageProps }) => {

  return (
   
      <div className='flex flex-col bg-black font-poppins text-white text-base w-92 h-full m-0 max-w-100 overflow-hidden'>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </div>
    
  );
};

export default App;
