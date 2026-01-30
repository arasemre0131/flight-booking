// Filter Model for Search Results

export type SeatClass = 'economy' | 'business' | 'first';

export interface TimeRange {
  start: string;
  end: string;
  label: string;
}

export interface FilterState {
  maxPrice: number | null;
  stops: number | null;
  departureTimeRange: TimeRange | null;
  arrivalTimeRange: TimeRange | null;
  airlines: string[];
  seatClass: SeatClass | null;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  maxPrice: null,
  stops: null,
  departureTimeRange: null,
  arrivalTimeRange: null,
  airlines: [],
  seatClass: null
};

export const TIME_RANGES: TimeRange[] = [
  { start: '00:00', end: '06:00', label: 'Early morning (12am-6am)' },
  { start: '06:00', end: '12:00', label: 'Morning (6am-12pm)' },
  { start: '12:00', end: '18:00', label: 'Afternoon (12pm-6pm)' },
  { start: '18:00', end: '24:00', label: 'Evening (6pm-12am)' }
];

export interface StopOption {
  value: number | null;
  label: string;
}

export const STOPS_OPTIONS: StopOption[] = [
  { value: null, label: 'Any number of stops' },
  { value: 0, label: 'Nonstop only' },
  { value: 1, label: '1 stop or fewer' },
  { value: 2, label: '2 stops or fewer' }
];
