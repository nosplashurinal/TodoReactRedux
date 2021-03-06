const initialState = {
  loading: true,
  loaded: false,
  error: false,
  addError: false,
  offset: 0,
  pageSize: 10,
  todos: []
};

const TOGGLE_TODO = "todo/manage/TOGGLE_TODO";
const MOVE_TODO_UP = "todo/manage/MOVE_TODO_UP";
const MOVE_TODO_DOWN = "todo/manage/MOVE_TODO_DOWN";

function toggleTodo(id) {
  return { type: TOGGLE_TODO, id };
}

function moveTodoUp(index) {
  return { type: MOVE_TODO_UP, index };
}

function moveTodoDown(index) {
  return { type: MOVE_TODO_DOWN, index };
}

function findPreviousItem(list, id) {
  const itemIndex = list.findIndex((listItem) => listItem.id === id);
  const listType = list[itemIndex].completed ? "completed" : "incomplete";
  let indexOfPreviousItem = null;
  if (listType === "completed") {
    for (let i = itemIndex - 1; i >= 0; i--) {
      if (list[i].completed) {
        indexOfPreviousItem = i;
        break;
      }
    }
  } else {
    for (let i = itemIndex - 1; i >= 0; i--) {
      if (!list[i].completed) {
        indexOfPreviousItem = i;
        break;
      }
    }
  }
  console.log("list is", list);
  console.log("previous index is", indexOfPreviousItem);
  return indexOfPreviousItem;
}

function findNextItem(list, id) {
  const itemIndex = list.findIndex((listItem) => listItem.id === id);
  const listType = list[itemIndex].completed ? "completed" : "incomplete";
  let indexOfNextItem = null;
  if (listType === "completed") {
    for (let i = itemIndex + 1; i <= list.length; i++) {
      if (list[i].completed) {
        indexOfNextItem = i;
        break;
      }
    }
  } else {
    for (let i = itemIndex + 1; i <= list.length; i++) {
      if (!list[i].completed) {
        indexOfNextItem = i;
        break;
      }
    }
  }
  return indexOfNextItem;
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

const LOAD_TODOS = "todo/manage/LOAD_TODOS";
const LOAD_TODOS_SUCCESS = "todo/manage/LOAD_TODOS_SUCCESS";
const LOAD_TODOS_FAIL = "todo/manage/LOAD_TODOS_FAIL";

const LOAD_MORE = "todo/manage/LOAD_MORE";
const ADD_TODO = "todo/manage/ADD_TODO";
const DELETE_ALL = "todo/manage/DELETE_ALL";

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

const ADD_TODO_WITH_ERROR = "todo/manage/ADD_TODO_WITH_ERROR";

// This mimics when you have an action that goes to the server and fails,
// we typically include a global error
function addTodoWithError() {
  return { type: ADD_TODO_WITH_ERROR };
}

const REFRESH = "todo/manage/REFRESH";

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
        ...state,
        loading: true,
        addError: false,
        error: false
      };
    }
    case LOAD_TODOS_SUCCESS: {
      const { todos } = action;
      return {
        ...state,
        loading: false,
        todos,
        loaded: true
      };
    }
    case LOAD_TODOS_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }
    case LOAD_MORE: {
      const { pageSize, offset } = state;

      return {
        ...state,
        offset: pageSize + offset
      };
    }
    case ADD_TODO: {
      const { id, todo } = action;

      return {
        ...state,
        addError: false,
        todos: [{ id, name: todo, completed: false }, ...state.todos]
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
        todos: todos.map(todo => todoReducer(todo, action))
      };
    }
    case MOVE_TODO_UP: {
      const { id } = action;
      const previousItemIndex = findPreviousItem(state.todos, id);
      if (previousItemIndex) {
        let todos = state.todos;
        todos = todos.map((item, i) => {
          if (index === i) {
            return todos[previousItemIndex];
          } else if (index === previousItemIndex) {
            return todos[index];
          }
          return item;
        });
        return { ...state, todos };
      }
      return state;
    }
    case MOVE_TODO_DOWN: {
      const { index } = action;
      const nextItemIndex = findNextItem(state.todos, index);
      if (nextItemIndex) {
        let todos = state.todos;
        todos = todos.map((item, i) => {
          if (index === i) {
            return todos[nextItemIndex];
          } else if (index === nextItemIndex) {
            return todos[index];
          }
          return item;
        });
        return { ...state, todos };
      }
      return state;
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
  moveTodoUp,
  moveTodoDown,
  refresh
};

export const actionTypes = {
  LOAD_TODOS
};

export default ManageReducer;
