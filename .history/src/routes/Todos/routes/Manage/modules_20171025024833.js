const initialState = {
  loading: true,
  loaded: false,
  error: false,
  addError: false,
  offset: 0,
  pageSize: 10,
  todos: [],
};

const TOGGLE_TODO = 'todo/manage/TOGGLE_TODO';

function toggleTodo(id) {
  return { type: TOGGLE_TODO, id };
}

function todoReducer(state = {}, action) {
  switch (action.type) {
    case TOGGLE_TODO: {
      const { completed } = state;
      const { id } = action;

      if (id !== state.id) {
        return state;
      }

      return { ...state, completed: !completed };
    }
    default:
      return state;
  }
}

const LOAD_TODOS = 'todo/manage/LOAD_TODOS';
const LOAD_TODOS_SUCCESS = 'todo/manage/LOAD_TODOS_SUCCESS';
const LOAD_TODOS_FAIL = 'todo/manage/LOAD_TODOS_FAIL';

const LOAD_MORE = 'todo/manage/LOAD_MORE';
const ADD_TODO = 'todo/manage/ADD_TODO';
const DELETE_ALL = 'todo/manage/DELETE_ALL';

function loadMore() {
  return { type: LOAD_MORE };
}

function load() {
  return { type: LOAD_TODOS };
}

function loadError() {
  return { type: LOAD_TODOS, error: true };
}

function loadSuccess(todos) {
  return { type: LOAD_TODOS_SUCCESS, todos };
}

function loadFail(error) {
  return { type: LOAD_TODOS_FAIL, error };
}

function addTodo(todo) {
  return { type: ADD_TODO, id: Math.random(), todo };
}

function deleteAll() {
  return { type: DELETE_ALL };
}

const ADD_TODO_WITH_ERROR = 'todo/manage/ADD_TODO_WITH_ERROR';

// This mimics when you have an action that goes to the server and fails,
// we typically include a global error
function addTodoWithError() {
  return { type: ADD_TODO_WITH_ERROR };
}

const REFRESH = 'todo/manage/REFRESH';

function refresh() {
  return { type: REFRESH };
}

function ManageReducer(state = initialState, action) {
  switch (action.type) {
    case REFRESH: {
      return initialState;
    }
    case LOAD_TODOS: {
      return {
        ...state, loading: true, addError: false, error: false,
      };
    }
    case LOAD_TODOS_SUCCESS: {
      const { todos } = action;
      return {
        ...state, loading: false, todos, loaded: true,
      };
    }
    case LOAD_TODOS_FAIL: {
      return {
        ...state, error: true, loading: false,
      };
    }
    case LOAD_MORE: {
      const { pageSize, offset } = state;

      return {
        ...state, offset: pageSize + offset,
      };
    }
    case ADD_TODO: {
      const { id, todo } = action;

      return {
        ...state,
        addError: false,
        todos: [
          { id, name: todo, completed: false },
          ...state.todos,
        ],
      };
    }
    case ADD_TODO_WITH_ERROR: {
      return { ...state, addError: true };
    }
    case DELETE_ALL: {
      return { ...state, todos: [] };
    }
    case TOGGLE_TODO: {
      const todos = state.todos;
      return {
        ...state,
        todos: todos.map((todo) => todoReducer(todo, action)),
      };
    }
    default:
      return state;
  }
}

export const actions = {
  load,
  addTodo,
  addTodoWithError,
  deleteAll,
  loadError,
  loadMore,
  loadSuccess,
  loadFail,
  toggleTodo,
  refresh,
};

export const actionTypes = {
  LOAD_TODOS,
};

export default ManageReducer;
