/**
 * Port Reference Data
 * Sources: IANA Well-Known Ports, Common Service Ports
 */
export interface PortInfo {
  port: number;
  protocol: 'TCP' | 'UDP' | 'Both';
  service: string;
  description: string;
  category: 'Web' | 'Email' | 'Database' | 'Security' | 'Gaming' | 'Infrastructure' | 'Other';
  risk?: string;
}

export const WELL_KNOWN_PORTS: PortInfo[] = [
  { port: 20, protocol: 'TCP', service: 'FTP-Data', description: 'File Transfer Protocol (Data)', category: 'Infrastructure' },
  { port: 21, protocol: 'TCP', service: 'FTP', description: 'File Transfer Protocol (Control)', category: 'Infrastructure' },
  { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell', category: 'Security' },
  { port: 23, protocol: 'TCP', service: 'Telnet', description: 'Unencrypted text communications', category: 'Security', risk: 'High - sends data in cleartext' },
  { port: 25, protocol: 'TCP', service: 'SMTP', description: 'Simple Mail Transfer Protocol', category: 'Email' },
  { port: 53, protocol: 'Both', service: 'DNS', description: 'Domain Name System', category: 'Infrastructure' },
  { port: 67, protocol: 'UDP', service: 'DHCP', description: 'Dynamic Host Configuration Protocol (Server)', category: 'Infrastructure' },
  { port: 68, protocol: 'UDP', service: 'DHCP', description: 'Dynamic Host Configuration Protocol (Client)', category: 'Infrastructure' },
  { port: 80, protocol: 'TCP', service: 'HTTP', description: 'Hypertext Transfer Protocol', category: 'Web' },
  { port: 110, protocol: 'TCP', service: 'POP3', description: 'Post Office Protocol v3', category: 'Email' },
  { port: 123, protocol: 'UDP', service: 'NTP', description: 'Network Time Protocol', category: 'Infrastructure' },
  { port: 143, protocol: 'TCP', service: 'IMAP', description: 'Internet Message Access Protocol', category: 'Email' },
  { port: 161, protocol: 'UDP', service: 'SNMP', description: 'Simple Network Management Protocol', category: 'Infrastructure' },
  { port: 179, protocol: 'TCP', service: 'BGP', description: 'Border Gateway Protocol', category: 'Infrastructure' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'Hypertext Transfer Protocol Secure', category: 'Web' },
  { port: 445, protocol: 'TCP', service: 'SMB', description: 'Server Message Block', category: 'Infrastructure', risk: 'Medium - frequent target for lateral movement' },
  { port: 514, protocol: 'UDP', service: 'Syslog', description: 'System Logging Protocol', category: 'Infrastructure' },
  { port: 587, protocol: 'TCP', service: 'SMTP (Submit)', description: 'SMTP Submission with STARTTLS', category: 'Email' },
  { port: 636, protocol: 'TCP', service: 'LDAPS', description: 'LDAP over SSL', category: 'Security' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', description: 'IMAP over SSL', category: 'Email' },
  { port: 995, protocol: 'TCP', service: 'POP3S', description: 'POP3 over SSL', category: 'Email' },
  { port: 1433, protocol: 'TCP', service: 'MSSQL', description: 'Microsoft SQL Server', category: 'Database' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL Database System', category: 'Database' },
  { port: 3389, protocol: 'TCP', service: 'RDP', description: 'Remote Desktop Protocol', category: 'Infrastructure', risk: 'Critical - common entry point for ransomware' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL Database System', category: 'Database' },
  { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Redis In-Memory Database', category: 'Database' },
  { port: 8080, protocol: 'TCP', service: 'HTTP-Alt', description: 'Commonly used for proxy or alternative web servers', category: 'Web' },
  { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB NoSQL Database', category: 'Database' },
  { port: 25565, protocol: 'Both', service: 'Minecraft', description: 'Minecraft Server Default Port', category: 'Gaming' },
];
