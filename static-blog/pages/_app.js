import React from 'react'
import '/Users/hayleyowens/Desktop/website/static-blog/globals.css'

const App = ({ Component, pageProps }) => {
  return (
    <div className='app'>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
