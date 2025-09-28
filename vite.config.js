(async () => {
  const { defineConfig } = await import('vite');
  const react = (await import('@vitejs/plugin-react-swc')).default;

  module.exports = defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  });
})();