import { useState, useMemo } from 'react';
import { Search, Info, ShieldAlert, Copy, Check } from 'lucide-react';
import { WELL_KNOWN_PORTS, PortInfo } from '../lib/ports';
import { motion, AnimatePresence } from 'motion/react';

export default function PortReference() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [category, setCategory] = useState<string>('All');
  const [copied, setCopied] = useState<number | null>(null);

  const categories = ['All', 'Web', 'Email', 'Database', 'Security', 'Infrastructure', 'Gaming', 'Other'];
  const protocols = ['All', 'TCP', 'UDP', 'Both'];

  const filteredPorts = useMemo(() => {
    return WELL_KNOWN_PORTS.filter(port => {
      const matchesSearch =
        port.port.toString().includes(search) ||
        port.service.toLowerCase().includes(search.toLowerCase()) ||
        port.description.toLowerCase().includes(search.toLowerCase());
      const matchesProtocol = filter === 'All' || port.protocol === filter || port.protocol === 'Both';
      const matchesCategory = category === 'All' || port.category === category;
      return matchesSearch && matchesProtocol && matchesCategory;
    });
  }, [search, filter, category]);

  const handleCopy = (port: PortInfo) => {
    const text = `Port: ${port.port}\nProtocol: ${port.protocol}\nService: ${port.service}\nDescription: ${port.description}`;
    navigator.clipboard.writeText(text);
    setCopied(port.port);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search port number, service, or keyword..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="input-field w-32"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {protocols.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            className="input-field w-40"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="tool-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 border-bottom border-slate-200 dark:border-white/10">
              <th className="px-6 py-4 font-semibold text-sm">Port</th>
              <th className="px-6 py-4 font-semibold text-sm">Protocol</th>
              <th className="px-6 py-4 font-semibold text-sm">Service</th>
              <th className="px-6 py-4 font-semibold text-sm">Description</th>
              <th className="px-6 py-4 font-semibold text-sm">Category</th>
              <th className="px-6 py-4 font-semibold text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredPorts.map((port) => (
                <motion.tr
                  key={port.port}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-network-teal">{port.port}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      port.protocol === 'TCP' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      port.protocol === 'UDP' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {port.protocol}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{port.service}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col gap-1">
                      {port.description}
                      {port.risk && (
                        <span className="flex items-center gap-1 text-xs text-network-red font-medium">
                          <ShieldAlert className="w-3 h-3" />
                          {port.risk}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 border border-slate-200 dark:border-white/10 rounded px-2 py-0.5">
                      {port.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleCopy(port)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-network-teal"
                      title="Copy Info"
                    >
                      {copied === port.port ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredPorts.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No ports found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
