/**
 * Defines the React 16 Adapter for Enzyme. 
 *
 * @link http://airbnb.io/enzyme/docs/installation/#working-with-react-16
 * @copyright 2017 Airbnb, Inc.
 */
const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
enzyme.configure({ adapter: new Adapter() });

import * as d3 from 'd3';
import * as topojson from 'topojson';
import select from 'd3-selection';
import "d3-selection-multi";
import React from 'react';

global.d3 = d3;