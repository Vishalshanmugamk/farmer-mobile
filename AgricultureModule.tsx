import React, { useState, useEffect, useRef } from "react";
import { MobileFrame } from "./components/MobileFrame";
import { Dashboard } from "./components/Dashboard";
import { AgricultureModule } from "./components/AgricultureModule";
import { LivestockModule } from "./components/LivestockModule";
import { HarvestModule } from "./components/HarvestModule";
import { LorryModule } from "./components/LorryModule";
import { FamilyBillsModule } from "./components/FamilyBillsModule";
import { AdvisorModule } from "./components/AdvisorModule";

import { 
  Reminder, 
  ActivityLog, 
  CropItem, 
  LivestockItem, 
  HarvestItem, 
  WaterLorryRental, 
  Bill, 
  ChatMessage, 
  ModuleType,
  ModuleType as ActiveModule
} from "./types";

import { 
  Home, 
  Sprout, 
  Beef, 
  Coins, 
  Truck, 
  Bell, 
  Check, 
  Volume2, 
  DollarSign, 
  Sparkles,
  Award,
  BookOpen
} from "lucide-react";

export default function App() {
  // Navigation: "dashboard" | "agriculture" | "livestock" | "harvest" | "lorry" | "bills" | "advisor"
  const [activeModule, setActiveModule] = useState<ActiveModule | "dashboard">("dashboard");

  // Global Time Simulation
  // We initialize simulated time to 2026-06-13T08:00:00 (matching realistic farmer hours)
  const [simulatedTime, setSimulatedTime] = useState<string>("2026-06-13T08:00:00-07:00");
  const [simTimeRate, setSimTimeRate] = useState<number>(0); // 0 = standard time, 15 = 15m/sec, 60 = 1h/sec

  // Active alarms popping up in the smartphone
  const [dueAlarms, setDueAlarms] = useState<Reminder[]>([]);
  const [alarmSnoozedIds, setAlarmSnoozedIds] = useState<string[]>([]);
  const [audioMuted, setAudioMuted] = useState(false);

  // Suggested Advisor Query (passed from other components)
  const [autofillQuery, setAutofillQuery] = useState("");

  // DB States Synced to localStorage
  const [crops, setCrops] = useState<CropItem[]>([]);
  const [animals, setAnimals] = useState<LivestockItem[]>([]);
  const [harvests, setHarvests] = useState<HarvestItem[]>([]);
  const [rentals, setRentals] = useState<WaterLorryRental[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Initialize state from localstorage or static placeholders
  useEffect(() => {
    try {
      const getStored = (key: string, def: any) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : def;
      };

      // Set crops
      setCrops(getStored("crops", [
        { id: "c1", name: "Ganga Mango Orchard", type: "tree", variety: "Alphanso", plantedDate: "2026-06-01", status: "healthy", lastWatered: "2026-06-13T04:00:00-07:00", nextWatering: "2026-06-13T16:00:00-07:00", lastFertilized: "2026-06-10T08:00:00-07:00", nextFertilizer: "2026-06-15T08:00:00-07:00" },
        { id: "c2", name: "Spicy Chilli Beds", type: "plant", variety: "Guntur Red", plantedDate: "2026-06-10", status: "needs_water", lastWatered: "2026-06-12T10:00:00-07:00", nextWatering: "2026-06-13T06:00:00-07:00", lastFertilized: "2026-06-12T10:00:00-07:00", nextFertilizer: "2026-06-19T10:00:00-07:00" }
      ]));

      // Set animals
      setAnimals(getStored("animals", [
        { id: "a1", name: "Hansi Dairy Cow", category: "cow", breed: "Indian Gir", count: 2, status: "healthy", lastFed: "2026-06-13T05:00:00-07:00", nextFeed: "2026-06-13T11:00:00-07:00", lastVaccinated: "2026-05-15", nextVaccination: "2026-08-15" },
        { id: "a2", name: "Village Hen Pen", category: "hen", breed: "Dual Leghorns", count: 45, status: "healthy", lastFed: "2026-06-13T07:15:00-07:00", nextFeed: "2026-06-13T11:15:00-07:00" }
      ]));

      // Set harvests
      setHarvests(getStored("harvests", [
        { id: "h1", cropName: "Kalyan Tomatoes", quantity: "150 Kilograms", harvestDate: "2026-06-13T05:00:00-07:00", sellDeadline: "2026-06-13T20:00:00-07:00", marketName: "Azadpur Subzi Mandi", targetPricePerUnit: "₹35 / kg", status: "stored" }
      ]));

      // Set Water lorry rentals
      setRentals(getStored("rentals", [
        { id: "r1", customerName: "Rohan Kumar", customerPhone: "+91 91223-44561", capacityLiters: 5000, rentAmount: 1400, startTime: "2026-06-13T08:00:00-07:00", endTime: "2026-06-13T12:00:00-07:00", status: "active", notes: "Sugarcane field watering dispatch." }
      ]));

      // Set bills
      setBills(getStored("bills", [
        { id: "b1", name: "EB Orchard Pump power bill", category: "eb_bill", amount: 1550, dueDate: "2026-06-14", status: "pending" },
        { id: "b2", name: "Rohan College Semester Fees", category: "school_fees", amount: 6200, dueDate: "2026-06-16", status: "pending" },
        { id: "b3", name: "Broadband Farm Wifi wifi bill", category: "wifi_bill", amount: 499, dueDate: "2026-06-13", status: "pending" }
      ]));

      // Set reminders (with scheduled alarms very close to initial simulated time so they trigger right away on acceleration!)
      setReminders(getStored("reminders", [
        { id: "rem1", moduleId: "agriculture", title: "💧 Check Guntur Chilli Moisture", description: "Watering schedule alert for Chilli fields", scheduledTime: "08:15", repeat: "daily", completed: false, triggeredCount: 0 },
        { id: "rem2", moduleId: "bills", title: "⚡ Settle pump EB charge", description: "Pay Electric Board power bill online", scheduledTime: "11:00", repeat: "daily", completed: false, triggeredCount: 0 },
        { id: "rem3", moduleId: "lorry", title: "🚚 Collect Water Lorry from Rohan", description: "Verify truck tank return & collect ₹1400 rent", scheduledTime: "12:00", repeat: "none", completed: false, triggeredCount: 0 }
      ]));

      // Set initial logs
      setLogs(getStored("logs", [
        { id: "log1", timestamp: "2026-06-13T05:00:00-07:00", moduleId: "harvest", title: "Harvest Logged", description: "Registered 150 kg Tomatoes harvested", type: "success" },
        { id: "log2", timestamp: "2026-06-13T07:15:00-07:00", moduleId: "livestock", title: "Hen Pen Feed", description: "Backyard Hen Pen feed and fresh water refilled", type: "info" }
      ]));

      // Chat history
      setChatHistory(getStored("chatHistory", []));
      
    } catch (e) {
      console.warn("Storage fetch failed, running initial defaults", e);
    }
  }, []);

  // Sync state modifications to save variables across reload
  useEffect(() => { if (crops.length) localStorage.setItem("crops", JSON.stringify(crops)); }, [crops]);
  useEffect(() => { if (animals.length) localStorage.setItem("animals", JSON.stringify(animals)); }, [animals]);
  useEffect(() => { if (harvests.length) localStorage.setItem("harvests", JSON.stringify(harvests)); }, [harvests]);
  useEffect(() => { if (rentals.length) localStorage.setItem("rentals", JSON.stringify(rentals)); }, [rentals]);
  useEffect(() => { if (bills.length) localStorage.setItem("bills", JSON.stringify(bills)); }, [bills]);
  useEffect(() => { if (reminders.length) localStorage.setItem("reminders", JSON.stringify(reminders)); }, [reminders]);
  useEffect(() => { if (logs.length) localStorage.setItem("logs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { if (chatHistory.length) localStorage.setItem("chatHistory", JSON.stringify(chatHistory)); }, [chatHistory]);

  // Synthetic Audio Web Chime
  const triggerAudioChime = () => {
    if (audioMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, audioCtx.currentTime); // chime 1st part
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // chime 2nd part
      
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // safe fallback if audio contexts blocked
    }
  };

  // Automated Simulation Clock Engine
  useEffect(() => {
    const timer = setInterval(() => {
      // Step simulated time forward
      setSimulatedTime(prevTimeStr => {
        try {
          const date = new Date(prevTimeStr);
          if (simTimeRate === 0) {
            // standard clock rate: add 1 real second
            date.setSeconds(date.getSeconds() + 1);
          } else {
            // accelerated test rate: add simTimeRate minutes
            date.setMinutes(date.getMinutes() + simTimeRate);
          }
          const nextTimeStr = date.toISOString();
          
          // Poll outstanding reminders based on new simulated time
          pollActiveAlarms(nextTimeStr);
          return nextTimeStr;
        } catch {
          return prevTimeStr;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [simTimeRate, reminders, alarmSnoozedIds]);

  // Push manual tick forward by 1 hour
  const handleManualTick = () => {
    setSimulatedTime(prevTimeStr => {
      try {
        const date = new Date(prevTimeStr);
        date.setHours(date.getHours() + 1);
        const nextTimeStr = date.toISOString();
        pollActiveAlarms(nextTimeStr);
        return nextTimeStr;
      } catch {
        return prevTimeStr;
      }
    });
  };

  // Alarm Check engine: checks if any scheduled reminder matches simulated clock
  const pollActiveAlarms = (currentTimeISO: string) => {
    const currentHrsMin = currentTimeISO.substring(11, 16); // e.g. "08:15"
    
    const triggered: Reminder[] = [];

    reminders.forEach(reminder => {
      if (reminder.completed) return;
      if (alarmSnoozedIds.includes(reminder.id)) return;

      // Match check: If reminder scheduledTime is "HH:MM", check if currentHrsMin is identical
      const isDueTime = reminder.scheduledTime === currentHrsMin;
      
      // Complete date time match
      const isDueDateTime = reminder.scheduledTime.includes("T") && 
                             currentTimeISO.startsWith(reminder.scheduledTime.substring(0, 16));

      if (isDueTime || isDueDateTime) {
        triggered.push(reminder);
      }
    });

    if (triggered.length > 0) {
      setDueAlarms(prev => {
        // filter duplicates
        const existingIds = prev.map(p => p.id);
        const nextList = [...prev];
        triggered.forEach(t => {
          if (!existingIds.includes(t.id)) {
            nextList.push(t);
            // logging telemetry
            writeLog(t.moduleId, `⏰ REMINDER DUE`, `${t.title} - ${t.description}`, "warning");
          }
        });
        return nextList;
      });
      triggerAudioChime();
    }
  };

  const writeLog = (moduleId: ModuleType, title: string, description: string, type: "success" | "warning" | "info" = "info") => {
    const newLog: ActivityLog = {
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timestamp: simulatedTime,
      moduleId,
      title,
      description,
      type
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Dismiss Alarm Action
  const handleDismissAlarm = (alarmId: string) => {
    setDueAlarms(prev => prev.filter(p => p.id !== alarmId));
    
    // update reminders list - mark 'once' types as done, increase triggered count for repeating
    setReminders(prev => prev.map(r => {
      if (r.id === alarmId) {
        const isOnce = r.repeat === "none";
        return {
          ...r,
          completed: isOnce ? true : false,
          triggeredCount: r.triggeredCount + 1
        };
      }
      return r;
    }));
  };

  // Snooze Alarm Action (mutes for current simulation session)
  const handleSnoozeAlarm = (alarmId: string) => {
    setDueAlarms(prev => prev.filter(p => p.id !== alarmId));
    setAlarmSnoozedIds(prev => [...prev, alarmId]);
    // Wake up mock after 5 minutes simulated time
    writeLog("agriculture", "Snoozed Alarm", `Temporary alarm mute set.`, "info");
  };

  // CRUD for Module 1: Crops
  const handleAddCrop = (newCrop: any) => {
    const item: CropItem = {
      ...newCrop,
      id: "c_" + Date.now(),
      status: "healthy",
      lastWatered: simulatedTime,
      nextWatering: simulatedTime,
      lastFertilized: simulatedTime,
      nextFertilizer: simulatedTime
    };
    setCrops(prev => [...prev, item]);
    writeLog("agriculture", "Crop Registered", `Added ${item.name} variety ${item.variety} to farming fields.`, "success");
  };

  const handleDeleteCrop = (id: string) => {
    setCrops(prev => prev.filter(c => c.id !== id));
    writeLog("agriculture", "Crop Removed", `Deregistered land record.`, "info");
  };

  const handleWaterCrop = (id: string) => {
    setCrops(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, lastWatered: simulatedTime, status: "healthy" };
      }
      return c;
    }));
    const crop = crops.find(c => c.id === id);
    writeLog("agriculture", "Crop Watered", `Provided on-time watering to ${crop?.name}. Soil hydration reaches optimal 100%.`, "success");
  };

  const handleFertilizeCrop = (id: string) => {
    setCrops(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, lastFertilized: simulatedTime };
      }
      return c;
    }));
    const crop = crops.find(c => c.id === id);
    writeLog("agriculture", "Crop Fertilized", `Added NPK organic fertilizer nutrients to ${crop?.name}.`, "success");
  };

  // CRUD for Module 2: Livestock
  const handleAddAnimal = (newAnimal: any) => {
    const item: LivestockItem = {
      ...newAnimal,
      id: "a_" + Date.now(),
      status: "healthy",
      lastFed: simulatedTime,
      nextFeed: simulatedTime
    };
    setAnimals(prev => [...prev, item]);
    writeLog("livestock", "Livestock Registered", `Registered ${item.count} heads of ${item.breed} (${item.category}) to livestock yard.`, "success");
  };

  const handleDeleteAnimal = (id: string) => {
    setAnimals(prev => prev.filter(c => c.id !== id));
  };

  const handleFeedAnimal = (id: string) => {
    setAnimals(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, lastFed: simulatedTime };
      }
      return a;
    }));
    const animal = animals.find(a => a.id === id);
    writeLog("livestock", "Animal Fed", `Provided fresh cattle-fodder and clean cooling water to ${animal?.name}.`, "success");
  };

  // CRUD for Module 3: Harvest sales
  const handleAddHarvest = (newHarvest: any) => {
    const item: HarvestItem = {
      ...newHarvest,
      id: "h_" + Date.now(),
      status: "stored"
    };
    setHarvests(prev => [...prev, item]);
    writeLog("harvest", "Harvest Stored", `Logged freshly harvested ${item.cropName}. Expiry countdown initiated.`, "success");
  };

  const handleDeleteHarvest = (id: string) => {
    setHarvests(prev => prev.filter(c => c.id !== id));
  };

  const handleSellHarvest = (id: string) => {
    setHarvests(prev => prev.map(h => {
      if (h.id === id) {
        return { ...h, status: "sold" };
      }
      return h;
    }));
    const item = harvests.find(h => h.id === id);
    writeLog("harvest", "Stocks Sold", `Sold ${item?.cropName} (${item?.quantity}) at ${item?.marketName} for targeted rate ${item?.targetPricePerUnit}!`, "success");
  };

  // CRUD for Module 4: Water Lorry rentals
  const handleAddRental = (newRental: any) => {
    const item: WaterLorryRental = {
      ...newRental,
      id: "r_" + Date.now(),
      status: "active"
    };
    setRentals(prev => [...prev, item]);
    writeLog("lorry", "Lorry Dispatched", `Dispatched water tanker rent request to customer ${item.customerName} for ${item.capacityLiters} L size.`, "success");
  };

  const handleDeleteRental = (id: string) => {
    setRentals(prev => prev.filter(c => c.id !== id));
  };

  const handleReturnRental = (id: string) => {
    setRentals(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: "returned" };
      }
      return r;
    }));
    const rental = rentals.find(r => r.id === id);
    writeLog("lorry", "Lorry Returned", `Water truck tanker returned safely by ${rental?.customerName}. Total rent payment ₹${rental?.rentAmount} settled.`, "success");
  };

  // CRUD for Module 5: Family Bills
  const handleAddBill = (newBill: any) => {
    const item: Bill = {
      ...newBill,
      id: "b_" + Date.now(),
      status: "pending"
    };
    setBills(prev => [item, ...prev]);
    writeLog("bills", "Bill Registered", `Logged family payment requirement: ${item.name} for ₹${item.amount}.`, "info");
  };

  const handleDeleteBill = (id: string) => {
    setBills(prev => prev.filter(c => c.id !== id));
  };

  const handlePayBill = (id: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, status: "paid" };
      }
      return b;
    }));
    const bill = bills.find(b => b.id === id);
    writeLog("bills", "Bill Paid", `Settle OK: Paid outstanding amount ₹${bill?.amount} for ${bill?.name} on-time.`, "success");
  };

  // Add customized timed reminders
  const handleAddReminder = (moduleId: ModuleType, title: string, desc: string, time: string, repeat: "none" | "daily" | "weekly") => {
    // formatting: if time is "HH:MM", we keep it. If it's a date-time picker string, we clean it.
    const item: Reminder = {
      id: "rem_" + Date.now(),
      moduleId,
      title,
      description: desc,
      scheduledTime: time,
      repeat,
      completed: false,
      triggeredCount: 0
    };
    setReminders(prev => [item, ...prev]);
    // remove from snoozed list if they replace it
    setAlarmSnoozedIds(prev => prev.filter(id => id !== item.id));
    writeLog(moduleId, "Alarm Set", `Scheduled timing reminder alert at ${time}.`, "info");
  };

  // Chat API Connector calling Express API Route
  const handleSendChat = async (text: string) => {
    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text,
      timestamp: simulatedTime
    };
    setChatHistory(prev => [...prev, userMsg]);
    setAiLoading(true);

    try {
      const response = await fetch("/api/farming-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          moduleId: activeModule === "dashboard" ? undefined : activeModule,
          contextData: activeModule === "agriculture" ? crops : activeModule === "livestock" ? animals : activeModule === "harvest" ? harvests : undefined
        })
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: "msg_" + Date.now() + "_ai",
        sender: "ai",
        text: data.text || "Failed to query advice.",
        timestamp: simulatedTime
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: "msg_err_" + Date.now(),
        sender: "ai",
        text: "I am having trouble connecting to Kisan Guru right now. Please check if server is responsive. Fast-guideline: Check your internet connection.",
        timestamp: simulatedTime
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleNavigateToAdvisorWithAutofill = (entityQuery: string) => {
    const query = `Provide quick tips and recommended watering, vaccination, or sales timetable for: "${entityQuery}"`;
    setAutofillQuery(query);
    setActiveModule("advisor");
  };

  const handleClearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  // Setup sample heads-up reminder for quick manual audit testing
  const handleQuickAlarmTest = () => {
    const sysHrsMin = simulatedTime.substring(11, 16);
    const split = sysHrsMin.split(":");
    let minNum = Number(split[1]) + 1;
    let hrNum = Number(split[0]);
    if (minNum >= 60) {
      minNum = 0;
      hrNum = (hrNum + 1) % 24;
    }
    const formattedTarget = `${hrNum.toString().padStart(2, "0")}:${minNum.toString().padStart(2, "0")}`;
    
    handleAddReminder(
      "agriculture",
      "💧 TEST ALARM: Quick water check",
      "Accelerated test alarm trigger",
      formattedTarget,
      "none"
    );
    writeLog("agriculture", "Test Trigger Set", `Set test alarm at ${formattedTarget} (Next simulated minute). Speed up time using "Turbo" to instantly trigger it.`, "info");
  };

  // Helper selectors
  const totalCrops = crops.length;
  const totalAnimals = animals.map(a => a.count).reduce((sum, c) => sum + c, 0);
  const activeRentals = rentals.filter(r => r.status === "active").length;
  const unpaidBills = bills.filter(b => b.status !== "paid").length;

  return (
    <MobileFrame currentTimeStr={simulatedTime} isSimulated={simTimeRate > 0}>
      
      {/* Dynamic Alarm overlay in mobile chassis */}
      {dueAlarms.length > 0 && (
        <div className="absolute inset-0 z-50 bg-neutral-900/95 backdrop-blur-md flex flex-col justify-between p-6 text-center animate-fade-in font-sans">
          <div className="mt-8">
            <div className="mx-auto w-16 h-16 bg-red-650 rounded-full flex items-center justify-center border-4 border-red-500 animate-bounce mb-4 text-white">
              <Bell className="w-8 h-8 animate-pulse text-white" />
            </div>
            <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 border border-red-500/10 rounded-full font-bold uppercase tracking-wider">
              Farmer Alarm Alert
            </span>
            
            <h2 className="text-xl font-bold mt-4 text-zinc-100 bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
              {dueAlarms[0].title}
            </h2>
            <p className="text-xs text-zinc-400 mt-2 px-4 italic">
              {dueAlarms[0].description}
            </p>
          </div>

          <div className="bg-zinc-950/45 p-4 rounded-2xl border border-zinc-800/40 text-left space-y-2 mb-4 font-sans text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Scheduler Time</span>
              <span className="font-bold text-amber-400 font-mono">{dueAlarms[0].scheduledTime}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Module Sector</span>
              <span className="font-bold text-sky-400 uppercase tracking-widest">{dueAlarms[0].moduleId}</span>
            </div>
          </div>

          <div className="space-y-2 mb-8 grid grid-cols-2 gap-2 font-sans text-xs w-full">
            <button
              type="button"
              onClick={() => handleSnoozeAlarm(dueAlarms[0].id)}
              className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-xl border border-zinc-700 transition-all text-center"
            >
              😴 Snooze (Skip)
            </button>
            <button
              type="button"
              onClick={() => handleDismissAlarm(dueAlarms[0].id)}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl border border-emerald-500 transition-all text-center flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" /> I've Done It
            </button>
          </div>
        </div>
      )}

      {/* Screen Area Header */}
      <div className="bg-zinc-900 px-3.5 py-2.5 border-b border-zinc-800 flex justify-between items-center shrink-0">
        <h1 className="font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-1 select-none">
          🌾 Kisan Mobile HUB
        </h1>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-1 px-1.5 bg-zinc-950 rounded-lg text-zinc-400 border border-zinc-800 hover:text-zinc-150"
            title={audioMuted ? "Unmute Alarm Chime" : "Mute Alarm Chime"}
          >
            {audioMuted ? <span className="text-[10px]">🔇 Mute</span> : <span className="text-[10px]">🔊 Chime</span>}
          </button>
        </div>
      </div>

      {/* Active Sub Viewport */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-zinc-950">
        {activeModule === "dashboard" && (
          <Dashboard 
            reminders={reminders}
            logs={logs}
            onNavigate={(mod) => setActiveModule(mod)}
            simTimeRate={simTimeRate}
            setSimTimeRate={setSimTimeRate}
            simulatedTime={simulatedTime}
            onTickManual={handleManualTick}
            activeRemindersCount={reminders.filter(r => !r.completed).length}
            totalCrops={totalCrops}
            totalAnimals={totalAnimals}
            activeRentals={activeRentals}
            unpaidBills={unpaidBills}
            triggerMockNotification={handleQuickAlarmTest}
          />
        )}

        {activeModule === "agriculture" && (
          <AgricultureModule
            crops={crops}
            reminders={reminders}
            onAddCrop={handleAddCrop}
            onDeleteCrop={handleDeleteCrop}
            onWaterCrop={handleWaterCrop}
            onFertilizeCrop={handleFertilizeCrop}
            onAddReminder={handleAddReminder}
            onNavigateToAdvisor={handleNavigateToAdvisorWithAutofill}
            currentTimeStr={simulatedTime}
          />
        )}

        {activeModule === "livestock" && (
          <LivestockModule
            animals={animals}
            reminders={reminders}
            onAddAnimal={handleAddAnimal}
            onDeleteAnimal={handleDeleteAnimal}
            onFeedAnimal={handleFeedAnimal}
            onAddReminder={handleAddReminder}
            onNavigateToAdvisor={handleNavigateToAdvisorWithAutofill}
            currentTimeStr={simulatedTime}
          />
        )}

        {activeModule === "harvest" && (
          <HarvestModule
            harvests={harvests}
            reminders={reminders}
            onAddHarvest={handleAddHarvest}
            onDeleteHarvest={handleDeleteHarvest}
            onSellHarvest={handleSellHarvest}
            onAddReminder={handleAddReminder}
            onNavigateToAdvisor={handleNavigateToAdvisorWithAutofill}
            currentTimeStr={simulatedTime}
          />
        )}

        {activeModule === "lorry" && (
          <LorryModule
            rentals={rentals}
            reminders={reminders}
            onAddRental={handleAddRental}
            onDeleteRental={handleDeleteRental}
            onReturnRental={handleReturnRental}
            onAddReminder={handleAddReminder}
            onNavigateToAdvisor={handleNavigateToAdvisorWithAutofill}
            currentTimeStr={simulatedTime}
          />
        )}

        {activeModule === "bills" && (
          <FamilyBillsModule
            bills={bills}
            reminders={reminders}
            onAddBill={handleAddBill}
            onDeleteBill={handleDeleteBill}
            onPayBill={handlePayBill}
            onAddReminder={handleAddReminder}
            currentTimeStr={simulatedTime}
          />
        )}

        {activeModule === "advisor" && (
          <AdvisorModule
            chatHistory={chatHistory}
            onSendMessage={handleSendChat}
            onClearHistory={handleClearChatHistory}
            isLoading={aiLoading}
            autofillQuery={autofillQuery}
            clearAutofill={() => setAutofillQuery("")}
          />
        )}
      </div>

      {/* Screen Area Footer Bottom Nav-bar */}
      <div className="bg-zinc-950 border-t border-zinc-850 px-2 py-1.5 flex justify-between shrink-0 select-none">
        {/* Nav 1: Home */}
        <button
          type="button"
          onClick={() => setActiveModule("dashboard")}
          className={`flex flex-col items-center flex-1 py-1 text-[10px] transition-all ${
            activeModule === "dashboard" ? "text-amber-500 font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Nav 2: Farm */}
        <button
          type="button"
          onClick={() => setActiveModule("agriculture")}
          className={`flex flex-col items-center flex-1 py-1 text-[10px] transition-all ${
            activeModule === "agriculture" ? "text-emerald-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Sprout className="w-4 h-4 mb-0.5" />
          <span>Farm</span>
        </button>

        {/* Nav 3: Livestock */}
        <button
          type="button"
          onClick={() => setActiveModule("livestock")}
          className={`flex flex-col items-center flex-1 py-1 text-[10px] transition-all ${
            activeModule === "livestock" ? "text-amber-500 font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Beef className="w-4 h-4 mb-0.5" />
          <span>Animals</span>
        </button>

        {/* Nav 4: Lorry */}
        <button
          type="button"
          onClick={() => setActiveModule("lorry")}
          className={`flex flex-col items-center flex-1 py-1 text-[10px] transition-all ${
            activeModule === "lorry" ? "text-sky-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Truck className="w-4 h-4 mb-0.5" />
          <span>Lorry</span>
        </button>

        {/* Nav 5: Bills */}
        <button
          type="button"
          onClick={() => setActiveModule("bills")}
          className={`flex flex-col items-center flex-1 py-1 text-[10px] transition-all ${
            activeModule === "bills" ? "text-indigo-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Bell className="w-4 h-4 mb-0.5" />
          <span>Bills</span>
        </button>

        {/* Nav 6: Chat */}
        <button
          type="button"
          onClick={() => setActiveModule("advisor")}
          className={`flex flex-col items-center flex-1 py-1 text-[10px] transition-all ${
            activeModule === "advisor" ? "text-violet-400 font-bold animate-pulse" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Advisor</span>
        </button>
      </div>

    </MobileFrame>
  );
}
