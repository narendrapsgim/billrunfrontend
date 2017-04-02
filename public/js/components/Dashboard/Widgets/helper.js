import moment from 'moment';
import countries from './countries.json';

export function getCountryKeyByCountryName(name, notSetValue = null) {
  for (const key in countries) {
    if (countries[key] === name) {
      return key;
    }
  }
  return notSetValue;
}

export function getMonthName(index) {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return names[(index - 1) % 12];
}

export function getYearsToDisplay(dateFrom, dateTo) {
  const datesToDisplay = {};
  const dateDiffIter = moment.twix(dateFrom, moment(dateTo).add(1, 'months')).iterateInner('months');
  while (dateDiffIter.hasNext()) {
    const next = dateDiffIter.next();
    const year = next.format('Y');
    const month = next.format('M');
    if (!datesToDisplay.hasOwnProperty(year)) {
      datesToDisplay[year] = [];
    }
    datesToDisplay[year].push(month);
  }
  return datesToDisplay;
}

export function chartOptionCurrencyAxesLabel(value) {
  if (value === 0) {
    return 0;
  } else if (value >= 1000) {
    return `${value / 1000}K${globalSetting.currency}`;
  }
  return value + globalSetting.currency;
}

export function chartOptionCurrencyTooltipLabel(tooltipItems) {
  const value = tooltipItems.yLabel;
  if (value === 0) {
    return '0';
  } else if (value >= 1000) {
    return `${value / 1000}K${globalSetting.currency}`;
  }
  return value + globalSetting.currency;
}

export function drawDataOnPie() {
  const self = this.chart.config;
  const ctx = this.chart.ctx;
  const chart = this.chart;

  ctx.font = 'bold 12px Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';

  self.data.datasets.forEach((dataset) => {
    let total = 0; // total values to compute fraction
    const labelxy = [];
    const offset = Math.PI / 2; // start sector from top
    let radius;
    let centerx;
    let centery;
    let lastend = 0; // prev arc's end line: starting with 0


      // TODO needs improvement
    let i = 0;
    let meta = dataset._meta[i];
    while (!meta) {
      i += 1;
      meta = dataset._meta[i];
    }


    for (let index = 0; index < dataset.data.length; index += 1) {
      if (!meta.data[index].hidden) {
        total += dataset.data[index];
      }
    }

    let element;
    for (let index = 0; index < meta.data.length; index += 1) {
      element = meta.data[index];
      radius = (0.9 * element._view.outerRadius) - element._view.innerRadius;
      centerx = element._model.x;
      centery = element._model.y;
      const thispart = dataset.data[index];
      const arcsector = Math.PI * ((2 * thispart) / total);
      if (element.hasValue() && dataset.data[index] > 0 && !element.hidden) {
        labelxy.push(lastend + (arcsector / 2) + Math.PI + offset);
      } else {
        labelxy.push(-1);
      }
      lastend += arcsector;
    }

    const lradius = (radius * 3) / 4;
    for (const idx in labelxy) {
      if (labelxy[idx] !== -1) {
        const langle = labelxy[idx];
        const dx = centerx + (lradius * Math.cos(langle));
        const dy = centery + (lradius * Math.sin(langle));
        const val = (Math.round(dataset.data[idx] / total) * 100);
        const suffix = (typeof chart.config.options.valueSuffix !== 'undefined') ? chart.config.options.valueSuffix : '';
        ctx.fillText(`${dataset.data[idx] + suffix} (${val}%)`, dx, dy);
        ctx.fillText(chart.config.data.labels[idx], dx, dy + 15);
      }
    }
    ctx.restore();
  });
}

export function isEmptyData(data) {
  return data && data.data && (data.data.length === 0);
}

export function isPointDate({ year, month }, { year: pointYear, month: pointMonth }) {
  return String(month) === String(pointMonth) && String(year) === String(pointYear);
}
