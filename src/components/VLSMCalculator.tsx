import { useState } from 'react';
import { calculateVLSM, VLSMSingleSubnet } from '../lib/networking';
import { Plus, Trash2, Download, Table, BarChart3, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function VLSMCalculator() {
  const [baseIp, setBaseIp] = useState('192.168.1.0');
  const [subnets, setSubnets] = useState([{ id: 1, name: 'LAN A', count: 100 }, { id: 2, name: 'LAN B', count: 50 }]);
  const [results, setResults] = useState<VLSMSingleSubnet[] | null>(null);

  const addRow = () => {
    setSubnets([...subnets, { id: Date.now(), name: `LAN ${String.fromCharCode(65 + subnets.length)}`, count: 10 }]);
  };

  const removeRow = (id: number) => {
    if (subnets.length > 1) {
      setSubnets(subnets.filter(s => s.id !== id));
    }
  };

  const updateRow = (id: number, field: string, value: any) => {
    setSubnets(subnets.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleCalculate = () => {
    try {
      const res = calculateVLSM(baseIp, subnets.map(s => ({ name: s.name, count: s.count })));
      setResults(res);
    } catch (e) {
      alert('Invalid base IP or configurations');
    }
  };

  const exportCSV = () => {
    if (!results) return;
    const header = 'Name,Needed,Allocated,Prefix,Network,Range,Broadcast,Mask\n';
    const rows = results.map(r => `${r.name},${r.neededHosts},${r.allocatedHosts},/${r.prefix},${r.network},${r.range},${r.broadcast},${r.mask}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vlsm_results.csv';
    a.click();
  };

  const utilization = results ? results.reduce((acc, r) => acc + (r.neededHosts / (r.allocatedHosts + 2) * 100), 0) / results.length : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="tool-card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Table className="w-5 h-5 text-network-teal" />
              Network Config
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-500 mb-1">Base Network Address</label>
              <input
                type="text"
                className="input-field"
                value={baseIp}
                onChange={(e) => setBaseIp(e.target.value)}
                placeholder="e.g. 192.168.1.0"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-500">Subnets Requirements</label>
              <AnimatePresence initial={false}>
                {subnets.map((s) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      className="input-field py-1 flex-1"
                      value={s.name}
                      onChange={(e) => updateRow(s.id, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <input
                      type="number"
                      className="input-field py-1 w-24"
                      value={s.count}
                      onChange={(e) => updateRow(s.id, 'count', Number(e.target.value))}
                      placeholder="Hosts"
                    />
                    <button
                      onClick={() => removeRow(s.id)}
                      className="p-2 text-slate-400 hover:text-network-red hover:bg-network-red/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={addRow}
                className="w-full mt-2 py-2 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-lg text-slate-400 hover:text-network-teal hover:border-network-teal/50 hover:bg-network-teal/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Subnet
              </button>
            </div>

            <button
              onClick={handleCalculate}
              className="btn-primary w-full mt-8 py-3 text-lg"
            >
              Calculate VLSM
            </button>
          </div>

          {results && (
            <div className="tool-card p-6 border-network-blue/20 bg-network-blue/5">
              <h3 className="text-sm font-bold text-network-blue uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Efficiency Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-500">Address Utilization</span>
                    <span className="font-bold text-network-blue">{utilization.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${utilization}%` }}
                      className="h-full bg-network-blue"
                    />
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-black/20 rounded-lg border border-network-blue/10">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Efficiency is based on requested vs allocated hosts per block. Higher is better.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {!results ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 tool-card border-dashed">
              <Table className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-lg">Enter requirements and calculate to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Subnet Allocation Table</h3>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 text-sm font-medium text-network-teal hover:underline"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
              <div className="tool-card overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                      <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">Name</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">Req/Alloc</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">Network</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">Usable Range</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">Broadcast</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase text-slate-400">Mask</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 font-bold">{r.name}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className="font-mono">{r.neededHosts}</span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="font-mono opacity-60">{r.allocatedHosts}</span>
                        </td>
                        <td className="px-4 py-4 font-mono text-network-teal font-bold">{r.network}/{r.prefix}</td>
                        <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">{r.range}</td>
                        <td className="px-4 py-4 font-mono text-sm opacity-80">{r.broadcast}</td>
                        <td className="px-4 py-4 font-mono text-xs opacity-60">{r.mask}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
