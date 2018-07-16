import {makeReducer} from '#/main/core/scaffolding/reducer'

import {reducer as editorReducer} from '#/main/core/tools/home/editor/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

import {
  CURRENT_TAB
} from '#/main/core/tools/home/actions'

const reducer = {
  currentTabId: makeReducer(null, {
    [CURRENT_TAB]: (state, action) => action.tab
  }),
  tabs: makeReducer([], {
    [FORM_SUBMIT_SUCCESS+'/editor']: (state, action) => action.updatedData.tabs
  }),
  editor: editorReducer
}

export {
  reducer
}
