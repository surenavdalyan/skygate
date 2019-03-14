import renderConfigGC from "../ObjectGroupGC/renderConfig";
import ObjectRenderer from "../lib/ObjectRenderer";
import GeometryGC from "../ObjectGroupGC/objects";
import { GeneralConfig } from "./mainConfig";
import Utils from "../AppUtils";
import WorkGroupWrapper from "./WorkGroupWrapper";

export default class ShutsWrapper extends WorkGroupWrapper {
  constructor(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager) {
    super(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager);
    this.shutRenderer = new ObjectRenderer(gl, shaderPrograms, renderConfigGC);
  }

  createBuffers() {
    super.createBuffers();
    let yPos = 0;
    const yStepSize = GeneralConfig.CellHeight;
    const { networkElementWrappers, shutRenderer } = this;
    shutRenderer.clearObjects();

    networkElementWrappers.forEach(networkElementWrapper => {
      yPos += yStepSize;
      // this.addNetworkElement(yPos, yStepSize, networkElementWrapper);
      const { Shuts } = networkElementWrapper;
      Shuts.forEach(shutObj => {
        this.addShutObject(shutObj, yPos - yStepSize);
      });
    });

    this.height = yPos;
    this.setupShutRenderer();
  }

  addShutObject(tsObjWrapper, yTop) {
    const { StartDate, EndDate, IsOld } = tsObjWrapper;
    const { shutRenderer, appTimeTransform } = this;
    if (StartDate > appTimeTransform.tEnd0) return;
    const xLeft = appTimeTransform.timeToScreenX(StartDate);
    let xRight = appTimeTransform.timeToScreenX(EndDate);
    xRight = Math.min(appTimeTransform.xSpan, xRight);
    if (Number.isNaN(xLeft)) return;
    const shutObj = new GeometryGC.BorderedRectangle2D(
      xLeft,
      yTop,
      xRight - xLeft,
      GeneralConfig.CellHeight
    );
    // shutObj.enableTexture = true;
    if (IsOld) {
      shutObj.setColor(
        GeneralConfig.RectangleBorderColor_Old,
        GeneralConfig.RectangleBgAlpha_Old
      );
      shutObj.setBorderColor(GeneralConfig.RectangleBorderColor_Old, 1.0);
    } else {
      shutObj.setColor(GeneralConfig.RectangleBgColor, 0.1);
      shutObj.setBorderColor(GeneralConfig.RectangleBorderColor, 1.0);
    }
    shutRenderer.addObject(shutObj);
  }

  setupShutRenderer() {
    const { shutRenderer } = this;
    shutRenderer.createBuffers();
    shutRenderer.setUniformGetter(
      this.createUniformGetter(
        GeneralConfig.NetworkElementLabelWidth,
        GeneralConfig.WGWrapperShutObjDepth,
        false,
        0
      )
    );
  }

  handleDoubleClick = (x, y) => {};
  findShuts = (startTime, endTime, networkElementWrapper) => {
    if (networkElementWrapper.Shuts) {
      const selectedShuts = networkElementWrapper.Shuts.filter(Obj => {
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
          selectedNetworkElement
        );
        selectionObject.selectedShuts = selectedShuts;
        selectionObject.StartTime.setHours(10);
        selectionObject.EndTime.setHours(10);
      }
      // console.log(selectionObject);
    }
    return selectionObject;
  }

  handleHover(x, y) {
    const selectionObject = this.getShutsAt(x, y);
    if (selectionObject.selectedShuts) {
      // Get StartDate and EndDate

      const { selectedShuts } = selectionObject;
      let xPos = this.appTimeTransform.timeToScreenX(selectedShuts.StartDate);
      let xRight = this.appTimeTransform.timeToScreenX(selectedShuts.EndDate);
      const boxWidth = xRight - xPos;

      xPos = this.appTimeTransform.transformX(xPos);
      xRight = this.appTimeTransform.transformX(xRight);

      let yPos = selectionObject.yPos;
      let top = yPos - GeneralConfig.CellHeight;
      yPos = this.appTimeTransform.transformY(yPos);
      top = this.appTimeTransform.transformY(top);

      let tooltipLeft = xPos;
      if (xPos < 0) tooltipLeft = 0;
      else if (xRight >= this.canvas.width - 300) tooltipLeft = xPos - 220;

      const tooltipTop = top + 10 + this.yOffset;
      tooltipLeft = tooltipLeft + 10 + GeneralConfig.NetworkElementLabelWidth;
      selectedShuts.StartDate = selectedShuts.StartDate.toDateString();
      selectedShuts.EndDate = selectedShuts.EndDate.toDateString();
      selectedShuts.HistoryRecord = selectedShuts.IsOld == true ? "Yes" : "No";
      // TODO : Allowed Keys should come from JSON
      const allowedKeys = ["name", "StartDate", "EndDate", "HistoryRecord"];
      const hoverText = selectedShuts.hoverTextGenerator(
        selectedShuts,
        allowedKeys
      );
      // this.hoverTextRenderer.init(selectedPossession.data);
      // const hoverText = this.hoverTextRenderer.generateHoverText();
      if (this.handlerList.tooltipHandler) {
        this.handlerList.tooltipHandler(true, hoverText, {
          x: tooltipLeft + boxWidth,
          y: tooltipTop + GeneralConfig.CellHeight
        });
      }
    } else if (this.handlerList.tooltipHandler) {
      this.handlerList.tooltipHandler(false);
    }
  }

  render() {
    if (!this.visible) return;
    super.render();
    const { shutRenderer } = this;

    shutRenderer.render();
  }
}
