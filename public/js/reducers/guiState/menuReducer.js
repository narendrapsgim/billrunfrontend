import Immutable from 'immutable';
import { PREPARE_MAIN_MENU_STRUCTURE, prossessMenuTree, combineMenuOverrides } from '../../actions/guiStateActions/menuActions';

const defaultState = Immutable.Map({
  main: null,
});

const menuReducer = (state = defaultState, action) => {
  switch (action.type) {
    case PREPARE_MAIN_MENU_STRUCTURE: {
      const overrides = Immutable.fromJS(action.mainMenuOverrides);
      // const mainMenuTree = Immutable.fromJS(mainMenu).withMutations(mainMenuTreeWithMutations => {
      //   if (overrides && overrides.size) {
      //     overrides.forEach((menuData, menuKey) => {
      //       if (mainMenuTreeWithMutations.has(menuKey)) {
      //         menuData.forEach((value, menuProperty) => {
      //           mainMenuTreeWithMutations.setIn([menuKey, menuProperty], value);
      //         });
      //       }
      //     });
      //   }
      // });
      return state.set('main', prossessMenuTree(combineMenuOverrides(overrides), 'root'));
    }
    default:
      return state;
  }
};

export default menuReducer;
