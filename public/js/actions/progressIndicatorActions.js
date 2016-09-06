export const PROGRESS_INDICATOR_FINISH = 'PROGRESS_INDICATOR_FINISH';
export const PROGRESS_INDICATOR_START = 'PROGRESS_INDICATOR_START';
export const PROGRESS_INDICATOR_DISMISS = 'PROGRESS_INDICATOR_DISMISS';

export function startProgressIndicator(){
  return { type: PROGRESS_INDICATOR_START }
}

export function finishProgressIndicator(){
  return { type: PROGRESS_INDICATOR_FINISH }
}

export function dismissProgressIndicator(){
  return { type: PROGRESS_INDICATOR_DISMISS }
}
