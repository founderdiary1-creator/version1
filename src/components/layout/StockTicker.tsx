'use client';

const stocks = [
  { name: 'WeWork India', price: '₹624.7', change: '-21.30', pct: '-3.30%', up: false },
  { name: 'Smartworks', price: '₹489.2', change: '+8.45', pct: '+1.76%', up: true },
  { name: 'ShadowFax', price: '₹221.2', change: '-7.50', pct: '-3.28%', up: false },
  { name: 'Tek Travels', price: '₹1,460.95', change: '+21.15', pct: '+1.47%', up: true },
  { name: 'Delivery', price: '₹465.2', change: '-15.40', pct: '-3.20%', up: false },
  { name: 'Aye Finance', price: '₹168', change: '+2.80', pct: '+1.69%', up: true },
  { name: 'Zomato', price: '₹285.5', change: '+5.20', pct: '+1.85%', up: true },
  { name: 'Paytm', price: '₹895.3', change: '-12.40', pct: '-1.37%', up: false },
];

export function StockTicker() {
  const renderStock = (stock: typeof stocks[0], idx: number) => (
    <div key={`${stock.name}-${idx}`} className="flex items-center gap-2 px-4 whitespace-nowrap">
      <span className="text-xs font-medium text-gray-900">{stock.name}</span>
      <span className="text-xs text-gray-500">{stock.price}</span>
      <span className={`text-xs font-medium ${stock.up ? 'text-green-600' : 'text-red-600'}`}>
        {stock.change} ({stock.pct})
      </span>
      <span className={`text-[10px] ${stock.up ? 'text-green-600' : 'text-red-600'}`}>
        {stock.up ? '▲' : '▼'}
      </span>
    </div>
  );

  return (
    <div className="bg-white border-b border-gray-200 h-9 flex items-center overflow-hidden">
      <div className="flex animate-marquee hover:animate-marquee">
        {[...stocks, ...stocks].map((stock, idx) => renderStock(stock, idx))}
      </div>
    </div>
  );
}
