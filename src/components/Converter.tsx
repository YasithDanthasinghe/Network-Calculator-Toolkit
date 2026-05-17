import { useState, useEffect, ReactNode } from 'react';
import { Hash, Binary, Monitor, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'motion/react';

export default function Converter() {
  const [decimal, setDecimal] = useState('192');
  const [binary, setBinary] = useState('11000000');
  const [hex, setHex] = useState('C0');

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Number System Converter</h2>
        <p className="text-slate-500">Live conversion between Binary, Decimal, and Hexadecimal</p>
      </div>

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

      <div className="tool-card p-8 bg-slate-50 dark:bg-black/20 border-dashed">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
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
        className={`w-full bg-transparent text-center text-2xl font-mono font-bold outline-none border-b-2 border-transparent focus:border-network-teal transition-all pb-2`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
