import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  ClipboardEdit, 
  Activity, 
  FlaskConical, 
  Factory, 
  History,
  LogOut,
  SlidersHorizontal,
  Bell,
  Wifi,
  WifiOff,
  Database,
  Cpu,
  Users
} from "lucide-react";

const DASHBOARDS = [
  { icon: LayoutDashboard, label: "Moniteur JFC1",      path: "/",          laboOnly: false, adminOnly: false, color: "text-accent-blue" },
  { icon: ClipboardEdit,   label: "Saisie Pertes",      path: "/perte",     laboOnly: true,  color: "text-accent-green" },
  { icon: Activity,        label: "Analyse Gypse",      path: "/gypse",     laboOnly: false, color: "text-accent-cyan" },
  { icon: FlaskConical,    label: "Analyse Phosphate",  path: "/phosphate", laboOnly: false, color: "text-accent-amber" },
  { icon: Factory,         label: "Analyse Production", path: "/production",laboOnly: false, color: "text-accent-blue" },
  { icon: History,         label: "Historique JFC1",    path: "/historique",laboOnly: false, color: "text-text-secondary" },
  { icon: SlidersHorizontal,label: "Seuils",             path: "/seuils",    laboOnly: false, color: "text-accent-cyan" },
  { icon: Users,           label: "Utilisateurs",        path: "/admin/users", laboOnly: false, adminOnly: true, color: "text-accent-green" },
];

export default function Sidebar({ alertesCount, connected, onToggleAlerts }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isLabo, isAdmin, user, logout } = useAuth();

  const visibleDashboards = DASHBOARDS.filter(d => isAdmin
    ? d.adminOnly
    : !d.adminOnly && (!d.laboOnly || isLabo)
  );

  return (
    <nav className="group fixed left-0 top-0 h-full w-16 hover:w-[220px] transition-all duration-300 ease-in-out bg-background-surface border-r border-border-subtle flex flex-col py-4 z-50 overflow-hidden">
      
      {/* Brand / Logo placeholder */}
      <div className="flex items-center px-4 mb-8 h-10">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center shadow-lg shadow-accent-blue/20">
          <span className="font-bold text-white text-lg">J</span>
        </div>
        <span className="ml-4 font-bold text-lg text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          JFC3 <span className="text-accent-blue font-light">PRO</span>
        </span>
      </div>

      {/* User info */}
      <div className="px-3 mb-6">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-background-cards border border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-accent-blue">{user?.username?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs font-semibold text-text-primary truncate">{user?.username}</p>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isLabo ? "text-accent-green" : "text-text-muted"}`}>
              {user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-text-muted hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            title="Déconnexion"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 space-y-1 px-2">
        {visibleDashboards.map((d) => {
          const isActive = location.pathname === d.path;
          const Icon = d.icon;
          return (
            <button
              key={d.path}
              onClick={() => navigate(d.path)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group/item relative ${
                isActive
                  ? "bg-accent-blue/10 text-accent-blue"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              }`}
            >
              <Icon size={20} className={`flex-shrink-0 ${isActive ? "text-accent-blue" : d.color}`} />
              <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {d.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent-blue rounded-r-full" />
              )}
              
              {/* Tooltip for collapsed state */}
              <div className="absolute left-16 px-2 py-1 rounded bg-background-cards border border-border-medium text-xs text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:hidden group-hover/item:block z-[60] shadow-xl">
                {d.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="px-2 mb-4">
        <button
          onClick={onToggleAlerts}
          className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all relative ${
            alertesCount > 0
              ? "bg-accent-red/10 text-accent-red"
              : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
          }`}
        >
          <div className="relative">
            <Bell size={20} className="flex-shrink-0" />
            {alertesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-red rounded-full animate-pulse ring-2 ring-background-surface" />
            )}
          </div>
          <div className="flex flex-1 items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium">Alertes</span>
            <span className="bg-accent-red/20 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
              {alertesCount}
            </span>
          </div>
        </button>
      </div>

      {/* System status */}
      <div className="px-4 py-4 space-y-4 border-t border-border-subtle overflow-hidden">
        <div className="flex items-center gap-4">
          <div className={`${connected ? "text-accent-green" : "text-accent-red"}`}>
            {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
          </div>
          <div className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[10px] font-bold text-text-muted uppercase">Backend</p>
            <p className={`text-[10px] font-bold ${connected ? "text-accent-green" : "text-accent-red"}`}>
              {connected ? "EN LIGNE" : "HORS LIGNE"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Cpu size={16} className="text-accent-cyan" />
          <div className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[10px] font-bold text-text-muted uppercase">Python</p>
            <p className="text-[10px] font-bold text-accent-cyan">STABLE</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Database size={16} className="text-accent-amber" />
          <div className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-[10px] font-bold text-text-muted uppercase">Base de données</p>
            <p className="text-[10px] font-bold text-accent-amber">MySQL 8.0</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
