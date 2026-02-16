import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Variable {
  name: string;
  type: string;
  description?: string;
  nested?: Array<{ path: string; description: string }>;
  source?: 'system' | 'http' | 'input';
  hasData?: boolean;
}

interface VariableAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  flowId?: string;
}

const VariableAutocomplete: React.FC<VariableAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  className,
  rows = 4,
  flowId
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredVariables, setFilteredVariables] = useState<Variable[]>([]);
  const [allVariables, setAllVariables] = useState<Variable[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch variables from API when flowId changes
  useEffect(() => {
    const fetchVariables = async () => {
      // System variables - always show these
      const systemVariables: Variable[] = [
        { name: 'phone_number', type: 'string', description: 'User phone number', source: 'system', hasData: true },
        { name: 'customer_name', type: 'string', description: 'Customer name', source: 'system', hasData: true },
        { name: 'email', type: 'string', description: 'Email address', source: 'system', hasData: true }
      ];

      if (!flowId) {
        setAllVariables(systemVariables);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/flows/${flowId}/variables`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          const variables = response.data.data.variables || [];
          
          // Flatten nested variables and mark custom variables
          const customVariables: Variable[] = [];
          variables.forEach((v: Variable) => {
            // Skip system variables from API (we already have them)
            if (v.source === 'system') return;
            
            // Add the main variable (mark as hasData: false for custom vars - will be updated at runtime)
            customVariables.push({
              ...v,
              hasData: false // Custom variables don't have data until HTTP node executes
            });
            
            if (v.nested) {
              v.nested.forEach(nested => {
                customVariables.push({
                  name: nested.path,
                  type: 'any',
                  description: nested.description,
                  source: v.source,
                  hasData: false
                });
              });
            }
          });
          
          // Combine system variables + custom variables
          setAllVariables([...systemVariables, ...customVariables]);
        }
      } catch (error) {
        console.error('Error fetching variables:', error);
        // Fallback to system variables only
        setAllVariables(systemVariables);
      }
    };

    fetchVariables();
  }, [flowId]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleInput = () => {
      const cursorPos = textarea.selectionStart;
      setCursorPosition(cursorPos);

      // Check if user typed {{
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastOpenBraces = textBeforeCursor.lastIndexOf('{{');
      const lastCloseBraces = textBeforeCursor.lastIndexOf('}}');

      // Show suggestions if {{ is more recent than }}
      if (lastOpenBraces > lastCloseBraces && lastOpenBraces !== -1) {
        const searchTerm = textBeforeCursor.substring(lastOpenBraces + 2).toLowerCase();
        
        // Filter variables based on search term
        const filtered = allVariables.filter(v => 
          v.name.toLowerCase().includes(searchTerm)
        );
        
        setFilteredVariables(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    };

    handleInput();
  }, [value, cursorPosition, allVariables]);

  const insertVariable = (variableName: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const textAfterCursor = value.substring(cursorPos);
    
    // Find the {{ before cursor
    const lastOpenBraces = textBeforeCursor.lastIndexOf('{{');
    
    if (lastOpenBraces !== -1) {
      // Replace from {{ to cursor with {{variableName}}
      const newValue = 
        value.substring(0, lastOpenBraces) + 
        `{{${variableName}}}` + 
        textAfterCursor;
      
      onChange(newValue);
      setShowSuggestions(false);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        const newCursorPos = lastOpenBraces + variableName.length + 4; // +4 for {{}}
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredVariables.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        if (filteredVariables[selectedIndex]) {
          e.preventDefault();
          insertVariable(filteredVariables[selectedIndex].name);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  };

  // Calculate dropdown position
  const getDropdownPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { top: 0, left: 0 };

    // Get cursor coordinates (approximate)
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length;
    const lineHeight = 20; // approximate line height
    
    return {
      top: currentLine * lineHeight,
      left: 10
    };
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={className}
        placeholder={placeholder}
        rows={rows}
      />
      
      {showSuggestions && filteredVariables.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
          style={{
            top: `${dropdownPosition.top + 30}px`,
            left: `${dropdownPosition.left}px`,
            minWidth: '250px'
          }}
        >
          <div className="px-2 py-1 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
            Available Variables
          </div>
          {filteredVariables.map((variable, index) => (
            <div
              key={variable.name}
              className={`px-3 py-2 cursor-pointer text-sm ${
                index === selectedIndex
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => insertVariable(variable.name)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Visual indicator for data presence */}
                  {variable.source === 'system' ? (
                    <span className="w-2 h-2 rounded-full bg-blue-500" title="System variable"></span>
                  ) : variable.hasData ? (
                    <span className="w-2 h-2 rounded-full bg-green-500" title="Has data"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300" title="No data yet"></span>
                  )}
                  <span className="font-mono font-medium text-xs">{variable.name}</span>
                </div>
                <span className="text-xs text-gray-400 ml-2">{variable.type}</span>
              </div>
              {variable.description && (
                <div className="text-xs text-gray-500 mt-0.5 ml-4">
                  {variable.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
        <span>Type <code className="bg-gray-100 px-1 rounded">{'{{'}</code> to insert variables</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>System</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Has data</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
          <span>No data</span>
        </span>
      </div>
    </div>
  );
};

export default VariableAutocomplete;
