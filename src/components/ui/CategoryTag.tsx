interface CategoryTagProps {
  category: string;
  variant?: 'default' | 'white';
}

export function CategoryTag({ category, variant = 'default' }: CategoryTagProps) {
  if (variant === 'white') {
    return (
      <span className="inline-block bg-white/90 text-[#E31E24] text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded">
        {category}
      </span>
    );
  }

  return (
    <span className="inline-block bg-[#E31E24] text-white text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded">
      {category}
    </span>
  );
}
