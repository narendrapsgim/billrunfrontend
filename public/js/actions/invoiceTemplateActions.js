export const SET_INVOICE_TEMPLATE = 'SET_INVOICE_TEMPLATE';
export const CLEAR_INVOICE_TEMPLATE = 'CLEAR_COLLECTION';

export function setInvoiceTemplate(path, value) {
  return {
    type: SET_INVOICE_TEMPLATE,
    path,
    value
  };
}

export function clearInvoiceTemplate() {
  return {
    type: CLEAR_INVOICE_TEMPLATE
  };
}