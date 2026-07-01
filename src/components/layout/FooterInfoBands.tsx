import Image from 'next/image';

const unicorns = 'MapmyIndia, CarTrade, Delhivery, Fino PayTech, EaseMyTrip, Nykaa, ideaForge, IndiaMART, Infibeam Avenues, Info Edge, Nazara Technologies, Paytm, PolicyBazaar, RateGain, Tracxn, Yatra, Zaggle, Zomato, Mamaearth, TAC Security, Digit Insurance, Awfis, Ixigo, Menhood, Ola Electric, FirstCry, Unicommerce';
const soonicorns = 'Lenskart, boAt, PharmEasy, Dream11, Zerodha, BharatPe, Pine Labs, ShareChat, VerSe Innovation, MyGlamm, MPL, Khatabook, BrowserStack, OfBusiness, recharge, Spinny, Groww, Apollo 24/7, Infra.Market, Pristyn Care, Moglix, upGrad, BlackBuck, Droom, Zetwerk, NoBroker, Vedantu';
const listedTech = 'Zomato, Nykaa, Paytm, PolicyBazaar, RateGain, Tracxn, Delhivery, CarTrade, Fino PayTech, EaseMyTrip, IndiaMART, Infibeam Avenues, Info Edge, Nazara Technologies, MapmyIndia, Yatra, Zaggle, Mamaearth, TAC Security, Digit Insurance, Awfis, Ixigo, Menhood, Ola Electric, FirstCry, Unicommerce';
const investors = 'Peak XV Partners, Blume Ventures, Venture Catalysts, Inflection Point Ventures, Matrix Partners India, Kalaari Capital, Mumbai Angels, 9Unicorns Accelerator Fund, Indian Angel Network, Titan Capital, 3one4 Capital, Elevation Capital, Brand Capital, InnoVen Capital, India Quotient, Chiratae Ventures, Trifecta Capital Advisors, Alteria Capital, Axilor Ventures, Kae Capital, 100X.VC, ah! Ventures, Fireside Ventures, Lightspeed India Partners, Orios Venture Partners';

const InteractiveList = ({ data }: { data: string }) => {
  const items = data.split(', ');
  return (
    <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-[13px] text-gray-500 group/list">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="hover:text-black hover:bg-gray-200/60 px-1.5 py-0.5 rounded cursor-default transition-all duration-200 ease-out">
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="text-gray-300 ml-1.5 select-none">•</span>
          )}
        </span>
      ))}
    </div>
  );
};

export function FooterInfoBands() {
  return (
    <section className="bg-[#F8F9FA] py-12 border-t border-gray-200 scroll-reveal">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="mb-10 opacity-80 hover:opacity-100 transition-opacity">
          <Image src="/images/logo2.png" alt="Founder Diary" width={140} height={40} className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="space-y-3 group">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E31E24] rounded-sm group-hover:scale-110 transition-transform"></span>
              Unicorns
            </h4>
            <InteractiveList data={unicorns} />
          </div>
          
          <div className="space-y-3 group">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E31E24] rounded-sm group-hover:scale-110 transition-transform"></span>
              Soonicorns
            </h4>
            <InteractiveList data={soonicorns} />
          </div>
          
          <div className="space-y-3 group">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E31E24] rounded-sm group-hover:scale-110 transition-transform"></span>
              Listed Tech Companies
            </h4>
            <InteractiveList data={listedTech} />
          </div>
          
          <div className="space-y-3 group">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E31E24] rounded-sm group-hover:scale-110 transition-transform"></span>
              Key Investors
            </h4>
            <InteractiveList data={investors} />
          </div>
        </div>
      </div>
    </section>
  );
}
