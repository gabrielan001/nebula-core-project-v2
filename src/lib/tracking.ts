// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = window.dataLayer || [];
}

type EventProperties = {
  [key: string]: any;
  event_category?: string;
  event_label?: string;
  value?: number;
};

/**
 * Pushes an event to the dataLayer
 */
export const trackEvent = (eventName: string, properties: EventProperties = {}) => {
  if (typeof window === 'undefined') return;
  
  const eventData = {
    event: eventName,
    ...properties,
    timestamp: new Date().toISOString(),
  };

  window.dataLayer.push(eventData);
};

/**
 * Tracks page views
 */
export const trackPageView = (pageTitle: string, pagePath: string) => {
  trackEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: window.location.href,
  });
};

/**
 * Tracks form submissions
 */
export const trackFormSubmit = (formName: string, formData: Record<string, any> = {}) => {
  trackEvent('form_submit', {
    event_category: 'form',
    event_label: formName,
    form_data: formData,
  });
};

/**
 * Tracks user signup
 */
export const trackSignup = (method: string, properties: EventProperties = {}) => {
  trackEvent('signup_completed', {
    event_category: 'engagement',
    event_label: method,
    ...properties,
  });
};

/**
 * Tracks e-commerce events
 */
export const trackPurchase = (transactionData: {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  trackEvent('purchase_completed', {
    event_category: 'ecommerce',
    ...transactionData,
  });
};
