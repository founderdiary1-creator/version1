'use client';

interface CardRadioProps {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isMulti?: boolean;
}

export function CardRadio({ options, value, onChange, isMulti = false }: CardRadioProps) {
  
  const handleToggle = (opt: string) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(opt)) {
        onChange(currentValues.filter(v => v !== opt));
      } else {
        onChange([...currentValues, opt]);
      }
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((opt) => {
        const isSelected = isMulti 
          ? Array.isArray(value) && value.includes(opt)
          : value === opt;

        return (
          <button
            key={opt}
            type="button"
            onClick={() => handleToggle(opt)}
            className={`flex items-start p-5 rounded-2xl border-2 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#E31E24] focus-visible:ring-offset-2 ${
              isSelected
                ? 'border-[#E31E24] bg-red-50/50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
            }`}
          >
            <div className={`mt-1 mr-4 shrink-0 flex items-center justify-center w-5 h-5 border rounded-full ${
              isSelected ? 'border-[#E31E24] bg-[#E31E24]' : 'border-gray-300'
            }`}>
              {isSelected && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div>
              <span className={`font-semibold text-base ${isSelected ? 'text-[#E31E24]' : 'text-gray-900'}`}>
                {opt}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
