import Immutable from 'immutable';
import moment from 'moment';
import changeCase from 'change-case';

const defaultState = Immutable.Map({});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'GOT_DATA': {
      const { chartId, chartData } = action;
      switch (chartId) {
        case 'total_revenue':
        case 'outstanding_debt': {
          const parsedData = Immutable.Map({
            values: Immutable.List(chartData.map(val => val.due)),
          });
          return state.set(chartId, parsedData);
        }

        case 'total_num_of_customers': {
          const parsedData = Immutable.Map({
            values: Immutable.List(chartData.map(val => val.customers_num)),
          });
          return state.set(chartId, parsedData);
        }

        case 'customer_state_distribution': {
          const parsedData = Immutable.Map({
            labels: Immutable.List(chartData.map(val => changeCase.titleCase(val.state))),
            values: Immutable.List(chartData.map(val => val.customers_num)),
          });
          return state.set(chartId, parsedData);
        }

        case 'revenue_by_plan': {
          const parsedData = Immutable.Map({
            labels: Immutable.List(chartData.map(val => val.plan)),
            values: Immutable.List(chartData.map(val => val.amount)),
            sign: Immutable.List(chartData.map(val => val.amount - val.prev_amount)),
          });
          return state.set(chartId, parsedData);
        }

        case 'aging_debt': {
          const parsedData = Immutable.Map({
            x: Immutable.List([
              Immutable.Map({
                label: 'Aging Debt',
                values: Immutable.List(chartData.map(val => val.left_to_pay)),
              }),
            ]),
            y: Immutable.List(chartData.map(val => moment(`${val.billrun_key}01`, 'YYYYMMDD'))),
          });

          return state.set(chartId, parsedData);
        }

        case 'debt_over_time':
        case 'revenue_over_time': {
          const currYear = moment().format('YYYY');
          const lastYear = moment().subtract(1, 'years').format('YYYY');
          const values = {
            [currYear]: [],
            [lastYear]: [],
          };
          chartData.forEach((val) => {
            const year = val.billrun_key.substring(0, 4);
            values[year].push(val.due);
          });
          const lastYearCount = values[lastYear].length;
          const lastYearAvg = values[lastYear].reduce((acc, cur) => acc + cur, 0) / lastYearCount;

          const parsedData = Immutable.Map({
            x: Immutable.List([
              Immutable.Map({
                label: currYear,
                values: Immutable.List(values[currYear]),
              }),
              Immutable.Map({
                label: lastYear,
                values: Immutable.List(values[lastYear]),
              }),
              Immutable.Map({
                label: `${lastYear} AVG`,
                values: Immutable.List(Array.from(Array(lastYearCount)).map(() => lastYearAvg)),
              }),
            ]),
            y: Immutable.List(Array.from(Array(lastYearCount)).map((v, i) => moment().month(i).date(1))),
          });
          return state.set(chartId, parsedData);
        }

        default: {
          return state.set(chartId, Immutable.fromJS(chartData));
        }
      }
    }
    case 'GOT_DATA_ERROR':
      return state.set(action.chartId, null);
    default:
      return state;
  }
}
