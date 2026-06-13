import React, { useState } from "react";
import { Beef, MessageSquare, Plus, Calendar, Coins, History, Heart, Trash2 } from "lucide-react";
import { LivestockItem, Reminder } from "../types";

interface LivestockModuleProps {
  animals: LivestockItem[];
  reminders: Reminder[];
  onAddAnimal: (animal: Omit<LivestockItem, "id" | "status" | "lastFed" | "nextFeed">) => void;
  onDeleteAnimal: (id: string) => void;
  onFeedAnimal: (id: string) => void;
  onAddReminder: (moduleId: "livestock", title: string, desc: string, time: string, repeat: "none" | "daily" | "weekly") => void;
  onNavigateToAdvisor: (animalCategory: string) => void;
  currentTimeStr: string;
}

export const LivestockModule: React.FC<LivestockModuleProps> = ({
  animals,
  reminders,
  onAddAnimal,
  onDeleteAnimal,
  onFeedAnimal,
  onAddReminder,
  onNavigateToAdvisor,
  currentTimeStr
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Form states
  const [animalName, setAnimalName] = useState("");
  const [animalCategory, setAnimalCategory] = useState<"cow" | "goat" | "hen">("cow");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalCount, setAnimalCount] = useState(1);

  // Reminder states
  const [remTitle, setRemTitle] = useState("");
  const [remDesc, setRemDesc] = useState("");
  const [remTime, setRemTime] = useState("");
  const [remRepeat, setRemRepeat] = useState<"none" | "daily" | "weekly">("daily");

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalName || !animalBreed) return;
    onAddAnimal({
      name: animalName,
      category: animalCategory,
      breed: animalBreed,
      count: Number(animalCount),
    });
    setAnimalName("");
    setAnimalBreed("");
    setAnimalCount(1);
    setShowAddForm(false);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle || !remTime) return;
    onAddReminder(
      "livestock",
      remTitle,
      remDesc || `Livestock care reminder`,
      remTime,
      remRepeat
    );
    setRemTitle("");
    setRemDesc("");
    setRemTime("");
    setShowReminderForm(false);
  };

  const getLivestockFeedingStatus = (animal: LivestockItem) => {
    try {
      const last = new Date(animal.lastFed).getTime();
      const now = new Date(currentTimeStr).getTime();
      const diffHrs = (now - last) / (1000 * 60 * 60);

      // Cows need feed every 6 hours, goats 8 hours, hens 4 hours (active hours)
      const feedLimit = animal.category === "hen" ? 4 : animal.category === "cow" ? 6 : 8;
      const statusLevel = Math.max(0, Math.min(100, Math.round(100 - (diffHrs / feedLimit * 100))));
      return statusLevel;
    } catch {
      return 70;
    }
  };

  const autofillReminder = (animal: LivestockItem, task: "feed" | "vaccination") => {
    const timeOnly = currentTimeStr.split("T")[1]?.substring(0, 5) || "07:00";
    if (task === "feed") {
      setRemTitle(`🌾 Feed ${animal.name} (${animal.category})`);
      setRemDesc(`Provide fodder and clean drink water for animal yard.`);
    } else {
      setRemTitle(`💉 Vaccine checklist: ${animal.name}`);
      setRemDesc(`Veterinary vaccine schedule check for ${animal.breed}.`);
    }
    setRemTime(timeOnly);
    setShowReminderForm(true);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 pb-8 text-zinc-100 bg-zinc-950 font-sans cursor-default">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-black text-amber-500 flex items-center gap-2">
            <Beef className="w-5 h-5 animate-pulse" /> Module 2: Livestock Care
          </h2>
          <p className="text-[11px] text-zinc-400">Manage Feed, cool water, and vaccine rosters for animals</p>
        </div>
      </div>

      {/* Buttons Block */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => { setShowAddForm(!showAddForm); setShowReminderForm(false); }}
          className="flex items-center justify-center gap-1.5 p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs font-bold hover:bg-amber-500/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Livestock / Pen
        </button>
        <button
          type="button"
          onClick={() => { setShowReminderForm(!showReminderForm); setShowAddForm(false); }}
          className="flex items-center justify-center gap-1.5 p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl text-xs font-bold hover:bg-sky-500/25 transition-all"
        >
          <Calendar className="w-4 h-4" /> Feed or Vet Timer
        </button>
      </div>

      {/* Form: Add Animal */}
      {showAddForm && (
        <form onSubmit={handleCreateAnimal} className="mb-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-2.5">
          <h3 className="font-bold text-zinc-200">Register Domestic Animals</h3>

          <div className="space-y-1">
            <label className="text-zinc-400">Animal Custom Name / Pen Name</label>
            <input 
              required
              type="text" 
              value={animalName}
              onChange={e => setAnimalName(e.target.value)}
              placeholder="e.g. Ganga (My Dairy Cow) or Hen Pen B" 
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1 col-span-1">
              <label className="text-zinc-400">Species</label>
              <select 
                value={animalCategory}
                onChange={e => setAnimalCategory(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-200"
              >
                <option value="cow">🐄 Cow</option>
                <option value="goat">🐐 Goat</option>
                <option value="hen">🐓 Hen</option>
              </select>
            </div>
            <div className="space-y-1 col-span-1">
              <label className="text-zinc-400">Breed / Variety</label>
              <input 
                required
                type="text" 
                value={animalBreed}
                onChange={e => setAnimalBreed(e.target.value)}
                placeholder="e.g. Holstein / Gir" 
                className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-200"
              />
            </div>
            <div className="space-y-1 col-span-1">
              <label className="text-zinc-400">Count / Heads</label>
              <input 
                required
                type="number" 
                min={1}
                value={animalCount}
                onChange={e => setAnimalCount(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-200 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-3 py-1.5 bg-amber-600 border border-amber-500 text-black font-bold rounded hover:bg-amber-500"
            >
              Save Registry
            </button>
          </div>
        </form>
      )}

      {/* Form: Add Reminder Alarm */}
      {showReminderForm && (
        <form onSubmit={handleCreateReminder} className="mb-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-2.5">
          <h3 className="font-bold text-sky-400">Setup Feed or vaccine reminder</h3>

          <div className="space-y-1">
            <label className="text-zinc-400">Alarm Alert Title</label>
            <input 
              required
              type="text" 
              value={remTitle} 
              onChange={e => setRemTitle(e.target.value)}
              placeholder="e.g. 🌾 Feed Cows green clover grass" 
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-100 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Description</label>
            <input 
              type="text" 
              value={remDesc} 
              onChange={e => setRemDesc(e.target.value)}
              placeholder="e.g. Refill water troughs and distribute clover" 
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-zinc-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-zinc-400">Alarm Time</label>
              <input 
                required
                type="text" 
                value={remTime} 
                onChange={e => setRemTime(e.target.value)}
                placeholder="24h e.g. 06:15 or 16:30" 
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
                <option value="daily">Daily feed schedule</option>
                <option value="weekly">Weekly vaccinations check</option>
                <option value="none">Once only</option>
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
              className="px-3 py-1.5 bg-sky-600 border border-sky-500 text-black font-semibold rounded hover:bg-sky-500"
            >
              Activate Alarm
            </button>
          </div>
        </form>
      )}

      {/* Animals Display list */}
      <div className="space-y-3 mb-5">
        <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">My Livestock Roster</h3>
        {animals.length === 0 ? (
          <div className="text-center py-6 bg-zinc-900 border border-zinc-850 rounded-2xl text-xs text-zinc-500">
            🐄 No registered domestic animals. Click on "Add Livestock / Pen" to register cows, goats, or hen sets.
          </div>
        ) : (
          animals.map(animal => {
            const indexValue = getLivestockFeedingStatus(animal);
            const animalNeedsFeed = indexValue < 40;
            return (
              <div 
                key={animal.id} 
                className={`p-3 bg-zinc-900/95 border rounded-2xl transition-all ${
                  animalNeedsFeed ? "border-amber-500/50 bg-amber-500/5" : "border-zinc-800"
                }`}
              >
                {/* Header Row */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-[14px] text-zinc-100 flex items-center gap-1.5">
                      <span className="text-amber-500 text-xs py-0.5 px-2 bg-amber-500/10 rounded font-mono border border-amber-500/10 shrink-0">
                        {animal.category === "cow" ? "🐄 Cow" : animal.category === "goat" ? "🐐 Goat" : "🐓 Hen"}
                      </span>
                      {animal.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 leading-none">
                      {animal.breed} Breed • {animal.count} Heads registered
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => onDeleteAnimal(animal.id)}
                    className="text-zinc-650 hover:text-red-400 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Satiety bar */}
                <div className="mb-2.5 p-2 bg-zinc-950/80 rounded-xl border border-zinc-800/40">
                  <div className="flex justify-between items-center text-[10px] mb-1 font-mono">
                    <span className="text-zinc-400 flex items-center gap-1">
                      🌾 Feeding Status
                    </span>
                    <span className={`font-bold ${animalNeedsFeed ? "text-amber-400 animate-pulse" : "text-amber-500"}`}>
                      {indexValue}% {animalNeedsFeed ? "(Needs fodder)" : "(Fed)"}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        indexValue > 60 ? "bg-amber-500" : indexValue > 30 ? "bg-amber-600" : "bg-red-500"
                      }`}
                      style={{ width: `${indexValue}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time stamps */}
                <div className="mb-2.5 text-[9px] text-zinc-500 font-mono flex gap-3">
                  <span>🍼 Last Handled: <span className="text-zinc-300 font-semibold">{animal.lastFed.split("T")[1]?.substring(0, 5) || "06:00"}</span></span>
                  <span>🦠 Health Status: <span className="text-emerald-400 font-bold">Vaccinated</span></span>
                </div>

                {/* Quick feed button */}
                <div className="flex gap-1.5 justify-between">
                  <button
                    type="button"
                    onClick={() => onFeedAnimal(animal.id)}
                    className="flex-1 py-1 px-3 bg-amber-600/25 border border-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500 hover:text-black text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1"
                  >
                    🌾 Refill Feed / Fresh Water
                  </button>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => autofillReminder(animal, "feed")}
                      className="p-1 text-amber-400 hover:bg-zinc-800 border border-zinc-750 bg-zinc-900 rounded-lg shrink-0"
                      title="Set quick timer alert"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToAdvisor(animal.category)}
                      className="p-1 px-2 text-violet-300 hover:bg-zinc-800 border border-zinc-750 bg-zinc-900 rounded-lg text-[10px] flex items-center gap-0.5 shrink-0 font-medium"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Advisor
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Tips section */}
      <div className="p-3.5 bg-zinc-900 border border-zinc-850 rounded-2xl relative overflow-hidden">
        <h4 className="text-xs font-bold text-zinc-200 mb-1 flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-400" /> Veterinary Care Guidelines
        </h4>
        <ul className="text-[10px] text-zinc-400 space-y-1 list-disc list-inside">
          <li>Cows require clean drinking water free of algae to boost dairy milking yield.</li>
          <li>Goats digest coarse fields well, but need dry shed environments.</li>
          <li>Chickens (Hens) must have feeding alarms at light-break (6 AM) for laying.</li>
          <li>Do de-worming and vaccination checkups every quarter for protection.</li>
        </ul>
      </div>

    </div>
  );
};
