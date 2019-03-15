import React from 'react';
import renderConfigGC from '../ObjectGroupGC/renderConfig';
import renderConfigTextureGC from '../ObjectGroupGC/renderConfigTexture';
import ObjectRenderer from '../lib/ObjectRenderer';
import { TextRenderer } from '../lib/TextRenderer';
import GeometryGC from '../ObjectGroupGC/objects';
import TextObject from '../ObjectGroupGC/textObjects';
import { GeneralConfig } from './mainConfig';
import { SHADER_VARS } from '../ShaderFactory/constants';
import EventAggregator from '../EventAggregator';
import Utils from '../AppUtils';
import { GanttEventNames, GanttEvent } from '../Events';
import LazyEvent from '../lib/LazyEvent';

export default class WorkGroupWrapper {
  constructor(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager) {
    this.data = workGroup;
    this.visible = true;
    this.yOffset = 0;
    this.height = 0;
    this.handlerList = {};
    this.yAxisRenderer = new ObjectRenderer(gl, shaderPrograms, renderConfigGC);
    this.timeAxisRenderer = new ObjectRenderer(
      gl,
      shaderPrograms,
      renderConfigGC,
    );
    this.selectionObjectRenderer = new ObjectRenderer(
      gl,
      shaderPrograms,
      renderConfigGC,
    );
    this.bgRenderer = new ObjectRenderer(gl, shaderPrograms, renderConfigGC);
    this.textRenderer = new TextRenderer(canvas2Dcontext);
    this.eventManager = eventManager;
    this.canvas = gl.canvas;

    this.lazyRendererList = [];
    this.lazyTextLoad = new LazyEvent();

    // Selection Flag
    this.enableCellSelection = true;
  }

  createBuffers() {
    let yPos = 0;
    const yStepSize = GeneralConfig.CellHeight;
    const {
      networkElementWrappers,
      yAxisRenderer,
      // tsObjectRenderer,
      // shutRenderer,
      selectionObjectRenderer,
      timeAxisRenderer,
      bgRenderer,
      textRenderer,
    } = this;

    yAxisRenderer.clearObjects();
    timeAxisRenderer.clearObjects();
    textRenderer.clearObjects();
    // tsObjectRenderer.clearObjects();
    // shutRenderer.clearObjects();
    bgRenderer.clearObjects();
    selectionObjectRenderer.clearObjects();

    networkElementWrappers.forEach((networkElementWrapper) => {
      yPos += yStepSize;
      networkElementWrapper.yPos = yPos;
      this.addNetworkElement(yPos, yStepSize, networkElementWrapper);

      //   const { Possessions, Shuts,WorkOrders } = networkElementWrapper;
      //   Possessions.forEach(possessionObj => {
      //     this.addPossessionObject(possessionObj, yPos - yStepSize);
      //   });
      //   Shuts.forEach(shutObj => {
      //     this.addShutObject(shutObj, yPos - yStepSize);
      //   });
      //   WorkOrders.forEach(workObj => {
      //     this.addShutObject(workObj, yPos - yStepSize);

      //   });
    });

    this.height = yPos;
    this.addBackgroundObjects();
    this.addYAxisObjects(); // needs this.height value

    this.addTimeAxisObjects();
    // this.setupTSRenderer();
    // this.setupShutRenderer();
    this.setupSelectionRenderer();
    textRenderer.setMatrixGetter(() =>
      this.createTransformationMatrix(0, true));
  }

  addBackgroundObjects() {
    const { bgRenderer } = this;
    const bgRect2D = new GeometryGC.Rectangle2D(
      0,
      0,
      GeneralConfig.NetworkElementLabelWidth,
      this.height,
    );
    bgRect2D.setColor(GeneralConfig.BackgroundColor);

    bgRenderer.addObjects([bgRect2D]);
    // Create buffers and uniform getter
    bgRenderer.createBuffers();
    bgRenderer.setUniformGetter(this.createUniformGetter(0, GeneralConfig.WGWrapperBgDepth, true));
  }

  // addPossessionObject(tsObjWrapper, yTop) {
  //   const { StartDate, EndDate, workType } = tsObjWrapper;
  //   const { tsObjectRenderer, appTimeTransform } = this;
  //   const xLeft = appTimeTransform.timeToScreenX(StartDate);
  //   const xRight = appTimeTransform.timeToScreenX(EndDate);
  //   if (Number.isNaN(xLeft)) return;
  //   const tsObj = new GeometryGC.Rectangle2D(
  //     xLeft,
  //     yTop,
  //     xRight - xLeft,
  //     GeneralConfig.CellHeight
  //   );
  //   tsObj.setColor(GeneralConfig.getColorCode(workType));
  //   tsObjectRenderer.addObject(tsObj);
  // }

  // addShutObject(tsObjWrapper, yTop) {
  //   const { StartDate, EndDate } = tsObjWrapper;
  //   const { shutRenderer, appTimeTransform } = this;
  //   const xLeft = appTimeTransform.timeToScreenX(StartDate);
  //   const xRight = appTimeTransform.timeToScreenX(EndDate);
  //   if (Number.isNaN(xLeft)) return;
  //   const shutObj = new GeometryGC.Rectangle2D(
  //     xLeft,
  //     yTop,
  //     xRight - xLeft,
  //     GeneralConfig.CellHeight
  //   );
  //   shutObj.enableTexture = true;
  //   shutObj.setColor([100, 20, 20], 0.0);
  //   shutRenderer.addObject(shutObj);
  // }

  addSelectionObject(startTime, endTime, yPos) {
    const { selectionObjectRenderer, appTimeTransform, renderAll } = this;
    const xLeft = appTimeTransform.timeToScreenX(startTime);
    const xRight = appTimeTransform.timeToScreenX(endTime);
    const yBottom = yPos;
    const yTop = yPos - GeneralConfig.CellHeight;
    if (Number.isNaN(xLeft)) return;
    const selectionObj = new GeometryGC.LineGroup2D([
      [[xLeft, yTop], [xRight, yTop]],
      [[xRight, yTop], [xRight, yBottom]],
      [[xRight, yBottom], [xLeft, yBottom]],
      [[xLeft, yBottom], [xLeft, yTop]],
    ]);
    selectionObj.setColor([100, 200, 250]);

    selectionObjectRenderer.clearObjects();
    selectionObjectRenderer.addObject(selectionObj);
    selectionObjectRenderer.createBuffers();
    renderAll();
  }

  setupSelectionRenderer() {
    const { selectionObjectRenderer } = this;
    selectionObjectRenderer.setUniformGetter(this.createUniformGetter(
      GeneralConfig.NetworkElementLabelWidth,
      GeneralConfig.WGWrapperSelectionObjDepth,
    ));
  }

  addTimeAxisObjects() {
    const { timeLabels, timeAxisRenderer, appTimeTransform } = this;

    // Vert Grid lines
    timeLabels.forEach((timeLabel) => {
      if (timeLabel.datetime >= appTimeTransform.tEnd0) return;
      const t = appTimeTransform.timeToScreenX(timeLabel.datetime);
      const vertLineForTime2D = new GeometryGC.LineSegment2D(
        [t, 0],
        [t, this.height],
      );
      vertLineForTime2D.setColor(GeneralConfig.MainThemeColor_beta, GeneralConfig.GridLinesAlpha);
      timeAxisRenderer.addObject(vertLineForTime2D);
    });

    const vertPartition2D = new GeometryGC.Rectangle2D(
      appTimeTransform.xSpan,
      0,
      3,
      this.height,
    );
    vertPartition2D.setColor(GeneralConfig.MainThemeColor_beta);
    timeAxisRenderer.addObject(vertPartition2D);

    timeAxisRenderer.createBuffers();
    timeAxisRenderer.setUniformGetter(this.createUniformGetter(
      GeneralConfig.NetworkElementLabelWidth,
      GeneralConfig.WGWrapperTimeAxisDepth,
    ));
  }

  addYAxisObjects() {
    const { yAxisRenderer } = this;

    // Add a line when workgroup ends
    const partitionRect2D = new GeometryGC.Rectangle2D(
      0,
      this.height,
      this.canvas.width,
      5,
    );

    const vertLine2D = new GeometryGC.LineSegment2D(
      [GeneralConfig.NetworkElementLabelWidth, 0],
      [GeneralConfig.NetworkElementLabelWidth, this.height],
    );
    partitionRect2D.setColor(GeneralConfig.WorkGroupPartitionColor);
    vertLine2D.setColor(GeneralConfig.MainThemeColor_beta);
    yAxisRenderer.addObjects([partitionRect2D, vertLine2D]);

    // Create buffers and uniform getter
    yAxisRenderer.createBuffers();
    yAxisRenderer.setUniformGetter(this.createUniformGetter(0, GeneralConfig.WGWrapperYAxisDepth, true));
  }

  addNetworkElement(yPos, yStepSize, networkElementWrapper) {
    const {
      yAxisRenderer,
      timeAxisRenderer,
      textRenderer,
      appTimeTransform,
    } = this;
    const lineGrid2D = new GeometryGC.LineSegment2D(
      [0, yPos],
      [appTimeTransform.xSpan, yPos],
    );
    lineGrid2D.setColor(GeneralConfig.MainThemeColor_beta, GeneralConfig.GridLinesAlpha);
    timeAxisRenderer.addObject(lineGrid2D);

    const lineNetworkElement2D = new GeometryGC.LineSegment2D(
      [0, yPos],
      [GeneralConfig.NetworkElementLabelWidth, yPos],
    );
    lineNetworkElement2D.setColor(GeneralConfig.MainThemeColor_beta, GeneralConfig.GridLinesAlpha);
    yAxisRenderer.addObject(lineNetworkElement2D);

    const label = new TextObject.NetworkElementBox(
      networkElementWrapper,
      0,
      yPos - yStepSize,
      GeneralConfig.NetworkElementLabelWidth,
      yStepSize,
    );
    textRenderer.addObject(label);
  }

  findPossession = (startTime, endTime, networkElementWrapper) => {
    if (networkElementWrapper.Possessions) {
      const selectedPossessions = networkElementWrapper.Possessions.filter((tsObj) => {
        const startDateMatching = Utils.compareDates(
          tsObj.StartDate,
          startTime,
          1000,
        );
        const endDateMatching = Utils.compareDates(
          tsObj.EndDate,
          endTime,
          1000,
        );
        return startDateMatching && endDateMatching;
      });
      if (selectedPossessions.length > 0) { return Utils.clone(selectedPossessions[0]); }
    }
    return null;
  };

  lazyRender() {
    // this.lazyRendererList.forEach(renderer => renderer.clear());
    this.lazyTextLoad.lazyCall(() => {
      this.lazyRendererList.forEach((renderer) => {
        renderer.clear();
        renderer.render();
      });
    }, 300);
  }

  render() {
    if (!this.visible) return;

    const {
      yAxisRenderer,
      timeAxisRenderer,
      // tsObjectRenderer,
      // shutRenderer,
      selectionObjectRenderer,
      bgRenderer,
      textRenderer,
    } = this;
    yAxisRenderer.render();
    textRenderer.render();
    timeAxisRenderer.render();
    // tsObjectRenderer.render();
    // shutRenderer.render();
    selectionObjectRenderer.render();
    bgRenderer.render();
    this.lazyRender();
  }

  createUniformGetter(xOffset, zvalue, fixX, textureIndex = 0) {
    return (uniformName) => {
      switch (uniformName) {
        case SHADER_VARS.u_matrix: {
          const matrix = this.createTransformationMatrix(xOffset, fixX);
          // console.log(matrix);
          return matrix;
        }
        case SHADER_VARS.u_resolution: {
          const resolutionVec = [this.canvas.width, this.canvas.height];
          return resolutionVec;
        }
        case SHADER_VARS.u_zvalue: {
          return zvalue;
        }
        case SHADER_VARS.u_texture: {
          return textureIndex;
        }
        default:
          break;
      }
      console.error(`UniformGetter: requested bad uniform - ${uniformName}`);
      return null;
    };
  }

  createTransformationMatrix(xOffset, fixX, fixY) {
    const { appTimeTransform, yOffset } = this;
    return appTimeTransform.getMatrix(xOffset, yOffset, fixX, fixY);
  }

  setLiveParams(yOffset) {
    this.yOffset = yOffset;

    // Here we are set with all params to render hence
    // subscribe to events here
    this.subscribeToEvents();
  }
  findShuts = (startTime, endTime, networkElementWrapper) => {
    if (networkElementWrapper.Shuts) {
      const selectedShuts = networkElementWrapper.Shuts.filter((Obj) => {
        const startDateMatching = startTime >= Obj.StartDate;
        const endDateMatching = endTime <= Obj.EndDate;
        return startDateMatching && endDateMatching;
      });
      if (selectedShuts.length > 0) return Utils.clone(selectedShuts[0]);
    }
    return null;
  };

  getShutsAt(x, y, showSelection = false) {
    const { appTimeTransform } = this;
    let selectionObject = null;

    const xTime = appTimeTransform.screenXToTime(x);
    if (xTime) {
      const StartTime = Utils.getStartOfTheDay(xTime);
      const EndTime = Utils.getEndOfTheDay(xTime);

      selectionObject = { StartTime, EndTime };

      const selectedNetworkElement = this.findNetworkElementWrapper(y);

      if (selectedNetworkElement) {
        selectionObject.networkElementName = selectedNetworkElement.Name;
        selectionObject.yPos = selectedNetworkElement.yPos;
        if (selectedNetworkElement.data) {
          selectionObject.networkElement = selectedNetworkElement.data;
        }

        // TODO: move this to PossessionWrapper
        const selectedShuts = this.findShuts(
          StartTime,
          EndTime,
          selectedNetworkElement,
        );
        selectionObject.selectedShuts = selectedShuts;
        selectionObject.StartTime.setHours(10);
        selectionObject.EndTime.setHours(10);
      }
      // console.log(selectionObject);
    }
    return selectionObject;
  }

  findNetworkElementWrapper(y) {
    const selectedNetworkElements = this.networkElementWrappers.filter(networkEleWrapper =>
      y < networkEleWrapper.yPos &&
        y > networkEleWrapper.yPos - GeneralConfig.CellHeight);
    if (selectedNetworkElements.length > 0) {
      return selectedNetworkElements[0];
    }
    return null;
  }

  findObjectsUnderXTime = (xTime, selectedNetworkElement) => {
    if (selectedNetworkElement) {
      // console.log(selectedNetworkElement);
      const { Objects, yPos } = selectedNetworkElement;
      if (Objects && Objects.length > 0) {
        const filteredObjs = Objects.filter((obj) => {
          const { StartDate, EndDate } = obj;
          return xTime > StartDate && xTime < EndDate;
        });
        return filteredObjs;
      }
    }
    return [];
  };

  getSelectionObjectAt(x, y) {
    const { appTimeTransform } = this;
    let selectionObject = null;

    const xTime = appTimeTransform.screenXToTime(x);
    if (xTime) {
      selectionObject = { xTime };
      const selectedNetworkElement = this.findNetworkElementWrapper(y);
      if (selectedNetworkElement) {
        selectionObject.networkElementName = selectedNetworkElement.Name;
        selectionObject.yPos = selectedNetworkElement.yPos;
        if (selectedNetworkElement.data) {
          selectionObject.networkElement = selectedNetworkElement.data;
        }

        const objects = this.findObjectsUnderXTime(
          xTime,
          selectedNetworkElement,
        );
        selectionObject.selectedObjects = objects;
      }
    }
    return selectionObject;
  }

  setHoverContent(hoverContent) {
    this.hoverContent = hoverContent;
  }

  handleMousePan(dx, dy) {
    // console.log(dx, dy);
    if (dx > 0 || dx < 0) {
      const viewportWidth =
        this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
      // appTimeTransform.applyPan(dx, viewportWidth);
      // renderAll();
      EventAggregator.applyPan(dx, viewportWidth);
    }
  }

  handleWheel(x, y, delta) {
    const viewportWidth =
      this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
    // appTimeTransform.applyZoom(0.05, delta, x, viewportWidth);
    // renderAll();
    EventAggregator.applyZoom(0.05, delta, x, viewportWidth);
  }

  handleClick = (x, y) => {
    if (this.enableCellSelection) {
      const selectionObject = this.getSelectionObjectAt(x, y, true);
      if (this.handlerList.onSelection) {
        this.handlerList.onSelection(selectionObject);
      }
    }
  };

  handleDoubleClick = (x, y) => {
    const selectionObject = this.getSelectionObjectAt(x, y, true);
    selectionObject.action = 'Add';
    if (selectionObject.selectedPossession) {
      selectionObject.action = 'Edit';
    }
    if (this.handlerList.onDoubleClick) {
      this.handlerList.onDoubleClick(selectionObject);
    }
  };

  handleHover(x, y) {
    const selectionObject = this.getSelectionObjectAt(x, y);
    const { selectedObjects } = selectionObject;
    if (selectedObjects && selectedObjects.length > 0) {
      const firstObject = selectedObjects[0];
      // Get StartDate and EndDate
      let xLeft = this.appTimeTransform.timeToScreenX(firstObject.StartDate);
      let xRight = this.appTimeTransform.timeToScreenX(firstObject.EndDate);

      xLeft = this.appTimeTransform.transformX(xLeft);
      xRight = this.appTimeTransform.transformX(xRight);

      let { yPos } = selectionObject;
      let top = yPos - GeneralConfig.CellHeight;
      yPos = this.appTimeTransform.transformY(yPos);
      top = this.appTimeTransform.transformY(top);


      let content = null;
      if (this.hoverContent) {
        content = <this.hoverContent obj={firstObject.data} />;
      }
      GanttEvent.emit(GanttEventNames.AssignmentHover, {
        content,
        xLeft,
        xRight,
        yPos,
        canvasWidth: this.canvas.width,
        canvasHeight: this.canvas.height,
      });
    } else {
      // Mouse not falling on valid objects.
      GanttEvent.emit(GanttEventNames.AssignmentHover, null);
    }
  }

  handleHoverYAxis = (x, y) => {
    // Figure out netwrok element from y
    const networkElement = this.findNetworkElementWrapper(y);
    const hoverTextGenerator = (obj, keySet) => {
      const displayContents = [];
      Object.keys(obj)
        .filter(key => keySet.includes(key))
        .forEach((key) => {
          const modifiedKey = Utils.removeCamelCase(key);
          displayContents.push(`${modifiedKey}: ${obj[key]}`);
        });
      return displayContents;
    };
    if (networkElement && networkElement.data) {
      let wrapperObj = {};
      wrapperObj = networkElement.data;
      const hoverText = [];
      const displayData = hoverTextGenerator(wrapperObj, ['FromKmMarker', 'FromTrackName', 'Name', 'ToKmMarker', 'ToTrackName']);
      hoverText.push(displayData);
      if (this.handlerList.tooltipHandler) {
        let yPos = networkElement.yPos;
        let top = yPos - GeneralConfig.CellHeight;
        yPos = this.appTimeTransform.transformY(yPos);
        top = this.appTimeTransform.transformY(top);
        const tooltipTop = top + 10 + this.yOffset;

        this.handlerList.tooltipHandler(true, hoverText, {
          x: GeneralConfig.NetworkElementLabelWidth,
          y: tooltipTop,
        });
      }
    } else if (this.handlerList.tooltipHandler) {
      this.handlerList.tooltipHandler(false);
    }
  };

  subscribeToEvents() {
    const { eventManager } = this;
    const x = GeneralConfig.NetworkElementLabelWidth;
    const width = this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'mousepan',
      this.handleMousePan.bind(this),
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'shiftmousewheel',
      this.handleWheel.bind(this),
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'mouseclick',
      this.handleClick.bind(this),
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'mousehover',
      this.handleHover.bind(this),
    );

    eventManager.subscribeEvent(
      'y_axis',
      0,
      this.yOffset,
      x,
      this.height,
      'mousehover',
      this.handleHoverYAxis.bind(this),
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'mousedoubleclick',
      this.handleDoubleClick.bind(this),
    );
  }

  setHandler(handlerName, handler) {
    this.handlerList[handlerName] = handler;
  }
}
