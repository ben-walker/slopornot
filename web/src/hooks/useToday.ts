import { format, startOfTomorrow } from "date-fns";
import { useEffect, useState } from "react";

function useToday() {
  const [today, setToday] = useState(() => format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    const msUntilMidnight = startOfTomorrow().getTime() - Date.now();

    const timeout = setTimeout(() => {
      setToday(format(new Date(), "yyyy-MM-dd"));
    }, msUntilMidnight + 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [today]);

  return today;
}

export { useToday };
