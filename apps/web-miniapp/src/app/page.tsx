export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-10 h-full text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent mb-4">
        Neuro-Academy
      </h1>
      <p className="text-lg text-white/40 font-medium">
        Welcome
      </p>
    </div>
  );
}

const NavItem = ({ label, icon, active = false }: { label: string; icon: string; active?: boolean }) => (
  <button className={`flex flex-col items-center gap-1 transition-all ${active ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    {active && <div className="h-1 w-1 rounded-full bg-blue-400 mt-1" />}
  </button>
);
