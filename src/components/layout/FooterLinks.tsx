import Link from 'next/link';

const footerLinks: Record<string, { label: string; href: string }[]> = {
  MEDIA: [
    { label: 'News', href: '/news' },
    { label: 'In-Depth', href: '/features' },
    { label: 'Startup Spotlight', href: '/news?category=startups' },
    { label: 'Newsletter', href: '#' },
    { label: 'Resources', href: '#' },
    { label: 'Glossary', href: '#' },
  ],
  DATALABS: [
    { label: 'Company', href: '#' },
    { label: 'Investor', href: '#' },
    { label: 'Research Report', href: '#' },
    { label: 'Industry', href: '#' },
    { label: 'Location', href: '#' },
  ],
  COURSES: [
    { label: 'D2CX', href: '#' },
    { label: 'MANAGEMENTX', href: '#' },
    { label: 'ANGELX', href: '#' },
  ],
  EVENTS: [
    { label: 'Griffin Retreat', href: '#' },
    { label: 'FAST42 D2C Edition 2025', href: '#' },
    { label: 'The GenAI Summit 2025', href: '#' },
    { label: 'D2C Retreat 2025', href: '#' },
    { label: 'MoneyX 2025', href: '#' },
    { label: 'The D2C Summit 2025', href: '#' },
  ],
  MORE: [
    { label: 'Partner With Founder Diary', href: '/partner' },
    { label: 'About Us', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Careers', href: '#' },
  ],
};

export function FooterLinks() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 sm:gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col">
              <h4 className="text-xs font-black text-[#E31E24] uppercase tracking-[0.15em] mb-6">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-[13px] text-gray-600 font-medium hover:text-black transition-colors"
                    >
                      <span className="relative overflow-hidden">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                          {link.label}
                        </span>
                        <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-[#E31E24]">
                          {link.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}