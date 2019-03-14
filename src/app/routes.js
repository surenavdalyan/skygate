/* eslint max-len: ["error", { "code": 200 }] */
import * as React from 'react';
import { Redirect, BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';

import GanttView from './components/Gantt';
import GridView from './components/grids/StandsAssignmentsGrid';
import MainContainer from './containers/MainContainer';

export default function getRoutes() {
  return (
    <Router>
      <Switch>
        <Route
          path="/home"
          title="Gate Optimizer"
          component={MainContainer}
        />

        <Route
          path="/gantt"
          component={GanttView}
        />

        <Route
          path="/grid"
          component={GridView}
        />

        <Route path="*" component={() => (<div>No Match Found</div>)} />
      </Switch>
    </Router>
  );
}
