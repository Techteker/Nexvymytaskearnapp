import React from 'react';

interface AdBannerProps {
  type: 'large' | 'small'; // large = 300x250, small = 320x50
}

export const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  if (type === 'large') {
    // 300x250 Large Ad banner script details
    return (
      <div className="flex flex-col items-center justify-center my-4 overflow-hidden w-full">
        <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mb-1.5 select-none">
          Sponsored Link
        </div>
        <div className="w-[300px] h-[250px] bg-slate-900/5 dark:bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm relative">
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 0; 
                      display: flex; 
                      justify-content: center; 
                      align-items: center; 
                      background: transparent; 
                    }
                  </style>
                </head>
                <body>
                  <script type="text/javascript">
                    atOptions = {
                      'key' : '7625f4ef1383a0db01222e4b192bf980',
                      'format' : 'iframe',
                      'height' : 250,
                      'width' : 300,
                      'params' : {}
                    };
                  </script>
                  <script type="text/javascript" src="https://www.highperformanceformat.com/7625f4ef1383a0db01222e4b192bf980/invoke.js"></script>
                </body>
              </html>
            `}
            width="300"
            height="250"
            style={{ border: 'none', overflow: 'hidden' }}
            title="Nexvy Large Promotional Ad"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 320x50 Small Ad banner script details
  return (
    <div className="flex flex-col items-center justify-center my-3 overflow-hidden w-full">
      <div className="text-[8px] text-slate-400 font-mono tracking-widest uppercase mb-1.5 select-none">
        Advertisement
      </div>
      <div className="w-[320px] h-[50px] bg-slate-900/5 dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-xs relative">
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { 
                    margin: 0; 
                    padding: 0; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    background: transparent; 
                  }
                </style>
              </head>
              <body>
                <script type="text/javascript">
                  atOptions = {
                    'key' : 'bbc1fbcbf2e9f1b2c85398e0cd80137a',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/bbc1fbcbf2e9f1b2c85398e0cd80137a/invoke.js"></script>
              </body>
            </html>
          `}
          width="320"
          height="50"
          style={{ border: 'none', overflow: 'hidden' }}
          title="Nexvy Small Promotional Ad"
          scrolling="no"
        />
      </div>
    </div>
  );
};
