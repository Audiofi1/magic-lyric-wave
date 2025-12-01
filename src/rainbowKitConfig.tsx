"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { story, base, celo } from "wagmi/chains";

export default getDefaultConfig({
  appName: "Cross-Credit Lending",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [story, base, celo],
  ssr: false,
});