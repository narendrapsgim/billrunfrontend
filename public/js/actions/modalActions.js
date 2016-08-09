export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

export function showModal(message, title = '') {
  return {
    type: SHOW_MODAL,
    title,
    message
  };
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  };
}
