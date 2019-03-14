import Utils from "../AppUtils";
import GanttChartView from "./GanttChartView";
import PossessionsWrapper from "./PossessionsWrapper";

// PossessionsGanttView Layer
export default class PossessionsGanttView extends GanttChartView {
  // Construct canvas and webgl context
  constructor(wrapperElem, canvas) {
    super(wrapperElem, canvas);
    this.defaultRenderType = "possessions";
    this.syncTimeline = true;
  }

  createDataObjects() {
    const { gl, shaderFac, canvas2D, mouseEventManager } = this;

    this.workGroupWrapperList = [];
    this.networkElementWrapperList = {};

    // since we are adding every possession in single workgroup
    const workGroup = { Id: 1, Name: "Workgroup1" };
    const workGroupWrapper = new PossessionsWrapper(
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

    const {
      sections,
      sectionMapping,
      possessions,
      shuts,
      endFacilitySectionMapping,
      validations
    } = this.inputData;

    if (sections && sections.length > 0) {
      sections.forEach(section => {
        this.networkElementWrapperList[section.Id] = {
          data: section,
          Name: section.Name,
          Shuts: [],
          Possessions: [],
          PossessionWarnings: []
          // WorkOrders:[]
        };
        workGroupWrapper.networkElementWrappers.push(
          this.networkElementWrapperList[section.Id]
        );
      });
    }
    if (validations && validations.length > 0) {
      this.warningLookUp = {};
      validations.forEach(warning => {
        const { SectionId, SelectedDate, Message, Severity, PossessionId } = warning;
        if (SelectedDate != null && SectionId !== 0 && PossessionId !== 0) {
          const StartDate = Utils.getStartOfTheDay(SelectedDate);
          const EndDate = Utils.getEndOfTheDay(SelectedDate);
          const WarningWrapper = {
            StartDate,
            EndDate,
            Severity,
            Message,
            PossessionId
          };
          if(this.networkElementWrapperList[SectionId])
          this.networkElementWrapperList[SectionId].PossessionWarnings.push(
            WarningWrapper
          );
        }
      });
    }

    if (
      sectionMapping &&
      sectionMapping.length > 0 &&
      possessions &&
      possessions.length > 0
    ) {
      this.possessionLookup = {};
      possessions.forEach(possession => {
        const { Id } = possession;
        this.possessionLookup[Id] = possession;
      });

      sectionMapping.forEach(relation => {
        const { SourceId, SectionId } = relation;

        if (
          this.networkElementWrapperList[SectionId] &&
          this.possessionLookup[SourceId]
        ) {
          const { WorkDate, WorkType } = this.possessionLookup[SourceId];
          if (!WorkDate) {
            console.error("WorkDate received is null");
            return;
          }
          const StartDate = Utils.getStartOfTheDay(WorkDate);
          const EndDate = Utils.getEndOfTheDay(WorkDate);

          const TSObjectWrapper = {
            StartDate,
            EndDate,
            data: this.possessionLookup[SourceId],
            workType: WorkType
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
          TSObjectWrapper.hoverTextGenerator = generateHoverText;
          this.networkElementWrapperList[SectionId].Possessions.push(
            TSObjectWrapper
          );
        }
      });
    }

    // Draw Shuts on Possessions Gantt
    if (
      shuts &&
      shuts.length > 0 &&
      endFacilitySectionMapping &&
      endFacilitySectionMapping.length > 0
    ) {
      this.shutLookup = {};
      shuts.forEach(shut => {
        const { EndFacilityId } = shut;
        if (!this.shutLookup[EndFacilityId]) {
          this.shutLookup[EndFacilityId] = new Array();
        }
        this.shutLookup[EndFacilityId].push(shut);
      });

      endFacilitySectionMapping.forEach(relation => {
        const { EndFacilityId, SectionId } = relation;
        if (
          this.networkElementWrapperList[SectionId] &&
          this.shutLookup[EndFacilityId]
        ) {
          this.shutLookup[EndFacilityId].forEach(shut => {
            if (!shut.IsOld) {
              const { StartTime, EndTime, EndFacilityName, IsOld } = shut;
              const StartDate = Utils.getStartOfTheDay(StartTime);
              const EndDate = Utils.getEndOfTheDay(EndTime);
              const name = EndFacilityName;
              const shutWrapper = {
                StartDate,
                EndDate,
                name,
                IsOld
              };
              this.networkElementWrapperList[SectionId].Shuts.push(shutWrapper);
            }
          });
        }
      });
    }
  }
}
