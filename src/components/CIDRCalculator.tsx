import { useState } from 'react';
import { summarizeRoutes } from '../lib/networking';
import { Network, ListPlus, Trash2, GitMerge, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdBanner from './AdBanner';

export default function CIDRCalculator() {
  const [ips, setIps] = useState<string[]>(['192.168.1.0/24', '192.168.2.0/24']);
  const [newIp, setNewIp] = useState('');
  const [summary, setSummary] = useState<string | null>(null);

  const addIp = () => {
    if (newIp) {
      setIps([...ips, newIp]);
      setNewIp('');
    }
  };

  const removeIp = (index: number) => {
    setIps(ips.filter((_, i) => i !== index));
  };

  const handleSummarize = () => {
    const rawIps = ips.map(i => i.split('/')[0]);
    const result = summarizeRoutes(rawIps);
    setSummary(result);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">CIDR & Supernet Calculator</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Summarize multiple network routes into a single aggregate CIDR block.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="tool-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Network className="w-5 h-5 text-network-teal" />
            Route Summarizer
          </h3>
          <p className="text-sm text-slate-500 mb-6 font-mono border-l-2 border-network-teal/30 pl-4 py-1 italic">
            Enter multiple network addresses to find the most specific supernet (Common Prefix).
          </p>

          <div className="space-y-3">
             <div className="flex gap-2">
               <input
                 type="text"
                 className="input-field py-2"
                 value={newIp}
                 onChange={(e) => setNewIp(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addIp()}
                 placeholder="e.g. 172.16.0.0/24"
               />
               <button onClick={addIp} className="btn-secondary px-4">
                 <ListPlus className="w-5 h-5" />
               </button>
             </div>

             <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {ips.map((ip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg group"
                    >
                      <span className="font-mono font-medium text-slate-600 dark:text-slate-300">{ip}</span>
                      <button onClick={() => removeIp(index)} className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-network-red transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>

             <button
               onClick={handleSummarize}
               disabled={ips.length < 1}
               className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2"
             >
               <GitMerge className="w-4 h-4" /> Calculate Summary Route
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {summary ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tool-card p-8 bg-network-teal text-white flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="p-4 bg-white/20 rounded-full">
                <Network className="w-12 h-12" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Summary Route/CIDR</p>
                <h4 className="text-5xl font-mono font-bold tracking-tighter">{summary}</h4>
              </div>
              <p className="text-sm opacity-80 max-w-xs">
                This is the shortest CIDR prefix that covers all your input networks.
              </p>
              <div className="pt-4 flex gap-4">
                 <div className="text-center">
                    <p className="text-[10px] uppercase font-bold opacity-50">Common Prefix</p>
                    <p className="font-mono text-lg">{summary.split('/')[1]} bits</p>
                 </div>
                 <div className="w-[1px] bg-white/20" />
                 <div className="text-center">
                    <p className="text-[10px] uppercase font-bold opacity-50">Mask</p>
                    <p className="font-mono text-lg">{summary.split('/')[0]}</p>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="tool-card p-12 border-dashed border-2 flex flex-col items-center justify-center text-center text-slate-400 space-y-4 h-full"
            >
              <GitMerge className="w-16 h-16 opacity-10" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Add routes to begin</p>
                <p className="text-sm">Summary routes help reduce routing table size</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="tool-card p-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Subnet Breakdown</h4>
          <p className="text-[10px] text-slate-500 mb-4">Capacity of the calculated summary range {summary || ''}:</p>
          <div className="space-y-2">
            {[25, 26, 27, 28, 29, 30].map(p => {
               if (!summary) return null;
               const mainPrefix = parseInt(summary.split('/')[1]);
               if (p <= mainPrefix) return null;
               const count = Math.pow(2, p - mainPrefix);
               return (
                 <div key={p} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-network-blue/10 flex items-center justify-center text-network-blue font-bold text-xs">/{p}</div>
                     <span className="text-sm font-medium">/{p} Subnets</span>
                   </div>
                   <span className="font-mono text-lg font-bold text-network-teal">{count.toLocaleString()}</span>
                 </div>
               );
            })}
            {!summary && <p className="text-xs text-center text-slate-400 italic">Calculate a summary to see details</p>}
          </div>
        </div>

        <div className="tool-card p-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Quick CIDR Reference</h4>
          <div className="grid grid-cols-3 gap-2">
            {[8, 16, 24, 25, 26, 27, 28, 29, 30].map(p => (
              <div key={p} className="p-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded flex items-center justify-between">
                <span className="font-bold text-network-teal">/{p}</span>
                <span className="text-[10px] font-mono opacity-50">2^{(32-p)} hosts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-12 border-t border-slate-200 dark:border-white/5 pt-12">
        <section className="max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is CIDR & Route Summarization?</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            <strong className="text-network-teal">CIDR (Classless Inter-Domain Routing)</strong> and <strong>Route Summarization</strong> (also known as Supernetting) 
            are techniques used to reduce the size of routing tables. By grouping multiple contiguous network addresses into a 
            single prefix, routers can manage traffic more efficiently, reduce memory usage, and minimize routing protocol overhead.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="tool-card p-6 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-network-teal" />
                The Purpose of Summarization
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="text-network-teal font-bold">•</span>
                  <span><strong>Table Efficiency:</strong> Shrink thousands of routes into hundreds of aggregate blocks.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-network-teal font-bold">•</span>
                  <span><strong>Stability:</strong> Isolate route flapping by only advertising the summary route to the core.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-network-teal font-bold">•</span>
                  <span><strong>Bandwidth Protection:</strong> Reduce the frequency and size of routing update messages.</span>
                </li>
              </ul>
            </div>
            <div className="tool-card p-6 border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-network-blue" />
                How Supernetting Works
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Supernetting works by finding the common high-order bits among several network addresses. For example, 
                combining 192.168.0.0/24 and 192.168.1.0/24 results in the supernet 192.168.0.0/23. Our tool automates 
                this bitwise matching for any number of input networks.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:col-span-2">
        <AdBanner slot="8658215641" />
      </div>
    </div>
  </div>
);
}
