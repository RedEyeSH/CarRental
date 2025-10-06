// (async () => {
//   const { defineConfig } = await import('vite');
//   const react = (await import('@vitejs/plugin-react-swc')).default;

//   module.exports = defineConfig({
//     plugins: [react()],
//     base: '/CarRental/',
//     server: {
//       host: '0.0.0.0',
//       port: 3000,
//     },
//   });
// })();
// PLEASE WORK
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/CarRental/",
  server: {
    host: "0.0.0.0",
    port: 3001,
  },
});
