import React from 'react';
import { keyBy } from "lodash/collection";
import { OperationLegends } from "../Header/showLegends";
import classNames from "classnames";


export const Header = (props) => {
 let config =  keyBy(props.config.menu, "name") ;
 const onAssignAction = () => {
  config.ADD.onClick();
  }
  const onChangeDisplay = () => {
    config.DISPLAY.onClick();
  }
  const onShowGridView = () => {
    props.changeView(true);
   // config.SHOW_GRID_VIEW.onClick(true);
  }
  const onShowGanttChart = () => {
  // config.SHOW_GANTT_CHART.onClick(false);
    props.changeView(false);
  }
  const activeGrid = classNames({ "active-icon": props.view });
  const activeChart = classNames({ "active-icon": !props.view });
  return (
    <div className="secondary-title">
      <span className="sec-title-name">{props.gridName}</span>
    {config.ADD && <a title={config.ADD.tooltip} onClick={onAssignAction} className={`header-grid-icons pull-right ${config.ADD.icon}`}>{config.ADD.text}</a>}
    {/* <a className="header-grid-icons icon-legends pull-right" /> */}
    {!props.view ? config.LEGENDS && (
              <OperationLegends
                onClick={event => {
                    event.stopPropagation();
                  }}
                  item={{
                    icon: config.LEGENDS.icon,
                    tooltip: config.LEGENDS.tooltip
                  }}
          />
          ) : null}
    {config.SHOW_GRID_VIEW && <a title={config.SHOW_GRID_VIEW.tooltip} onClick={onShowGridView} className={`header-grid-icons pull-right ${config.SHOW_GRID_VIEW.icon} ${activeGrid}`}  />}
    {config.SHOW_GANTT_CHART && <a title={config.SHOW_GANTT_CHART.tooltip} onClick={onShowGanttChart} className={`header-grid-icons pull-right ${config.SHOW_GANTT_CHART.icon} ${activeChart}`}  />}
    </div>
  );
};
