import moment from 'moment';
import twix from 'twix';

var countries = {
  "AFG": "Afghanistan",
  "AGO": "Angola",
  "ALB": "Albania",
  "ARE": "United Arab Emirates",
  "ARG": "Argentina",
  "ARM": "Armenia",
  "AUS": "Australia",
  "AUT": "Austria",
  "AZE": "Azerbaijan",
  "BDI": "Burundi",
  "BEL": "Belgium",
  "BEN": "Benin",
  "BFA": "Burkina Faso",
  "BGD": "Bangladesh",
  "BGR": "Bulgaria",
  "BHS": "The Bahamas",
  "BIH": "Bosnia and Herzegovina",
  "BLR": "Belarus",
  "BLZ": "Belize",
  "BOL": "Bolivia",
  "BRA": "Brazil",
  "BRN": "Brunei",
  "BTN": "Bhutan",
  "BWA": "Botswana",
  "CAF": "Central African Republic",
  "CAN": "Canada",
  "CHE": "Switzerland",
  "CHL": "Chile",
  "CHN": "China",
  "CIV": "Ivory Coast",
  "CMR": "Cameroon",
  "COD": "Democratic Republic of the Congo",
  "COG": "Republic of the Congo",
  "COL": "Colombia",
  "CRI": "Costa Rica",
  "CUB": "Cuba",
  "CYP": "Cyprus",
  "CZE": "Czech Republic",
  "DEU": "Germany",
  "DJI": "Djibouti",
  "DNK": "Denmark",
  "DOM": "Dominican Republic",
  "DZA": "Algeria",
  "ECU": "Ecuador",
  "EGY": "Egypt",
  "ERI": "Eritrea",
  "ESP": "Spain",
  "EST": "Estonia",
  "ETH": "Ethiopia",
  "FIN": "Finland",
  "FJI": "Fiji",
  "FLK": "Falkland Islands",
  "FRA": "France",
  "GUF": "French Guiana",
  "GAB": "Gabon",
  "GBR": "United Kingdom",
  "GEO": "Georgia",
  "GHA": "Ghana",
  "GIN": "Guinea",
  "GMB": "Gambia",
  "GNB": "Guinea Bissau",
  "GNQ": "Equatorial Guinea",
  "GRC": "Greece",
  "GRL": "Greenland",
  "GTM": "Guatemala",
  "GUY": "Guyana",
  "HND": "Honduras",
  "HRV": "Croatia",
  "HTI": "Haiti",
  "HUN": "Hungary",
  "IDN": "Indonesia",
  "IND": "India",
  "IRL": "Ireland",
  "IRN": "Iran",
  "IRQ": "Iraq",
  "ISL": "Iceland",
  "ISR": "Israel",
  "ITA": "Italy",
  "JAM": "Jamaica",
  "JOR": "Jordan",
  "JPN": "Japan",
  "KAZ": "Kazakhstan",
  "KEN": "Kenya",
  "KGZ": "Kyrgyzstan",
  "KHM": "Cambodia",
  "KOR": "South Korea",
  "KWT": "Kuwait",
  "LAO": "Laos",
  "LBN": "Lebanon",
  "LBR": "Liberia",
  "LBY": "Libya",
  "LKA": "Sri Lanka",
  "LSO": "Lesotho",
  "LTU": "Lithuania",
  "LUX": "Luxembourg",
  "LVA": "Latvia",
  "MAR": "Morocco",
  "MDA": "Moldova",
  "MDG": "Madagascar",
  "MEX": "Mexico",
  "MKD": "Macedonia",
  "MLI": "Mali",
  "MMR": "Myanmar",
  "MNE": "Montenegro",
  "MNG": "Mongolia",
  "MOZ": "Mozambique",
  "MRT": "Mauritania",
  "MWI": "Malawi",
  "MYS": "Malaysia",
  "NAM": "Namibia",
  "NCL": "New Caledonia",
  "NER": "Niger",
  "NGA": "Nigeria",
  "NIC": "Nicaragua",
  "NLD": "Netherlands",
  "NOR": "Norway",
  "NPL": "Nepal",
  "NZL": "New Zealand",
  "OMN": "Oman",
  "PAK": "Pakistan",
  "PAN": "Panama",
  "PER": "Peru",
  "PHL": "Philippines",
  "PNG": "Papua New Guinea",
  "POL": "Poland",
  "PRI": "Puerto Rico",
  "PRK": "North Korea",
  "PRT": "Portugal",
  "PRY": "Paraguay",
  "QAT": "Qatar",
  "ROU": "Romania",
  "RUS": "Russia",
  "RWA": "Rwanda",
  "ESH": "Western Sahara",
  "SAU": "Saudi Arabia",
  "SDN": "Sudan",
  "SSD": "South Sudan",
  "SEN": "Senegal",
  "SLB": "Solomon Islands",
  "SLE": "Sierra Leone",
  "SLV": "El Salvador",
  "SOM": "Somalia",
  "SRB": "Republic of Serbia",
  "SUR": "Suriname",
  "SVK": "Slovakia",
  "SVN": "Slovenia",
  "SWE": "Sweden",
  "SWZ": "Swaziland",
  "SYR": "Syria",
  "TCD": "Chad",
  "TGO": "Togo",
  "THA": "Thailand",
  "TJK": "Tajikistan",
  "TKM": "Turkmenistan",
  "TLS": "East Timor",
  "TTO": "Trinidad and Tobago",
  "TUN": "Tunisia",
  "TUR": "Turkey",
  "TWN": "Taiwan",
  "TZA": "United Republic of Tanzania",
  "UGA": "Uganda",
  "UKR": "Ukraine",
  "URY": "Uruguay",
  "USA": "United States of America",
  "UZB": "Uzbekistan",
  "VEN": "Venezuela",
  "VNM": "Vietnam",
  "VUT": "Vanuatu",
  "PSE": "West Bank",
  "YEM": "Yemen",
  "ZAF": "South Africa",
  "ZMB": "Zambia",
  "ZWE": "Zimbabwe"
};

export function getCountryKeyByCountryName(name) {
  for(var key in countries) {
    if(countries[key] === name) {
        return key;
    }
  }
  return null;
}

export function getMonthName(index){
  let names =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return names[ (index-1) % 12 ]
}

export function getYearsToDisplay(dateFrom, dateTo){
  var datesToDisplay = {};
  var dateDiffIter = moment.twix(dateFrom, moment(dateTo).add(1,'months')).iterateInner("months");
  while (dateDiffIter.hasNext()) {
    let next = dateDiffIter.next();
    let year = next.format('Y')
    let month = next.format('M');
    if(!datesToDisplay.hasOwnProperty(year)){
      datesToDisplay[year] = [];
    }
    datesToDisplay[year].push(month);
  }
  return datesToDisplay;
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


export function chartOptionCurrencyAxesLabel(value, index, values) {
  if(value == 0 ){
    return 0;
  } else if (value >= 1000) {
    return (value/1000) + "K" + globalSetting.currency;
  } else {
    return value + globalSetting.currency;
  }
}

export function chartOptionCurrencyTooltipLabel(tooltipItems, data) {
  var value = tooltipItems.yLabel;
  if(value == 0 ){
    return "0";
  } else if (value >= 1000) {
    return (value/1000) + "K" + globalSetting.currency;
  } else {
    return value + globalSetting.currency;
  }
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
        var suffix = (typeof chart.config.options.valueSuffix !== 'undefined') ? chart.config.options.valueSuffix : '';
        ctx.fillText(dataset.data[idx] + suffix + " (" + val + '%)', dx, dy);
        ctx.fillText(chart.config.data.labels[idx], dx, dy+15);
      }
      ctx.restore();
    });
}
