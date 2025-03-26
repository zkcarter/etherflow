import { http, createConfig, Chain } from 'wagmi'
import { 
  mainnet, 
  sepolia, 
  goerli,
  bsc, 
  bscTestnet, 
  polygon, 
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet, 
  arbitrum, 
  arbitrumSepolia,
  arbitrumNova,
  optimism, 
  optimismSepolia,
  base,
  baseSepolia,
  zkSync,
  zkSyncSepoliaTestnet,
  gnosis,
  avalanche,
  avalancheFuji,
  fantom,
  fantomTestnet,
  celo,
  celoAlfajores,
  aurora,
  auroraTestnet,
  metis,
  metisGoerli,
  cronos,
  cronosTestnet,
} from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// 定义自定义链的示例
const opBNB: Chain = {
  id: 204,
  name: 'opBNB',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
    public: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
  },
  blockExplorers: {
    default: { name: 'opBNBScan', url: 'https://opbnbscan.com' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 512_730,
    },
  },
}

const opBNBTestnet: Chain = {
  id: 5611,
  name: 'opBNB Testnet',
  nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
    public: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
  },
  blockExplorers: {
    default: { name: 'opBNBScan', url: 'https://testnet.opbnbscan.com' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 512_730,
    },
  },
}

// Linea 网络配置
const linea: Chain = {
  id: 59144,
  name: 'Linea',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.linea.build'] },
    public: { http: ['https://rpc.linea.build'] },
  },
  blockExplorers: {
    default: { name: 'LineaScan', url: 'https://lineascan.build' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_389_306,
    },
  },
}

const lineaSepolia: Chain = {
  id: 59141,
  name: 'Linea Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.linea.build'] },
    public: { http: ['https://rpc.sepolia.linea.build'] },
  },
  blockExplorers: {
    default: { name: 'LineaScan', url: 'https://sepolia.lineascan.build' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_389_306,
    },
  },
}

// Mantle 网络配置
const mantle: Chain = {
  id: 5000,
  name: 'Mantle',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mantle.xyz'] },
    public: { http: ['https://rpc.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MantleScan', url: 'https://explorer.mantle.xyz' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_337,
    },
  },
}

const mantleSepolia: Chain = {
  id: 5003,
  name: 'Mantle Sepolia',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    public: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MantleScan', url: 'https://sepolia.mantlescan.xyz' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_337,
    },
  },
}

// Manta Pacific 网络配置
const mantaPacific: Chain = {
  id: 169,
  name: 'Manta Pacific',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://pacific-rpc.manta.network/http'] },
    public: { http: ['https://pacific-rpc.manta.network/http'] },
  },
  blockExplorers: {
    default: { name: 'MantaScan', url: 'https://pacific-explorer.manta.network' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_337,
    },
  },
}

const mantaPacificSepolia: Chain = {
  id: 3441006,
  name: 'Manta Pacific Sepolia Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://pacific-rpc.sepolia-testnet.manta.network/http'] },
    public: { http: ['https://pacific-rpc.sepolia-testnet.manta.network/http'] },
  },
  blockExplorers: {
    default: { name: 'MantaScan', url: 'https://pacific-explorer.sepolia-testnet.manta.network' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_337,
    },
  },
}

// zkLink Nova 网络配置
const zkLinkNova: Chain = {
  id: 810180,
  name: 'zkLink Nova',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.zklink.io'] },
    public: { http: ['https://rpc.zklink.io'] },
  },
  blockExplorers: {
    default: { name: 'zkLink Explorer', url: 'https://explorer.zklink.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_337,
    },
  },
}

const zkLinkNovaSepolia: Chain = {
  id: 810181,
  name: 'zkLink Nova Sepolia Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.rpc.zklink.io'] },
    public: { http: ['https://sepolia.rpc.zklink.io'] },
  },
  blockExplorers: {
    default: { name: 'zkLink Explorer', url: 'https://sepolia.explorer.zklink.io' },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1_337,
    },
  },
}

// 定义支持的链
const chains = [
  // 以太坊及其测试网
  mainnet,    // Ethereum 主网
  sepolia,    // Sepolia 测试网
  goerli,     // Goerli 测试网

  // BSC 网络
  bsc,        // BSC 主网
  bscTestnet, // BSC 测试网
  opBNB,      // opBNB 主网
  opBNBTestnet, // opBNB 测试网

  // Polygon 网络
  polygon,    // Polygon 主网
  polygonMumbai, // Mumbai 测试网
  polygonZkEvm,  // Polygon zkEVM 主网
  polygonZkEvmTestnet, // Polygon zkEVM 测试网

  // Arbitrum 网络
  arbitrum,   // Arbitrum One 主网
  arbitrumSepolia, // Arbitrum Sepolia 测试网
  arbitrumNova,    // Arbitrum Nova

  // Optimism 网络
  optimism,   // Optimism 主网
  optimismSepolia, // Optimism Sepolia 测试网

  // Base 网络
  base,       // Base 主网
  baseSepolia, // Base Sepolia 测试网

  // zkSync 网络
  zkSync,     // zkSync Era 主网
  zkSyncSepoliaTestnet, // zkSync Era 测试网

  // Mantle 网络
  mantle,     // Mantle 主网
  mantleSepolia, // Mantle Sepolia 测试网

  // Manta Pacific 网络
  mantaPacific, // Manta Pacific 主网
  mantaPacificSepolia, // Manta Pacific Sepolia 测试网

  // Linea 网络
  linea,      // Linea 主网
  lineaSepolia, // Linea Sepolia 测试网

  // zkLink 网络
  zkLinkNova, // zkLink Nova 主网
  zkLinkNovaSepolia, // zkLink Nova Sepolia 测试网

  // 其他 L1/L2 网络
  gnosis,     // Gnosis Chain (原 xDai)
  avalanche,  // Avalanche C-Chain
  avalancheFuji, // Avalanche Fuji 测试网
  fantom,     // Fantom Opera
  fantomTestnet, // Fantom 测试网
  celo,       // Celo 主网
  celoAlfajores, // Celo Alfajores 测试网
  aurora,     // Aurora 主网
  auroraTestnet, // Aurora 测试网
  metis,      // Metis Andromeda
  metisGoerli,  // Metis Goerli 测试网
  cronos,     // Cronos 主网
  cronosTestnet, // Cronos 测试网
]

export const config = createConfig({
  chains,
  transports: Object.fromEntries(
    chains.map(chain => [chain.id, http()])
  ),
  ssr: false,
})

// 配置 Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: '76324e339c1841f2b0f5ee6c384fa14c',
  chains,
  defaultChain: mainnet,
  featuredWalletIds: [],
  themeMode: 'light',
}) 