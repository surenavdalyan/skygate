import Utils from '../AppUtils';
import GanttChartView from './GanttChartView';
import OperationsWrapper from './OperationsWrapper';
import { GeneralConfig } from './mainConfig';
import RenderTypes from '../RenderTypes';

const sampleData = [
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 10,
    Description: '4M Major Service SW Mooka ET',
    FromKmMarker: '28.2455',
    ToKmMarker: '31.1997',
    FromTrackName: 'NML-ET',
    ToTrackName: 'NML-ET',
    Duration: 4,
    StartTime: '2018-08-01T00:00:00',
    EndTime: '2018-08-02T23:00:00',
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: 'MN20-L35',
    MainWorkCenter: 'MN21',
    NumberOfResources: 4,
    PlannerGroup: 'I46',
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 42,
    TimeOffset: 24,
    Type: 'SS',
    AssignmentDate: '2018-08-01T00:00:00',
    IsLocked: false,
    Id: 111,
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 10,
    Description: '4M Major Service SW Mooka ET',
    FromKmMarker: '28.2455',
    ToKmMarker: '31.1997',
    FromTrackName: 'NML-ET',
    ToTrackName: 'NML-ET',
    Duration: 4,
    StartTime: '2018-08-02T00:00:00',
    EndTime: '2018-08-02T23:00:00',
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: 'MN20-L35',
    MainWorkCenter: 'MN21',
    NumberOfResources: 4,
    PlannerGroup: 'I46',
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 42,
    TimeOffset: 24,
    Type: 'SS',
    AssignmentDate: '2018-08-02T00:00:00',
    IsLocked: false,
    Id: 111,
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 10,
    Description: '4M Major Service SW Mooka ET',
    FromKmMarker: '28.2455',
    ToKmMarker: '31.1997',
    FromTrackName: 'NML-ET',
    ToTrackName: 'NML-ET',
    Duration: 4,
    StartTime: '2018-08-03T00:00:00',
    EndTime: '2018-08-03T23:00:00',
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: 'MN20-L35',
    MainWorkCenter: 'MN21',
    NumberOfResources: 4,
    PlannerGroup: 'I46',
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 42,
    TimeOffset: 24,
    Type: 'SS',
    AssignmentDate: '2018-08-03T00:00:00',
    IsLocked: false,
    Id: 111,
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 10,
    Description: '4M Major Service SW Mooka ET',
    FromKmMarker: '28.2455',
    ToKmMarker: '31.1997',
    FromTrackName: 'NML-ET',
    ToTrackName: 'NML-ET',
    Duration: 4,
    StartTime: '2018-08-04T00:00:00',
    EndTime: '2018-08-04T23:00:00',
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: 'MN20-L35',
    MainWorkCenter: 'MN21',
    NumberOfResources: 4,
    PlannerGroup: 'I46',
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 42,
    TimeOffset: 24,
    Type: 'SS',
    AssignmentDate: '2018-08-04T00:00:00',
    IsLocked: false,
    Id: 111,
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 10,
    Description: '4M Major Service SW Mooka ET',
    FromKmMarker: '28.2455',
    ToKmMarker: '31.1997',
    FromTrackName: 'NML-ET',
    ToTrackName: 'NML-ET',
    Duration: 4,
    StartTime: '2018-08-01T00:00:00',
    EndTime: '2018-08-02T23:00:00',
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: 'MN20-L35',
    MainWorkCenter: 'MN21',
    NumberOfResources: 4,
    PlannerGroup: 'I46',
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 42,
    TimeOffset: 24,
    Type: 'SS',
    AssignmentDate: '2018-08-01T00:00:00',
    IsLocked: false,
    Id: 111,
  },
  {
    WorkOrderId: 340,
    WorkOrderRefereceId: null,
    OperationId: 10,
    Description: '4M Major Service SW Mooka ET',
    FromKmMarker: '28.2455',
    ToKmMarker: '31.1997',
    FromTrackName: 'NML-ET',
    ToTrackName: 'NML-ET',
    Duration: 4,
    StartTime: '2018-08-01T00:00:00',
    EndTime: '2018-08-02T23:00:00',
    ResourceWorkCenterId: 36,
    ResourceWorkCenter: 'MN20-L35',
    MainWorkCenter: 'MN21',
    NumberOfResources: 4,
    PlannerGroup: 'I46',
    AssignmentPossessionId: null,
    ReferenceWorkOperationId: 42,
    TimeOffset: 24,
    Type: 'SS',
    AssignmentDate: '2018-08-01T00:00:00',
    IsLocked: false,
    Id: 111,
  },
];

  // Gantt01 Layer
export default class Gantt01 extends GanttChartView {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);
    this.defaultRenderType = RenderTypes.GANTT_CHART_01;
    this.ctxObjLabels = this.newCanvas2D();
  }

  // override setData method
  setData(inputData) {
    super.setData(inputData);
  }

  // timeStep is in minutes
  generateTimelabels(timeStep = 60) {
    // Time Transform
    const { timeWindow } = this.appTimeTransform;
    const dateVar = new Date(timeWindow.startTime);
    dateVar.setMinutes(0);
    this.timeLabels = [];

    while (dateVar < timeWindow.endTime) {
      const hours = dateVar.getHours();
      const minutes = dateVar.getMinutes();
      const xPos = timeWindow.getPositionOnTimeScale(dateVar);
      if (!Number.isNaN(xPos)) {
        const xVal = xPos;
        let timeText = '';

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
          datetime: new Date(dateVar),
        });
      }
      dateVar.setMinutes(minutes + timeStep);
    }
    this.appTimeTransform.setSpanInX(GeneralConfig.CellWidth * (this.timeLabels.length + 1));
  }

  createDataObjects() {
    const {
      gl, shaderFac, canvas2D, mouseEventManager, ctxObjLabels,
    } = this;

    this.workGroupWrapperList = [];
    this.TSObjByKey = {};

    // since we are adding every possession in single workgroup
    const tsObjWrapper = new OperationsWrapper(
      gl,
      canvas2D.ctx,
      shaderFac.shaderPrograms,
      { Id: 1, Name: 'TSgroup1' },
      mouseEventManager,
      ctxObjLabels,
    );
    tsObjWrapper.networkElementWrappers = [];
    tsObjWrapper.timeLabels = this.timeLabels;
    tsObjWrapper.renderAll = this.render.bind(this);
    tsObjWrapper.appTimeTransform = this.appTimeTransform;
    this.workGroupWrapperList.push(tsObjWrapper);

    const {
      YData,
      TSData,
      XData: { StartTime, EndTime },
      HoverContent,
    } = this.inputData;

    if (HoverContent) {
      tsObjWrapper.setHoverContent(HoverContent);
    }

    YData.data.forEach((y) => {
      this.TSObjByKey[y.name] = {
        data: y,
        Name: y.name,
        Objects: [],
      };
      tsObjWrapper.networkElementWrappers.push(this.TSObjByKey[y.name]);
    });

    if (TSData.data && TSData.data.length > 0) {
      TSData.data.forEach((dataElement) => {
        const tsObj = TSData.getter(dataElement);
        if (tsObj.StartDate < StartTime || tsObj.StartDate > EndTime) return;
        if (this.TSObjByKey[tsObj.Y]) {
          this.TSObjByKey[tsObj.Y].Objects.push(tsObj);
        }
      });
    }
  }
}

