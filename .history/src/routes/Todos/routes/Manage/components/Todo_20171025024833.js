import React from 'react';
import PropTypes from 'prop-types';
import styles from './Todo.module.scss';
import { Card, Checkbox } from 'antd';
import { Row } from 'react-flexbox-grid/lib';

export function Todo(props) {
  const { name, completed, id, toggle } = props;

  const toggleTodo = () => toggle(id);

  return (
    <Card className={styles.card}>
      <Row>
        <p className={styles.text}>{name}</p>
        <Checkbox checked={completed} onChange={toggleTodo} />
      </Row>
    </Card>
  );
}

Todo.propTypes = {
  name: PropTypes.string,
  completed: PropTypes.bool,
  id: PropTypes.number,
  toggle: PropTypes.func,
};
