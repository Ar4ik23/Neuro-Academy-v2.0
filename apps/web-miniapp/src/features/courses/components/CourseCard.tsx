import React from 'react';

export const CourseCard: React.FC<{
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  onClick: () => void;
}> = ({ title, description, thumbnail, price, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="glass-card premium-border rounded-3xl p-4 flex flex-col gap-3 twa-tap-active cursor-pointer animate-enter"
    >
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-800">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
             <span className="text-white/40 text-4xl">🎓</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {price > 0 ? `$${price}` : 'FREE'}
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{description}</p>
      </div>

      <button className="mt-2 w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-bold text-sm text-white transition-colors shadow-lg shadow-indigo-500/20">
        Open Course
      </button>
    </div>
  );
};
