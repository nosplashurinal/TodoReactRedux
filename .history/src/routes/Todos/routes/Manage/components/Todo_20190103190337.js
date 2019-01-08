import React from "react";
import PropTypes from "prop-types";
import styles from "./Todo.module.scss";
import { Card, Checkbox } from "antd";
import { Row } from "react-flexbox-grid/lib";
import { Button } from "components";
import arrow from "images/up-arrow.png";

export function Todo(props) {
  const { name, completed, id, toggle, moveUp, moveDown } = props;

  const toggleTodo = () => toggle(id);

  const bodyStyle = {
    padding: "8px 24px 8px 8px"
  };

  return (
    <Card className={styles.card} bodyStyle={bodyStyle} bordered={false}>
      <Row>
        <div className={styles.reorder_buttons}>
          <Button className={styles.moveup} onClick={() => moveUp()}>
            <img src={arrow} alt="up_arrow" />
          </Button>
          <Button className={styles.movedown} onClick={() => moveDown()}>
            <img src={arrow} alt="down_arrow" />
          </Button>
        </div>
        <Row middle={"md"}>
          <Checkbox
            className={styles.checkbox}
            checked={completed}
            onChange={toggleTodo}
          />
          <p className={`${styles.text} ${completed ? styles.completed : ""}`}>
            {name}
          </p>
        </Row>
      </Row>
    </Card>
  );
}

Todo.propTypes = {
  name: PropTypes.string,
  completed: PropTypes.bool,
  id: PropTypes.number,
  toggle: PropTypes.func,
  moveUp: PropTypes.func,
  moveDown: PropTypes.func
};
