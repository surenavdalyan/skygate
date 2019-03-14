const WorkTypeColorPalette = {
  Routine: [44, 177, 159],
  Grinding: [44, 118, 255],
  Rerail: [255, 194, 0],
  Renewal: [203, 82, 67],
  Other: [147, 155, 154],
  Bundled: [220, 137, 0]
};

// GANTT CHART CONFIGURATION
const GeneralConfig = {
  MainThemeColor_alpha: [9, 42, 77],
  MainThemeColor_beta: [51, 51, 51], // [0, 0, 0], // [20, 64, 111],
  WorkGroupPartitionColor: [20, 20, 20],
  BackgroundColor: [24, 36, 60],

  // Shuts
  RectangleBgColor: [200, 200, 250],
  RectangleBorderColor: [150, 150, 200],
  RectangleBgColor_Old: [250, 220, 220],
  RectangleBgAlpha_Old: 0.3,
  RectangleBorderColor_Old: [250, 220, 220],

  // Possession Warning Config
  WarningTriangleOffset: 10,
  WarningLineHeight: 10,
  WarningYGap: 3,

  NetworkElementLabelWidth: 200,
  CellHeight: 25,
  CellWidth: 40,

  // Depth values: WGWrapper - this decides the order of different elements
  WGWrapperYAxisDepth: 0.21,
  WGWrapperBgDepth: 0.22,

  WGWrapperSelectionObjDepth: 0.32,
  WGWrapperShutObjDepth: 0.33,
  WGWrapperTimeAxisDepth: 0.34,
  WGWrapperTSObjDepth: 0.35,
  WGWrapperTsWarningDepth: 0.32,

  // Depth values: Timeline header
  THeaderYAxisDepth: 0.11,
  THeaderYAxisBgDepth: 0.115,
  THeaderTimeAxisDepth: 0.12,
  THeaderTimeAxisBgDepth: 0.13,

  getColorCode: wtype => {
    switch (wtype) {
      case "Routine":
        return WorkTypeColorPalette.Routine;
      case "Grinding":
        return WorkTypeColorPalette.Grinding;
      case "Rerail":
        return WorkTypeColorPalette.Rerail;
      case "Renewal":
      case "TrackRn":
      case "SwitchRn":
      case "LevelXingRn":
        return WorkTypeColorPalette.Renewal;
      default: {
        if (wtype && wtype.indexOf(",") !== -1) {
          return WorkTypeColorPalette.Bundled;
        }
        return WorkTypeColorPalette.Other;
      }
    }
  },

  getOperationColorCode: wtype => {
    switch (wtype) {
      case "SN08-S01":
        return [150, 150, 50];
      case "SN08-S02":
        return [150, 70, 100];
      case "SN08-S03":
        return [50, 150, 50];
      default:
        return [146, 155, 104];
    }
  }
};

export { GeneralConfig };
