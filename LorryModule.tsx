export type ModuleType = "agriculture" | "livestock" | "harvest" | "lorry" | "bills" | "advisor";

export interface Reminder {
  id: string;
  moduleId: ModuleType;
  title: string;
  description: string;
  scheduledTime: string; // format: "YYYY-MM-DDTHH:mm" for specific date/time, or "HH:mm" for repeating
  repeat: "none" | "daily" | "weekly";
  completed: boolean;
  triggeredCount: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  moduleId: ModuleType;
  title: string;
  description: string;
  type: "success" | "warning" | "info";
}

// Module 1: Agriculture State
export interface CropItem {
  id: string;
  name: string;
  type: "tree" | "plant" | "seedbed";
  variety: string;
  plantedDate: string;
  status: "healthy" | "needs_water" | "harvest_ready" | "pest_alert";
  lastWatered: string;
  nextWatering: string;
  lastFertilized: string;
  nextFertilizer: string;
}

// Module 2: Livestock State
export interface LivestockItem {
  id: string;
  name: string;
  category: "cow" | "goat" | "hen";
  breed: string;
  count: number; // For hens, groups of animals
  status: "healthy" | "needs_feed" | "check_up" | "dry";
  lastFed: string;
  nextFeed: string;
  lastVaccinated?: string;
  nextVaccination?: string;
}

// Module 3: Harvest State & Market Sales
export interface HarvestItem {
  id: string;
  cropName: string;
  quantity: string; // e.g. "150 kg", "10 crates"
  harvestDate: string;
  sellDeadline: string; // Veggies must be sold on time
  marketName: string;
  targetPricePerUnit: string;
  status: "stored" | "transporting" | "sold" | "spoiled";
}

// Module 4: Water Lorry State
export interface WaterLorryRental {
  id: string;
  customerName: string;
  customerPhone: string;
  capacityLiters: number;
  rentAmount: number;
  startTime: string; // YYYY-MM-DDTHH:mm
  endTime: string;   // YYYY-MM-DDTHH:mm
  status: "scheduled" | "active" | "returned" | "overdue";
  notes?: string;
}

// Module 5: Family Time & Utility Bills
export interface Bill {
  id: string;
  name: string;
  category: "school_fees" | "eb_bill" | "wifi_bill" | "appliance_emi" | "other";
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: "pending" | "paid" | "overdue";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
