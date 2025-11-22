interface UserProperties {
  id?: string;
  email?: string;
  role?: string;
  // Add other user properties as needed
}

interface PageViewEvent {
  event: 'page_view';
  page_title: string;
  page_path: string;
  page_location: string;
  user?: UserProperties;
  timestamp: string;
}

interface GoalEvent {
  event: string; // e.g., 'signup_completed', 'purchase_completed'
  event_category: string;
  event_label?: string;
  value?: number;
  user?: UserProperties;
  timestamp: string;
  // Add any additional properties specific to the goal
  [key: string]: any;
}

type DataLayerEvent = PageViewEvent | GoalEvent;

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}
