import React from 'react';
import PropTypes from 'prop-types';
import { Todo } from './Todo';
import { Col, Row } from 'react-flexbox-grid/lib';

export function TodoList(props) {
  const { todos, toggle } = props;

  const renderTodos = todos.map((todo) => {
    const { name, completed, id } = todo;
    return (
      <Todo
        name={name}
        toggle={toggle}
        key={id}
        id={id}
        completed={completed}
      />
    );
  });

  return (
    <Col xs={12}>
      <Row center="xs">
        {renderTodos}
      </Row>
    </Col>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object),
  toggle: PropTypes.func,
};
