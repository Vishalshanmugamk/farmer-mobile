import React, { useState } from "react";
import { 
  Sprout, 
  Beef, 
  Coins, 
  Truck, 
  Home, 
  Clock, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  CalendarDays,
  Activity
} from "lucide-react";
import { Reminder, ActivityLog, ModuleType } from "../types";

interface DashboardProps {
  reminders: Reminder[];
  logs: ActivityLog[];
  onNavigate: (module: "agriculture" | "livestock" | "harvest" | "lorry" | "bills" | "advisor") => void;
  // Simulation params
  simTimeRate: number; // 0 = normal (matches real-time ticks), > 0 = fast-forward speed
  setSimTimeRate: (rate: number) => void;
  simulatedTime: string;
  onTickManual: () => void;
  // Stats
  activeRemindersCount: number;
  totalCrops: number;
  totalAnimals: number;
  activeRentals: number;
  unpaidBills: number;
  triggerMockNotification: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  reminders,
  logs,
  onNavigate,
  simTimeRate,
  setSimTimeRate,
  simulatedTime,
  onTickManual,
  activeRemindersCount,
  totalCrops,
  totalAnimals,
  activeRentals,
  unpaidBills,
  triggerMockNotification
}) => {
  const [showTimeHelp, setShowTimeHelp] = useState(false);

  // Get next 3 upcoming reminders
  const upcomingReminders = [...reminders]
    .filter(r => !r.completed)
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
    .slice(0, 3);

  // Format Sim Date for display
  const formatSimDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return isoStr;
    }
  };

  const getModuleIcon = (moduleId: ModuleType) => {
    switch (moduleId) {
      case "agriculture": return <Sprout className="w-4 h-4 text-emerald-400" />;
      case "livestock": return <Beef className="w-4 h-4 text-amber-500" />;
      case "harvest": return <Coins className="w-4 h-4 text-teal-400" />;
      case "lorry": return <Truck className="w-4 h-4 text-sky-400" />;
      case "bills": return <Home className="w-4 h-4 text-indigo-400" />;
      default: return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getModuleLabel = (moduleId: ModuleType) => {
    switch (moduleId) {
      case "agriculture": return "Farm";
      case "livestock": return "Livestock";
      case "harvest": return "Harvest";
      case "lorry": return "Lorry";
      case "bills": return "Family";
      default: return "System";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 pb-8 text-zinc-100 bg-zinc-950 font-sans cursor-default scrollbar-thin">
      
      {/* Simulation Banner */}
      <div className="mb-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-400 font-bold font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Farm Scheduler Clock</span>
          </div>
          <button 
            type="button" 
            onClick={() => setShowTimeHelp(!showTimeHelp)}
            className="text-[10px] text-zinc-500 underline hover:text-zinc-300"
          >
            How it works?
          </button>
        </div>

        <div className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent font-mono mb-2">
          {formatSimDate(simulatedTime)}
        </div>

        {showTimeHelp && (
          <div className="text-[10px] text-zinc-400 p-2 bg-zinc-950/60 rounded-lg border border-zinc-800/40 mb-2">
            💡 Due to browser restrictions, we provide an accelerated clock to demonstrate 
            automated schedules and reminder ringdowns. Speeding up let's crops dry out, rentals 
            complete, and bills come due in real-time!
          </div>
        )}

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setSimTimeRate(0)}
            className={`text-[10px] py-1.5 rounded-lg border font-medium transition-all ${
              simTimeRate === 0 
                ? "bg-zinc-800 text-white border-zinc-700" 
                : "border-zinc-800 text-zinc-400 bg-zinc-900/40 hover:bg-zinc-800"
            }`}
          >
            ⏸️ Resume
          </button>
          <button
            type="button"
            onClick={() => setSimTimeRate(15)} // 1s = 15m
            className={`text-[10px] py-1.5 rounded-lg border font-medium transition-all ${
              simTimeRate === 15 
                ? "bg-amber-600 border-amber-500 text-black font-semibold" 
                : "border-zinc-800 text-zinc-400 bg-zinc-900/40 hover:bg-zinc-800"
            }`}
          >
            ⏱️ Fast 15m
          </button>
          <button
            type="button"
            onClick={() => setSimTimeRate(60)} // 1s = 60m
            className={`text-[10px] py-1.5 rounded-lg border font-medium transition-all ${
              simTimeRate === 60 
                ? "bg-amber-600 border-amber-500 text-black font-semibold animate-pulse" 
                : "border-zinc-800 text-zinc-400 bg-zinc-900/40 hover:bg-zinc-800"
            }`}
          >
            ⚡ Turbo 1hr
          </button>
          <button
            type="button"
            onClick={onTickManual}
            className="text-[10px] py-1.5 rounded-lg border border-zinc-800 text-zinc-300 bg-zinc-900/40 hover:bg-zinc-800 font-medium"
          >
            ➕ Manual 1h
          </button>
        </div>
      </div>

      {/* Main Grid: 5 Modules & Advisory */}
      <h2 className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-2">My Mobile Modules</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        
        {/* Mod 1: Farm */}
        <button
          type="button"
          onClick={() => onNavigate("agriculture")}
          className="flex flex-col items-start p-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl hover:border-emerald-500/50 transition-all text-left group"
        >
          <div className="p-2 bg-emerald-500/10 rounded-xl mb-3 border border-emerald-500/10 group-hover:bg-emerald-500/20 transition-all">
            <Sprout className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[13px] font-bold text-zinc-200">1. Agri Land</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">{totalCrops} Crops, Trees</span>
          <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/10 rounded text-emerald-400">
            Reminders Active
          </div>
        </button>

        {/* Mod 2: Livestock */}
        <button
          type="button"
          onClick={() => onNavigate("livestock")}
          className="flex flex-col items-start p-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl hover:border-amber-500/50 transition-all text-left group"
        >
          <div className="p-2 bg-amber-500/10 rounded-xl mb-3 border border-amber-500/10 group-hover:bg-amber-500/20 transition-all">
            <Beef className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[13px] font-bold text-zinc-200">2. Animals Yard</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">{totalAnimals} Animals</span>
          <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/10 rounded text-amber-400">
            Feed, Health due
          </div>
        </button>

        {/* Mod 3: Harvest */}
        <button
          type="button"
          onClick={() => onNavigate("harvest")}
          className="flex flex-col items-start p-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl hover:border-teal-500/50 transition-all text-left group"
        >
          <div className="p-2 bg-teal-500/10 rounded-xl mb-3 border border-teal-500/10 group-hover:bg-teal-500/20 transition-all">
            <Coins className="w-5 h-5 text-teal-400" />
          </div>
          <span className="text-[13px] font-bold text-zinc-200">3. Harvest Sells</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">Market Scheduler</span>
          <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-teal-500/10 border border-teal-500/10 rounded text-teal-400">
            Veggies to Sell
          </div>
        </button>

        {/* Mod 4: Water Lorry */}
        <button
          type="button"
          onClick={() => onNavigate("lorry")}
          className="flex flex-col items-start p-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl hover:border-sky-500/50 transition-all text-left group"
        >
          <div className="p-2 bg-sky-500/10 rounded-xl mb-3 border border-sky-500/10 group-hover:bg-sky-500/20 transition-all">
            <Truck className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-[13px] font-bold text-zinc-200">4. Lorry Rentals</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">{activeRentals} Active rentals</span>
          <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-sky-500/10 border border-sky-500/10 rounded text-sky-400">
            Times & Records
          </div>
        </button>

        {/* Mod 5: Household Bills */}
        <button
          type="button"
          onClick={() => onNavigate("bills")}
          className="flex flex-col items-start p-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl hover:border-indigo-500/50 transition-all text-left group"
        >
          <div className="p-2 bg-indigo-500/10 rounded-xl mb-3 border border-indigo-500/10 group-hover:bg-indigo-500/20 transition-all">
            <Home className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-[13px] font-bold text-zinc-200">5. Family & Bills</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">{unpaidBills} Pending dues</span>
          <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/10 rounded text-indigo-400">
            EB, fees, wifi
          </div>
        </button>

        {/* AI Advisor Card */}
        <button
          type="button"
          onClick={() => onNavigate("advisor")}
          className="flex flex-col items-start p-3 bg-zinc-900 border border-violet-800/60 rounded-2xl hover:border-violet-500/80 transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-violet-600/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="p-2 bg-violet-500/15 rounded-xl mb-3 border border-violet-500/20 group-hover:bg-violet-500/25 transition-all">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <span className="text-[13px] font-bold text-violet-300">AI Advisor AI</span>
          <span className="text-[10px] text-zinc-400 mt-0.5">Kisan Guru advisor</span>
          <div className="mt-2 text-[10px] px-1.5 py-0.5 bg-violet-500/20 border border-violet-500/30 rounded text-violet-300">
            Get Expert Tips
          </div>
        </button>
      </div>

      {/* Upcoming Reminders Section */}
      <div className="mb-5 bg-zinc-900/50 border border-zinc-850 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-150">Upcoming Reminders</h3>
          </div>
          <span className="text-[11px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-bold">
            {reminders.filter(r => !r.completed).length} Pending
          </span>
        </div>

        {upcomingReminders.length === 0 ? (
          <div className="text-center py-4 text-xs text-zinc-500">
            🎉 All scheduled reminders for the farm are complete! Use other modules to schedule more.
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingReminders.map(reminder => (
              <div 
                key={reminder.id} 
                className="flex items-center justify-between p-2.5 bg-zinc-900 rounded-xl border border-zinc-800/80"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="p-2 bg-zinc-950 rounded-lg shrink-0 border border-zinc-800">
                    {getModuleIcon(reminder.moduleId)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-200 truncate">{reminder.title}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{reminder.description}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-amber-400 font-mono font-bold block bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/40">
                    {reminder.scheduledTime.includes("T") 
                      ? formatSimDate(reminder.scheduledTime).split(",")[1]?.trim() || reminder.scheduledTime.split("T")[1]
                      : reminder.scheduledTime
                    }
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5 uppercase tracking-wide">
                    {getModuleLabel(reminder.moduleId)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Quick Logs */}
      <div className="bg-zinc-900/50 border border-zinc-850 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-zinc-150 font-sans">Recent Activity Logs</h3>
          </div>
          <button 
            type="button"
            onClick={triggerMockNotification}
            className="text-[10px] text-zinc-500 hover:text-sky-400"
          >
            🧪 Test Alert
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-4 text-xs text-zinc-500">
            Waiting for activity logs. Watering plants, feeding livestock, and paying bills will generate logs here.
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {logs.slice(0, 5).map(log => (
              <div 
                key={log.id} 
                className="p-2 bg-zinc-950 rounded-xl border border-zinc-800/60 flex items-start justify-between gap-1.5"
              >
                <div className="flex gap-2 items-start text-[10px] flex-1">
                  <span className="mt-0.5">{getModuleIcon(log.moduleId)}</span>
                  <div>
                    <span className="font-bold text-zinc-300">{log.title}: </span>
                    <span className="text-zinc-400">{log.description}</span>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-zinc-500 shrink-0 mt-0.5">
                  {log.timestamp.substring(11, 16)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
