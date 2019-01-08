import React from "react";
import PropTypes from "prop-types";
import { Todo } from "./Todo";
import styles from "./TodoList.module.scss";
import { Col, Row } from "react-flexbox-grid/lib";

export function TodoList(props) {
  const { todos, toggle, moveUp, moveDown } = props;
  const renderTodos = todos.map((todo, index) => {
    const { name, completed, id } = todo;
    return (
      <Col md={12} key={id}>
        <Row start="md">
          <Todo
            name={name}
            toggle={toggle}
            id={id}
            index={index}
            completed={completed}
            moveDown={moveDown}
            moveUp={moveUp}
          />
        </Row>
      </Col>
    );
  });

  return (
    <Col xs={12}>
      <Row center="xs">{renderTodos}</Row>
    </Col>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object),
  toggle: PropTypes.func,
  moveUp: PropTypes.func,
  moveDown: PropTypes.func,
  animatingPair: PropTypes.array
};
