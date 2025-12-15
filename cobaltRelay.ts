// app/cobaltRelay.ts
import { createBaseAccountSDK } from "@base-org/account";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatEther,
  parseAbi,
} from "viem";
import { base, baseSepolia } from "viem/chains";

type NetworkKey = "base" | "baseSepolia";

const RPC: Record<NetworkKey, string> = {
  base: (import.meta as any).env?.VITE_BASE_RPC_URL || "https://mainnet.base.org",
  baseSepolia:
    (import.meta as any).env?.VITE_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
};

const EXPLORER: Record<NetworkKey, string> = {
  base: "https://basescan.org",
  baseSepolia: "https://sepolia.basescan.org",
};

const CHAIN_ID: Record<NetworkKey, number> = {
  base: 8453,
  baseSepolia: 84532,
};

const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
]);

function $(id: string) {
  const n = document.getElementById(id);
  if (!n) throw new Error(`Missing element #${id}`);
  return n;
}

function setStatus(text: string) {
  $("status").textContent = text;
}

function log(line: string) {
  const out = $("out");
  out.textContent = `${out.textContent || ""}${line}\n`;
}

function isAddress(v: string): v is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim());
}

function addr(v: string): `0x${string}` {
  const t = v.trim();
  if (!isAddress(t)) throw new Error("Invalid address");
  return t;
}

function networkFromSelect(v: string): NetworkKey {
  return v === "base" ? "base" : "baseSepolia";
}

export async function runCobaltRelay() {
  $("out").textContent = "";

  const net = networkFromSelect(($("network") as HTMLSelectElement).value);
  const chain = net === "base" ? base : baseSepolia;
  const rpcUrl = RPC[net];
  const explorer = EXPLORER[net];
  const expectedChainId = CHAIN_ID[net];

  setStatus("Initializing Base Account SDK…");

  const sdk = createBaseAccountSDK({
    appName: "CobaltRelay (Built for Base)",
    appLogoUrl: "https://base.org/favicon.ico",
    appChainIds: [8453, 84532],
  });

  const provider = sdk.getProvider();

  const walletClient = createWalletClient({
    chain,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  log(`Built for Base — target=${chain.name} chainId=${expectedChainId}`);
  log(`Explorer: ${explorer}`);
  log(`RPC: ${rpcUrl}`);

  setStatus("Connecting wallet…");
  const addresses = await walletClient.requestAddresses();
  const user = addresses?.[0];
  if (!user) throw new Error("No address returned from wallet");
  log(`Connected address: ${user}`);
  log(`Basescan address: ${explorer}/address/${user}`);

  setStatus("Reading chain state…");
  const [rpcChainId, blockNumber, balanceWei] = await Promise.all([
    publicClient.getChainId(),
    publicClient.getBlockNumber(),
    publicClient.getBalance({ address: user }),
  ]);

  log(`RPC chainId: ${rpcChainId}`);
  log(`Latest block: ${blockNumber}`);
  log(`Native balance: ${formatEther(balanceWei)} ETH`);

  if (rpcChainId !== expectedChainId) {
    log(
      `Warning: wallet/RPC mismatch. Expected ${expectedChainId} but RPC returned ${rpcChainId}.`
    );
  }

  const contractInput = ($("contract") as HTMLInputElement).value.trim();
  if (contractInput) {
    const ca = addr(contractInput);
    log(`Contract address: ${ca}`);
    log(`Basescan contract: ${explorer}/address/${ca}`);
    log(`Basescan verification: ${explorer}/address/${ca}#code`);
  }

  const tokenInput = ($("token") as HTMLInputElement).value.trim();
  if (tokenInput) {
    const token = addr(tokenInput);

    setStatus("Reading ERC-20 metadata & balance…");

    const [name, symbol, decimals, tokenBal] = await Promise.all([
      publicClient.readContract({ address: token, abi: ERC20_ABI, functionName: "name" }),
      publicClient.readContract({ address: token, abi: ERC20_ABI, functionName: "symbol" }),
      publicClient.readContract({
        address: token,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
      publicClient.readContract({
        address: token,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [user],
      }),
    ]);

    const denom = 10n ** BigInt(decimals as number);
    const whole = (tokenBal as bigint) / denom;
    const frac = (tokenBal as bigint) % denom;

    log(`Token: ${token}`);
    log(`Token Basescan: ${explorer}/address/${token}`);
    log(`Token name: ${name}`);
    log(`Token symbol: ${symbol}`);
    log(`Token decimals: ${decimals}`);
    log(`Token balance (approx): ${whole}.${frac.toString().padStart(Number(decimals), "0")}`);
  }

  setStatus("Done.");
}

if (typeof window !== "undefined") {
  (window as any).runCobaltRelay = runCobaltRelay;

  window.addEventListener("DOMContentLoaded", () => {
    const runBtn = document.getElementById("run");
    if (runBtn) {
      runBtn.addEventListener("click", async () => {
        try {
          await runCobaltRelay();
        } catch (e: any) {
          setStatus("Error");
          log(`Error: ${e?.message || String(e)}`);
          console.error(e);
        }
      });
    }
  });
}
