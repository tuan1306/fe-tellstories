"use client";
import { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon, CloudSun } from "lucide-react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getIconByHour = (hour: number) => {
    if (hour >= 5 && hour < 8) return <Sunrise className="text-orange-300" />;
    if (hour >= 8 && hour < 11) return <Sun className="text-yellow-400" />;
    if (hour >= 11 && hour < 14)
      return <CloudSun className="text-yellow-500" />;
    if (hour >= 14 && hour < 18) return <Sunset className="text-[#ffa527]" />;
    return <Moon className="text-blue-400" />;
  };

  return (
    <div className="text-white flex items-center gap-2">
      {getIconByHour(time.getHours())}
      {time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}
    </div>
  );
};

export default Clock;
