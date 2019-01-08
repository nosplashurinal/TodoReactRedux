const initialState = {
  loading: true,
  loaded: false,
  error: false,
  addError: false,
  offset: 0,
  pageSize: 10,
  todos: [],
  showCompletedSorted: false,
  showIncompleteSorted: false,
  animatingPair: []
};

const TOGGLE_TODO = "todo/manage/TOGGLE_TODO";
const MOVE_TODO_UP = "todo/manage/MOVE_TODO_UP";
const MOVE_TODO_DOWN = "todo/manage/MOVE_TODO_DOWN";
const TOGGLE_COMPLETED_SORT = "todo/manage/TOGGLE_COMPLETED_SORT";
const TOGGLE_INCOMPLETE_SORT = "todo/manage/TOGGLE_INCOMPLETE_SORT";
const CLEAR_ANIMATIONS = "todo/manage/CLEAR_ANIMATIONS";
const EDIT_TODO = "todo/manage/EDIT_TODO";

function clearAnimations() {
  return { type: CLEAR_ANIMATIONS };
}

function toggleTodo(id) {
  return { type: TOGGLE_TODO, id };
}

function moveTodoUp(id) {
  return { type: MOVE_TODO_UP, id };
}

function moveTodoDown(id) {
  return { type: MOVE_TODO_DOWN, id };
}

function toggleSortedCompletedTodos() {
  return { type: TOGGLE_COMPLETED_SORT };
}

function toggleSortedIncompleteTodos() {
  return { type: TOGGLE_INCOMPLETE_SORT };
}

function editTodo(id, text) {
  console.log(text);
  return { type: EDIT_TODO, id, text };
}

function findPreviousItem(list, itemIndex) {
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
  return indexOfPreviousItem;
}

function findNextItem(list, itemIndex) {
  const listType = list[itemIndex].completed ? "completed" : "incomplete";
  let indexOfNextItem = null;
  if (listType === "completed") {
    for (let i = itemIndex + 1; i <= list.length - 1; i++) {
      if (list[i].completed) {
        indexOfNextItem = i;
        break;
      }
    }
  } else {
    for (let i = itemIndex + 1; i <= list.length - 1; i++) {
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
    case EDIT_TODO: {
      const { id, name } = action;
      const todos = state.todos.map(item => {
        if (item.id === id) return { ...item, name };
        else return item;
      });
      return { ...state, todos };
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
      const index = state.todos.findIndex(listItem => listItem.id === id);
      const previousItemIndex = findPreviousItem(state.todos, index);
      if (previousItemIndex !== null) {
        let todos = state.todos;
        todos = todos.map((item, i) => {
          if (i === index) {
            return todos[previousItemIndex];
          } else if (i === previousItemIndex) {
            return todos[index];
          }
          return item;
        });
        return {
          ...state,
          todos,
          animatingPair: [id, state.todos[previousItemIndex].id]
        };
      }
      return state;
    }
    case MOVE_TODO_DOWN: {
      const { id } = action;
      const index = state.todos.findIndex(listItem => listItem.id === id);
      const nextItemIndex = findNextItem(state.todos, index);
      if (nextItemIndex !== null) {
        let todos = state.todos;
        todos = todos.map((item, i) => {
          if (index === i) {
            return todos[nextItemIndex];
          } else if (i === nextItemIndex) {
            return todos[index];
          }
          return item;
        });
        return {
          ...state,
          todos,
          animatingPair: [state.todos[nextItemIndex].id, id]
        };
      }
      return state;
    }
    case TOGGLE_COMPLETED_SORT: {
      return { ...state, showCompletedSorted: !state.showCompletedSorted };
    }
    case TOGGLE_INCOMPLETE_SORT: {
      return { ...state, showIncompleteSorted: !state.showIncompleteSorted };
    }
    case CLEAR_ANIMATIONS: {
      return { ...state, animatingPair: [] };
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
  toggleSortedCompletedTodos,
  toggleSortedIncompleteTodos,
  refresh,
  clearAnimations,
  editTodo
};

export const actionTypes = {
  LOAD_TODOS
};

export default ManageReducer;
