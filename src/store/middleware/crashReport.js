import rollbar from 'lib/rollbar';
import { userSelector } from 'modules/user/selectors';
import { debounce } from 'lodash';
import { sanitizeState, sanitize } from 'store/utils';
import { actions } from 'modules/global';
import { GLOBAL_ERROR_MESSAGE } from 'utils/constants';

const { showGlobalError } = actions;

const debouncedSanitizeState = debounce(sanitizeState, 300);
let count = 0;

export const crashReport = (store) => (next) => (action) => {
  try {
    // throw it on the event loop so it doesn't block the current flow
    rollbar.configure({
      payload: {
        [`latest_action_${count++}`]: sanitize(action),
      },
    });

    setTimeout(
      () =>
        rollbar.configure({
          payload: {
            latestState: debouncedSanitizeState(store),
          },
        }),
      0
    );
    next(action);
  } catch (err) {
    rollbar.error(err, {
      action: sanitize(action),
      state: sanitizeState(store),
      user: userSelector(store.getState()),
    });

    // will include Doga's error here in a bit
    store.dispatch(showGlobalError(GLOBAL_ERROR_MESSAGE));
    if (process.env.NODE_ENV === 'dev') {
      console.log(err.stack); // eslint-disable-line
    }
  }
};
