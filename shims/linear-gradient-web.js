// Web/SSR shim for `react-native-linear-gradient`.
//
// On web (and especially during Expo's static rendering pass), the real
// `react-native-linear-gradient` calls `requireNativeComponent`, which is not
// available in `react-native-web`. `react-native-gifted-charts` tries to
// `require()` it first and falls back to `expo-linear-gradient`, but the
// latter ships with a `'use client'` directive that fails when imported on
// the server during static export. This shim is wired in via metro.config.js
// for the web platform so the first require succeeds with a CSS-gradient
// implementation that is safe to evaluate on the server.

const React = require('react');
const { View } = require('react-native');

function toRgba(color) {
  if (typeof color !== 'string') return color;
  return color;
}

function buildBackgroundImage(colors, locations, start, end) {
  const safeColors = Array.isArray(colors) && colors.length > 0 ? colors : ['transparent', 'transparent'];

  let angle = 180;
  if (start && end) {
    const sx = start.x != null ? start.x : (Array.isArray(start) ? start[0] : 0.5);
    const sy = start.y != null ? start.y : (Array.isArray(start) ? start[1] : 0);
    const ex = end.x != null ? end.x : (Array.isArray(end) ? end[0] : 0.5);
    const ey = end.y != null ? end.y : (Array.isArray(end) ? end[1] : 1);
    const dx = ex - sx;
    const dy = ey - sy;
    angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  }

  const stops = safeColors.map((c, i) => {
    const color = toRgba(c);
    if (Array.isArray(locations) && typeof locations[i] === 'number') {
      return `${color} ${Math.round(locations[i] * 100)}%`;
    }
    return color;
  });

  return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
}

const LinearGradient = React.forwardRef(function LinearGradient(props, ref) {
  const { colors, locations, start, end, style, children, ...rest } = props || {};
  const backgroundImage = buildBackgroundImage(colors, locations, start, end);
  const mergedStyle = Object.assign({}, style, { backgroundImage });
  return React.createElement(View, Object.assign({ ref, style: mergedStyle }, rest), children);
});

module.exports = LinearGradient;
module.exports.LinearGradient = LinearGradient;
module.exports.default = LinearGradient;
