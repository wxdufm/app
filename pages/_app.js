import React from 'react'
import '/styles/globals.css'
import NextBreadcrumbs from "../components/ArchiveBreadcrumbs"
import { Layout } from '../components/Layout';


const App = ({ Component, pageProps }) => {

  return (
   
      <div className='bg-black font-poppins text-white text-base w-92 h-full m-0'>
          <Layout>
            {/* <iframe src={`https://dj.wxyc.org/#/NowPlaying`} style={{border: '0px', width: '200px', height: '200px', overflow: 'hidden', marginBottom: "50px", position: "fixed", top: "0", right: "0" }} /> */}
            {/* <NextBreadcrumbs className="text-white"/> */}
            <Component {...pageProps} />
          </Layout>
      </div>
    
  );
};

export default App;
