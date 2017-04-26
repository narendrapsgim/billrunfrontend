import chartPalitra from './palitra.json';

export const palitra = (index = 0, type = 'normal') => {
  const i = (index % chartPalitra.normal.length);
  return chartPalitra[type][i];
};

export const trend = (direction = 0, type = 'normal') => {
  const i = direction < 0 ? 5 : 3;
  return chartPalitra[type][i];
};

export function hexToRgba(hex, opacity = 1) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
