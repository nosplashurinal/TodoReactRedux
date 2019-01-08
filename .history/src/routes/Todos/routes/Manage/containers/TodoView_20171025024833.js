import React from 'react';
import PropTypes from 'prop-types';
import styles from './TodoView.module.scss';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid/lib';
import { compose } from 'redux';
import {
  LoadComponent,
  StateComponent,
  PaginationComponent,
  AlertDispatcher,
} from 'HOCS';
import {
  completedTodosSelector,
  incompleteTodosLimitedSelector,
  contextSelector,
  paginationSelector,
} from '../selectors';
import { Input, Text, Button, Icon } from 'components';
import { ALERT_TYPES } from 'HOCS/AlertListener';
import { TodoList } from '../components/TodoList';
import { errors, decorators } from 'utils/validators';
import { ALERT_CHANNELS } from 'modules/global/constants';
import { strings } from 'utils/constants';
import { TODO_MANAGE } from '../constants';
import { actions } from '../modules';

const { REFRESH_ICON, ERROR_ICON } = Icon;

const FormInput = Input.form;
const StatefulTodoList = compose(StateComponent, PaginationComponent)(TodoList);

function TodoViewComponent(props) {
  const { completedTodos, incompleteTodos, toggleTodo, load,
    loadError, loading, addTodo, loadMore, offset, pageSize, count,
    handleSubmit, reset, error, addTodoWithError, deleteAll } = props;

  return (
    <Col xs={12}>
      <Row center="xs">
        <Text size="large1" weight="med1">
          Completed
        </Text>
      </Row>
      <Row center="xs">
        <StatefulTodoList
          className={styles.stateContent}
          todos={completedTodos}
          toggle={toggleTodo}
          loading={loading}
          loadingSize={'med1'}
          loadBoxClass={styles.loadBoxClass}
          zeroData={completedTodos.length === 0}
          zeroDataMessage={strings.ZERO_INCOMPLETE_TODOS}
          error={error}
          errorMessage={strings.GLOBAL_ERROR_MESSAGE}
        />
      </Row>
      <Row center="xs">
        <Text size="large1" weight="med1">
          Incomplete
        </Text>
      </Row>
      <Row center="xs">
        <StatefulTodoList
          className={styles.stateContent}
          todos={incompleteTodos}
          toggle={toggleTodo}
          loading={loading}
          loadingSize={'med1'}
          count={count}
          offset={offset}
          pageSize={pageSize}
          loadMore={loadMore}
          loadBoxClass={styles.loadBoxClass}
          zeroData={incompleteTodos.length === 0}
          zeroDataMessage={strings.ZERO_COMPLETE_TODOS}
          error={error}
          errorMessage={strings.GLOBAL_ERROR_MESSAGE}
        />
      </Row>
      <Row center="xs">
        <form
          onSubmit={handleSubmit((values) => {
            addTodo(values.todoItem);
            return reset();
          })}
        >
          <div className={styles.inputBlock}>
            <Row>
              <Col xs={7}>
                <Field
                  name="todoItem"
                  type="input"
                  component={FormInput}
                  disabled={loading}
                  formLayout={{
                    labelSize: 0,
                    inputSize: 12,
                  }}
                  placeholder="Enter to Add Todo (hint try 1 char)"
                  validate={[
                    errors.isRequired,
                    errors.alphanumerical,
                    errors.minLength(2),
                    decorators.forceError(errors.maxLength(20)),
                  ]}
                />
              </Col>
              <Col xs={5}>
                <Button
                  type="primary"
                  onClick={addTodoWithError}
                  disabled={loading}
                >
                  Add Todo with Error
                </Button>
              </Col>
            </Row>
          </div>
        </form>
      </Row>
      <Row center="xs">
        <Button
          type="primary"
          className={styles.button}
          iconType={REFRESH_ICON}
          onClick={load}
          disabled={loading}
        >
          Reload
        </Button>
        <Button
          type="primary"
          className={styles.button}
          iconType={ERROR_ICON}
          onClick={loadError}
          disabled={loading}
        >
          Reload With Error
        </Button>
        <Button
          type="primary"
          className={styles.button}
          iconType={ERROR_ICON}
          onClick={deleteAll}
          disabled={loading}
        >
          Delete All (to see zero state)
        </Button>
      </Row>
    </Col>
  );
}

TodoViewComponent.propTypes = {
  completedTodos: PropTypes.arrayOf(PropTypes.object),
  incompleteTodos: PropTypes.arrayOf(PropTypes.object),
  toggleTodo: PropTypes.func,
  load: PropTypes.func,
  loadError: PropTypes.func,
  loading: PropTypes.bool,
  addTodo: PropTypes.func,
  loadMore: PropTypes.func,
  offset: PropTypes.number,
  pageSize: PropTypes.number,
  count: PropTypes.number,
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  error: PropTypes.bool,
  addTodoWithError: PropTypes.func,
};

import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  completedTodos: completedTodosSelector(state),
  incompleteTodos: incompleteTodosLimitedSelector(state),
  ...contextSelector(state),
  ...paginationSelector(state),
  // These are alert dispatcher properties below
  alertType: ALERT_TYPES.ERROR,
  alertMessage: strings.TODO_ADD_ERROR,
  closeable: true,
});

export const TodoView = compose(
  reduxForm({ form: TODO_MANAGE }),
  connect(mapStateToProps, actions),
  LoadComponent,
  AlertDispatcher(ALERT_CHANNELS.NAVBAR),
)(TodoViewComponent);
