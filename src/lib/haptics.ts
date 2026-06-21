/**
 * Native Android Haptics Interface
 * Emulates native Android OS touch response vibrations (Haptic Feedback) via HTML5 Vibrate API.
 * Makes any WebView or Web-To-App converted frame feel identical to a native Kotlin/Java app.
 */

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        // Standard Android light UI tap
        navigator.vibrate(12);
        break;
      case 'medium':
        // Confirmed selection haptic
        navigator.vibrate(30);
        break;
      case 'heavy':
        // Big item/score interaction haptic
        navigator.vibrate(60);
        break;
      case 'success':
        // Double success ring vibration code
        navigator.vibrate([15, 60, 20]);
        break;
      case 'error':
        // Quick triple fail alerts
        navigator.vibrate([45, 60, 45, 60, 45]);
        break;
      case 'warning':
        // Soft caution vibration
        navigator.vibrate([35, 100, 35]);
        break;
    }
  } catch (error) {
    console.debug('[Haptics] Device vibration bypassed:', error);
  }
};
