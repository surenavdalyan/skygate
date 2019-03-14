import renderConfigGC from "../ObjectGroupGC/renderConfig";
import ObjectRenderer from "../lib/ObjectRenderer";
import GeometryGC from "../ObjectGroupGC/objects";
import { GeneralConfig } from "./mainConfig";
import WorkGroupWrapper from "./WorkGroupWrapper";
import Utils from "../AppUtils";

export default class PossessionsWrapper extends WorkGroupWrapper {
  constructor(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager) {
    super(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager);
    this.tsObjectRenderer = new ObjectRenderer(
      gl,
      shaderPrograms,
      renderConfigGC
    );
    this.shutRenderer = new ObjectRenderer(gl, shaderPrograms, renderConfigGC);
    this.warningTriangleRenderer = new ObjectRenderer(
      gl,
      shaderPrograms,
      renderConfigGC
    );

    this.showShuts = true;
  }

  createBuffers() {
    super.createBuffers();
    let yPos = 0;
    const yStepSize = GeneralConfig.CellHeight;
    const {
      networkElementWrappers,
      tsObjectRenderer,
      warningTriangleRenderer
    } = this;

    tsObjectRenderer.clearObjects();
    warningTriangleRenderer.clearObjects();

    networkElementWrappers.forEach(networkElementWrapper => {
      yPos += yStepSize;
      // this.addNetworkElement(yPos, yStepSize, networkElementWrapper);

      const { Possessions, Shuts, PossessionWarnings } = networkElementWrapper;
      Possessions.forEach(possessionObj => {
        this.addPossessionObject(possessionObj, yPos - yStepSize);
      });
      Shuts.forEach(shutObj => {
        this.addShutObject(shutObj, yPos - yStepSize);
      });
      PossessionWarnings.forEach(warning => {
        this.addWarningTriangle(warning, yPos - yStepSize);
      });
    });

    this.height = yPos;

    this.setupTSRenderer();
    this.setupShutRenderer();
    this.setUpWarningTriangleRenderer();
  }

  addPossessionObject(tsObjWrapper, yTop) {
    const { StartDate, EndDate, workType } = tsObjWrapper;
    const { tsObjectRenderer, appTimeTransform } = this;
    if (StartDate >= appTimeTransform.tEnd0) return;
    const xLeft = appTimeTransform.timeToScreenX(StartDate);
    const xRight = appTimeTransform.timeToScreenX(EndDate);
    if (Number.isNaN(xLeft)) return;
    const tsObj = new GeometryGC.Rectangle2D(
      xLeft,
      yTop,
      xRight - xLeft,
      GeneralConfig.CellHeight
    );
    tsObj.setColor(GeneralConfig.getColorCode(workType));
    tsObjectRenderer.addObject(tsObj);
  }

  addWarningTriangle(warning, yTop) {
    const { StartDate, EndDate } = warning;
    const { warningTriangleRenderer, appTimeTransform } = this;
    if (StartDate >= appTimeTransform.tEnd0) return;
    const xLeft = appTimeTransform.timeToScreenX(StartDate);
    const xRight = appTimeTransform.timeToScreenX(EndDate);
    if (Number.isNaN(xLeft)) return;
    const xCenter = (xLeft + xRight) / 2.0;
    const lineHeight = GeneralConfig.WarningLineHeight;
    const offsetFromCenter = GeneralConfig.WarningTriangleOffset;
    const yGap = GeneralConfig.WarningYGap;
    const warningObj = new GeometryGC.LineGroup2D([
      [
        [xCenter, yTop + yGap],
        [xCenter - offsetFromCenter, yTop + GeneralConfig.CellHeight - yGap]
      ],
      [
        [xCenter, yTop + yGap],
        [xCenter + offsetFromCenter, yTop + GeneralConfig.CellHeight - yGap]
      ],
      [
        [xCenter - offsetFromCenter, yTop + GeneralConfig.CellHeight - yGap],
        [xCenter + offsetFromCenter, yTop + GeneralConfig.CellHeight - yGap]
      ],
      [[xCenter, yTop + 2 * yGap], [xCenter, yTop + 2 * yGap + lineHeight]]
    ]);
    warningObj.setColor([242,31,31]);
    warningTriangleRenderer.addObject(warningObj);
  }

  addShutObject(tsObjWrapper, yTop) {
    const { StartDate, EndDate, IsOld } = tsObjWrapper;
    const { shutRenderer, appTimeTransform } = this;
    if (StartDate >= appTimeTransform.tEnd0) return;
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

  setupTSRenderer() {
    const { tsObjectRenderer } = this;
    tsObjectRenderer.createBuffers();
    tsObjectRenderer.setUniformGetter(
      this.createUniformGetter(
        GeneralConfig.NetworkElementLabelWidth,
        GeneralConfig.WGWrapperTSObjDepth
      )
    );
  }
  setUpWarningTriangleRenderer() {
    const { warningTriangleRenderer } = this;
    warningTriangleRenderer.createBuffers();
    warningTriangleRenderer.setUniformGetter(
      this.createUniformGetter(
        GeneralConfig.NetworkElementLabelWidth,
        GeneralConfig.WGWrapperTsWarningDepth
      )
    );
  }

  render() {
    if (!this.visible) return;
    super.render();
    const {
      tsObjectRenderer,
      shutRenderer,
      showShuts,
      warningTriangleRenderer
    } = this;

    tsObjectRenderer.render();
    if (showShuts) {
      shutRenderer.render();
    }
    warningTriangleRenderer.render();
  }
  findPossessionWarning = (startTime, endTime, networkElementWrapper) => {
    if (networkElementWrapper.PossessionWarnings) {
      const selectedPossessionWarning = networkElementWrapper.PossessionWarnings.filter(
        Obj => {
          const startDateMatching = Utils.compareDates(
            Obj.StartDate,
            startTime,
            1000
          );
          const endDateMatching = Utils.compareDates(
            Obj.EndDate,
            endTime,
            1000
          );
          return startDateMatching && endDateMatching;
        }
      );
      if (selectedPossessionWarning.length > 0){
        const selectedPossessionWarningsCloned = [];
        selectedPossessionWarning.forEach(possessionWarning => {
          selectedPossessionWarningsCloned.push(Utils.clone(possessionWarning));
        });
        return selectedPossessionWarningsCloned;
     

      }
       // return Utils.clone(selectedPossessionWarning[0]);
    }
    return null;
  };

  findPossessions = (startTime, endTime, networkElementWrapper) => {
    if (networkElementWrapper.Possessions) {
      const selectedPossessions = networkElementWrapper.Possessions.filter(
        tsObj => {
          const startDateMatching = Utils.compareDates(
            tsObj.StartDate,
            startTime,
            1000
          );
          const endDateMatching = Utils.compareDates(
            tsObj.EndDate,
            endTime,
            1000
          );
          return startDateMatching && endDateMatching;
        }
      );
      if (selectedPossessions.length > 0) {
        const selectedPossessionsCloned = [];
        selectedPossessions.forEach(possession => {
          selectedPossessionsCloned.push(Utils.clone(possession));
        });
        return selectedPossessionsCloned;
      }
    }
    return null;
  };

  getWarningObjectAt(x, y) {
    const { appTimeTransform } = this;
    let warningObject = null;

    const xTime = appTimeTransform.screenXToTime(x);
    if (xTime) {
      const StartTime = Utils.getStartOfTheDay(xTime);
      const EndTime = Utils.getEndOfTheDay(xTime);

      warningObject = { StartTime, EndTime };

      const selectedNetworkElement = this.findNetworkElementWrapper(y);

      if (selectedNetworkElement) {
        warningObject.yPos = selectedNetworkElement.yPos;

        // TODO: move this to PossessionWrapper
        const selectedPossessionWarning = this.findPossessionWarning(
          StartTime,
          EndTime,
          selectedNetworkElement
        );
        warningObject.selectedPossessionWarning = selectedPossessionWarning;
        warningObject.StartTime.setHours(10);
        warningObject.EndTime.setHours(10);
      }
      // console.log(selectionObject);
    }
    return warningObject;
  }

  getPossessionObjectAt(x, y, showSelection = false) {
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
        if (showSelection)
          this.addSelectionObject(
            StartTime,
            EndTime,
            selectedNetworkElement.yPos
          );

        // TODO: move this to PossessionWrapper
        const selectedPossession = this.findPossessions(
          StartTime,
          EndTime,
          selectedNetworkElement
        );
        selectionObject.selectedPossession = selectedPossession;
        selectionObject.StartTime.setHours(10);
        selectionObject.EndTime.setHours(10);
      }
      // console.log(selectionObject);
    }
    return selectionObject;
  }


  handleHover(x, y) {
    const selectionObject = this.getPossessionObjectAt(x, y);
    const warningObject = this.getWarningObjectAt(x, y);
    const shutsObject = this.getShutsAt(x, y);
    let showHover = false;
    let xPos = 0,
      xRight = 0,
      yPos = 0;
    const hoverTextGenerator = (obj, keySet) => {
      const displayContents = [];
      Object.keys(obj)
        .filter(key => keySet.includes(key))
        .forEach(key => {
          const modifiedKey = Utils.removeCamelCase(key);
          displayContents.push(`${modifiedKey}: ${obj[key]}`);
        });
      return displayContents;
    };

    const textObjectList = [];

    
    if (warningObject && warningObject.selectedPossessionWarning) {
      // Invoke handler for displaying warning
      const { selectedPossessionWarning } = warningObject;
      const warningTexts = [];
      xPos = this.appTimeTransform.timeToScreenX(
        selectedPossessionWarning[0].StartDate
      );
      xRight = this.appTimeTransform.timeToScreenX(
        selectedPossessionWarning[0].EndDate
      );

      yPos = selectionObject.yPos;
      selectedPossessionWarning.forEach(warning => {

        const wrappedObj = {};
      wrappedObj.Title = "Warning";
      wrappedObj.StartDate = warning.StartDate;
      wrappedObj.StartDate = warning.StartDate.toDateString();
      //wrappedObj.Severity = warning.Severity;
      wrappedObj.PossessionId = warning.PossessionId;
      wrappedObj.Message = warning.Message;
     

      const allowedKeys = ["Title", "StartDate", "Message","PossessionId"];
      const hoverText = hoverTextGenerator(wrappedObj, allowedKeys);
      const combinedHoverText = [];               

      
      warningTexts.push(hoverText);

       
      });

      let combinedWarningText = [];
      combinedWarningText.push(warningTexts[0][0]);
      combinedWarningText.push(warningTexts[0][1]);

      warningTexts.map(textArr=>{
                textArr.map((text,index)=>{
                        if(index === 2 || index === 3)
                        {
                          combinedWarningText.push(text);
                        }

                })

      });

      textObjectList.push(combinedWarningText);

     
      showHover = true;
    }

    if (shutsObject && shutsObject.selectedShuts) {
      const { selectedShuts } = shutsObject;
      xPos = this.appTimeTransform.timeToScreenX(selectedShuts.StartDate);
      xRight = this.appTimeTransform.timeToScreenX(selectedShuts.EndDate);
      yPos = selectionObject.yPos;

      const wrappedObj = {};
      wrappedObj.Title = "Shuts";
      wrappedObj.StartDate = selectedShuts.StartDate;
      wrappedObj.StartDate = wrappedObj.StartDate.toDateString();
      wrappedObj.EndDate = selectedShuts.EndDate;
      wrappedObj.EndDate = wrappedObj.EndDate.toDateString();      
      wrappedObj.name = selectedShuts.name;
      wrappedObj.isOld = selectedShuts.isOld;

      const allowedKeys = ["Title", "name", "StartDate", "EndDate", "IsOld"];
      const hoverText = hoverTextGenerator(wrappedObj, allowedKeys);
      textObjectList.push(hoverText);
      showHover = true;
    }

    if (selectionObject.selectedPossession) {
      // Get StartDate and EndDate

      const { selectedPossession } = selectionObject;
      xPos = this.appTimeTransform.timeToScreenX(
        selectedPossession[0].StartDate
      );
      xRight = this.appTimeTransform.timeToScreenX(
        selectedPossession[0].EndDate
      );
      yPos = selectionObject.yPos;

      const wrappedObj = [];
      selectedPossession.forEach(possession => {
        const possessionObj = {};
        const data = possession.data;
        possessionObj.Title = "Possession";
        possessionObj.Name = data.Name;
        possessionObj.StartDate = data.StartTime;
        possessionObj.WorkType = data.WorkType;
        possessionObj.WorkGroup = data.WorkGroup;

        const allowedKeys = [
          "Title",
          "Name",
          "StartDate",
          "WorkType",
          "WorkGroup"
        ];
        const hoverText = hoverTextGenerator(possessionObj, allowedKeys);
        textObjectList.push(hoverText);
      });
      showHover = true;
    }
    if (showHover) {
      const boxWidth = xRight - xPos;

      xPos = this.appTimeTransform.transformX(xPos);
      xRight = this.appTimeTransform.transformX(xRight);

      let top = yPos - GeneralConfig.CellHeight;
      yPos = this.appTimeTransform.transformY(yPos);
      top = this.appTimeTransform.transformY(top);

      let tooltipLeft = xPos;
      if (xPos < 0) tooltipLeft = 0;
      else if (xRight >= this.canvas.width - 300) tooltipLeft = xPos - 220;

      const tooltipTop = top + 10 + this.yOffset;
      tooltipLeft = tooltipLeft + 10 + GeneralConfig.NetworkElementLabelWidth;
      // TODO : Allowed Keys should come from JSON
      // this.hoverTextRenderer.init(selectedPossession.data);
      // const hoverText = this.hoverTextRenderer.generateHoverText();
      if (this.handlerList.tooltipHandler) {
        this.handlerList.tooltipHandler(true, textObjectList, {
          x: tooltipLeft + boxWidth,
          y: tooltipTop + GeneralConfig.CellHeight
        });
      }
    } else if (this.handlerList.tooltipHandler) {
      this.handlerList.tooltipHandler(false);
    }
  }
}
