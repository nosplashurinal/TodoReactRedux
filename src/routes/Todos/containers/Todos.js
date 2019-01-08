import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { StateComponent, LoadComponent } from "HOCS";
import { stateSelector, titleSelector } from "../selectors";
import { Row, Col } from "react-flexbox-grid/lib";
import { Text, Button, Icon } from "components";
import { actions } from "../modules";
import { strings } from "utils/constants";
import styles from "./Todos.module.scss";
import { connect } from "react-redux";

const { ERROR_ICON, REFRESH_ICON } = Icon;

function TodosComponent(props) {
  const { title, load } = props;

  return (
    <Col xs={12}>
      <Row center="md" className={styles.todos}>
        <Col md={6}>
          <Row start="md" className={styles.textContainer}>
            <Text size="large2" weight="med1">
              {title}
            </Text>
          </Row>
        </Col>
      </Row>
      <Row center="md">{props.children}</Row>
    </Col>
  );
}

// Many times you do want to load something in a parent route
// before a sub-route.  In this case, we will load a count as an example.
const mapStateToProps = state => ({
  title: titleSelector(state),
  ...stateSelector(state),
  errorMessage: strings.GLOBAL_ERROR_MESSAGE
});

TodosComponent.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  load: PropTypes.func
};

export const Todos = compose(
  connect(
    mapStateToProps,
    actions
  ),
  StateComponent,
  LoadComponent
)(TodosComponent);
