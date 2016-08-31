var palitra = {
  light:    ['#F06292', '#64B5F6', '#FFB74D', '#81C784', '#9575CD', '#E57373', '#7986CB', '#FFD54F', '#4DB6AC', '#BA68C8'],
  normal:   ['#E91E63', '#2196F3', '#FF9800', '#4CAF50', '#673AB7', '#F44336', '#3F51B5', '#FFC107', '#009688', '#9C27B0'],
  dark:     ['#C2185B', '#1976D2', '#F57C00', '#388E3C', '#512DA8', '#D32F2F', '#303F9F', '#FFA000', '#00796B', '#7B1FA2']
};

export function palitra(index = 0, type = 'normal') {
  let i = (index % palitra.normal.length);
  return palitra[type][i];
}

export function trend(direction = 0, type = 'normal') {
  let i = direction < 0 ? 5 : 3;
  return palitra[type][i];
}

export function hexToRgba(hex, opacity) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
}
