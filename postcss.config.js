const autoprefixer = require('autoprefixer');
const purgeCSSPlugin = require('@fullhuman/postcss-purgecss').default;

const purgecss = purgeCSSPlugin({
  content: ['./hugo_stats.json'],
  defaultExtractor: content => {
    const els = JSON.parse(content).htmlElements;
    return [
      ...(els.tags || []),
      ...(els.classes || []),
      ...(els.ids || []),
    ];
  },
  // https://purgecss.com/safelisting.html
  safelist: ["toggled", "dark-theme"]
});

module.exports = {
  plugins: [
    process.env.HUGO_ENVIRONMENT !== 'development' ? purgecss : null,
    autoprefixer,
  ]
};