import constants from '../constants';
import { identifyRowChanges } from '../../DataGrid/editHelper';
import Fields from '../../../constants/Fields';
import { timeFormatterMMDDHHmm } from '../../Utils';

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
          width: 100,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.SCHEDULED_ARRIVAL_DATETIME,
          headerName: 'In Time Scheduled',
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.PROJECTED_ACTUAL_ARRIVAL_TIME,
          headerName: 'In Time Projected',
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.ARRIVAL_TYPE,
          headerName: 'In Type',
          width: 100,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.DEPARTURE_INFO,
          headerName: 'Out Flight',
          width: 100,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.SCHEDULED_DEPARTURE_DATETIME,
          headerName: 'Out Time Scheduled',
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.PROJECTED_ACTUAL_DEPARTURE_TIME,
          headerName: 'Out Time Projected',
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.DEPARTURE_TYPE,
          headerName: 'Out Type',
          width: 100,
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
          width: 100,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: '',
          headerName: 'Notes',
        },
      ],
      enableFilter: true,
      gridName: 'StandsAssignmentData',
      entityName: 'StandsAssignment',
      keyColumn: 'Id',
      rowSelection: 'single',
      title: 'Stands Assignment Data',
      domLayout: 'autoHeight',
      defaultColDef: {
        width: 150,
        headerClass: 'grid-header-class',
        cellClass: 'grid-cell-class',
      },
    };
  }
}
export default GridConfig;
