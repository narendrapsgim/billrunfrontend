const importCustomersCSV = [];
const importSubscriptionsCSV = [];
const accounts = [];
const bills = [];
const lines = [];


function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function replaceDate(stringifyJson = '') {
  let replaceDateString = stringifyJson;
  replaceDateString = replaceDateString.replace(/"REPRIGHT/g, '{$date:"');
  replaceDateString = replaceDateString.replace(/REPLEFT"/g, '"}');
  return replaceDateString;
}

function getRandomPlanName() {
  const randomPlanIndex = chance.integer({ min: 0, max: 4 });
  return config.plans[randomPlanIndex];
}

function saveFile(data, filename = 'data.json') {
  if (!data) {
    console.error('Console.save: No data');
    return;
  }

  const type = filename.includes('.json') ? 'json' : 'csv';

  if (typeof data !== 'string') {
    data = (type === 'csv')
      ? Papa.unparse(data)
      : JSON.stringify(data);
  }

  const blob = new Blob([data], { type: 'text/json' });
  const e = document.createEvent('MouseEvents');
  const a = document.createElement('a');

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = [`text/${type}`, a.download, a.href].join(':');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
}

function generateDemoData() {
  for (let aid = 1; aid <= config.accountsAmount; aid++) {
    const limit = new Date().getMonth();
    const month = chance.integer({ min: 0, max: limit });
    const accountCreationDate = moment(new Date(2016, month, 1)).utc();
    const accountToDate = moment(accountCreationDate).add(10, 'years').utc();

    const account = {
      firstname: chance.first(),
      lastname: chance.last(),
      email: chance.email(),
      country: chance.country({ full: true }),
      address: chance.address(),
      type: 'account',
      from: `REPRIGHT${accountCreationDate.format()}REPLEFT`,
      to: `REPRIGHT${accountToDate.format()}REPLEFT`,
      aid,
    };
    accounts.push(account);

    /* Generate account subscribers */
    const subCreationDate = moment(randomDate(new Date(accountCreationDate.format()), new Date(2016, month, 29))).utc();
    for (var sid = 1; sid <= config.subscribersAmount; sid++) {
      const churing = chance.bool({ likelihood: 99 });
      const subToDate = churing ? moment(subCreationDate).add(3, 'months').utc() : moment(subCreationDate).add(10, 'years').utc();

      const subscriber = {
        aid: account.aid,
        firstname: chance.first(),
        lastname: chance.last(),
        plan: getRandomPlanName(),
        address: chance.country({ full: true }),
        country: chance.country({ full: true }),
        type: 'subscriber',
        from: `REPRIGHT${subCreationDate.format()}REPLEFT`,
        plan_activation: `REPRIGHT${subCreationDate.format()}REPLEFT`,
        to: `REPRIGHT${subToDate.format()}REPLEFT`,
        sid,
        // creation_time: 'REPRIGHT' + subCreationDate.format() + 'REPLEFT',
      };
      accounts.push(subscriber);
    }

    /* Generate account Bills */
    const billMonths = moment().utc().diff(moment((moment(new Date(2016, month, 1)).add(-5, 'months').utc())), 'months', false);
    for (let j = 0; j < billMonths; j++) {
      const billDate = accountCreationDate.add(+j - 1, 'months').utc();
      const bill = {
        dir: 'fc',
        method: 'credit',
        aid: account.aid,
        type: 'rec',
        amount: 0.2,
        due: chance.integer({ min: 100, max: 2000 }),
        urt: `REPRIGHT${billDate.format()}REPLEFT`,
        payer_name: '1',
        source: 'cycle',
        left: 0.2,
        txid: '0000000000014',
        waiting_for_confirmation: false,
        confirmation_time: `REPRIGHT${billDate.format()}REPLEFT`,
      };
      bills.push(bill);
    }

    /* Generate account Lines */
    const basedate = moment(new Date()).add(-6, 'months').utc();
    for (let j = 0; j < 8; j++) {
      const lineCreationDate = basedate.add(+1, 'months').utc();
      const line = {
        aid: account.aid,
        sid: account.aid + 100000,
        source: 'billrun',
        billrun: '201607',
        type: 'flat',
        usaget: 'flat',
        urt: `REPRIGHT${lineCreationDate.format()}REPLEFT`,
        aprice: chance.floating({ min: 9.99, max: 99.99, fixed: 2 }),
        plan: getRandomPlanName(),
        process_time: '2016-07-15 01:47:16',
        offer_id_curr: '4175',
        offer_id_next: '4175',
        stamp: `${sid}6f9c46364eeec5ff4398378648dc078${j}`,
      };
      lines.push(line);
    }
  }

  /* generate data for Importer */
  for (let i = 0; i < 5; i++) {
    const uuid = chance.guid()
    importCustomersCSV.push({
      company_name: `${chance.first()} LTD.`,
      contact_name: `${chance.prefix()} ${chance.name()}`,
      email: chance.email(),
      phone: chance.phone(),
      fax: chance.phone(),
      street: chance.street(),
      city: chance.city(),
      state: chance.state(),
      zip_code: chance.zip(),
      firstname: chance.first(),
      lastname: chance.last(),
      address: chance.country({ full: true }),
      country: chance.country({ full: true }),
      legacyunique_field: uuid,
    });
    for (let i = 0; i < 10; i++) {
      importSubscriptionsCSV.push({
        firstname: chance.first(),
        lastname: chance.last(),
        plan: getRandomPlanName(),
        address: chance.country({ full: true }),
        country: chance.country({ full: true }),
        services: [getRandomPlanName(), getRandomPlanName(), getRandomPlanName()],
        extension: chance.word(),
        accound_id: uuid,
      });
    }
  }
  /* ~generate data for Importer */

}


function exportBillsToJson() {
  const dataString = replaceDate(JSON.stringify(bills));
  saveFile(dataString, 'bills.json');
}

function exportSubsToJson() {
  const dataString = replaceDate(JSON.stringify(accounts));
  saveFile(dataString, 'subs.json');
}
function exportLinesToJson() {
  const dataString = replaceDate(JSON.stringify(lines));
  saveFile(dataString, 'lines.json');
}

function downloadCustomersCSV() {
  saveFile(importCustomersCSV, 'customers.csv');
}

function downloadSubscriptionsCSV() {
  saveFile(importSubscriptionsCSV, 'subscriptions.csv');
}

function emptyContent() {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';
}

function apendImporterControlers() {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML += `
    <div class="panel panel-default">
      <div class="panel-heading">CSV for Importer test</div>
      <div class="panel-body">
        <ul class="list-group">

          <li class="list-group-item">
            <button class="badge" onclick="downloadCustomersCSV()">
              <span class="glyphicon glyphicon-download-alt" aria-hidden="true" /></span>&nbsp;
              Download
            </button>
            <h4 class="list-group-item-heading">Customers</h4>
            <p class="list-group-item-text">
            </p>
          </li>

          <li class="list-group-item">
            <button class="badge" onclick="downloadSubscriptionsCSV()">
              <span class="glyphicon glyphicon-download-alt" aria-hidden="true" /></span>&nbsp;
              Download
            </button>
            <h4 class="list-group-item-heading">Subscribers</h4>
            <p class="list-group-item-text">
            </p>
          </li>
      </ul>
    </div>
  </div>`;
}

function apendDashboardControlers() {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML += `
    <div class="panel panel-default">
      <div class="panel-heading">Dashboard Data</div>
      <div class="panel-body">
        <ul class="list-group">

          <li class="list-group-item">
            <button class="badge" onclick="exportBillsToJson()">
              <span class="glyphicon glyphicon-download-alt" aria-hidden="true" /></span>&nbsp;
              Download
            </button>
            <h4 class="list-group-item-heading">Bills</h4>
            <p class="list-group-item-text">
              <code>mongoimport --db billing_cloud --collection bills bills.json --jsonArray</code>
            </p>
          </li>

          <li class="list-group-item">
            <button class="badge" onclick="exportSubsToJson()">
              <span class="glyphicon glyphicon-download-alt" aria-hidden="true" /></span>&nbsp;
              Download
            </button>
            <h4 class="list-group-item-heading">Subscribers</h4>
            <p class="list-group-item-text">
              <code>mongoimport --db billing_cloud --collection subscribers subs.json --jsonArray</code>
            </p>
          </li>

          <li class="list-group-item">
            <button class="badge" onclick="exportLinesToJson()">
              <span class="glyphicon glyphicon-download-alt" aria-hidden="true" /></span>&nbsp;
              Download
            </button>
            <h4 class="list-group-item-heading">Lines</h4>
            <p class="list-group-item-text">
              <code>mongoimport --db billing_cloud --collection lines lines.json --jsonArray</code>
            </p>
          </li>
      </ul>
    </div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  generateDemoData();
  emptyContent();
  apendDashboardControlers();
  apendImporterControlers();
});
