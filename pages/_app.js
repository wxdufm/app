import React from 'react'
import '/styles/globals.css'


const App = ({ Component, pageProps }) => {

  return (

      <div className='app'>
        <Component {...pageProps} />
      </div>
    
  );
};

export default App;
