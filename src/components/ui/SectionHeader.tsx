import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  action?: {
    label: string;
    href?: string;
  };
  light?: boolean;
}

export function SectionHeader({ title, action, light = false }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-2xl font-bold ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {action && (
        <Link
          href={action.href || '#'}
          className={`text-[13px] font-medium uppercase tracking-wide hover:underline ${
            light ? 'text-white' : 'text-[#E31E24]'
          }`}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
