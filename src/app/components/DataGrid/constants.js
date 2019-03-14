const appConstants = {
  STRING: "string",
  NUMBER: "number",
  DOUBLE: "double",
  DATE: "date",
  TIME: "time",
  BOOLEAN: "boolean",
  PERCENTAGE: "percentage",
  TEXT: "text",
  DATETIME: "datetime",
  LINK: "link",
  CUSTOM: "custom",
  COMMON_ERROR_MSG: "Sorry, something went wrong",
  APP_ERROR_MSG: "Sorry, something went wrong. Please contact the support team",
  GRID_ROW_HEIGHT: 30,
  GRID_HEADER_HEIGHT: 35,

  userPreferences: {
    DateRange: "DateRange",
    GridSettings: "GridSettings",
    PossessionGrid: "PossessionGrid",
    WorkOrderGrid: "WorkOrderGrid",
    PossessionResources: "PossessionResources",
    OrderResources: "OrderResources"
  },

  gridNames: {
    possessionsGrid: "Possession",
    workOperationGrid: "Work Operation",
    workorderGrid: "Work Order",
    plannedShut: "Planned Shuts",
    PossessionResources: "PossessionResources",
    OrderResources: "OrderResources",
    SilteKpi: "KPI Railing by Site ",
    ProductKpi: "KPI Railing by Product "
  },
  entityNames: {
    possessionsGrid: "Possession",
    workOperationGrid: "WorkOperation",
    workorderGrid: "Workorder",
    plannedShut: "PlannedShuts",
    PossessionResources: "PossessionResources",
    OrderResources: "OrderResources"
  },
  entityMapping: {
    1: "Possession",
    4: "Shutdown"
  },
  minColumnWidths: (fn => ({
    // todo: try to create width dynamically instead of hard coding
    Icons: fn([100], true),
    Number: fn([120], true),
    Text: fn([210], true),
    DateTime: fn([200], true),
    CheckBox: fn([150], true),
    CheckBoxLong: fn([160], true),
    Markers: fn([160], true),
    // -----------------
    TrackLocationId: fn([100], true),
    StartTime: fn([200], true),
    EndTime: fn([200], true),
    WorkType: fn([200], true),
    Import: fn([200], true),
    Workgroup: fn([200], true),
    FromTrackPrefix: fn([200], true),
    FromKMMark: fn([200], true),
    ToTrackPrefix: fn([200], true),
    ToKMMark: fn([200], true),
    TrackTime: fn([200], true),
    ContinousPossesionRequired: fn([200], true),
    IsAdjacentLineProtectionRequired: fn([200], true),
    Endorse1: fn([100], true),
    Endorce2: fn([100], true),
    IsLocked: fn([100], true),
    ActivityId: fn([100], true),
    EndFacilityId: fn([120], true),
    ActivityName: fn([250], true),
    EndFacilityName: fn([200], true),
    ActivityTypeCode: fn([150], true),
    PlannedEnd: fn([180], true),
    PlannedStart: fn([180], true),
    WorkOrderOperation: fn([200], true),
    WorkOrderDateTime: fn([150], true),
    WorkOrderString: fn([160], true),
    WorkOrderRevision: fn([120], true ),
    WorkOrderSort: fn([300], true),
  }))(([minWidth] = [], exact = false) => {
    if (exact) return minWidth;
    const headerWidth = 20; // add sort and filter icon width
    const width = minWidth + headerWidth;
    return width;

    //  const labelWidth = (width * 50) / 100;
    //  return labelWidth + headerWidth + (labelWidth < headerWidth ? headerWidth - labelWidth : 0);
  })
};

export default appConstants;
