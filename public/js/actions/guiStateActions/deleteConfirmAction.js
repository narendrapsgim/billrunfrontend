export const TOGGLE_DELETE_CONFIRM = 'TOGGLE_DELETE_CONFIRM';

export function toggleDeleteConfirm(desc) {
  return {
    type: TOGGLE_DELETE_CONFIRM,
    desc
  };
}