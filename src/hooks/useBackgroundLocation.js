import { useEffect, useRef } from 'react';
import { changeLocationController } from '../MVC/controllers/driverStatusController';


export function useBackgroundLocation(location, isOnline, intervalMs = 60000) {
  const locationRef = useRef(location);

  // Keep ref updated with latest location
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    let interval;

    const updateLocation = async () => {
      if (!isOnline || !locationRef.current?.latitude || !locationRef.current?.longitude) {
        return;
      }

      const payload = {
        current_latitude: locationRef.current.latitude.toString(),
        current_longitude: locationRef.current.longitude.toString(),
      };

      try {
        await changeLocationController({
          payload,
          onLocationUpdate: (updatedData) => {
            console.log('[Location] Updated on server:', updatedData);
          },
        });
      } catch (error) {
        console.log('[Location] Update failed:', error);
      }
    };

    if (isOnline) {
      interval = setInterval(updateLocation, intervalMs);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOnline, intervalMs]);
}

export default useBackgroundLocation;
