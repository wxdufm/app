import React from 'react'
import '/Users/hayleyowens/Desktop/website/static-blog/styles/globals.css'
import "@fontsource/poppins";

const App = ({ Component, pageProps }) => {
  return (
    <div className='app'>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
