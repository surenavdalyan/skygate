import Utils from "../AppUtils";
import GanttChartView from "./GanttChartView";
import OperationsWrapper from "./OperationsWrapper";
import { GeneralConfig } from "./mainConfig";

// ShutsGanttView Layer
export default class OperationsGanttView extends GanttChartView {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);
    this.defaultRenderType = "operations";
  }

  // override setData method
  setData(inputData) {
    super.setData(inputData);

    const { selectedPossession: { SelectedDate } } = this.inputData;
    this.inputData.startDate = Utils.getStartOfTheDay(SelectedDate);
    this.inputData.endDate = Utils.getEndOfTheDay(SelectedDate);
  }

  // timeStep is in minutes
  generateTimelabels(timeStep = 15) {
    // Time Transform
    const { timeWindow } = this.appTimeTransform;
    const dateVar = new Date(timeWindow.startTime);
    this.timeLabels = [];

    while (dateVar < timeWindow.endTime) {
      const hours = dateVar.getHours();
      const minutes = dateVar.getMinutes();
      const xPos = timeWindow.getPositionOnTimeScale(dateVar);
      if (!Number.isNaN(xPos)) {
        const xVal = xPos;
        let timeText = "";

        switch (minutes) {
          case 0: {
            timeText = `${hours}:00`;
            break;
          }
          default:
            break;
        }

        this.timeLabels.push({
          x: xVal,
          text: timeText,
          datetime: new Date(dateVar)
        });
      }
      dateVar.setMinutes(minutes + timeStep);
    }
    this.appTimeTransform.setSpanInX(
      GeneralConfig.CellWidth * (this.timeLabels.length + 1)
    );
  }

  createDataObjects() {
    const { gl, shaderFac, canvas2D, mouseEventManager } = this;

    this.workGroupWrapperList = [];
    this.networkElementWrapperList = {};

    // since we are adding every possession in single workgroup
    const workGroup = { Id: 1, Name: "Workgroup1" };
    const workGroupWrapper = new OperationsWrapper(
      gl,
      canvas2D.ctx,
      shaderFac.shaderPrograms,
      workGroup,
      mouseEventManager
    );
    workGroupWrapper.networkElementWrappers = [];
    workGroupWrapper.timeLabels = this.timeLabels;
    workGroupWrapper.renderAll = this.render.bind(this);
    workGroupWrapper.appTimeTransform = this.appTimeTransform;
    this.workGroupWrapperList.push(workGroupWrapper);

    const { operations, startDate, endDate } = this.inputData;

    const createName = obj => `${obj.OperationId}_${obj.Description}`;

    if (operations && operations.length > 0) {
      operations.forEach(operation => {
        const {
          OperationId,
          Type,
          AssignmentDate,
          Duration,
          StartTime,
          EndTime,
          ResourceWorkCenter
        } = operation;

        const startTimeStr = `${AssignmentDate.split("T")[0]}T${StartTime}`;
        const endTimeStr = `${AssignmentDate.split("T")[0]}T${EndTime}`;
        const StartDate = new Date(startTimeStr);
        const EndDate = new Date(endTimeStr);

        if (StartDate < startDate || StartDate > endDate) return;

        const TSObjectWrapper = {
          StartDate,
          EndDate,
          data: operation,
          Type,
          ResourceWorkCenter
        };

        this.networkElementWrapperList[OperationId] = {
          data: operation,
          Name: createName(operation),
          Shuts: [],
          Possessions: [],
          Operations: [TSObjectWrapper]
        };
        workGroupWrapper.networkElementWrappers.push(
          this.networkElementWrapperList[OperationId]
        );
      });
    }
  }
}

const sampleData = [
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 10,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: "MN20-L35",
    MainWorkCenter: "MN21",
    NumberOfResources: 4,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 42,
    TimeOffset: 24,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 111
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 52,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 6,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 19,
    ResourceWorkCenter: "SN08-T44",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 51,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 277
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 32,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 19,
    ResourceWorkCenter: "SN08-T44",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 31,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-07-31T00:00:00",
    IsLocked: false,
    Id: 283
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 40,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 37,
    ResourceWorkCenter: "MN21-L35",
    MainWorkCenter: "MN21",
    NumberOfResources: 4,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 32,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-07-31T00:00:00",
    IsLocked: false,
    Id: 284
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 41,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 30,
    ResourceWorkCenter: "SN08-S01",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 40,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-07-31T00:00:00",
    IsLocked: false,
    Id: 285
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 42,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 3,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 19,
    ResourceWorkCenter: "SN08-T44",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 41,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-07-31T00:00:00",
    IsLocked: false,
    Id: 286
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 50,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: "MN20-L35",
    MainWorkCenter: "MN21",
    NumberOfResources: 4,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 22,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 287
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 51,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 2,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 30,
    ResourceWorkCenter: "SN08-S01",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 50,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 288
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 12,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 19,
    ResourceWorkCenter: "SN08-T44",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 11,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 289
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 20,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: "MN20-L35",
    MainWorkCenter: "MN21",
    NumberOfResources: 4,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 12,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 290
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 21,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 2,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 30,
    ResourceWorkCenter: "SN08-S01",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 20,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 291
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 22,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 2,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 19,
    ResourceWorkCenter: "SN08-T44",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 21,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 292
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 30,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 4,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 37,
    ResourceWorkCenter: "MN21-L35",
    MainWorkCenter: "MN21",
    NumberOfResources: 4,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: null,
    TimeOffset: null,
    Type: "",
    AssignmentDate: "2018-07-31T00:00:00",
    IsLocked: false,
    Id: 293
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 31,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 2,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 30,
    ResourceWorkCenter: "SN08-S01",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 30,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-07-31T00:00:00",
    IsLocked: false,
    Id: 294
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 11,
    Description: "4M Major Service SW Mooka ET",
    FromKmMarker: "28.2455",
    ToKmMarker: "31.1997",
    FromTrackName: "NML-ET",
    ToTrackName: "NML-ET",
    Duration: 2,
    StartTime: null,
    EndTime: null,
    ResourceWorkCenterId: 30,
    ResourceWorkCenter: "SN08-S01",
    MainWorkCenter: "MN21",
    NumberOfResources: 1,
    PlannerGroup: "I46",
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 10,
    TimeOffset: 0,
    Type: "SS",
    AssignmentDate: "2018-08-01T00:00:00",
    IsLocked: false,
    Id: 300
  }
];
