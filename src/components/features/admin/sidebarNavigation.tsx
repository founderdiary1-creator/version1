export function SidebarNavigation({ activeSection, onSelect, pageSections }: { activeSection: string, onSelect: (id: string) => void, pageSections: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm relative">
      <div className="absolute left-[39px] top-8 bottom-8 w-px bg-gray-100 z-0"></div>
      <div className="space-y-2 relative z-10">
        {pageSections.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-300 group ${
                isActive ? 'bg-[#E31E24]/5 border border-[#E31E24]/20 shadow-sm translate-x-1' : 'hover:bg-gray-50 border border-transparent hover:translate-x-1'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isActive ? 'bg-[#E31E24] text-white shadow-[0_0_15px_rgba(227,30,36,0.3)] scale-110' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-900'
              }`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm transition-colors ${isActive ? 'text-[#E31E24]' : 'text-gray-900'}`}>
                  {section.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{section.desc}</p>
              </div>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}