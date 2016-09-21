var outputDiv = document.getElementById("output");

var accounts = [];
var bills = [];
var lines = [];


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function replaceDate(stringifyJson) {
  stringifyJson = stringifyJson.replace(/"REPRIGHT/g , '{$date:"');
  stringifyJson = stringifyJson.replace(/REPLEFT"/g , '"}');
  return stringifyJson;
}

function getRandomPlanName() {
  var randomPlanIndex = chance.integer({min: 0, max: 4});
  return config.plans[randomPlanIndex];
}

function saveFile(data, filename) {
    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'data.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

function generateDemoData() {

  for (var aid = 1; aid <= config.accountsAmount; aid++) {

    var limit = new Date().getMonth();
    var month = chance.integer({min: 0, max: limit});
    var accountCreationDate = moment(new Date(2016,month,1)).utc();
    var accountToDate = moment(accountCreationDate).add(10, 'years').utc()

    var account = {
      firstname: chance.first(),
      lastname: chance.last(),
      email: chance.email(),
      country: chance.country({ full: true }),
      address: chance.address(),
      type: "account",
      from: 'REPRIGHT' + accountCreationDate.format() + 'REPLEFT',
      to: 'REPRIGHT' + accountToDate.format() + 'REPLEFT',
      aid: aid,
    };
    accounts.push(account);

    /* Generate account subscribers */
    var subCreationDate = moment(randomDate(new Date(accountCreationDate.format()), new Date(2016,month,29))).utc();
    for (var sid = 1; sid <= config.subscribersAmount; sid++) {

      var churing = chance.bool({likelihood: 99});
      var subToDate = churing ? moment(subCreationDate).add(3, 'months').utc() : moment(subCreationDate).add(10, 'years').utc();

      var subscriber = {
        aid: account.aid,
        firstname: chance.first(),
        lastname: chance.last(),
        plan: getRandomPlanName(),
        address: chance.country({ full: true }),
        country: chance.country({ full: true }),
        type: "subscriber",
        from: 'REPRIGHT' + subCreationDate.format() + 'REPLEFT',
        plan_activation: 'REPRIGHT' + subCreationDate.format() + 'REPLEFT',
        to: 'REPRIGHT' + subToDate.format() + 'REPLEFT',
        sid: sid,
        // creation_time: 'REPRIGHT' + subCreationDate.format() + 'REPLEFT',
      };
      accounts.push(subscriber);
    }

    /* Generate account Bills */
    var billMonths = moment().utc().diff(moment((moment(new Date(2016,month,1)).add(-5, 'months').utc())), 'months', false);
    for (var j = 0; j < billMonths; j++) {
      var billDate = accountCreationDate.add(+j-1, 'months').utc();
      var bill = {
        "dir" : "fc",
        "method" : "credit",
        "aid" : account.aid,
        "type" : "rec",
        "amount" : 0.2,
        "due" : chance.integer({min: 100, max: 2000}),
        "urt" : 'REPRIGHT' + billDate.format() + 'REPLEFT',
        "payer_name" : "1",
        "source" : "cycle",
        "left" : 0.2,
        "txid" : "0000000000014",
        "waiting_for_confirmation" : false,
        "confirmation_time" : 'REPRIGHT' + billDate.format()   + 'REPLEFT',
      };
      bills.push(bill);
    }

    /* Generate account Lines */
    var basedate = moment(new Date()).add(-6, 'months').utc();
    for (var j = 0; j < 8; j++) {
      var lineCreationDate = basedate.add(+1, 'months').utc();
      var line = {
        "aid" : account.aid,
        "sid" : account.aid + 100000,
        "source" : "billrun",
        "billrun" : "201607",
        "type" : "flat",
        "usaget" : "flat",
        "urt" : 'REPRIGHT' + lineCreationDate.format() + 'REPLEFT',
        "aprice" : chance.floating({min: 9.99, max: 99.99, fixed: 2}),
        "plan" : getRandomPlanName(),
        "process_time" : "2016-07-15 01:47:16",
        "offer_id_curr" : "4175",
        "offer_id_next" : "4175",
        "stamp" : sid + "6f9c46364eeec5ff4398378648dc078" + j
      }
      lines.push(line);
    }
  }
}


function exportBillsToJson() {
  var dataString = replaceDate(JSON.stringify(bills));
  saveFile(dataString, 'bills.json')
}

function exportSubsToJson() {
  var dataString = replaceDate(JSON.stringify(accounts));
  saveFile(dataString, 'subs.json')
}
function exportLinesToJson() {
  var dataString = replaceDate(JSON.stringify(lines));
  saveFile(dataString, 'lines.json')
}

function apendControlers(){
  outputDiv.innerHTML = "<ul>";
  outputDiv.innerHTML += `<li>
    <a href='#' id='bills'>Export Bills</a>
    <code> mongoimport --db billing_cloud --collection bills bills.json --jsonArray </code>
  </li>`;
  outputDiv.innerHTML += `<li>
    <a href='#' id='subs'>Export Subscribers</a>
    <code> mongoimport --db billing_cloud --collection subscribers subs.json --jsonArray </code>
  </li>`;
  outputDiv.innerHTML += `<li>
    <a href='#' id='lines'>Export Lines</a>
    <code> mongoimport --db billing_cloud --collection lines lines.json --jsonArray </code>
  </li>`;
  outputDiv.innerHTML += "</ul>";

  var buttonBills = document.getElementById('bills');
  buttonBills.addEventListener('click', exportBillsToJson);

  var buttonSubs = document.getElementById('subs');
  buttonSubs.addEventListener('click', exportSubsToJson);

  var buttonLines = document.getElementById('lines');
  buttonLines.addEventListener('click', exportLinesToJson);
}

document.addEventListener('DOMContentLoaded', function() {
  generateDemoData();
  apendControlers();
});
