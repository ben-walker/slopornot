import { intervalToDuration, startOfTomorrow } from "date-fns";
import { useEffect, useState } from "react";

function useTimeUntilMidnight() {
  const [duration, setDuration] = useState(() => (
    intervalToDuration({ start: new Date(), end: startOfTomorrow() })
  ));

  useEffect(() => {
    const interval = setInterval(() => {
      const newDuration = intervalToDuration({ start: new Date(), end: startOfTomorrow() });

      setDuration(newDuration);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const hours = String(duration.hours ?? 0).padStart(2, "0");
  const minutes = String(duration.minutes ?? 0).padStart(2, "0");
  const seconds = String(duration.seconds ?? 0).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export { useTimeUntilMidnight };
