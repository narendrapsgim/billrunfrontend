export const UPDATE_PAYMENT_DETAILS_FIELD = 'UPDATE_PAYMENT_DETAILS_FIELD';
export const SUBMIT_PAYMENT_DETAILS = 'SUBMIT_PAYMENT_DETAILS';

export function updatePaymentDetailsField(field, value) {
  return {
    type: UPDATE_PAYMENT_DETAILS_FIELD,
    field,
    value
  };
}

export function submitPaymentDetails() {
  return {
    type: SUBMIT_PAYMENT_DETAILS
  };
}
