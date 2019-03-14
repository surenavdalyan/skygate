// import WorkGroupWrapper from "./WorkGroupWrapper";
// import Utils from "../AppUtils";
// import GanttChartView from "./GanttChartView";
// import WorkOrdersWrapper from "./WorkOrdersWrapper";

// // ShutsGanttView Layer
// export default class WorkOrdersView extends GanttChartView {
//   // Construct canvas and webgl context
//   constructor(wrapperElem, canvas) {
//     super(wrapperElem, canvas);
//     this.defaultRenderType = "workorders";
//   }

//   createDataObjects() {
//     const { gl, shaderFac, canvas2D, mouseEventManager } = this;

//     this.workGroupWrapperList = [];
//     this.networkElementWrapperList = {};

//     // since we are adding every possession in single workgroup
//     const workGroup = { Id: 1, Name: "Workgroup1" };
//     const workGroupWrapper = new WorkOrdersWrapper(
//       gl,
//       canvas2D.ctx,
//       shaderFac.shaderPrograms,
//       workGroup,
//       mouseEventManager
//     );
//     workGroupWrapper.networkElementWrappers = [];
//     workGroupWrapper.timeLabels = this.timeLabels;
//     workGroupWrapper.renderAll = this.render.bind(this);
//     workGroupWrapper.appTimeTransform = this.appTimeTransform;
//     this.workGroupWrapperList.push(workGroupWrapper);

//     const objList = this.inputData.workorders;
//     const getNameFromObj = obj => obj.EndFacilityName;
//     const getDateFromObj = obj => obj.StartTime;

//     objList.forEach(tsObject => {
//       const name = getNameFromObj(tsObject);
//       const workDate = getDateFromObj(tsObject);
//       let StartDate = new Date(workDate);
//       if (workDate.indexOf("T") === -1) {
//         StartDate = Utils.convertDateTime(workDate);
//       }
//       StartDate.setMinutes(0);
//       StartDate.setSeconds(0);
//       StartDate.setHours(0);
//       const EndDate = new Date(StartDate);
//       EndDate.setHours(EndDate.getHours() + 24);
//       const TSObjectWrapper = {
//         StartDate,
//         EndDate,
//         name
//       };

//       if (!this.networkElementWrapperList[name]) {
//         this.networkElementWrapperList[name] = {
//           Name: name,
//           Shuts: [],
//           Possessions: [],
//           WorkOrders :[]
//         };
//         workGroupWrapper.networkElementWrappers.push(
//           this.networkElementWrapperList[name]
//         );
//       }
//       this.networkElementWrapperList[name].WorkOrders.push(TSObjectWrapper);
//     });
//   }
// }
