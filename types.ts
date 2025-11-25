export enum TravelStyle {
  Luxury = "Luxury",
  Budget = "Budget",
  Balanced = "Balanced",
  Adventure = "Adventure"
}

export interface TravelPreferences {
  destination: string[];
  duration: number;
  travelers: number;
  budget: TravelStyle;
  interests: string[];
  specialRequests?: string;
}

export interface Activity {
  time: string;
  description: string;
  location?: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  activities: Activity[];
  accommodation: string;
  meals: {
    lunch: string;
    dinner: string;
  };
}

export interface TravelItinerary {
  tripTitle: string;
  summary: string;
  days: DayPlan[];
}
