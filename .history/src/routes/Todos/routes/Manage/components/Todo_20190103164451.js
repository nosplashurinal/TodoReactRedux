import React from "react";
import PropTypes from "prop-types";
import styles from "./Todo.module.scss";
import { Card, Checkbox } from "antd";
import { Row } from "react-flexbox-grid/lib";
import { Button } from "components";
import arrow from "images/up-arrow.png";

export function Todo(props) {
  const { name, completed, id, toggle } = props;

  const toggleTodo = () => toggle(id);

  const bodyStyle = {
    padding: "8px 24px 8px 8px"
  };

  return (
    <Card className={styles.card} bodyStyle={bodyStyle}>
      <Row>
        <div className={styles.reorder_buttons}>
          <Button className={styles.moveup}>
            <img src={arrow} alt="up_arrow" />
          </Button>
          <Button className={styles.movedown}>
            <img src={arrow} alt="down_arrow" />
          </Button>
        </div>
        <Checkbox
          className={styles.checkbox}
          checked={completed}
          onChange={toggleTodo}
        />
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
