import moment from 'moment';
import constants from '../constants';
import { identifyRowChanges } from '../../DataGrid/editHelper';
import Fields from '../../../constants/Fields';

const timeFormatter = data => moment(data.value).format('mm/dd HH:mm');

class GridConfig {
  constructor(configuration) {
    const config = configuration || {};
    this.name = 'GridConfiguration';
    this.config = GridConfig.getConfiguration(config);
  }

  static getConfiguration() {
    return GridConfig.getDefaultConfiguration();
  }
  static onCellValueChanged = (params) => {
    identifyRowChanges(params);
  };

  static rowEditableStatus = (params) => {
    const edit = params.node.data.statusType;
    if (edit === true) {
      return true;
    }
    return false;
  };

  static getDefaultConfiguration(config) {
    return {
      columns: [
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.STAND_ID,
          headerName: 'Gate/Stand',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.ARRIVAL_INFO,
          headerName: 'In Flight',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.SCHEDULED_ARRIVAL_DATETIME,
          headerName: 'In Time Scheduled',
          valueFormatter: timeFormatter,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.PROJECTED_ACTUAL_ARRIVAL_TIME,
          headerName: 'In Time Projected',
          valueFormatter: timeFormatter,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.ARRIVAL_TYPE,
          headerName: 'In Type',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.DEPARTURE_INFO,
          headerName: 'Out Flight',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.SCHEDULED_DEPARTURE_DATETIME,
          headerName: 'Out Time Scheduled',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.PROJECTED_ACTUAL_DEPARTURE_TIME,
          headerName: 'Out Time Projected',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.DEPARTURE_TYPE,
          headerName: 'Out Type',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.EQUIPMENT_TYPE,
          headerName: 'Aircraft Type',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.BUFFER,
          headerName: 'Buffer',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: '',
          headerName: 'Notes',
        },
      ],
      headerConfig: {
        menu: [
          {
            tooltip: 'Legends',
            name: 'LEGENDS',
            isVisible: true,
            icon: 'icon-legends',
            onClick: '',
          },
          {
            tooltip: 'Add new Shutdown',
            name: 'ADD',
            isVisible: true,
            icon: 'icon-add-outline',
            onClick: 'onAdd',
          },
          {
            tooltip: 'Remove',
            name: 'REMOVE',
            isVisible: true,
            icon: 'icon-remove',
            onClick: 'onRemove',
          },
          {
            tooltip: 'Show Grid View',
            name: 'SHOW_GRID_VIEW',
            isVisible: true,
            icon: 'icon-grid-view',
            onClick: 'onShowGridView',
          },
          {
            tooltip: 'Show Gantt Chart',
            name: 'SHOW_GANTT_CHART',
            isVisible: true,
            icon: 'icon-graph',
            onClick: 'onShowGanttChart',
          },
          {
            tooltip: 'Edit',
            name: 'EDIT',
            isVisible: true,
            icon: 'icon-edit',
            onClick: 'onEdit',
          },
        ],
      },
      enableFilter: true,
      gridName: 'StandsAssignmentData',
      entityName: 'StandsAssignment',
      keyColumn: 'Id',
      rowSelection: 'single',
      title: 'Stands Assignment Data',
      domLayout: 'autoHeight',
      defaultColDef: {
        headerClass: 'grid-header-class',
        cellClass: 'grid-cell-class',
      },
    };
  }
}
export default GridConfig;
