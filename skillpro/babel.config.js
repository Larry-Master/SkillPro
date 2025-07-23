module.exports = {
  presets: [
    ['next/babel', {
      'preset-react': { runtime: 'automatic' }, // Enable modern JSX transform
    }],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
