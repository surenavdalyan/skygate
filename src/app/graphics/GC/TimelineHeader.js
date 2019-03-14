import GeometryGC from "../ObjectGroupGC/objects";
import TextObject from "../ObjectGroupGC/textObjects";
import { GeneralConfig } from "./mainConfig";
import { SHADER_VARS } from "../ShaderFactory/constants";
import EventAggregator from "../EventAggregator";
import Utils from "../AppUtils";

export default class TimelineHeader {
  constructor(
    timeLabels,
    yAxisRenderer,
    yAxisBgRenderer,
    timeAxisRenderer,
    timeAxisBgRenderer,
    yAxisTextRenderer,
    timeAxisTextRenderer,
    eventManager
  ) {
    this.timeLabels = timeLabels;
    this.visible = true;
    this.yOffset = 0;
    this.height = 0;
    this.yAxisRenderer = yAxisRenderer;
    this.yAxisBgRenderer = yAxisBgRenderer;
    this.timeAxisRenderer = timeAxisRenderer;
    this.timeAxisBgRenderer = timeAxisBgRenderer;
    this.timeAxisTextRenderer = timeAxisTextRenderer;
    this.yAxisTextRenderer = yAxisTextRenderer;
    this.eventManager = eventManager;

    this.canvas = this.timeAxisRenderer.gl.canvas;
    this.height = 3 * GeneralConfig.CellHeight;
  }

  createBuffers() {
    const {
      yAxisRenderer,
      yAxisBgRenderer,
      timeAxisRenderer,
      timeAxisBgRenderer,
      timeAxisTextRenderer,
      yAxisTextRenderer
    } = this;
    yAxisRenderer.clearObjects();
    yAxisBgRenderer.clearObjects();
    timeAxisRenderer.clearObjects();
    timeAxisBgRenderer.clearObjects();
    timeAxisTextRenderer.clearObjects();
    yAxisTextRenderer.clearObjects();
    const y0 = 0;
    const y1 = this.height / 3;
    const y2 = 2 * this.height / 3;
    const y3 = this.height;

    this.addBackgroundObjects();
    this.addTimeAxisObjects(y0, y1, y2, y3);
    this.addYAxisObjects(y0, y1, y2, y3);
    timeAxisTextRenderer.setMatrixGetter(() =>
      this.createTransformationMatrix(GeneralConfig.NetworkElementLabelWidth)
    );
    yAxisTextRenderer.setMatrixGetter(() =>
      this.createTransformationMatrix(0, true)
    );

    this.subscribeToEvents();
  }

  addBackgroundObjects() {
    const { timeAxisBgRenderer, yAxisBgRenderer, canvas, height } = this;
    const timeAxisbgRect2D = new GeometryGC.Rectangle2D(
      0,
      0,
      canvas.width,
      height
    );
    timeAxisbgRect2D.setColor(GeneralConfig.BackgroundColor);

    timeAxisBgRenderer.addObjects([timeAxisbgRect2D]);
    // Create buffers and uniform getter
    timeAxisBgRenderer.createBuffers();
    timeAxisBgRenderer.setUniformGetter(
      this.createUniformGetter(0, GeneralConfig.THeaderTimeAxisBgDepth, true)
    );

    const yAxisbgRect2D = new GeometryGC.Rectangle2D(
      0,
      0,
      GeneralConfig.NetworkElementLabelWidth,
      height
    );
    yAxisbgRect2D.setColor(GeneralConfig.BackgroundColor);

    yAxisBgRenderer.addObjects([yAxisbgRect2D]);
    // Create buffers and uniform getter
    yAxisBgRenderer.createBuffers();
    yAxisBgRenderer.setUniformGetter(
      this.createUniformGetter(0, GeneralConfig.THeaderYAxisBgDepth, true)
    );
  }

  addTimeAxisObjects(y0, y1, y2, y3) {
    const {
      timeLabels,
      timeAxisRenderer,
      timeAxisTextRenderer,
      appTimeTransform
    } = this;

    // Vertical lines
    timeLabels.forEach(timeLabel => {
      if (timeLabel.datetime >= appTimeTransform.tEnd0) return;
      const t = appTimeTransform.timeToScreenX(timeLabel.datetime);
      const vertLineForDay2D = new GeometryGC.LineSegment2D([t, y2], [t, y3]);
      vertLineForDay2D.setColor(GeneralConfig.MainThemeColor_beta);
      timeAxisRenderer.addObject(vertLineForDay2D);

      // Horizontal lines
      const monthLine2D = new GeometryGC.LineSegment2D(
        [0, y1],
        [appTimeTransform.xSpan, y1]
      );
      monthLine2D.setColor(GeneralConfig.MainThemeColor_beta);
      const weekLine2D = new GeometryGC.LineSegment2D(
        [0, y2],
        [appTimeTransform.xSpan, y2]
      );
      weekLine2D.setColor(GeneralConfig.MainThemeColor_beta);
      const dayLine2D = new GeometryGC.LineSegment2D(
        [0, y3],
        [appTimeTransform.xSpan, y3]
      );
      dayLine2D.setColor(GeneralConfig.MainThemeColor_beta);
      const vertPartition2D = new GeometryGC.Rectangle2D(
        appTimeTransform.xSpan,
        0,
        3,
        this.height
      );
      vertPartition2D.setColor(GeneralConfig.MainThemeColor_beta);
      timeAxisRenderer.addObjects([
        monthLine2D,
        weekLine2D,
        dayLine2D,
        vertPartition2D
      ]);

      const { datetime } = timeLabel;
      if (+datetime.getDay() === 0) {
        const vertLineForWeek2D = new GeometryGC.LineSegment2D(
          [t, y1],
          [t, y2]
        );
        vertLineForWeek2D.setColor(GeneralConfig.MainThemeColor_beta);
        timeAxisRenderer.addObject(vertLineForWeek2D);

        const label = new TextObject.CenterLabelBox(
          { text: Utils.getWeekNumber(datetime) },
          t,
          y1,
          7 * GeneralConfig.CellWidth,
          y2 - y1
        );
        timeAxisTextRenderer.addObject(label);
      }

      if (+datetime.getDate() === 1) {
        const vertLineForMonth2D = new GeometryGC.LineSegment2D(
          [t, y0],
          [t, y1]
        );
        vertLineForMonth2D.setColor(GeneralConfig.MainThemeColor_beta);
        timeAxisRenderer.addObject(vertLineForMonth2D);

        const label = new TextObject.CenterLabelBox(
          { text: Utils.toMonthString(datetime) },
          t,
          y0,
          30 * GeneralConfig.CellWidth,
          y1 - y0
        );
        timeAxisTextRenderer.addObject(label);
      }

      timeLabel.smallerText = timeLabel.text.split("/")[0];
      const label = new TextObject.CenterLabelBox(
        timeLabel,
        t,
        y2,
        GeneralConfig.CellWidth,
        y3 - y2
      );
      timeAxisTextRenderer.addObject(label);
    });

    timeAxisRenderer.createBuffers();
    timeAxisRenderer.setUniformGetter(
      this.createUniformGetter(
        GeneralConfig.NetworkElementLabelWidth,
        GeneralConfig.THeaderTimeAxisDepth
      )
    );
  }

  addYAxisObjects(y0, y1, y2, y3) {
    const { yAxisRenderer, yAxisTextRenderer } = this;
    const yLabelWidth = GeneralConfig.NetworkElementLabelWidth;

    const clearBox = new TextObject.ClearBox(
      null,
      0,
      0,
      yLabelWidth,
      this.height
    );
    const monthLabel = new TextObject.CenterLabelBox(
      { text: "Month" },
      0,
      y0,
      yLabelWidth,
      y1 - y0
    );
    const weekLabel = new TextObject.CenterLabelBox(
      { text: "Week" },
      0,
      y1,
      yLabelWidth,
      y2 - y1
    );
    const dayLabel = new TextObject.CenterLabelBox(
      { text: "Date/Day" },
      0,
      y2,
      yLabelWidth,
      y3 - y2
    );
    yAxisTextRenderer.addObjects([clearBox, monthLabel, weekLabel, dayLabel]);

    // Vertical lines
    const vertLine2D = new GeometryGC.LineSegment2D(
      [yLabelWidth, 0],
      [yLabelWidth, this.height]
    );
    vertLine2D.setColor(GeneralConfig.MainThemeColor_beta);

    yAxisRenderer.addObjects([vertLine2D]);

    // Create buffers and uniform getter
    yAxisRenderer.createBuffers();
    yAxisRenderer.setUniformGetter(
      this.createUniformGetter(0, GeneralConfig.THeaderYAxisDepth, true)
    );
  }

  render() {
    if (!this.visible) return;
    const {
      yAxisRenderer,
      yAxisBgRenderer,
      timeAxisRenderer,
      timeAxisBgRenderer,
      yAxisTextRenderer,
      timeAxisTextRenderer
    } = this;
    timeAxisBgRenderer.render();
    timeAxisTextRenderer.render();
    yAxisTextRenderer.render();
    timeAxisRenderer.render();
    yAxisRenderer.render();
    yAxisBgRenderer.render();
  }

  createUniformGetter(xOffset, zvalue, fixX) {
    return uniformName => {
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
          return 0;
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

  subscribeToEvents() {
    const { eventManager } = this;
    const x = GeneralConfig.NetworkElementLabelWidth;
    const width = this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
    eventManager.subscribeEvent(
      "timeline_header",
      x,
      this.yOffset,
      width,
      this.height,
      "mousepan",
      this.handleMousePan.bind(this)
    );

    eventManager.subscribeEvent(
      "timeline_header",
      x,
      this.yOffset,
      width,
      this.height,
      "shiftmousewheel",
      this.handleWheel.bind(this)
    );
  }
}
