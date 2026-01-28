interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'orderPool', label: 'Auftragspool', icon: '📦' },
  { id: 'masterData', label: 'Stammdaten', icon: '⚙️' },
];

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-[250px] bg-[#1e3a5f] text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold">Auslastungsplanung</h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full px-6 py-3 text-left flex items-center gap-3 transition-colors ${
              activePage === item.id
                ? 'bg-white/20'
                : 'hover:bg-white/10'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
