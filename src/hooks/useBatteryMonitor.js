import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';


export function useBatteryMonitor({
  threshold = 20,
  intervalMs = 60000,
  enabled = true,
} = { enabled: true }) {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [showLowBatteryAlert, setShowLowBatteryAlert] = useState(false);
  const hasShownAlertRef = useRef(false);

  const isLowBattery = batteryLevel !== null && batteryLevel <= threshold && batteryLevel > 0;

  const dismissAlert = useCallback(() => {
    setShowLowBatteryAlert(false);
    hasShownAlertRef.current = false;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let interval;

    const checkBattery = async () => {
      try {
        const level = await DeviceInfo.getBatteryLevel();
        const batteryPercent = level * 100;
        setBatteryLevel(batteryPercent);

        // Show alert if battery is below threshold and not already shown
        if (batteryPercent <= threshold && batteryPercent > 0 && !hasShownAlertRef.current) {
          hasShownAlertRef.current = true;
          setShowLowBatteryAlert(true);
          Alert.alert(
            'Low Battery Warning',
            `Your battery is at ${Math.round(batteryPercent)}%. Please charge your device to continue using the app.`,
            [
              {
                text: 'OK',
                onPress: dismissAlert,
              },
            ]
          );
        }
      } catch (error) {
        console.log('[Battery] Error checking battery level:', error);
      }
    };

    // Check immediately
    checkBattery();

    // Check periodically
    interval = setInterval(checkBattery, intervalMs);

    return () => clearInterval(interval);
  }, [enabled, threshold, intervalMs, dismissAlert]);

  return {
    batteryLevel,
    showLowBatteryAlert,
    dismissAlert,
    isLowBattery,
  };
}

export default useBatteryMonitor;
