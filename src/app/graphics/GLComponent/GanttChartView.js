import renderConfigGC from '../ObjectGroupGC/renderConfig';
import Utils from '../AppUtils';
import Base from '../GraphicsLayer';
import ObjectRenderer from '../lib/ObjectRenderer';
import { TextRenderer } from '../lib/TextRenderer';
import WorkGroupWrapper from './WorkGroupWrapper';
import TimelineHeader from './TimelineHeader';
import OpTimelineHeader from './OpTimelineHeader';
import TimeTransform from './../TimeTransform';
import MouseEventManager from './../lib/MouseEventManager';
import { GeneralConfig } from './mainConfig';
import { GanttEventNames, GanttEvent } from '../Events';

// GanttChartView Layer
export default class GanttChartView extends Base {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);
    this.addCanvas2D(); // For text
    this.mouseEventManager = new MouseEventManager(wrapperElem);

    this.yScrollOffset = 0;
    this.syncTimeline = false;
  }

  createDataObjects(defaultRenderType) {
    const {
      gl, shaderFac, canvas2D, mouseEventManager,
    } = this;

    this.workGroupWrapperList = [];
    this.networkElementWrapperList = {};

    // since we are adding every possession in single workgroup
    const workGroup = { Id: 1, Name: 'Workgroup1' };
    const workGroupWrapper = new WorkGroupWrapper(
      gl,
      canvas2D.ctx,
      shaderFac.shaderPrograms,
      workGroup,
      mouseEventManager,
    );
    workGroupWrapper.networkElementWrappers = [];
    workGroupWrapper.timeLabels = this.timeLabels;
    workGroupWrapper.renderAll = this.render.bind(this);
    workGroupWrapper.appTimeTransform = this.appTimeTransform;
    this.workGroupWrapperList.push(workGroupWrapper);

    let objList = [];
    let getNameFromObj = obj => obj.ShutName;
    let getDateFromObj = obj => obj.Date;

    if (defaultRenderType && defaultRenderType === 'possessions') {
      objList = this.inputData.possessions;
      getNameFromObj = obj => obj.Name;
      getDateFromObj = obj => obj.WorkDate;
    } else if (defaultRenderType && defaultRenderType === 'shuts') {
      objList = this.inputData.shuts;
      getNameFromObj = obj => obj.EndFacilityName;
      getDateFromObj = obj => obj.StartTime;
    } else {
      objList = this.inputData.dummyShutsData;
    }
    objList.forEach((tsObject) => {
      const name = getNameFromObj(tsObject);
      const workDate = getDateFromObj(tsObject);
      let StartDate = new Date(workDate);
      if (workDate.indexOf('T') === -1) {
        StartDate = Utils.convertDateTime(workDate);
      }
      StartDate.setMinutes(0);
      StartDate.setSeconds(0);
      StartDate.setHours(0);
      const EndDate = new Date(StartDate);
      EndDate.setHours(EndDate.getHours() + 24);
      const TSObjectWrapper = {
        StartDate,
        EndDate,
        name,
      };

      if (!this.networkElementWrapperList[name]) {
        this.networkElementWrapperList[name] = {
          Name: name,
          Shuts: [],
          Possessions: [],
        };
        workGroupWrapper.networkElementWrappers.push(this.networkElementWrapperList[name] );
      }

      if (defaultRenderType && defaultRenderType === 'possessions') {
        this.networkElementWrapperList[name].Possessions.push(TSObjectWrapper);
      } else if (defaultRenderType && defaultRenderType === 'shuts') {
        this.networkElementWrapperList[name].Shuts.push(TSObjectWrapper);
      } else {
        this.networkElementWrapperList[name].Shuts.push(TSObjectWrapper);
      }
    });
  }

  createTimeAxis() {
    const {
      gl,
      shaderFac,
      timeLabels,
      mouseEventManager,
      defaultRenderType,
    } = this;

    const TimeHeaderClass = OpTimelineHeader;

    this.timeAxis = new TimeHeaderClass(
      timeLabels,
      new ObjectRenderer(gl, shaderFac.shaderPrograms, renderConfigGC),
      new ObjectRenderer(gl, shaderFac.shaderPrograms, renderConfigGC),
      new ObjectRenderer(gl, shaderFac.shaderPrograms, renderConfigGC),
      new ObjectRenderer(gl, shaderFac.shaderPrograms, renderConfigGC),
      new TextRenderer(this.canvas2D.ctx),
      new TextRenderer(this.canvas2D.ctx),
      mouseEventManager,
    );
    this.timeAxis.renderAll = this.render.bind(this);
    this.timeAxis.appTimeTransform = this.appTimeTransform;
  }

  generateTimelabels(timeStep = 24) {
    // TIme Transform
    const { timeWindow } = this.appTimeTransform;
    const dateVar = Utils.getStartOfTheDay(timeWindow.startTime);
    const endDate = Utils.getEndOfTheDay(timeWindow.endTime);
    // endDate.setHours(endDate.getHours());
    this.timeLabels = [];

    while (dateVar < endDate) {
      const hours = dateVar.getHours();
      const xPos = timeWindow.getPositionOnTimeScale(dateVar);
      if (!Number.isNaN(xPos)) {
        const xVal = xPos;
        let timeText = '';

        switch (hours) {
          case 0: {
            const dayStr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][
              dateVar.getDay()
            ];
            timeText = `${dateVar.getDate()}/${dayStr}`;
            break;
          }
          case 3: {
            timeText = '3:00 AM';
            break;
          }
          case 6: {
            timeText = '6:00 AM';
            break;
          }
          case 9: {
            timeText = '9:00 AM';
            break;
          }
          case 12: {
            timeText = '12:00 PM';
            break;
          }
          case 15: {
            timeText = '3:00 PM';
            break;
          }
          case 18: {
            timeText = '6:00 PM';
            break;
          }
          case 21: {
            timeText = '9:00 PM';
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
      dateVar.setHours(hours + timeStep);
    }
    this.appTimeTransform.setSpanInX(GeneralConfig.CellWidth * this.timeLabels.length );
  }

  createObjects() {
    const { defaultRenderType, syncTimeline } = this;
    // First thing to do
    const { XData } = this.inputData;
    this.appTimeTransform = new TimeTransform(
      new Date(XData.StartTime),
      new Date(XData.EndTime),
      () => this.render(),
    );

    // Enable/Disable time syncing
    if (syncTimeline) {
      this.appTimeTransform.enableTimeSyncing(`${defaultRenderType}_TT`);
    }

    if (!syncTimeline && this.defaultRenderType === 'operations') {
      this.appTimeTransform.retrieveCachedState('OpGantt');
    }

    this.generateTimelabels();
    this.createDataObjects();
    this.createTimeAxis();

    // Loop through each workgroupWrapper
    this.workGroupWrapperList.forEach((workGroupWrapper) => {
      workGroupWrapper.createBuffers();
    });

    this.timeAxis.createBuffers();
    this.subscribeToEvents();
    this.yScrollOffset = 0;
  }

  recomputeYOffsets() {
    const { workGroupWrapperList, timeAxis, yScrollOffset } = this;
    let yOffset = timeAxis.height + yScrollOffset;
    workGroupWrapperList.forEach((workGroupWrapper) => {
      if (workGroupWrapper.visible) {
        workGroupWrapper.setLiveParams(yOffset);
        yOffset += workGroupWrapper.height + 5;
      }
    });
  }

  clearAll() {
    super.clear();
  }

  render() {
    this.recomputeYOffsets();
    this.clearAll();

    this.workGroupWrapperList.forEach((workGroupWrapper) => {
      workGroupWrapper.render();
    });
    this.timeAxis.render();
  }

  subscribeToEvents() {
    const { mouseEventManager, canvas } = this;
    mouseEventManager.subscribeEvent(
      'gantt_main_view',
      0,
      0,
      canvas.width,
      canvas.height,
      'mousewheel',
      this.handleWheel.bind(this),
    );
  }

  handleWheel(x, y, delta) {
    const scrollStepSize = 30;
    const { workGroupWrapperList, canvas, timeAxis } = this;
    if (workGroupWrapperList.length > 0) {
      let scrolledY;
      const wgWrapper = workGroupWrapperList[workGroupWrapperList.length - 1];

      const noScroll = timeAxis.height + wgWrapper.height < canvas.height;

      const maxScrollReached =
        wgWrapper.yOffset + wgWrapper.height < canvas.height;

      if (noScroll) return;

      if (delta > 0) {
        scrolledY = this.yScrollOffset - scrollStepSize;
        if (maxScrollReached) return;
      } else {
        scrolledY = this.yScrollOffset + scrollStepSize;
      }
      const yScrollMax = 0.0;

      scrolledY = Math.min(scrolledY, yScrollMax);
      this.yScrollOffset = scrolledY;
      GanttEvent.emit(GanttEventNames.YScroll, { scrollY: this.yScrollOffset });
      this.render();
      // console.log(this.yScrollOffset);
    }
  }

  workGroupSelectionUpdated({ id, selectionFlag }) {
    const wgFiltered = this.workGroupWrapperList.filter(workGroupWrapper => workGroupWrapper.data.Id.toString() === id );
    wgFiltered[0].visible = selectionFlag;

    this.render();
  }

  setHandler(handlerName, handler) {
    this.workGroupWrapperList.forEach((workGroupWrapper) => {
      workGroupWrapper.setHandler(handlerName, handler);
    });
  }

  setData(inputData) {
    this.inputData = inputData;
  }
}
