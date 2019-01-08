import React from "react";
import PropTypes from "prop-types";
import styles from "./Todo.module.scss";
import { Card, Checkbox } from "antd";
import { Row } from "react-flexbox-grid/lib";

export function Todo(props) {
  const { name, completed, id, toggle } = props;

  const toggleTodo = () => toggle(id);

  const bodyStyle = {
    padding: "12px 24px",
    border: '0',
    boxShadow: 'none'
  };

  return (
    <Card className={styles.card} bodyStyle={bodyStyle}>
      <Row>
        <Checkbox checked={completed} onChange={toggleTodo} />
        <p className={`${styles.text} ${completed ? styles.completed : ""}`}>
          {name}
        </p>
      </Row>
    </Card>
  );
}

Todo.propTypes = {
  name: PropTypes.string,
  completed: PropTypes.bool,
  id: PropTypes.number,
  toggle: PropTypes.func
};
