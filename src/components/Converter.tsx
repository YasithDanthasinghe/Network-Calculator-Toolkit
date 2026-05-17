import { useState, useEffect, ReactNode } from 'react';
import { Hash, Binary, Monitor, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdBanner from './AdBanner';

export default function Converter() {
  const [decimal, setDecimal] = useState('192');
  const [binary, setBinary] = useState('11000000');
  const [hex, setHex] = useState('C0');
  const [mode, setMode] = useState<'number' | 'ip'>('number');

  // IP Mode state
  const [ipOctets, setIpOctets] = useState(['192', '168', '1', '1']);

  const updateFromDecimal = (val: string) => {
    const num = parseInt(val, 10);
    setDecimal(val);
    if (!isNaN(num)) {
      setBinary(num.toString(2));
      setHex(num.toString(16).toUpperCase());
    }
  };

  const updateFromBinary = (val: string) => {
    const num = parseInt(val, 2);
    setBinary(val);
    if (!isNaN(num)) {
      setDecimal(num.toString(10));
      setHex(num.toString(16).toUpperCase());
    }
  };

  const updateFromHex = (val: string) => {
    const num = parseInt(val, 16);
    setHex(val);
    if (!isNaN(num)) {
      setDecimal(num.toString(10));
      setBinary(num.toString(2));
    }
  };

  const updateIpOctet = (idx: number, val: string) => {
    const newOctets = [...ipOctets];
    newOctets[idx] = val;
    setIpOctets(newOctets);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">IP & Binary Converter</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Convert between binary, decimal, hex, and full IPv4 addresses.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-xl flex">
          <button 
            onClick={() => setMode('number')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'number' ? 'bg-white dark:bg-surface-dark shadow-md text-network-teal' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Number Converter
          </button>
          <button 
            onClick={() => setMode('ip')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'ip' ? 'bg-white dark:bg-surface-dark shadow-md text-network-teal' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            IP-to-Binary Mode
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'number' ? (
          <motion.div 
            key="number"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ConverterCard
                label="Decimal"
                value={decimal}
                onChange={updateFromDecimal}
                icon={<Monitor className="w-5 h-5" />}
                color="text-network-teal"
                placeholder="e.g. 255"
              />
              <ConverterCard
                label="Binary"
                value={binary}
                onChange={updateFromBinary}
                icon={<Binary className="w-5 h-5" />}
                color="text-network-blue"
                placeholder="e.g. 11111111"
              />
              <ConverterCard
                label="Hexadecimal"
                value={hex}
                onChange={updateFromHex}
                icon={<Hash className="w-5 h-5" />}
                color="text-network-amber"
                placeholder="e.g. FF"
              />
            </div>

            <div className="tool-card p-8 bg-slate-50 dark:bg-black/20 border-dashed text-slate-900 dark:text-white">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                <Layers className="w-5 h-5 text-slate-400" />
                Common Networking Values
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {[128, 192, 224, 240, 248, 252, 254, 255, 10, 172, 168, 0].map(val => (
                  <button
                    key={val}
                    onClick={() => updateFromDecimal(val.toString())}
                    className="p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl hover:border-network-teal hover:shadow-md transition-all group"
                  >
                    <p className="text-xl font-mono font-bold group-hover:text-network-teal">{val}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{val.toString(16).toUpperCase()} / {val.toString(2).padStart(8, '0')}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="ip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="tool-card p-8 text-slate-900 dark:text-white">
              <h3 className="text-xl font-bold mb-8 text-center text-slate-900 dark:text-white">IPv4 Dotted Decimal to Binary</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {ipOctets.map((octet, idx) => (
                  <div key={idx} className="flex items-center gap-4 flex-1 w-full md:w-auto">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-2">Octet {idx + 1}</p>
                      <input 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-center text-2xl font-mono font-bold focus:ring-2 focus:ring-network-teal outline-none"
                        value={octet}
                        onChange={(e) => updateIpOctet(idx, e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={3}
                      />
                      <div className="mt-4 p-2 bg-slate-100 dark:bg-black/20 rounded-lg text-center">
                        <span className="text-xs font-mono font-bold text-network-teal">
                          {parseInt(octet || '0').toString(2).padStart(8, '0')}
                        </span>
                      </div>
                    </div>
                    {idx < 3 && <span className="text-4xl font-bold text-slate-200 dark:text-white/10 hidden md:block">.</span>}
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Complete Binary String</p>
                <div className="flex flex-wrap justify-center gap-2 font-mono text-xl font-bold bg-slate-100 dark:bg-black/30 p-6 rounded-2xl">
                   {ipOctets.map((octet, idx) => (
                     <div key={idx} className="flex items-center gap-2">
                       <span className="text-network-teal">{parseInt(octet || '0').toString(2).padStart(8, '0')}</span>
                       {idx < 3 && <span className="text-slate-300 dark:text-white/10">•</span>}
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AdBanner slot="4064969751" />
    </div>
  );
}

function ConverterCard({ label, value, onChange, icon, color, placeholder }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: ReactNode;
  color: string;
  placeholder: string;
}) {
  return (
    <div className="tool-card p-6 flex flex-col items-center">
      <div className={`p-3 rounded-full bg-slate-100 dark:bg-white/5 ${color} mb-4`}>
        {icon}
      </div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</label>
      <input
        type="text"
        className={`w-full bg-transparent text-center text-2xl font-mono font-bold outline-none border-b-2 border-transparent focus:border-network-teal transition-all pb-2 text-slate-900 dark:text-white placeholder:text-slate-300`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
