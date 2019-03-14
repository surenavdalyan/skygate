import Utils from "../AppUtils";
import GanttChartView from "./GanttChartView";
import ShutsWrapper from "./ShutsWrapper";

// ShutsGanttView Layer
export default class ShutsGanttView extends GanttChartView {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);
    this.defaultRenderType = "shuts";
    this.syncTimeline = true;
  }

  createDataObjects() {
    const { gl, shaderFac, canvas2D, mouseEventManager } = this;

    this.workGroupWrapperList = [];
    this.networkElementWrapperList = {};

    // since we are adding every possession in single workgroup
    const workGroup = { Id: 1, Name: "Workgroup1" };
    const workGroupWrapper = new ShutsWrapper(
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

    // this.inputData.endFacilitySectionMapping
    // this.inputData.endFacilities

    const { endFacilities, shuts } = this.inputData;

    if (endFacilities && endFacilities.length > 0) {
      endFacilities.forEach(endFacility => {
        const { Id, Name } = endFacility;
        this.networkElementWrapperList[Id] = {
          Name,
          Shuts: [],
          Possessions: []
        };
        workGroupWrapper.networkElementWrappers.push(
          this.networkElementWrapperList[Id]
        );
      });
    }

    if (shuts && shuts.length > 0) {
      this.shutLookup = {};
      shuts.forEach(shut => {
        const {
          EndFacilityId,
          StartTime,
          EndTime,
          EndFacilityName,
          IsOld
        } = shut;
        if (this.networkElementWrapperList[EndFacilityId]) {
          const StartDate = Utils.getStartOfTheDay(StartTime);
          const EndDate = Utils.getEndOfTheDay(EndTime);
          const name = EndFacilityName;
          const shutWrapper = {
            StartDate,
            EndDate,
            name,
            IsOld
          };
          const generateHoverText = (obj, keySet) => {
            const displayContents = [];
            Object.keys(obj)
              .filter(key => keySet.includes(key))
              .forEach(key => {
                const modifiedKey = Utils.removeCamelCase(key);
                displayContents.push(`${modifiedKey}: ${obj[key]}`);
              });
            return displayContents;
          };
          shutWrapper.hoverTextGenerator = generateHoverText;
          this.networkElementWrapperList[EndFacilityId].Shuts.push(shutWrapper);
        }
      });
    }
  }
}
