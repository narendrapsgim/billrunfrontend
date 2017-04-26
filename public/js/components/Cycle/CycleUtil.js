export const getDateToDisplay = str => str.substr(0, str.indexOf(' '));

export const getCycleName = cycle => `cycle of ${getDateToDisplay(cycle.get('start_date', ''))} - ${getDateToDisplay(cycle.get('end_date', ''))}`;
