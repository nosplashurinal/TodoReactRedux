import { call, takeLatest, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { actionTypes, actions } from './modules';
import { fetchSaga } from 'store/sagas';

const { LOAD_TODOS } = actionTypes;
const { loadFail, loadSuccess } = actions;

export function* loadTodos(request, action) {
  try {
    let endpoint = 'api/todos';
    if (action.error) {
      endpoint = 'api/badrequest';
    }
    // mimic network latency
    yield delay(2000);
    const todos = yield call(request, endpoint, 'GET');
    yield put(loadSuccess(todos));
  } catch (e) {
    yield put(loadFail(e));
  }
}

/**
 * Saga manages page-load calls
 */
export function* watchTodos(request) {
  yield takeLatest(LOAD_TODOS, loadTodos, request);
}


export default [
  fetchSaga(watchTodos),
];
