// GANTT CHART CONFIGURATION
const GeneralConfig = {
  MainThemeColor_alpha: [9, 42, 77],
  MainThemeColor_beta: [51, 51, 51], // [0, 0, 0], // [20, 64, 111],
  WorkGroupPartitionColor: [20, 20, 20],
  BackgroundColor: [245, 247, 246],
  DARK_BLUE: [10, 10, 200],
  BLACK: [0, 0, 0],
  DARK_YELLOW: [100, 100, 50],

  // Possession Warning Config
  WarningTriangleOffset: 10,
  WarningLineHeight: 10,
  WarningYGap: 3,

  NetworkElementLabelWidth: 60,
  CellHeight: 65,
  CellWidth: 40,
  CellTopPadding: 27,
  GridLinesAlpha: 0.6,
  LabelBoxHeight: 12,

  // Depth values: WGWrapper - this decides the order of different elements
  WGWrapperYAxisDepth: 0.21,
  WGWrapperBgDepth: 0.22,

  WGWrapperSelectionObjDepth: 0.32,
  WGWrapperPointObjDepth: 0.325,
  WGWrapperShutObjDepth: 0.33,
  WGWrapperProjectionDepth: 0.335,
  WGWrapperTimeAxisDepth: 0.34,
  WGWrapperTSObjDepth: 0.35,
  WGWrapperTsWarningDepth: 0.32,

  // Depth values: Timeline header
  THeaderYAxisDepth: 0.11,
  THeaderYAxisBgDepth: 0.115,
  THeaderTimeAxisDepth: 0.12,
  THeaderTimeAxisBgDepth: 0.13,
};

export { GeneralConfig };
