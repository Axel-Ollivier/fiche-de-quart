import { Card, CardContent } from "./components/ui/card";
import { useEffect, useState } from "react";
import Settings from "./components/Settings";

// Default quarts configuration
const defaultQuarts = [
  { name: "Quart Alpha", time: "06h00 – 08h30", start: 360, end: 510, color: "bg-red-900", hexColor: "#7f1d1d", description: "Réveil, préparation, calme" },
  { name: "Quart Bravo", time: "08h30 – 12h00", start: 510, end: 720, color: "bg-gray-300 text-black", hexColor: "#d1d5db", description: "Exécution, focus total" },
  { name: "Quart Charlie", time: "12h00 – 13h00", start: 720, end: 780, color: "bg-blue-900", hexColor: "#1e3a8a", description: "Pause, récupération" },
  { name: "Quart Delta", time: "13h00 – 17h00", start: 780, end: 1020, color: "bg-gray-300 text-black", hexColor: "#d1d5db", description: "Reprise offensive, clarté" },
  { name: "Quart Echo", time: "17h00 – 20h00", start: 1020, end: 1200, color: "bg-amber-800", hexColor: "#92400e", description: "Décompression, analyse" },
  { name: "Quart Foxtrot", time: "20h00 – 23h00", start: 1200, end: 1380, color: "bg-red-800", hexColor: "#991b1b", description: "Travail calme, création" },
  { name: "Quart Silence", time: "23h00 – 06h00", start: 1380, end: 360, color: "bg-black", hexColor: "#000000", description: "Repos, silence total" },
];

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// Format time display (HHhMM – HHhMM)
function formatDisplayTime(start, end) {
  const startHours = Math.floor(start / 60);
  const startMins = start % 60;
  const endHours = Math.floor(end / 60);
  const endMins = end % 60;
  
  return `${startHours.toString().padStart(2, '0')}h${startMins.toString().padStart(2, '0')} – ${endHours.toString().padStart(2, '0')}h${endMins.toString().padStart(2, '0')}`;
}

function getCurrentIndex(quartsData) {
  const currentMinutes = getCurrentMinutes();
  return quartsData.findIndex(({ start, end }) => {
    if (start < end) return currentMinutes >= start && currentMinutes < end;
    else return currentMinutes >= start || currentMinutes < end;
  });
}

function getProgress(current) {
  const now = getCurrentMinutes();
  const start = current.start;
  const end = current.end > start ? current.end : current.end + 1440;
  const minutesPassed = (now >= start ? now : now + 1440) - start;
  const total = end - start;
  return Math.min(100, (minutesPassed / total) * 100);
}

export default function Dashboard() {
  const [quarts, setQuarts] = useState(defaultQuarts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Initialize and update current quart index
  useEffect(() => {
    const index = getCurrentIndex(quarts);
    setCurrentIndex(index);
    setProgress(getProgress(quarts[index]));
  }, [quarts]);

  // Update quart index and progress at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      const index = getCurrentIndex(quarts);
      setCurrentIndex(index);
      setProgress(getProgress(quarts[index]));
    }, 10000); // update every 10 seconds
    
    return () => clearInterval(interval);
  }, [quarts]);

  // Track user activity
  useEffect(() => {
    let activityTimeout;
    
    const handleActivity = () => {
      // Clear any existing timeout
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
      
      // Set user as active immediately
      setIsUserActive(true);
      setLastActivity(Date.now());
      
      // Set a new timeout to hide after inactivity
      activityTimeout = setTimeout(() => {
        setIsUserActive(false);
      }, 10000);
    };
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    // Initial activity trigger
    handleActivity();
    
    return () => {
      // Clean up event listeners and timeout
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
    };
  }, []);

  const handleUpdateQuarts = (newQuarts) => {
    // Map existing Tailwind color classes to hex colors for backwards compatibility
    const colorToHex = {
      'bg-red-900': '#7f1d1d',
      'bg-gray-300': '#d1d5db',
      'bg-blue-900': '#1e3a8a',
      'bg-amber-800': '#92400e',
      'bg-black': '#000000',
      'bg-green-800': '#166534',
      'bg-purple-900': '#581c87',
      'bg-teal-800': '#115e59',
      'bg-red-800': '#991b1b'
    };
    
    // Make sure each quart has its time display string properly formatted
    // and has hexColor if it's missing
    const formattedQuarts = newQuarts.map(quart => {
      // Get the base color class without text color
      const baseColor = quart.color.split(' ')[0];
      
      // If no hexColor but we have a mapping for it
      if (!quart.hexColor && colorToHex[baseColor]) {
        return {
          ...quart,
          time: formatDisplayTime(quart.start, quart.end),
          hexColor: colorToHex[baseColor]
        };
      }
      
      return {
        ...quart,
        time: formatDisplayTime(quart.start, quart.end)
      };
    });
    
    setQuarts(formattedQuarts);
  };

  const current = quarts[currentIndex];

  const getVisibleQuarts = () => {
    const total = quarts.length;
    const indices = [];
    for (let i = -3; i <= 3; i++) {
      indices.push((currentIndex + i + total) % total);
    }
    return indices.map((i, index) => {
      const distance = Math.abs(index - 3);
      return { ...quarts[i], opacity: 1 - distance * 0.25 };
    });
  };

  const ITEM_HEIGHT_REM = 4;
  const VISIBLE_ITEMS = 7;
  const TOTAL_HEIGHT_REM = ITEM_HEIGHT_REM * VISIBLE_ITEMS;
  const progressOffsetRem = (progress / 100) * ITEM_HEIGHT_REM;
  const offsetY = (TOTAL_HEIGHT_REM / 2) - (ITEM_HEIGHT_REM * 3) - progressOffsetRem;

  // Helper function to determine whether to use inline styles for custom colors
  const getColorStyles = (colorClass) => {
    if (colorClass && colorClass.startsWith('bg-[')) {
      // Extract hex value from bg-[#xxxxxx]
      const hexMatch = colorClass.match(/bg-\[(#[0-9A-Fa-f]{6})\]/);
      if (hexMatch && hexMatch[1]) {
        return { backgroundColor: hexMatch[1] };
      }
    }
    return {};
  };

  return (
    <div 
      className={`h-screen w-screen p-4 flex ${current.color} text-white transition-colors duration-500`}
      style={getColorStyles(current.color)}
    > 
      <Settings visible={isUserActive} onUpdateQuarts={handleUpdateQuarts} />
      
      <div className="w-1/3 overflow-hidden pr-4 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white opacity-30 z-10 transform -translate-y-1/2" />
        <div className="relative h-full flex items-center">
          <div
            className="flex flex-col transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateY(${offsetY}rem)` }}
          >
            {getVisibleQuarts().map((quart, i) => {
              const relativeIndex = i - 3;
              const isCurrent = relativeIndex === 0;
              const isPrevOrNext = Math.abs(relativeIndex) === 1;
              const baseStyle = isCurrent
                ? 'bg-white text-black font-bold z-20'
                : isPrevOrNext
                ? 'bg-white bg-opacity-20'
                : 'bg-white bg-opacity-10';

              return (
                <div
                  key={`${quart.name}-${i}`}
                  className={`p-2 my-1 rounded transition-all duration-300 ${baseStyle}`}
                  style={{
                    minHeight: `${ITEM_HEIGHT_REM}rem`,
                    opacity: quart.opacity,
                    transition: 'opacity 0.5s ease-in-out',
                  }}
                >
                  <div className="text-sm uppercase tracking-wide z-10 relative">{quart.name}</div>
                  <div className="text-xs italic z-10 relative">{quart.time}</div>
                  {quart.color.includes('text-black') && (
                    <div className="absolute inset-0 bg-black opacity-0 z-5"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-2/3 flex flex-col justify-center items-center">
        <Card className="bg-opacity-0 border-none">
          <CardContent className="text-center">
            <h1 className="text-5xl font-bold uppercase tracking-wide mb-2">{current.name}</h1>
            <h2 className="text-2xl mb-2">{current.time}</h2>
            <p className="text-lg opacity-90 mb-4">{current.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
