import { useState, useEffect } from "react";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";

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

// Available colors for quarts
const availableColors = [
  { name: "Red", value: "bg-red-900", hex: "#7f1d1d" },
  { name: "Light Gray", value: "bg-gray-300", hex: "#d1d5db" },
  { name: "Blue", value: "bg-blue-900", hex: "#1e3a8a" },
  { name: "Amber", value: "bg-amber-800", hex: "#92400e" },
  { name: "Black", value: "bg-black", hex: "#000000" },
  { name: "Green", value: "bg-green-800", hex: "#166534" },
  { name: "Purple", value: "bg-purple-900", hex: "#581c87" },
  { name: "Teal", value: "bg-teal-800", hex: "#115e59" },
];

// Function to determine if text should be black based on background color brightness
function isDarkColor(hexColor) {
  // Remove # if present
  hexColor = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate perceived brightness using the formula: (R*299 + G*587 + B*114) / 1000
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if the color is dark (brightness < 128)
  return brightness < 128;
}

// Function to check if a string is a valid hex color
function isValidHexColor(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

// Convert HH:MM format to minutes
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to HH:MM format
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Convert minutes to formatted display time
function formatDisplayTime(start, end) {
  const startHours = Math.floor(start / 60);
  const startMins = start % 60;
  const endHours = Math.floor(end / 60);
  const endMins = end % 60;
  
  return `${startHours.toString().padStart(2, '0')}h${startMins.toString().padStart(2, '0')} – ${endHours.toString().padStart(2, '0')}h${endMins.toString().padStart(2, '0')}`;
}

export default function Settings({ visible, onUpdateQuarts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedQuarts, setEditedQuarts] = useState([]);
  const [isVisible, setIsVisible] = useState(visible);
  
  // Track visibility based on props and hover
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  // Load quarts from localStorage on component mount
  useEffect(() => {
    const savedQuarts = localStorage.getItem('quarts');
    if (savedQuarts) {
      try {
        onUpdateQuarts(JSON.parse(savedQuarts));
      } catch (e) {
        console.error('Failed to parse saved quarts:', e);
      }
    }
  }, []);

  const openModal = () => {
    // Get current quarts from props for editing
    const savedQuarts = localStorage.getItem('quarts');
    if (savedQuarts) {
      try {
        setEditedQuarts(JSON.parse(savedQuarts));
      } catch (e) {
        setEditedQuarts(defaultQuarts);
      }
    } else {
      setEditedQuarts(defaultQuarts);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsVisible(true); // Make sure icon is visible when closing settings
  };

  const handleSave = () => {
    // Validate quarts before saving
    // Sort by start time for consistency
    const sortedQuarts = [...editedQuarts].sort((a, b) => a.start - b.start);
    localStorage.setItem('quarts', JSON.stringify(sortedQuarts));
    onUpdateQuarts(sortedQuarts);
    closeModal();
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default configuration?")) {
      setEditedQuarts([...defaultQuarts]);
      localStorage.setItem('quarts', JSON.stringify(defaultQuarts));
      onUpdateQuarts(defaultQuarts);
      closeModal();
    }
  };

  const updateQuart = (index, field, value) => {
    const updated = [...editedQuarts];
    
    // Handle hexColor update and set color class accordingly
    if (field === 'hexColor') {
      if (isValidHexColor(value)) {
        // Add text-black class if the color is light
        const textClass = isDarkColor(value) ? '' : ' text-black';
        updated[index] = { 
          ...updated[index], 
          color: `bg-[${value}]${textClass}`,
          hexColor: value 
        };
      } else {
        // Just update the hex field but don't change the color class
        updated[index] = { ...updated[index], hexColor: value };
      }
    }
    // Special handling for color dropdown updates
    else if (field === 'color') {
      if (value.startsWith('#')) {
        // This is a hex color update
        if (isValidHexColor(value)) {
          // Add text-black class if the color is light
          const textClass = isDarkColor(value) ? '' : ' text-black';
          updated[index] = { 
            ...updated[index], 
            color: `bg-[${value}]${textClass}`,
            hexColor: value 
          };
        }
      } else {
        // This is a preset color update
        const selectedColor = availableColors.find(c => c.value === value || c.value === value.split(' ')[0]);
        if (selectedColor) {
          // Check if we need a light text variant
          const textClass = selectedColor.value.includes('text-black') ? ' text-black' : '';
          updated[index] = { 
            ...updated[index], 
            color: `${selectedColor.value.split(' ')[0]}${textClass}`,
            hexColor: selectedColor.hex
          };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
      }
    } else {
      // Normal field update
      updated[index] = { ...updated[index], [field]: value };
    }
    
    setEditedQuarts(updated);
  };

  const handleTimeChange = (index, field, timeStr) => {
    // Convert time string (HH:MM) to minutes for internal storage
    const minutes = timeToMinutes(timeStr);
    
    // Update the time field when start or end changes
    const quart = editedQuarts[index];
    const updatedQuart = { ...quart, [field]: minutes };
    
    // Also update the time display string
    if (field === 'start' || field === 'end') {
      updatedQuart.time = formatDisplayTime(
        field === 'start' ? minutes : quart.start,
        field === 'end' ? minutes : quart.end
      );
    }
    
    const updated = [...editedQuarts];
    updated[index] = updatedQuart;
    setEditedQuarts(updated);
  };

  const addQuart = () => {
    // Find a reasonable default time slot (30 min after the last quart's start)
    const lastQuart = editedQuarts[editedQuarts.length - 1];
    const newStart = (lastQuart.start + 30) % 1440; // Wrap around 24 hours
    const newEnd = (newStart + 60) % 1440; // Default 1 hour duration
    
    // Default color (blue)
    const defaultColor = availableColors.find(c => c.value === "bg-blue-900");
    
    const newQuart = {
      name: `Quart ${editedQuarts.length + 1}`,
      time: formatDisplayTime(newStart, newEnd),
      start: newStart,
      end: newEnd,
      color: "bg-blue-900",
      hexColor: defaultColor ? defaultColor.hex : "#1e3a8a",
      description: "New quart"
    };
    
    setEditedQuarts([...editedQuarts, newQuart]);
  };

  const removeQuart = (index) => {
    if (editedQuarts.length <= 1) {
      alert("You must have at least one quart");
      return;
    }
    
    const updated = [...editedQuarts];
    updated.splice(index, 1);
    setEditedQuarts(updated);
  };

  return (
    <>
      <div 
        className={`fixed top-4 right-4 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button 
          onClick={openModal}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Quarts Settings">
        <div className="space-y-6">
          <div className="flex justify-between mb-4">
            <Button onClick={addQuart} variant="primary">Add Quart</Button>
            <Button onClick={handleReset} variant="danger">Reset to Default</Button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {editedQuarts.map((quart, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{quart.name}</h3>
                  <Button 
                    onClick={() => removeQuart(index)} 
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 px-2 py-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={quart.name}
                      onChange={(e) => updateQuart(index, 'name', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Color</label>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                      <select
                        value={availableColors.some(c => c.hex === quart.hexColor) ? 
                          availableColors.find(c => c.hex === quart.hexColor).value : ""}
                        onChange={(e) => {
                          const selectedColor = availableColors.find(c => c.value === e.target.value);
                          if (selectedColor) {
                            updateQuart(index, 'color', selectedColor.value);
                            updateQuart(index, 'hexColor', selectedColor.hex);
                          }
                        }}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Custom...</option>
                        {availableColors.map((color) => (
                          <option key={color.value} value={color.value}>{color.name}</option>
                        ))}
                      </select>
                      
                      <div className="flex items-center">
                        <input
                          type="color"
                          value={quart.hexColor || '#000000'}
                          onChange={(e) => updateQuart(index, 'hexColor', e.target.value)}
                          className="w-8 h-8 rounded border border-gray-500 cursor-pointer p-0"
                          title="Choisir une couleur personnalisée"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={minutesToTime(quart.start)}
                      onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">End Time</label>
                    <input
                      type="time"
                      value={minutesToTime(quart.end)}
                      onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={quart.description}
                    onChange={(e) => updateQuart(index, 'description', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    rows="2"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
            <Button onClick={closeModal} variant="secondary">Cancel</Button>
            <Button onClick={handleSave} variant="primary">Save Changes</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}