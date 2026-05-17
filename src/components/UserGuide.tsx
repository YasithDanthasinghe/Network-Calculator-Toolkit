import { motion } from 'motion/react';
import { 
  BookOpen, 
  Zap, 
  Table, 
  Hash, 
  Monitor, 
  Network, 
  Share2,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function UserGuide() {
  const sections = [
    {
      title: 'IP Subnet Calculator',
      icon: <Zap className="w-6 h-6 text-network-teal" />,
      content: 'Enter an IPv4 address and select a subnet mask (CIDR notation or dotted decimal). The tool instantly calculates the network range, broadcast address, and host availability. Use the "Precision" decimal mode for advanced calculations.',
      tips: ['Valid range: 0.0.0.0 to 255.255.255.255', 'Binary view helps visualize how bits are segmented.']
    },
    {
      title: 'Variable Length Subnet Masking (VLSM)',
      icon: <Table className="w-6 h-6 text-network-blue" />,
      content: 'Perfect for complex network design. Enter your major network prefix and define the number of hosts required for each sub-network. The tool will calculate the most efficient allocation to minimize IP address waste.',
      tips: ['Sort requirements from largest to smallest for optimal padding.', 'Supports up to 20 subnets.']
    },
    {
      title: 'Binary/Decimal/Hex Converter',
      icon: <Hash className="w-6 h-6 text-network-amber" />,
      content: 'A rapid conversion tool for network engineers. Convert between different number systems instantly. Useful for manually calculating masks or interpreting packet header values.',
      tips: ['Input field detects base automatically in most cases.', 'One-click copy for quick pasting into configuration files.']
    },
    {
      title: 'Topology Designer',
      icon: <Share2 className="w-6 h-6 text-network-teal" />,
      content: 'A visual drag-and-drop tool to sketch your network architecture. Add routers, switches, servers, and clouds. Connect them with line segments to visualize data paths.',
      tips: ['Drag nodes to reposition.', 'Click "Link" mode then click two nodes to create a connection.', 'Use templates (Home/Office) to get started quickly.']
    }
  ];

  return (
    <div className="space-y-12 py-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Guide & Documentation</h2>
        <p className="text-slate-500 dark:text-slate-400">Learn how to make the most of our professional networking toolkit.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="tool-card p-8 group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-12 h-12 shrink-0 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                {section.icon}
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.content}
                </p>
                <div className="bg-slate-50 dark:bg-black/20 rounded-lg p-4 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3" /> Pro Tips
                  </p>
                  <ul className="space-y-1.5">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-slate-900 dark:bg-[#1A1D2E] text-white rounded-3xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-network-teal rounded-2xl flex items-center justify-center mx-auto shadow-xl">
           <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold">Need more help?</h3>
        <p className="text-slate-400 max-w-lg mx-auto">
          Our toolkit is designed based on Cisco Networking Academy standards. For deep technical knowledge, we recommend referring to official documentation.
        </p>
        <div className="flex justify-center gap-4 pt-4">
           <a href="https://www.cisco.com/c/en/us/support/index.html" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Cisco Support
           </a>
        </div>
      </section>
    </div>
  );
}
