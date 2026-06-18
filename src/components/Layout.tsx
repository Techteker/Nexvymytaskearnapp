import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, HelpCircle, RefreshCw, X, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

export const Layout = ({ children, wide = false }: LayoutProps) => {
  const { isSimulationMode, setIsSimulationMode, refreshUser } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleTryConnecting = async () => {
    setIsRetrying(true);
    try {
      // Deactivate simulation mode so the system attempts a direct Appwrite request
      localStorage.removeItem('simulation_mode_active');
      setIsSimulationMode(false);
      
      // Wait a tiny bit and refresh user session/status
      await new Promise(resolve => setTimeout(resolve, 800));
      await refreshUser();
      
      // Check if it got activated again automatically (which means API still returns "paused" or network fails)
      const isActiveAgain = localStorage.getItem('simulation_mode_active') === 'true';
      if (isActiveAgain) {
        alert("Appwrite Cloud is still paused or unreachable! Retrying returned to local simulation.");
      } else {
        alert("Success! Appwrite connected successfully!");
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] text-slate-900 relative">
      {isSimulationMode && (
        <div className="bg-gradient-to-r from-amber-505 from-amber-500 to-orange-600 text-white px-4 py-2.5 text-center text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-3 shadow-md z-[9999] relative">
          <div className="flex items-center gap-1.5 justify-center">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-200 animate-bounce" />
            <span>Appwrite Project under heavy sleep/paused state on Appwrite Cloud.</span>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setShowGuide(true)}
              className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all border border-white/20 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Fix / Unpause Guide</span>
            </button>
            <button 
              onClick={handleTryConnecting}
              disabled={isRetrying}
              className="bg-white text-orange-700 hover:bg-orange-50 active:bg-orange-100 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 disabled:opacity-50"
            >
              {isRetrying ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span>Try Live Connection</span>
            </button>
          </div>
        </div>
      )}

      {/* Connection Mode Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-indigo-900 to-brand-purple p-6 text-white relative">
              <button 
                onClick={() => setShowGuide(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg tracking-tight uppercase italic">Appwrite Connect Guide</h3>
                  <p className="text-xs text-indigo-200">How to fix "Project is paused" or set your custom DB</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Hindi Instructions */}
              <div className="space-y-2 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-500" /> Appwrite Connect Kaise Kare? (Hindi)
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 leading-relaxed font-semibold">
                  <li>
                    यह error इसलिए आ रहा है क्योंकि आपका Appwrite Cloud project <strong className="text-indigo-950 font-bold">\"Paused / Sleeping state\"</strong> में चला गया है।
                  </li>
                  <li>
                    <a 
                      href="https://cloud.appwrite.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline font-black hover:text-indigo-800"
                    >
                      cloud.appwrite.io
                    </a> पर अपने अकाउंट से लॉग इन करें।
                  </li>
                  <li>
                    अपने प्रोजेक्ट को खोलें और <strong className="text-emerald-700 font-extrabold uppercase">\"Restore\"</strong> या <strong className="text-emerald-700 font-extrabold uppercase">\"Resume\"</strong> बटन पर क्लिक करके unpause करें।
                  </li>
                  <li>
                    Unpause होने के बाद ऊपर दिए गए <strong className="text-orange-600">\"Try Live Connection\"</strong> बटन पर क्लिक करें। आपका लाइव डेटा फिर से चलने लगेगा!
                  </li>
                </ol>
              </div>

              {/* English Instructions */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  English Guide
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-500 space-y-1.5 leading-relaxed">
                  <li>
                    Appwrite automatically pauses inactive cloud projects. Go to <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer" className="text-indigo-650 font-bold underline">Appwrite Cloud Console</a>.
                  </li>
                  <li>
                    Click the <strong className="text-slate-900 font-semibold">Restore / Resume</strong> button on your project dashboard to wake up your database container.
                  </li>
                  <li>
                    Once restored, click <strong className="text-orange-600 font-semibold">\"Try Live Connection\"</strong> above, or hard refresh your browser tab.
                  </li>
                  <li>
                    Alternatively, to configure your own custom Appwrite server, navigate to <strong className="text-brand-purple font-semibold">Account -&gt; System Settings (Appwrite Config)</strong> tab inside the application.
                  </li>
                </ol>
              </div>

              {/* Developer Configuration Spec Indicator */}
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-[11px] text-amber-800 leading-normal space-y-1.5">
                <div className="font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600" /> Current Config details:
                </div>
                <div className="font-mono text-[10px] space-y-0.5 text-slate-600 bg-white/80 p-2 rounded-lg border border-amber-200/50">
                  <div><span className="text-slate-400 font-semibold">Project ID:</span> <span className="font-bold">6a016eac001c0af48909</span></div>
                  <div><span className="text-slate-400 font-semibold">Endpoint:</span> <span className="font-bold">https://fra.cloud.appwrite.io/v1</span></div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowGuide(false)}
                className="px-5 py-2.5 bg-indigo-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Responsive Wrapper */}
      <div className="max-w-7xl mx-auto lg:px-6 lg:py-8 flex flex-col lg:flex-row gap-8 items-start relative min-h-screen">
        {/* Desktop Sidebar (Only seen on desktop viewport) */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Main Panel Content Area */}
        <main className={`w-full flex-1 ${wide ? 'lg:max-w-5xl' : 'max-w-md lg:max-w-4xl'} mx-auto pb-32 lg:pb-12 pt-6 px-4 lg:pt-0 relative min-h-screen transition-all duration-300`}>
          <TopBar />
          {children}
        </main>
      </div>

      {/* Bottom Navigation Tabs (Seen only on mobile/tablet viewports) */}
      <div className="lg:hidden">
        <Navigation />
      </div>
    </div>
  );
};

