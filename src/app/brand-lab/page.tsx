export default function BrandLabPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background abstract elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E31E24]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#E31E24]/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse" />
          <span className="text-xs font-medium text-white tracking-widest uppercase">Under Construction</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
          Brand <span className="text-[#E31E24]">Lab</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate foundry for premium corporate storytelling and immersive brand partnerships. 
          We are currently engineering a new standard in media integrations.
        </p>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-12" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto">
            Notify Me When Live
          </button>
          <a href="/" className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold rounded-lg hover:bg-white/5 transition-colors w-full sm:w-auto">
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
