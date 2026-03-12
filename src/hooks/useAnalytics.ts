export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`[Analytics] Event: ${eventName}`, parameters);
    }
  };

  const trackPageView = (pageName: string) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`[Analytics] Page View: ${pageName}`);
    }
  };

  const trackWaitlistSignup = (email: string) => {
    trackEvent('waitlist_signup', {
      method: 'email',
      email_domain: email.split('@')[1],
    });
  };

  const trackAppStoreClick = (platform: 'ios' | 'android') => {
    trackEvent('app_store_click', {
      platform,
      source: 'website',
    });
  };

  const trackMaintainerLoginAttempt = () => {
    trackEvent('maintainer_login_attempt', {
      source: 'website',
    });
  };

  const trackAuthEvent = (action: string, method: string, success: boolean) => {
    trackEvent('auth_event', {
      action,
      method,
      success,
      source: 'website',
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackWaitlistSignup,
    trackAppStoreClick,
    trackMaintainerLoginAttempt,
    trackAuthEvent,
  };
};
