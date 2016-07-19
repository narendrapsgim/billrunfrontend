
export function getMonthName(intex){
  let names =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return names[(intex-1) % 11 ]
}

export function getMonthsToDisplay(count, fromDate = new Date()){
  let monthsToShow = Array.from(Array(count), (v, k) => {
        let date = new Date(fromDate);
        date = new Date(date.setMonth(date.getMonth() - k));
        let monthNumber = new Date(date.setMonth(date.getMonth() + 1)).getMonth();
        return monthNumber ? monthNumber : 12;
      }).reverse();
  return monthsToShow;
}

export function getFromDate(before, type, from = new Date()){
  from.setUTCHours(0);
  from.setUTCMinutes(0);
  from.setUTCSeconds(0);
  var tempDate = new Date(from);
  tempDate.setUTCDate(1); // calc from beginning on tyhe month
  let dDate = from;
  switch (type) {
    case 'years':   return new Date(tempDate.setUTCFullYear(tempDate.getUTCFullYear() - before));
    case 'months':  return new Date(tempDate.setUTCMonth(tempDate.getUTCMonth() - before));
    case 'days':    return new Date(tempDate.setUTCDate(tempDate.getUTCDate() - before));
    default:
  }
}

export function getToDate(to = new Date()){
  to.setUTCHours(0);
  to.setUTCMinutes(0);
  to.setUTCSeconds(0);
  return to;
}

export function drawDataOnPie() {
    var self = this.chart.config;
    var ctx = this.chart.ctx;
    var chart = this.chart;

    ctx.font = 'bold 12px Roboto, sans-serif';
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";

    self.data.datasets.forEach(function (dataset, datasetIndex) {
      var total = 0, //total values to compute fraction
        labelxy = [],
        offset = Math.PI / 2, //start sector from top
        radius,
        centerx,
        centery,
        lastend = 0; //prev arc's end line: starting with 0


      //TODO needs improvement
      var i = 0;
      var meta = dataset._meta[i];
      while(!meta) {
        i++;
        meta = dataset._meta[i];
      }


      for(var index = 0; index < dataset.data.length; index++) {
        if(!meta.data[index].hidden){
          total += dataset.data[index];
        }
      }

      var element;
      for(var index = 0; index < meta.data.length; index++) {
        element = meta.data[index];
        radius = 0.9 * element._view.outerRadius - element._view.innerRadius;
        centerx = element._model.x;
        centery = element._model.y;
        var thispart = dataset.data[index],
          arcsector = Math.PI * (2 * thispart / total);
        if (element.hasValue() && dataset.data[index] > 0 && !element.hidden) {
          labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
        }
        else {
          labelxy.push(-1);
        }
        lastend += arcsector;
      }

      var lradius = radius * 3 / 4;
      for (var idx in labelxy) {
        if (labelxy[idx] === -1) continue;
        var langle = labelxy[idx],
        dx = centerx + lradius * Math.cos(langle),
        dy = centery + lradius * Math.sin(langle),
        val = Math.round(dataset.data[idx] / total * 100);
        ctx.fillText(dataset.data[idx] + " (" + val + '%)', dx, dy);
        ctx.fillText(chart.config.data.labels[idx], dx, dy+15);
      }
      ctx.restore();
    });
}
