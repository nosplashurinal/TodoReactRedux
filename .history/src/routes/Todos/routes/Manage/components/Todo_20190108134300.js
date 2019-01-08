import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./Todo.module.scss";
import { Card, Checkbox } from "antd";
import { Row } from "react-flexbox-grid/lib";
import { Button, Input } from "components";
import arrow from "images/up-arrow.png";

export class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditorOpen: false
    };
  }
  render() {
    const {
      name,
      completed,
      id,
      toggle,
      moveUp,
      moveDown,
      clearAnimations,
      onEdit
    } = this.props;

    const toggleTodo = () => toggle(id);
    const moveTodoUp = () => {
      setTimeout(() => {
        clearAnimations();
      }, 290);
      moveUp(id);
    };
    const moveTodoDown = () => {
      setTimeout(() => {
        clearAnimations();
      }, 290);
      moveDown(id);
    };
    const bodyStyle = {
      padding: "8px 24px 8px 8px"
    };
    return (
      <Card className={styles.card} bodyStyle={bodyStyle} bordered={false}>
        <Row>
          <div className={styles.reorder_buttons}>
            <Button className={styles.moveup} onClick={moveTodoUp}>
              <img src={arrow} alt="up_arrow" />
            </Button>
            <Button className={styles.movedown} onClick={moveTodoDown}>
              <img src={arrow} alt="down_arrow" />
            </Button>
          </div>
          <Row middle={"md"}>
            <Checkbox
              className={styles.checkbox}
              checked={completed}
              onChange={toggleTodo}
            />
            {this.state.isEditorOpen ? (
              <Input className={styles.todoEditorInput} type="text" />
            ) : (
              <p
                onClick={() => this.setState({ isEditorOpen: true })}
                className={`${styles.text} ${
                  completed ? styles.completed : ""
                }`}
              >
                {name}
              </p>
            )}
          </Row>
        </Row>
      </Card>
    );
  }
}

Todo.propTypes = {
  name: PropTypes.string,
  completed: PropTypes.bool,
  id: PropTypes.number,
  toggle: PropTypes.func,
  moveUp: PropTypes.func,
  moveDown: PropTypes.func,
  clearAnimations: PropTypes.func,
  index: PropTypes.number
};
