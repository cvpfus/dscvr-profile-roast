import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy":
        "connect-src https://*.solana.com/ https://rpc.hellomoon.io https://simple-server-chi.vercel.app https://actions-registry.dial.to https://proxy.dial.to https://cvpfus.xyz https://edge1-proxy.dscvr.cloud; img-src https://proxy.dial.to https://ui-avatars.com https://images.dscvr.one;",
    },
  },
});
