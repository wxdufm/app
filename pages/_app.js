import React from 'react'
import '/styles/globals.css'
import "@fontsource/poppins";

const App = ({ Component, pageProps }) => {
  return (
    <div className='app'>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
