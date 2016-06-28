export const GOT_INVOICES = 'GOT_INVOICES';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import axios from 'axios';

let axiosInstance = axios.create({
  withCredentials: true,
  baseUrl: globalSetting.serverUrl
});

function gotInvoices(invoices) {
  return {
    type: GOT_INVOICES,
    invoices
  };
}

function fetchInvoices() {
  let dummy_invoices = [
    {
      "_id" : {"$id": "5753d7f22e28c35a0cc42d77"},
      "aid" : 56124,
      "billrun_key" : "201603",
      "invoice_id" : 7098,
      "type" : "inv",
      "bill_unit" : "12",
      "due_date" : "2016-05-23",
      "due" : 100,
      "due_before_vat" : 124.777777778376,
      "customer_status" : "open",
      "payer_name" : "da id",
      "amount" : 100,
      "lastname" : "da",
      "firstname" : "id",
      "country_code" : "5",
      "payment_method" : "Debit",
      "bank_name" : null,
      "BIC" : null,
      "IBAN" : "",
      "RUM" : "",
      "urt" : "2016-06-01T07:55:39.704Z",
      "invoice_date" : "2016-05-23",
      "total_paid" : 100,
      "vatable_left_to_pay" : 0,
      "paid_by" : {
	"rec" : {
	  "0000000000009" : 0.2,
	  "0000000000035" : 99.8
	}
      },
      "source" : "cycle"
    },
    {
      "_id" : {"$id": "574e94fb0a298fcea80b7fb8"},
      "aid" : 46263,
      "billrun_key" : "201603",
      "invoice_id" : 7097,
      "type" : "inv",
      "bill_unit" : "12",
      "due_date" : "2016-05-23",
      "due" : 100,
      "due_before_vat" : 124.777777778376,
      "customer_status" : "open",
      "payer_name" : "da id",
      "amount" : 100,
      "lastname" : "da",
      "firstname" : "id",
      "country_code" : "5",
      "payment_method" : "Debit",
      "bank_name" : null,
      "BIC" : null,
      "IBAN" : "",
      "RUM" : "",
      "urt" : "2016-06-01T07:55:39.704Z",
      "invoice_date" : "2016-05-23",
      "total_paid" : 100,
      "vatable_left_to_pay" : 0,
      "source" : "cycle"
    }
  ];
  
  let fetchUrl = `/api/bill?action=query_bills_invoices&query={}`
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotInvoices(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      /* TODO: REMOVE */
      dispatch(gotInvoices(dummy_invoices));
      dispatch(hideProgressBar());
    });
  };
}

export function getInvoices() {
  return dispatch => {
    return dispatch(fetchInvoices());
  };
}
