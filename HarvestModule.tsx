import React, { useState } from "react";
import { Sprout, RefreshCw, Calendar, Droplets, Leaf, MessageSquare, Plus, Trash2 } from "lucide-react";
import { CropItem, Reminder } from "../types";

interface AgricultureModuleProps {
  crops: CropItem[];
  reminders: Reminder[];
  onAddCrop: (crop: Omit<CropItem, "id" | "status" | "lastWatered" | "nextWatering" | "lastFertilized" | "nextFertilizer">) => void;
  onDeleteCrop: (id: string) => void;
  onWaterCrop: (id: string) => void;
  onFertilizeCrop: (id: string) => void;
  onAddReminder: (moduleId: "agriculture", title: string, desc: string, time: string, repeat: "none" | "daily" | "weekly") => void;
  onNavigateToAdvisor: (cropName: string) => void;
  currentTimeStr: string;
}

export const AgricultureModule: React.FC<AgricultureModuleProps> = ({
  crops,
  reminders,
  onAddCrop,
  onDeleteCrop,
  onWaterCrop,
  onFertilizeCrop,
  onAddReminder,
  onNavigateToAdvisor,
  currentTimeStr
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  
  // Crop form state
  const [cropName, setCropName] = useState("");
  const [cropType, setCropType] = useState<"tree" | "plant" | "seedbed">("plant");
  const [cropVariety, setCropVariety] = useState("");

  // Reminder form state
  const [remTitle, setRemTitle] = useState("");
  const [remDesc, setRemDesc] = useState("");
  const [remTime, setRemTime] = useState("");
  const [remRepeat, setRemRepeat] = useState<"none" | "daily" | "weekly">("daily");
  const [selectedCropIdForRem, setSelectedCropIdForRem] = useState("");

  // Calculate soil moisture mock level based on simulated hours passed since lastWatered
  const getCropMoisture = (crop: CropItem) => {
    try {
      const last = new Date(crop.lastWatered).getTime();
      const now = new Date(currentTimeStr).getTime();
      const diffHrs = (now - last) / (1000 * 60 * 60);
      
      const rate = crop.type === "seedbed" ? 8 : crop.type === "plant" ? 4 : 2; // seedbed dries fast
      const moisture = Math.max(0, Math.min(100, Math.round(100 - (diffHrs * rate))));
      return moisture;
    } catch {
      return 60;
    }
  };

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !cropVariety) return;
    onAddCrop({
      name: cropName,
      type: cropType,
      variety: cropVariety,
      plantedDate: currentTimeStr.substring(0, 10),
    });
    setCropName("");
    setCropVariety("");
    setShowAddForm(false);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle || !remTime) return;
    onAddReminder(
      "agriculture",
      remTitle,
      remDesc || `Reminder for Agriculture items`,
      remTime,
      remRepeat
    );
    setRemTitle("");
    setRemDesc("");
    setRemTime("");
    setShowReminderForm(false);
  };

  const autofillReminder = (crop: CropItem, type: "water" | "fertilizer") => {
    const timeOnly = currentTimeStr.split("T")[1]?.substring(0, 5) || "08:00";
    if (type === "water") {
      setRemTitle(`💧 Water ${crop.name}`);
      setRemDesc(`Provide fresh water to the ${crop.variety} (${crop.type}) immediately.`);
    } else {
      setRemTitle(`🌱 Fertilize ${crop.name}`);
      setRemDesc(`Provide balanced nutrient solution / organic manure on time.`);
    }
    setRemTime(timeOnly);
    setShowReminderForm(true);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 pb-8 text-zinc-100 bg-zinc-950 font-sans cursor-default">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-black text-emerald-400 flex items-center gap-2">
            <Sprout className="w-5 h-5" /> Module 1: Agriculture
          </h2>
          <p className="text-[11px] text-zinc-400">Tree, plants, and seeds on-time watering & nutrition</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => { setShowAddForm(!showAddForm); setShowReminderForm(false); }}
          className="flex items-center justify-center gap-1.5 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all font-sans"
        >
          <Plus className="w-4 h-4" /> Add Tree / Plant
        </button>
        <button
          type="button"
          onClick={() => { setShowReminderForm(!showReminderForm); setShowAddForm(false); }}
          className="flex items-center justify-center gap-1.5 p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all font-sans"
        >
          <Calendar className="w-4 h-4" /> Schedule Alarm
        </button>
      </div>

      {/* Add Crop Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateCrop} className="mb-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-2.5">
          <h3 className="font-bold text-zinc-200">Register Plant or Tree</h3>
          
          <div className="space-y-1">
            <label className="text-zinc-400">Plant / Crop Name (e.g. Rice, Mango Tree)</label>
            <input 
              required
              type="text" 
              value={cropName} 
              onChange={e => setCropName(e.target.value)}
              placeholder="e.g. Alphanso Mango Tree" 
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-zinc-400">Category</label>
              <select 
                value={cropType} 
                onChange={e => setCropType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-100"
              >
                <option value="plant">Plant</option>
                <option value="tree">Fruit Tree / Tree</option>
                <option value="seedbed">Seedbeds / Nursery</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400">Variety</label>
              <input 
                required
                type="text" 
                value={cropVariety} 
                onChange={e => setCropVariety(e.target.value)}
                placeholder="e.g. Alphanso" 
                className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-100"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-3 py-1.5 bg-emerald-600 border border-emerald-500 text-black font-bold rounded hover:bg-emerald-500"
            >
              Save Plant
            </button>
          </div>
        </form>
      )}

      {/* Add Reminder Form */}
      {showReminderForm && (
        <form onSubmit={handleCreateReminder} className="mb-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-2.5">
          <h3 className="font-bold text-amber-400">Setup Watering / Fertilizer Alarm</h3>

          <div className="space-y-1">
            <label className="text-zinc-400">Reminder Label / Action</label>
            <input 
              required
              type="text" 
              value={remTitle} 
              onChange={e => setRemTitle(e.target.value)}
              placeholder="e.g. 💧 Water Mango Tree orchard" 
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-100 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Short Note</label>
            <input 
              type="text" 
              value={remDesc} 
              onChange={e => setRemDesc(e.target.value)}
              placeholder="e.g. Provide 15 liters of drip irrigation" 
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-zinc-400">Scheduled Time</label>
              <input 
                required
                type="text" 
                value={remTime} 
                onChange={e => setRemTime(e.target.value)}
                placeholder="24h e.g. 08:30 or 17:00" 
                className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-100 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400">Repeat Frequency</label>
              <select 
                value={remRepeat} 
                onChange={e => setRemRepeat(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-100"
              >
                <option value="daily">Daily Schedule</option>
                <option value="weekly">Weekly Schedule</option>
                <option value="none">One-time Alert</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button 
              type="button" 
              onClick={() => setShowReminderForm(false)}
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-3 py-1.5 bg-amber-600 border border-amber-500 text-black font-semibold rounded hover:bg-amber-500"
            >
              Activate Alarm
            </button>
          </div>
        </form>
      )}

      {/* Main Agriculture list */}
      <div className="space-y-3 mb-5">
        <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">My Registered Lands & Crops</h3>
        {crops.length === 0 ? (
          <div className="text-center py-6 bg-zinc-900 border border-zinc-850 rounded-2xl text-xs text-zinc-500">
            🌳 No crops registered yet. Click on "Add Tree / Plant" above to register your crops, trees & seedlings!
          </div>
        ) : (
          crops.map(crop => {
            const moisture = getCropMoisture(crop);
            const needsWater = moisture < 40;
            return (
              <div 
                key={crop.id} 
                className={`p-3 bg-zinc-900/90 border rounded-2xl transition-all ${
                  needsWater ? "border-amber-500/50 bg-amber-500/5" : "border-zinc-800"
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-[14px] text-zinc-100 flex items-center gap-1.5">
                      <span className="text-emerald-400 text-xs py-0.5 px-2 bg-emerald-500/10 rounded font-mono border border-emerald-500/10 shrink-0">
                        {crop.type === "tree" ? "Tree" : crop.type === "seedbed" ? "Seedbed" : "Plant"}
                      </span>
                      {crop.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 leading-none">{crop.variety} • Planted {crop.plantedDate}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => onDeleteCrop(crop.id)}
                    className="text-zinc-600 hover:text-red-400 p-1 rounded"
                    title="Remove Crop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dryness Progress Bar */}
                <div className="mb-3 p-2 bg-zinc-950/80 rounded-xl border border-zinc-800/40">
                  <div className="flex justify-between items-center text-[10px] mb-1 font-mono">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-400" /> Soil Hydration
                    </span>
                    <span className={`font-bold ${needsWater ? "text-amber-400 animate-pulse" : "text-sky-400"}`}>
                      {moisture}% {needsWater ? "(Urgent Water)" : "(Ok)"}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        moisture > 60 ? "bg-sky-500" : moisture > 35 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${moisture}%` }}
                    ></div>
                  </div>
                </div>

                {/* Timers Row */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-zinc-950/40 rounded-xl p-2 border border-zinc-800/20 mb-3 font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Last Watered</span>
                    <span className="text-zinc-300 block font-semibold">{crop.lastWatered.split("T")[1]?.substring(0, 5) || "08:00 AM"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Last Fertilizer</span>
                    <span className="text-zinc-300 block font-semibold">{crop.lastFertilized.split("T")[1]?.substring(0, 5) || "Two days ago"}</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex gap-1.5 justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onWaterCrop(crop.id)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-sky-600/25 border border-sky-500/20 text-sky-300 rounded-lg hover:bg-sky-500 hover:text-black transition-all flex items-center gap-1"
                    >
                      🌱 Feed Water
                    </button>
                    <button
                      type="button"
                      onClick={() => onFertilizeCrop(crop.id)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600/25 border border-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1"
                    >
                      🧪 Manure / Fert
                    </button>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => autofillReminder(crop, "water")}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 hover:border-amber-500/50 border border-zinc-750 text-amber-400 rounded-lg"
                      title="Set quick timer alert"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToAdvisor(crop.name)}
                      className="px-2 py-1 text-[10px] font-medium bg-violet-600/15 border border-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-500 hover:text-white transition-all flex items-center gap-0.5"
                    >
                      <MessageSquare className="w-3 h-3" /> Chat Guru
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Helper Guidelines Card */}
      <div className="p-3.5 bg-zinc-900 border border-zinc-850 rounded-2xl relative overflow-hidden">
        <h4 className="text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1">
          <Leaf className="w-4 h-4 text-emerald-400" /> Professional Irrigation Schedulers
        </h4>
        <ul className="text-[10px] text-zinc-400 space-y-1 list-disc list-inside">
          <li>Trees (Mango/Coconut) require deep sub-soil watering every 7–10 days.</li>
          <li>Vegetables (Tomatoes/Paddy) need daily morning mist or low drippage.</li>
          <li>Seedbeds/Nursery require dual misting timers (8 AM and 5 PM) to stay green.</li>
          <li>Fertilize strictly on cooler hours; nitrogen is volatile under high noon heat.</li>
        </ul>
      </div>

    </div>
  );
};
