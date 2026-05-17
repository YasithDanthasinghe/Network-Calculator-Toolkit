import { useState, useEffect, useMemo } from 'react';
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
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './components/SEO';
import Breadcrumbs from './components/Breadcrumbs';

// Core Components
import SubnetCalculator from './components/SubnetCalculator';
import AdBanner from './components/AdBanner';
import VLSMCalculator from './components/VLSMCalculator';
import Converter from './components/Converter';
import PortReference from './components/PortReference';
import CIDRCalculator from './components/CIDRCalculator';
import TopologyViewer from './components/TopologyViewer';
import UserGuide from './components/UserGuide';

type ToolId = 'subnet' | 'vlsm' | 'converter' | 'ports' | 'cidr' | 'topology' | 'home' | 'guide';

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
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
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

  const seoData = useMemo(() => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Network Calculator Toolkit",
      "applicationCategory": "NetworkingApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    switch(activeTool) {
      case 'subnet':
        return {
          title: "IP Subnet Calculator — IPv4 Range & Mask Tool",
          description: "Professional IPv4 subnet calculator. Determine network range, broadcast addresses, subnet masks, and host capacity for any CIDR prefix.",
          keywords: "subnet calculator, ip calculator, subnet mask calculator, ipv4 subnetting, online subnet tool",
          canonical: "https://network-calculator-toolkit.web.app/",
          schema: {
            ...baseSchema,
            "featureList": ["Subnet Mask Calculation", "Network Range Detection", "Broadcast Address Calculation"],
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I calculate a subnet?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To calculate a subnet, enter an IP address and select a CIDR prefix (like /24) or a subnet mask. The calculator will determine the network address, usable host range, and broadcast address."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is CIDR notation?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "CIDR (Classless Inter-Domain Routing) notation is a short way to represent a subnet mask. For example, /24 represents the subnet mask 255.255.255.0."
                  }
                }
              ]
            }
          }
        };
      case 'vlsm':
        return {
          title: "VLSM Calculator — Variable Length Subnet Mask Planner",
          description: "Free VLSM calculator for efficient IP allocation. Design hierarchical subnet structures for multiple network sizes with zero wastage.",
          keywords: "vlsm calculator, variable length subnet mask, ip planning tool, hierarchical subnetting",
          canonical: "https://network-calculator-toolkit.web.app/",
          schema: {
            ...baseSchema,
            "name": "VLSM Calculator",
            "description": "Calculate Variable Length Subnet Masks for complex networks.",
            "mainEntity": {
              "@type": "HowTo",
              "name": "How to calculate VLSM",
              "step": [
                { "@type": "HowToStep", "text": "Enter the base network IP address (e.g., 192.168.1.0/24)." },
                { "@type": "HowToStep", "text": "Add the required number of hosts for each subnet." },
                { "@type": "HowToStep", "text": "The tool will automatically sort and allocate subnets from largest to smallest." }
              ]
            }
          }
        };
      case 'cidr':
        return {
          title: "CIDR Calculator & Route Summarization Tool",
          description: "Summarize multiple network routes into a single aggregate CIDR block. Optimize routing tables with our professional supernetting tool.",
          keywords: "cidr calculator, route summarization, supernetting, aggregate routes, ipv4 summarization",
          canonical: "https://network-calculator-toolkit.web.app/",
          schema: {
            ...baseSchema,
            "name": "CIDR Route Summarizer",
            "description": "Combine multiple IP networks into a single summary route."
          }
        };
      case 'converter':
        return {
          title: "IP Binary Converter — Decimal, Hex, & Binary Tool",
          description: "Convert IP addresses between binary, decimal, and hex. Visualize IP bitwise boundaries for CCNA students and network engineers.",
          keywords: "ip to binary converter, decimal to hex, bitwise ip converter, networking converter",
          canonical: "https://network-calculator-toolkit.web.app/",
        };
      case 'ports':
        return {
          title: "Network Port Reference — Common TCP/UDP Services",
          description: "Complete database of common TCP/UDP ports and protocols. Search for well-known server ports for firewalls and security analysis.",
          keywords: "port reference, tcp ports list, common udp ports, port checker, networking protocols",
          canonical: "https://network-calculator-toolkit.web.app/",
        };
      case 'topology':
        return {
          title: "Network Topology Designer — Visual Infrastructure Map",
          description: "Design and visualize network architectures. Drag-and-drop routers, servers, and connections to map out your infrastructure.",
          keywords: "network topology design, infrastructure mapping, network diagram tool, visual network architect",
          canonical: "https://network-calculator-toolkit.web.app/",
        };
      default:
        return {
          title: "IP Subnet Calculator — Free Online CIDR & VLSM Toolkit",
          description: "Professional online networking toolkit. Calculate subnets, plan VLSM, design topologies, and summary routes with our free IP calculator.",
          keywords: "ip calculator, subnet calculator, networking tools, cidr calculator, vlsm tool",
          canonical: "https://network-calculator-toolkit.web.app/",
          schema: baseSchema
        };
    }
  }, [activeTool]);

  return (
    <div className="min-h-screen w-full flex text-slate-900 dark:text-slate-100 transition-colors bg-bg-light dark:bg-bg-dark font-sans">
      <SEO {...seoData} />
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
        fixed inset-y-0 left-0 w-64 bg-white dark:bg-surface-dark text-slate-500 dark:text-gray-400 z-50 border-r border-slate-200 dark:border-white/5 transition-all duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex-shrink-0
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Nav */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Primary Tools</p>
            {tools.slice(0, 3).map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id as ToolId); setSidebarOpen(false); }}
                className={`sidebar-btn ${activeTool === tool.id ? 'sidebar-btn-active' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                {tool.icon}
                <span className="font-medium">{tool.name}</span>
              </button>
            ))}

            <p className="px-3 py-2 pt-6 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Utilities</p>
            {tools.slice(3).map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id as ToolId); setSidebarOpen(false); }}
                className={`sidebar-btn ${activeTool === tool.id ? 'sidebar-btn-active' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                {tool.icon}
                <span className="font-medium">{tool.name}</span>
              </button>
            ))}

            <p className="px-3 py-2 pt-6 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">System</p>
            <button
               onClick={() => { setActiveTool('guide'); setSidebarOpen(false); }}
               className={`sidebar-btn ${activeTool === 'guide' ? 'sidebar-btn-active' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
               <BookOpen className="w-5 h-5" />
               <span className="font-medium">User Guide</span>
            </button>
          </nav>

          {/* Sidebar Stats Widget */}
          <div className="mt-auto p-6">
            <div className="bg-slate-50 dark:bg-[#2D314A] rounded-xl p-4 border border-slate-100 dark:border-transparent">
              <p className="text-xs text-slate-500 dark:text-gray-300 mb-2 font-bold tracking-tight">Platform Status</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">ACTIVE</span>
                <span className="text-[10px] text-green-600 dark:text-green-400 font-black mb-0.5">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 bg-network-teal rounded-lg flex items-center justify-center text-white cursor-pointer shadow-md shadow-network-teal/10 hover:scale-105 transition-transform"
              onClick={() => setActiveTool('home')}
            >
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-network-teal uppercase">NETWORK CALCULATOR</div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Professional Toolkit v2.4</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-[10px] font-bold bg-network-blue/10 text-network-blue px-2 py-0.5 rounded tracking-widest uppercase">PRO MODE</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all text-slate-600 dark:text-slate-400 group"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform" /> : <Moon className="w-5 h-5 text-slate-700 group-hover:-rotate-12 transition-transform" />}
              </button>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 rounded-lg">
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
                {activeTool === 'home' && <AdBanner slot="3998732590" />}
                
                {activeTool !== 'home' && (
                  <Breadcrumbs 
                    items={[
                      { name: tools.find(t => t.id === activeTool)?.name || activeTool.charAt(0).toUpperCase() + activeTool.slice(1) }
                    ]} 
                  />
                )}

                {activeTool === 'subnet' && <SubnetCalculator />}
                {activeTool === 'vlsm' && <VLSMCalculator />}
                {activeTool === 'converter' && <Converter />}
                {activeTool === 'ports' && <PortReference />}
                {activeTool === 'cidr' && <CIDRCalculator />}
                {activeTool === 'topology' && <TopologyViewer />}
                {activeTool === 'guide' && <UserGuide />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <footer className="h-8 bg-slate-50 dark:bg-[#1A1D2E] border-t border-slate-200 dark:border-white/5 flex items-center justify-between px-6 shrink-0 text-[10px] text-slate-400 dark:text-gray-500 uppercase font-bold tracking-widest">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> 
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
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
          Precision <span className="text-network-teal">IP Calculator</span> for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-network-teal to-network-blue">Network Engineering</span>
        </h1>
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
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-network-teal transition-colors">{p.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{p.desc}</p>
            <div className="flex items-center gap-2 text-xs font-bold text-network-teal uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
              Launch Tool <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Feature Highlight */}
      <section className="tool-card p-8 md:p-12 relative overflow-hidden bg-slate-900 dark:bg-[#1A1D2E] text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <LayoutGrid className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Why engineered for precision?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
               <div className="space-y-3">
                  <p className="font-bold text-network-teal text-lg">Offline First Architecture</p>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">All calculations are performed locally in your browser. No data leaves your machine, ensuring zero latency and total isolation.</p>
               </div>
               <div className="space-y-3">
                  <p className="font-bold text-network-teal text-lg">Binary Fidelity</p>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">Deep-dive into mask boundaries with our color-coded bitwise representation, synchronized across all calculation engines.</p>
               </div>
               <div className="space-y-3">
                  <p className="font-bold text-network-teal text-lg">CCNA v7 Alignment</p>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">Perfect for students studying for Cisco, CompTIA, or Juniper certifications with standardized prefix-length logic.</p>
               </div>
               <div className="space-y-3">
                  <p className="font-bold text-network-teal text-lg">Native Performance</p>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">Built with React 19 and Tailwind CSS v4, utilizing hardware-accelerated transitions for a buttery-smooth interface.</p>
               </div>
            </div>
          </div>
      </section>
    </div>
  );
}
