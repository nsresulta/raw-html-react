module.exports = require('babel-jest').createTransformer({
  presets: [
    'react',
    [
      'env',
      {
        useBuiltIns: 'entry',
        targets: {
          browsers: ['> 0.5%']
        }
      }
    ],
    'stage-1'
  ],
  plugins: [
    [
      'transform-runtime',
      {
        helpers: true,
        polyfill: true,
        regenerator: true
      }
    ]
  ]
});
