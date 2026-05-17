import { useState, useEffect, useMemo } from 'react';
import { calculateSubnet, SubnetInfo } from '../lib/networking';
import { Copy, Check, Info, Binary, Zap } from 'lucide-react';

export default function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.1');
  const [prefix, setPrefix] = useState(24);
  const [results, setResults] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const res = calculateSubnet(ip, prefix);
      setResults(res);
      setError('');
    } catch (e) {
      setError('Invalid IP address');
      setResults(null);
    }
  }, [ip, prefix]);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const prefixes = Array.from({ length: 33 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Column */}
      <div className="lg:col-span-1 space-y-6">
        <div className="tool-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-network-teal" />
            Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">IP Address</label>
              <input
                type="text"
                className={`input-field ${error ? 'border-network-red focus:ring-network-red' : ''}`}
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="e.g. 192.168.1.1"
              />
              {error && <p className="text-xs text-network-red mt-1">{error}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Prefix Length (/{prefix})</label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="1"
                  className="flex-1 accent-network-teal"
                  value={prefix}
                  onChange={(e) => setPrefix(Number(e.target.value))}
                />
                <select
                  className="input-field w-20 py-1"
                  value={prefix}
                  onChange={(e) => setPrefix(Number(e.target.value))}
                >
                  {prefixes.map(p => <option key={p} value={p}>/{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {results && (
          <div className="tool-card p-6 bg-network-teal/5 dark:bg-network-teal/10 border-network-teal/20">
            <h3 className="text-sm font-bold text-network-teal uppercase tracking-wider mb-3">IP Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Class</span>
                <span className="font-mono font-bold text-network-teal">{results.ipClass}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Type</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  results.isPrivate
                    ? 'bg-network-amber/10 text-network-amber'
                    : 'bg-network-blue/10 text-network-blue'
                }`}>
                  {results.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total Hosts</span>
                <span className="font-mono">{results.totalHosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Usable Hosts</span>
                <span className="font-mono font-bold">{results.usableHosts.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="tool-card">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/5">
            <ResultItem
              label="Network Address"
              value={results?.networkAddress || '-'}
              onCopy={() => handleCopy(results!.networkAddress, 'net')}
              isCopied={copied === 'net'}
            />
            <ResultItem
              label="Broadcast Address"
              value={results?.broadcastAddress || '-'}
              onCopy={() => handleCopy(results!.broadcastAddress, 'broad')}
              isCopied={copied === 'broad'}
            />
            <ResultItem
              label="Usable Range"
              value={results ? `${results.firstUsable} - ${results.lastUsable}` : '-'}
              onCopy={() => handleCopy(`${results!.firstUsable} - ${results!.lastUsable}`, 'range')}
              isCopied={copied === 'range'}
            />
            <ResultItem
              label="Subnet Mask"
              value={results?.subnetMask || '-'}
              onCopy={() => handleCopy(results!.subnetMask, 'mask')}
              isCopied={copied === 'mask'}
              subValue={results?.wildcardMask && `Wildcard: ${results.wildcardMask}`}
            />
          </div>
        </div>

        {results && (
          <div className="tool-card p-6 bg-[#1A1D2E] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none uppercase font-black text-6xl italic -rotate-12">0101010</div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Binary Representation</h3>
            <div className="space-y-4 font-mono">
              <BinaryLine label="IP Address" octets={results.binaryIp} prefix={results.prefixLength} />
              <div className="pt-2 border-t border-white/5">
                <BinaryLine label="Subnet Mask" octets={results.binaryMask} prefix={results.prefixLength} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-[10px] uppercase font-bold tracking-tighter">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-network-teal rounded-full" />
                Network Bits
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-network-blue rounded-full" />
                Host Bits
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultItem({ label, value, onCopy, isCopied, subValue }: {
  label: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
  subValue?: string | false;
}) {
  return (
    <div className="p-6 group relative">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-mono font-bold tracking-tight text-[#1A1D2E] dark:text-white">{value}</p>
      {subValue && <p className="text-xs text-slate-400 mt-1 font-mono">{subValue}</p>}
      <button
        onClick={onCopy}
        className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"
      >
        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
      </button>
    </div>
  );
}

function BinaryLine({ label, octets, prefix }: { label: string; octets: string[]; prefix: number }) {
  let bitCount = 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <span className="text-[10px] w-12 text-gray-500 shrink-0">{label}</span>
        <div className="flex flex-wrap gap-2 md:gap-4">
          {octets.map((octet, i) => (
            <div key={i} className="flex gap-0.5">
              {octet.split('').map((bit, j) => {
                const currentBitIndex = bitCount++;
                const isNetworkBit = currentBitIndex < prefix;
                return (
                  <span
                    key={j}
                    className={`font-mono font-bold text-sm transition-colors ${
                      isNetworkBit
                        ? 'text-network-teal'
                        : 'text-network-blue opacity-80'
                    }`}
                  >
                    {bit}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
