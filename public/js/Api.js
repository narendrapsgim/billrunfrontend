
export function apiBillRun(request) {
  //Create Prommisses array from queries
  let requests = [];
  for(var i = 0; i < request.queries.length; i++) {
    requests.push(sendHttpRequest(request.queries[i]));
  }
  //Send All prommisses
  var promise = new Promise((resolve, reject) => {
    Promise.all(requests).then(
      success   => { resolve({ type: request.type, data: success }); },
      error     => { reject({ type: request.type, error: error }); }
    ).catch(
      message   => { reject({ type: request.type, error: message }); }
    );
  });
  return promise;
}

//send Http request
export function sendHttpRequest(query) {
  //Create Api URL
  let url = globalSetting.serverUrl + "/api/" + query.request.api + buildQueryParamsString(query.request.params);

  let response = { name: query.name, data: {} };

  let promise = new Promise((resolve, reject) => {
    fetch(url).then(
      success => {
      if(success.ok) {
        success.json().then(
          body => {
            if(body.status) {
              resolve(Object.assign(response, { data: body.details }));
            } else {
              reject(Object.assign(response, { data: body }));
            }
          },
          error => { reject(Object.assign(response, { data: error })); }
        ).catch(
          message => { reject(Object.assign(response, { data: message })); }
        );
      } else {
        reject(Object.assign(response, { data: response }));
      }
    },
    error => { reject(Object.assign(response, { data: error })); });
  });

  return promise;
}

//help function to simulate API response with delay
export function delay(sec = 2, success = true, mock = { 'success': true }) {
  return new Promise((resolve, reject) => {
    let callback = success ? () => {
      resolve(mock);
    } : () => {
      reject(mock);
    };
    setTimeout(callback, sec * 1000);
  });
}

//help function to bulind query params string
function buildQueryParamsString(params){
  let queryParams = params.reduce((previousValue, currentValue, currentIndex) => {
    let key = Object.keys(currentValue)[0];
    let prev = (currentIndex == 0) ? previousValue : previousValue + "&";
    return prev + key + "=" + currentValue[key]
  }, "?");
  return queryParams;
}


// export function getChartMockData(query) {
//   // console.log('CALLING TO API !!!!');
//   let p = new Promise(function(resolve, reject) {
//     setTimeout(() => {
//       if(query && query.type) {
//         let data = {};
//         if(query.type == 'lineData') {
//           data = {
//             title: 'Revenue VS Subscribers',
//             x: [
//               // { label : 'Revenue', values : [65, -39, 120, 81, 56, 55] },
//               {
//                 label: 'Subsctibers',
//                 values: [75, 29, 10, 101, 86, 105]
//               },
//               // { label : 'Plans', values : [10, 59, 100, 101, 86, 10] },
//               // { label : 'B4', values : [75, 79, 70, 71, 70, 55] },
//               // { label : 'B5', values : [55, 24, 10, 101, 86, 55] },
//               // { label : 'B6', values : [65, 28, 10, 101, 86, 55] },
//               // { label : 'B7', values : [25, 109, 10, 101, 86, 55] },
//             ],
//             y: ["January", "February", "March", "April", "May", "June"],
//           };
//         } else if(query.type == 'totalSubscribers') {
//           data = {
//             title: 'Total Subscribers',
//             x: [{
//               label: 'Subsctibers',
//               values: [10048, 10197, 10349, 10504, 10524, 10803]
//             }],
//             y: ["January", "February", "March", "April", "May", "June"],
//           };
//         } else if(query.type == 'newSubscribers') {
//           data = {
//             title: 'New Subscribers',
//             x: [{
//               label: 'Subsctibers',
//               values: [50, 150, 152, 160, 20, 280]
//             }],
//             y: ["January", "February", "March", "April", "May", "June"],
//           };
//         } else if(query.type == 'leavingSubscribers') {
//           data = {
//             title: 'Churning Subscribers',
//             x: [{
//               label: 'Subsctibers',
//               values: [2, 1, 0, 5, 0, 1]
//             }],
//             y: ["January", "February", "March", "April", "May", "June"],
//           };
//         } else if(query.type == 'pieData') {
//           data = {
//             title: 'Subscribers per Plan',
//             labels: ["Plan A", "Plan B", "Plan C", "Plan D", "Plan E", "Plan F"],
//             values: [65, 59, 80, 81, 56, 5]
//           };
//         } else if(query.type == 'bubbleData') {
//           data = {
//             title: 'Revenue VS Subscribers',
//             labels: ["Plan A", "Plan B", "Plan C", "Plan D", "Plan E", "Plan F"],
//             x: [1, 2, 3, 4, 5, 6],
//             y: [65, -39, 120, 81, 56, 55],
//             z: [7, 2, 20, 10, 8, 5]
//           };
//         }
//         resolve({
//           type: query.type,
//           data: data
//         });
//       } else {
//         let message = 'for input ' + query;
//         reject(message + ' promise rejected :(');
//       }
//     }, Math.floor(Math.random() * (5000 - 1000 + 1) + 1000));
//   });
//   return p;
// }
