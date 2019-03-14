import renderConfigGC from "../ObjectGroupGC/renderConfig";
import ObjectRenderer from "../lib/ObjectRenderer";
import GeometryGC from "../ObjectGroupGC/objects";
import { GeneralConfig } from "./mainConfig";
import WorkGroupWrapper from "./WorkGroupWrapper";
import Utils from "../AppUtils";

export default class OperationsWrapper extends WorkGroupWrapper {
  constructor(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager) {
    super(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager);
    this.tsObjectRenderer = new ObjectRenderer(
      gl,
      shaderPrograms,
      renderConfigGC
    );
    this.editRenderer = new ObjectRenderer(gl, shaderPrograms, renderConfigGC);
    this.enableCellSelection = false;
  }

  createBuffers() {
    super.createBuffers();

    this.addOperationObjects();
    this.setupTSRenderer();
    this.setupEditRenderer();
  }

  addOperationObjects() {
    const { networkElementWrappers, tsObjectRenderer } = this;
    let yPos = 0;
    const yStepSize = GeneralConfig.CellHeight;
    tsObjectRenderer.clearObjects();
    networkElementWrappers.forEach(networkElementWrapper => {
      yPos += yStepSize;
      // this.addNetworkElement(yPos, yStepSize, networkElementWrapper);

      const { Operations } = networkElementWrapper;
      Operations.forEach(operationObj => {
        this.addOperationObject(operationObj, yPos - yStepSize);
      });
    });
    this.height = yPos;
  }

  addOperationObject(tsObjWrapper, yTop) {
    const { StartDate, EndDate, ResourceWorkCenter } = tsObjWrapper;
    const { tsObjectRenderer, appTimeTransform } = this;
    const xLeft = appTimeTransform.timeToScreenX(StartDate);
    const xRight = appTimeTransform.timeToScreenX(EndDate);
    if (Number.isNaN(xLeft)) return;
    const tsObj = new GeometryGC.Rectangle2D(
      xLeft,
      yTop + 2,
      xRight - xLeft,
      GeneralConfig.CellHeight - 4
    );
    tsObj.setColor(GeneralConfig.getOperationColorCode(ResourceWorkCenter));
    tsObjectRenderer.addObject(tsObj);
  }

  setupTSRenderer() {
    const { tsObjectRenderer } = this;
    tsObjectRenderer.createBuffers();
    tsObjectRenderer.setUniformGetter(
      this.createUniformGetter(
        GeneralConfig.NetworkElementLabelWidth,
        GeneralConfig.WGWrapperShutObjDepth
      )
    );
  }

  setupEditRenderer() {
    const { editRenderer } = this;
    editRenderer.createBuffers();
    editRenderer.setUniformGetter(
      this.createUniformGetter(
        GeneralConfig.NetworkElementLabelWidth,
        GeneralConfig.WGWrapperShutObjDepth
      )
    );
  }

  render() {
    if (!this.visible) return;
    super.render();
    const { tsObjectRenderer, editRenderer } = this;

    tsObjectRenderer.render();
    editRenderer.render();
  }

  findOperation = (timeX, networkElementWrapper) => {
    if (networkElementWrapper && networkElementWrapper.Operations) {
      const selectedOperations = networkElementWrapper.Operations.filter(
        tsObj => {
          const { StartDate, EndDate } = tsObj;
          return timeX >= StartDate && timeX <= EndDate;
        }
      );
      if (selectedOperations.length > 0) {
        const { StartDate, EndDate } = selectedOperations[0];
        const errorInTime = 2 * 60 * 1000;
        const selectionObj = {
          originalOperation: selectedOperations[0],
          originalStartDate: new Date(StartDate),
          originalEndDate: new Date(EndDate)
        };
        if (Utils.compareDates(StartDate, timeX, errorInTime)) {
          return { ...selectionObj, edge: "left" };
        } else if (Utils.compareDates(EndDate, timeX, errorInTime)) {
          return { ...selectionObj, edge: "right" };
        }
        return selectionObj;
      }
    }
    return null;
  };

  handleMousePan(dx, dy) {
    const { appTimeTransform } = this;
    // console.log(dx, dy);
    if (dx > 0 || dx < 0) {
      const viewportWidth =
        this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
      appTimeTransform.applyPan(dx, viewportWidth);
      appTimeTransform.quickCacheState("OpGantt");
    }
  }

  handleWheel(x, y, delta) {}

  handleDragStart(x, y) {
    const { appTimeTransform } = this;
    const timeX = appTimeTransform.screenXToTime(x);
    const selectedNetworkElement = this.findNetworkElementWrapper(y);
    const selectedObj = this.findOperation(timeX, selectedNetworkElement);
    if (selectedObj) {
      return {
        startX: x,
        ...selectedObj
      };
    }
    return null;
  }

  handleDrag = (x, y, dragObject) => {
    const { appTimeTransform } = this;
    if (dragObject) {
      const {
        startX,
        originalOperation,
        originalStartDate,
        originalEndDate,
        edge
      } = dragObject;
      const timeX = appTimeTransform.screenXToTime(x);
      const startTimeX = appTimeTransform.screenXToTime(startX);
      const timeDisplacementInSec = (timeX - startTimeX) / 1000;
      // console.log(timeDisplacementInSec);
      // Check if have to update start/end times
      let updateStartDate = (edge && edge === "left") || !edge;
      let updateEndDate = (edge && edge === "right") || !edge;
      const newStartDate = new Date(originalStartDate);
      const newEndDate = new Date(originalEndDate);
      if (updateStartDate) {
        newStartDate.setSeconds(
          newStartDate.getSeconds() + timeDisplacementInSec
        );
        updateStartDate =
          newStartDate < originalOperation.EndDate &&
          newStartDate > appTimeTransform.tStart0;
        // console.log(`S: ${  updateStartDate}`);
      }
      if (updateEndDate) {
        newEndDate.setSeconds(newEndDate.getSeconds() + timeDisplacementInSec);
        updateEndDate =
          newEndDate > originalOperation.StartDate &&
          newEndDate < appTimeTransform.tEnd0;
        // console.log(`E: ${  updateEndDate}`);
      }

      if (!edge && updateStartDate && updateEndDate) {
        originalOperation.StartDate = newStartDate;
        originalOperation.EndDate = newEndDate;
      } else if (edge && edge === "left" && updateStartDate) {
        originalOperation.StartDate = newStartDate;
      } else if (edge && edge === "right" && updateEndDate) {
        originalOperation.EndDate = newEndDate;
      }
      // Update scene
      this.addOperationObjects();
      this.setupTSRenderer();
      this.renderAll();
    }
  };

  handleDrop = (x, y, dragObject) => {
    if (dragObject) {
      const {
        startX,
        originalOperation,
        originalStartDate,
        originalEndDate,
        edge
      } = dragObject;

      const newData = Utils.clone(originalOperation.data);
      newData.StartTime = originalOperation.StartDate.toTimeString().substr(
        0,
        8
      );
      newData.EndTime = originalOperation.EndDate.toTimeString().substr(0, 8);
      newData.Duration =
        (originalOperation.EndDate - originalOperation.StartDate) /
        (60 * 60 * 1000);

      if (this.handlerList.onSaveUpdate) {
        this.handlerList.onSaveUpdate({
          action: "save",
          workOperation: newData
        });
      }
    }
  };

  handleShiftHover = (x, y, elemStyle) => {
    const { appTimeTransform } = this;
    const timeX = appTimeTransform.screenXToTime(x);
    const selectedNetworkElement = this.findNetworkElementWrapper(y);
    const selectedObj = this.findOperation(timeX, selectedNetworkElement);
    if (selectedObj) {
      const { edge } = selectedObj;
      if (elemStyle) {
        elemStyle.cursor = edge ? "w-resize" : "move";
      }
    } else {
      elemStyle.cursor = "default";
    }
  };

  handleHover = (x, y, elemStyle) => {
    if (elemStyle) {
      elemStyle.cursor = "default";
    }
  };

  subscribeToEvents() {
    super.subscribeToEvents();

    const { eventManager } = this;
    const x = GeneralConfig.NetworkElementLabelWidth;
    const width = this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      "shiftdragstart",
      this.handleDragStart.bind(this)
    );
    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      "shiftmousedrag",
      this.handleDrag.bind(this)
    );
    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      "shiftmousedrop",
      this.handleDrop.bind(this)
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      "shifthover",
      this.handleShiftHover.bind(this)
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      "mousehover",
      this.handleHover.bind(this)
    );
  }
}
