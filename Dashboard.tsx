import React from "react";
import { Wifi, Battery, Signal, Plus, Home } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  currentTimeStr: string;
  isSimulated?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, currentTimeStr, isSimulated }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-6 bg-slate-900 min-h-screen">
      {/* Decorative Outer Bezel */}
      <div className="w-full max-w-[430px] h-[880px] bg-neutral-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-neutral-800 flex flex-col relative overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-center gap-1.5 opacity-90">
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full border border-neutral-800"></div>
          <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full border border-neutral-800"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-2 pb-1.5 text-xs text-white z-40 bg-zinc-950 rounded-t-[36px] select-none font-sans">
          <div className="font-semibold text-[13px]">
            {currentTimeStr.substring(11, 16)}
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] opacity-90">
            {isSimulated && (
              <span className="bg-amber-600 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider animate-pulse">
                SIM Time
              </span>
            )}
            <Signal className="w-3.5 h-3.5" />
            <span className="font-medium">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-medium mr-0.5">85%</span>
              <Battery className="w-4 h-4 fill-white" />
            </div>
          </div>
        </div>

        {/* Screen Area */}
        <div className="flex-1 bg-zinc-950 rounded-[32px] overflow-hidden flex flex-col relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="h-6 w-full bg-zinc-950 flex justify-center items-center rounded-b-[36px]">
          <div className="w-32 h-1 bg-zinc-700 rounded-full mt-1"></div>
        </div>
      </div>
    </div>
  );
};
