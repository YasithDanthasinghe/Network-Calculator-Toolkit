import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Zap,
  Table,
  Hash,
  Monitor,
  Network,
  Share2,
  Moon,
  Sun,
  LayoutGrid,
  Info,
  Github,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Core Components
import SubnetCalculator from './components/SubnetCalculator';
import VLSMCalculator from './components/VLSMCalculator';
import Converter from './components/Converter';
import PortReference from './components/PortReference';
import CIDRCalculator from './components/CIDRCalculator';
import TopologyViewer from './components/TopologyViewer';

type ToolId = 'subnet' | 'vlsm' | 'converter' | 'ports' | 'cidr' | 'topology' | 'home';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const tools = [
    { id: 'subnet', name: 'IP Subnet', icon: <Zap className="w-5 h-5" />, desc: 'Standard IPv4 subnetting logic' },
    { id: 'vlsm', name: 'VLSM Calc', icon: <Table className="w-5 h-5" />, desc: 'Variable length subnet masking' },
    { id: 'converter', name: 'Converter', icon: <Hash className="w-5 h-5" />, desc: 'Binary, Decimal, Hex systems' },
    { id: 'ports', name: 'Port Ref', icon: <Monitor className="w-5 h-5" />, desc: 'TCP/UDP port reference database' },
    { id: 'cidr', name: 'CIDR Tool', icon: <Network className="w-5 h-5" />, desc: 'Supernetting and route summary' },
    { id: 'topology', name: 'Topology', icon: <Share2 className="w-5 h-5" />, desc: 'Interactive network designer' },
  ];

  return (
    <div className="min-h-screen flex text-slate-900 dark:text-slate-100 transition-colors bg-bg-light dark:bg-bg-dark font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#1A1D2E] text-gray-400 z-50 transition-transform duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex-shrink-0
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Nav */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Tools</p>
            {tools.slice(0, 3).map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id as ToolId); setSidebarOpen(false); }}
                className={`sidebar-btn ${activeTool === tool.id ? 'sidebar-btn-active' : ''}`}
              >
                {tool.icon}
                <span className="font-medium">{tool.name}</span>
              </button>
            ))}

            <p className="px-3 py-2 pt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Utilities</p>
            {tools.slice(3).map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id as ToolId); setSidebarOpen(false); }}
                className={`sidebar-btn ${activeTool === tool.id ? 'sidebar-btn-active' : ''}`}
              >
                {tool.icon}
                <span className="font-medium">{tool.name}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar Stats Widget */}
          <div className="mt-auto p-6">
            <div className="bg-[#2D314A] rounded-xl p-4">
              <p className="text-xs text-gray-300 mb-2">Platform Status</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-white leading-none">ACTIVE</span>
                <span className="text-[10px] text-green-400 font-bold mb-0.5">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 bg-[#0F6E56] rounded-lg flex items-center justify-center text-white cursor-pointer"
              onClick={() => setActiveTool('home')}
            >
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#0F6E56] dark:text-network-teal uppercase">NETWORK CALCULATOR</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Professional Toolkit v2.4</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-mono bg-[#378ADD]/10 text-[#378ADD] px-2 py-1 rounded">PRO MODE</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-500">
               <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTool === 'home' && <HomeView setActiveTool={setActiveTool} projects={tools} />}
                {activeTool === 'subnet' && <SubnetCalculator />}
                {activeTool === 'vlsm' && <VLSMCalculator />}
                {activeTool === 'converter' && <Converter />}
                {activeTool === 'ports' && <PortReference />}
                {activeTool === 'cidr' && <CIDRCalculator />}
                {activeTool === 'topology' && <TopologyViewer />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <footer className="h-8 bg-[#1A1D2E] border-t border-white/5 flex items-center justify-between px-6 shrink-0 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> 
              System Online
            </div>
            <div className="hidden sm:block">CCNA v7 Compatible</div>
          </div>
          <div className="flex gap-6">
            <span className="hidden sm:inline">Calculations: Client-Side</span>
            <span>Latency: 0ms</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function HomeView({ setActiveTool, projects }: {
  setActiveTool: (id: ToolId) => void,
  projects: any[]
}) {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="inline-block px-4 py-1.5 bg-network-teal/10 dark:bg-network-teal/20 text-network-teal rounded-full text-xs font-bold uppercase tracking-widest"
        >
          Networking Utilities for Professionals
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          Precision Tools for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-network-teal to-network-blue">Network Engineering</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Calculate subnets, plan VLSM hierarchies, design topologies, and lookup ports — all in one production-grade toolkit.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
           <button onClick={() => setActiveTool('subnet')} className="btn-primary py-3 px-8 text-lg font-bold shadow-lg shadow-network-teal/20 flex items-center gap-2">
              Start Calculating <ArrowRight className="w-5 h-5" />
           </button>
           <button onClick={() => setActiveTool('topology')} className="btn-secondary py-3 px-8 text-lg font-bold border border-slate-200 dark:border-white/10 flex items-center gap-2">
              Launch Viewer <Share2 className="w-5 h-5" />
           </button>
        </div>
      </section>

      {/* Grid of Tools */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveTool(p.id as ToolId)}
            className="tool-card p-6 group cursor-pointer hover:border-network-teal/50 hover:shadow-xl hover:shadow-network-teal/5 transition-all"
          >
            <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-network-teal group-hover:text-white transition-all mb-4">
              {p.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-network-teal transition-colors">{p.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{p.desc}</p>
            <div className="flex items-center gap-2 text-xs font-bold text-network-teal uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
              Launch Tool <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Feature Highlight */}
      <section className="tool-card p-8 md:p-12 relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <LayoutGrid className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <h3 className="text-3xl font-bold">Why use NetToolkit?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <p className="font-bold text-network-teal">Offline Ready</p>
                  <p className="text-sm text-slate-400">All calculations are performed locally in your browser. No data leaves your machine.</p>
               </div>
               <div className="space-y-2">
                  <p className="font-bold text-network-teal">Binary Visualizer</p>
                  <p className="text-sm text-slate-400">Deep-dive into mask boundaries with our color-coded bitwise representation.</p>
               </div>
               <div className="space-y-2">
                  <p className="font-bold text-network-teal">CCNA Aligned</p>
                  <p className="text-sm text-slate-400">Perfect for students studying for Cisco, CompTIA, or Juniper certifications.</p>
               </div>
               <div className="space-y-2">
                  <p className="font-bold text-network-teal">Modern UX</p>
                  <p className="text-sm text-slate-400">Built with the latest web standards: React 19, Tailwind CSS v4, and Motion.</p>
               </div>
            </div>
          </div>
      </section>
    </div>
  );
}
