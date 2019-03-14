import GeometryGC from "../ObjectGroupGC/objects";
import TextObject from "../ObjectGroupGC/textObjects";
import { GeneralConfig } from "./mainConfig";
import Utils from "../AppUtils";
import TimelineHeader from "./TimelineHeader";

export default class OpTimelineHeader extends TimelineHeader {
  createBuffers() {
    this.height = GeneralConfig.CellHeight;
    super.createBuffers();
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
      const t = appTimeTransform.timeToScreenX(timeLabel.datetime);

      const label = new TextObject.CenterLabelBox(
        timeLabel,
        t,
        y0,
        GeneralConfig.CellWidth,
        y3 - y0
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
    const dayLabel = new TextObject.CenterLabelBox(
      { text: "Time" },
      0,
      y0,
      yLabelWidth,
      y3 - y0
    );
    yAxisTextRenderer.addObjects([clearBox, dayLabel]);

    // Vertical lines
    const vertLine2D = new GeometryGC.LineSegment2D(
      [yLabelWidth, 0],
      [yLabelWidth, this.height]
    );
    vertLine2D.setColor(GeneralConfig.MainThemeColor_beta);

    // Horizontal lines
    const dayLine2D = new GeometryGC.LineSegment2D(
      [0, y3],
      [this.canvas.width, y3]
    );
    dayLine2D.setColor(GeneralConfig.MainThemeColor_beta);
    yAxisRenderer.addObjects([dayLine2D, vertLine2D]);

    // Create buffers and uniform getter
    yAxisRenderer.createBuffers();
    yAxisRenderer.setUniformGetter(
      this.createUniformGetter(0, GeneralConfig.THeaderYAxisDepth, true)
    );
  }

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
}
