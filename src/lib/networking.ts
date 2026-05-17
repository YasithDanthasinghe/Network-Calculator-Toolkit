/**
 * Networking Utility Library
 * Core logic for IP address manipulation and calculations
 */

export interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  prefixLength: number;
  wildcardMask: string;
  ipClass: string;
  isPrivate: boolean;
  binaryIp: string[];
  binaryMask: string[];
}

/**
 * Convert IPv4 string to 32-bit unsigned integer
 */
export function ipToLong(ip: string): number {
  const octets = ip.split('.').map(Number);
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new Error('Invalid IP address format');
  }
  return (octets[0] << 24 | octets[1] << 16 | octets[2] << 8 | octets[3]) >>> 0;
}

/**
 * Convert 32-bit unsigned integer to IPv4 string
 */
export function longToIp(long: number): string {
  return [
    (long >>> 24) & 0xff,
    (long >>> 16) & 0xff,
    (long >>> 8) & 0xff,
    long & 0xff
  ].join('.');
}

/**
 * Convert number to 8-bit binary string
 */
export function octetToBinary(octet: number): string {
  return octet.toString(2).padStart(8, '0');
}

/**
 * Convert 32-bit long to 32-bit binary string array (octets)
 */
export function ipToBinaryArray(long: number): string[] {
  return [
    octetToBinary((long >>> 24) & 0xff),
    octetToBinary((long >>> 16) & 0xff),
    octetToBinary((long >>> 8) & 0xff),
    octetToBinary(long & 0xff)
  ];
}

/**
 * Generate subnet mask long from prefix length
 */
export function prefixToMaskLong(prefix: number): number {
  if (prefix === 0) return 0;
  return ((0xffffffff << (32 - prefix)) >>> 0);
}

/**
 * Calculate full subnet details
 */
export function calculateSubnet(ip: string, prefix: number): SubnetInfo {
  const ipLong = ipToLong(ip);
  const maskLong = prefixToMaskLong(prefix);
  const wildcardLong = (~maskLong) >>> 0;

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? 0 : totalHosts - 2;

  const firstUsable = prefix >= 31 ? 'N/A' : longToIp(networkLong + 1);
  const lastUsable = prefix >= 31 ? 'N/A' : longToIp(broadcastLong - 1);

  // IP Class detection
  let ipClass = 'Unknown';
  if (ipLong >= ipToLong('0.0.0.0') && ipLong <= ipToLong('127.255.255.255')) ipClass = 'A';
  else if (ipLong >= ipToLong('128.0.0.0') && ipLong <= ipToLong('191.255.255.255')) ipClass = 'B';
  else if (ipLong >= ipToLong('192.0.0.0') && ipLong <= ipToLong('223.255.255.255')) ipClass = 'C';
  else if (ipLong >= ipToLong('224.0.0.0') && ipLong <= ipToLong('239.255.255.255')) ipClass = 'D (Multicast)';
  else if (ipLong >= ipToLong('240.0.0.0') && ipLong <= ipToLong('255.255.255.255')) ipClass = 'E (Experimental)';

  // Private IP checks
  const isPrivate = (
    (ipLong >= ipToLong('10.0.0.0') && ipLong <= ipToLong('10.255.255.255')) ||
    (ipLong >= ipToLong('172.16.0.0') && ipLong <= ipToLong('172.31.255.255')) ||
    (ipLong >= ipToLong('192.168.0.0') && ipLong <= ipToLong('192.168.255.255'))
  );

  return {
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    firstUsable,
    lastUsable,
    totalHosts,
    usableHosts,
    subnetMask: longToIp(maskLong),
    prefixLength: prefix,
    wildcardMask: longToIp(wildcardLong),
    ipClass,
    isPrivate,
    binaryIp: ipToBinaryArray(ipLong),
    binaryMask: ipToBinaryArray(maskLong)
  };
}

/**
 * VLSM Subnet Generator
 */
export interface VLSMSingleSubnet {
  name: string;
  neededHosts: number;
  allocatedHosts: number;
  prefix: number;
  network: string;
  range: string;
  broadcast: string;
  mask: string;
}

export function calculateVLSM(baseIp: string, subnets: { name: string, count: number }[]): VLSMSingleSubnet[] {
  // Sort by host count descending (Requirement for VLSM)
  const sorted = [...subnets].sort((a, b) => b.count - a.count);
  let currentIpLong = ipToLong(baseIp);
  const results: VLSMSingleSubnet[] = [];

  for (const s of sorted) {
    // Find the smallest prefix that fits s.count + 2 (network + broadcast)
    let prefix = 30;
    while (prefix >= 0) {
      const capacity = Math.pow(2, 32 - prefix) - 2;
      if (capacity >= s.count) {
        break;
      }
      prefix--;
    }

    const blockSize = Math.pow(2, 32 - prefix);

    // Network must be aligned to block size
    if (currentIpLong % blockSize !== 0) {
      currentIpLong = (Math.ceil(currentIpLong / blockSize) * blockSize) >>> 0;
    }

    const network = longToIp(currentIpLong);
    const broadcast = longToIp(currentIpLong + blockSize - 1);
    const first = longToIp(currentIpLong + 1);
    const last = longToIp(currentIpLong + blockSize - 2);

    results.push({
      name: s.name,
      neededHosts: s.count,
      allocatedHosts: blockSize - 2,
      prefix,
      network,
      range: `${first} - ${last}`,
      broadcast,
      mask: longToIp(prefixToMaskLong(prefix))
    });

    currentIpLong = (currentIpLong + blockSize) >>> 0;
  }

  return results;
}

/**
 * Route Summarization (CIDR Aggregation)
 */
export function summarizeRoutes(ips: string[]): string {
  if (ips.length === 0) return '';
  if (ips.length === 1) return ips[0];

  const longs = ips.map(ipToLong);
  const min = Math.min(...longs);
  const max = Math.max(...longs);

  // Find the bit where min and max differ
  let diff = min ^ max;
  let commonBits = 32;

  while (diff > 0) {
    diff >>= 1;
    commonBits--;
  }

  const maskLong = prefixToMaskLong(commonBits);
  const summaryNetwork = (min & maskLong) >>> 0;

  return `${longToIp(summaryNetwork)}/${commonBits}`;
}
