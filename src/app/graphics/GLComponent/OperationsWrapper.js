import renderConfigGC from '../ObjectGroupGC/renderConfig';
import renderConfigPointGC from '../ObjectGroupGC/renderConfigPointTriangle';
import ObjectRenderer from '../lib/ObjectRenderer';
import { TextRenderer } from '../lib/TextRenderer';
import TextObject from '../ObjectGroupGC/textObjects';
import GeometryGC from '../ObjectGroupGC/objects';
import PointGeometryGC from '../ObjectGroupGC/pointObjects';
import { GeneralConfig } from './mainConfig';
import WorkGroupWrapper from './WorkGroupWrapper';
import PointGeometryType from '../../constants/PointGeometryType';
import Utils from '../AppUtils';

const validString = str => str && str !== '';

export default class OperationsWrapper extends WorkGroupWrapper {
  constructor(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager, ctxObjLabels) {
    super(gl, canvas2Dcontext, shaderPrograms, workGroup, eventManager);
    // Basic renderers
    this.tsObjectRenderer = new ObjectRenderer(
      gl,
      shaderPrograms,
      renderConfigGC,
    );
    this.tsPointObjectRenderer = new ObjectRenderer(
      gl,
      shaderPrograms,
      renderConfigPointGC,
    );
    this.objLabelsRenderer = new TextRenderer(ctxObjLabels);

    // Edit + Selection renderers
    this.editRenderer = new ObjectRenderer(gl, shaderPrograms, renderConfigGC);
    this.enableCellSelection = false;
    super.yOffset = GeneralConfig.CellHeight;

    this.lazyRendererList.push(this.objLabelsRenderer);
  }

  createBuffers() {
    super.createBuffers();
    const { objLabelsRenderer } = this;
    objLabelsRenderer.clearObjects();


    this.addObjectGeometries();
    this.setupTSRenderer();
    this.setupEditRenderer();

    objLabelsRenderer.setClearOffsets(GeneralConfig.NetworkElementLabelWidth, GeneralConfig.CellHeight);
    objLabelsRenderer.setMatrixGetter(() =>
      this.createTransformationMatrix(GeneralConfig.NetworkElementLabelWidth));
  }

  addObjectGeometries() {
    const {
      networkElementWrappers,
      tsObjectRenderer,
      tsPointObjectRenderer,
      objLabelsRenderer,
    } = this;
    let yPos = 0;
    const yStepSize = GeneralConfig.CellHeight;
    tsObjectRenderer.clearObjects();
    tsPointObjectRenderer.clearObjects();

    const clearBox = new TextObject.ClearBox(
      null,
      0,
      0,
      2 * this.canvas.width,
      2 * this.canvas.height,
    );
    objLabelsRenderer.addObjects([clearBox]);

    networkElementWrappers.forEach((networkElementWrapper) => {
      yPos += yStepSize;
      // this.addNetworkElement(yPos, yStepSize, networkElementWrapper);

      const { Objects } = networkElementWrapper;
      Objects.forEach((obj) => {
        this.addObjectGeometry(obj, yPos - yStepSize);
        this.addObjectLabels(obj, yPos - yStepSize);
      });
    });
    this.height = yPos;
  }

  addObjectGeometry(tsObjWrapper, yTop) {
    const {
      StartDate, EndDate, Color, Properties,
    } = tsObjWrapper;
    const { tsObjectRenderer, appTimeTransform } = this;
    const xLeft = appTimeTransform.timeToScreenX(StartDate);
    const xRight = appTimeTransform.timeToScreenX(EndDate);
    if (Number.isNaN(xLeft)) return;
    const tsObj = new GeometryGC.Rectangle2D(
      xLeft,
      yTop + GeneralConfig.CellTopPadding,
      xRight - xLeft,
      GeneralConfig.CellHeight - 2 * GeneralConfig.CellTopPadding,
    );
    tsObj.setColor(Color, 0.8);
    tsObjectRenderer.addObject(tsObj);

    const { LeftPointGeometry, RightPointGeometry } = Properties;
    this.addPointGeometry(
      LeftPointGeometry,
      xLeft,
      yTop + (0.5 * GeneralConfig.CellHeight),
      GeneralConfig.CellHeight - (2 * GeneralConfig.CellTopPadding),
    );
    this.addPointGeometry(
      RightPointGeometry,
      xRight,
      yTop + (0.5 * GeneralConfig.CellHeight),
      GeneralConfig.CellHeight - (2 * GeneralConfig.CellTopPadding),
    );
  }

  addPointGeometry(pointGeometry, x, y, h) {
    const { tsPointObjectRenderer } = this;
    if (pointGeometry === PointGeometryType.DIMOND) {
      const pointObj = new PointGeometryGC.FixedDimond2D(x, y, 5, h);
      pointObj.setColor(GeneralConfig.DARK_BLUE);
      tsPointObjectRenderer.addObject(pointObj);
    } else if (pointGeometry === PointGeometryType.BAR) {
      const pointObj = new PointGeometryGC.FixedRectangle2D(x, y, 3, h);
      pointObj.setColor(GeneralConfig.BLACK);
      tsPointObjectRenderer.addObject(pointObj);
    } else if (pointGeometry === PointGeometryType.THREE_DOTS) {
      const pointObj = new PointGeometryGC.FixedRectDots2D(x, y, 5, h);
      pointObj.setColor(GeneralConfig.DARK_YELLOW);
      tsPointObjectRenderer.addObject(pointObj);
    }
  }

  addObjectLabels(tsObjWrapper, yTop) {
    const { StartDate, EndDate, Properties } = tsObjWrapper;
    const { objLabelsRenderer, appTimeTransform } = this;
    const xLeft = appTimeTransform.timeToScreenX(StartDate);
    const xRight = appTimeTransform.timeToScreenX(EndDate);
    if (Number.isNaN(xLeft)) return;

    const refBox = {
      x: xLeft,
      y: yTop + GeneralConfig.CellTopPadding,
      w: xRight - xLeft,
      h: GeneralConfig.CellHeight - (2 * GeneralConfig.CellTopPadding),
    };
    const label = new TextObject.CenterLabelBox(
      { text: Properties.CenterLabel },
      refBox.x,
      refBox.y,
      refBox.w,
      refBox.h,
    );
    objLabelsRenderer.addObject(label);

    const { LabelBoxHeight } = GeneralConfig;
    const {
      LeftTag, RightTag, LeftBottomTag, RightBottomTag,
    } = Properties;

    if (validString(LeftTag)) {
      const leftTag = new TextObject.AssignmentLabel(
        { text: LeftTag },
        refBox.x,
        refBox.y - LabelBoxHeight,
        refBox.w,
        LabelBoxHeight,
        'left',
      );
      objLabelsRenderer.addObject(leftTag);
    }
    if (validString(RightTag)) {
      const rightTag = new TextObject.AssignmentLabel(
        { text: RightTag },
        refBox.x,
        refBox.y - LabelBoxHeight,
        refBox.w,
        LabelBoxHeight,
        'right',
      );
      rightTag.moveUpOnCollide = Boolean(validString(LeftTag));
      objLabelsRenderer.addObject(rightTag);
    }
    if (validString(LeftBottomTag)) {
      const leftBottomTag = new TextObject.AssignmentLabel(
        { text: LeftBottomTag },
        refBox.x,
        refBox.y + refBox.h,
        refBox.w,
        LabelBoxHeight,
        'left',
      );
      objLabelsRenderer.addObject(leftBottomTag);
    }
    if (validString(RightBottomTag)) {
      const rightBottomTag = new TextObject.AssignmentLabel(
        { text: RightBottomTag },
        refBox.x,
        refBox.y + refBox.h,
        refBox.w,
        LabelBoxHeight,
        'right',
      );
      rightBottomTag.moveDownOnCollide = Boolean(validString(LeftBottomTag));
      objLabelsRenderer.addObject(rightBottomTag);
    }
  }

  setupTSRenderer() {
    const { tsObjectRenderer, tsPointObjectRenderer } = this;
    tsObjectRenderer.createBuffers();
    tsPointObjectRenderer.createBuffers();
    tsObjectRenderer.setUniformGetter(this.createUniformGetter(
      GeneralConfig.NetworkElementLabelWidth,
      GeneralConfig.WGWrapperShutObjDepth,
    ));
    tsPointObjectRenderer.setUniformGetter(this.createUniformGetter(
      GeneralConfig.NetworkElementLabelWidth,
      GeneralConfig.WGWrapperPointObjDepth,
    ));
  }

  setupEditRenderer() {
    const { editRenderer } = this;
    editRenderer.createBuffers();
    editRenderer.setUniformGetter(this.createUniformGetter(
      GeneralConfig.NetworkElementLabelWidth,
      GeneralConfig.WGWrapperShutObjDepth,
    ));
  }

  render() {
    if (!this.visible) return;
    super.render();
    const {
      tsObjectRenderer, tsPointObjectRenderer, editRenderer, objLabelsRenderer,
    } = this;

    tsObjectRenderer.render();
    tsPointObjectRenderer.render();
    editRenderer.render();
    // objLabelsRenderer.render();
  }

  findOperation = (timeX, networkElementWrapper) => {
    if (networkElementWrapper && networkElementWrapper.Operations) {
      const selectedOperations = networkElementWrapper.Operations.filter((tsObj) => {
        const { StartDate, EndDate } = tsObj;
        return timeX >= StartDate && timeX <= EndDate;
      });
      if (selectedOperations.length > 0) {
        const { StartDate, EndDate } = selectedOperations[0];
        const errorInTime = 2 * 60 * 1000;
        const selectionObj = {
          originalOperation: selectedOperations[0],
          originalStartDate: new Date(StartDate),
          originalEndDate: new Date(EndDate),
        };
        if (Utils.compareDates(StartDate, timeX, errorInTime)) {
          return { ...selectionObj, edge: 'left' };
        } else if (Utils.compareDates(EndDate, timeX, errorInTime)) {
          return { ...selectionObj, edge: 'right' };
        }
        return selectionObj;
      }
    }
    return null;
  };

  handleMousePan(dx, dy) {
    const { appTimeTransform } = this;
    // console.log(dx, dy);
    if (dx > 0 || dx < 0) {
      const viewportWidth =
        this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
      appTimeTransform.applyPan(dx, viewportWidth);
      appTimeTransform.quickCacheState('OpGantt');
    }
  }

  handleWheel(x, y, delta) {}

  handleDragStart(x, y) {
    const { appTimeTransform } = this;
    const timeX = appTimeTransform.screenXToTime(x);
    const selectedNetworkElement = this.findNetworkElementWrapper(y);
    const selectedObj = this.findOperation(timeX, selectedNetworkElement);
    if (selectedObj) {
      return {
        startX: x,
        ...selectedObj,
      };
    }
    return null;
  }

  handleDrag = (x, y, dragObject) => {
    const { appTimeTransform } = this;
    if (dragObject) {
      const {
        startX,
        originalOperation,
        originalStartDate,
        originalEndDate,
        edge,
      } = dragObject;
      const timeX = appTimeTransform.screenXToTime(x);
      const startTimeX = appTimeTransform.screenXToTime(startX);
      const timeDisplacementInSec = (timeX - startTimeX) / 1000;
      // console.log(timeDisplacementInSec);
      // Check if have to update start/end times
      let updateStartDate = (edge && edge === 'left') || !edge;
      let updateEndDate = (edge && edge === 'right') || !edge;
      const newStartDate = new Date(originalStartDate);
      const newEndDate = new Date(originalEndDate);
      if (updateStartDate) {
        newStartDate.setSeconds(newStartDate.getSeconds() + timeDisplacementInSec);
        updateStartDate =
          newStartDate < originalOperation.EndDate &&
          newStartDate > appTimeTransform.tStart0;
        // console.log(`S: ${  updateStartDate}`);
      }
      if (updateEndDate) {
        newEndDate.setSeconds(newEndDate.getSeconds() + timeDisplacementInSec);
        updateEndDate =
          newEndDate > originalOperation.StartDate &&
          newEndDate < appTimeTransform.tEnd0;
        // console.log(`E: ${  updateEndDate}`);
      }

      if (!edge && updateStartDate && updateEndDate) {
        originalOperation.StartDate = newStartDate;
        originalOperation.EndDate = newEndDate;
      } else if (edge && edge === 'left' && updateStartDate) {
        originalOperation.StartDate = newStartDate;
      } else if (edge && edge === 'right' && updateEndDate) {
        originalOperation.EndDate = newEndDate;
      }
      // Update scene
      this.addObjectGeometries();
      this.setupTSRenderer();
      this.renderAll();
    }
  };

  handleDrop = (x, y, dragObject) => {
    if (dragObject) {
      const {
        startX,
        originalOperation,
        originalStartDate,
        originalEndDate,
        edge,
      } = dragObject;

      const newData = Utils.clone(originalOperation.data);
      newData.StartTime = originalOperation.StartDate.toTimeString().substr(
        0,
        8,
      );
      newData.EndTime = originalOperation.EndDate.toTimeString().substr(0, 8);
      newData.Duration =
        (originalOperation.EndDate - originalOperation.StartDate) /
        (60 * 60 * 1000);

      if (this.handlerList.onSaveUpdate) {
        this.handlerList.onSaveUpdate({
          action: 'save',
          workOperation: newData,
        });
      }
    }
  };

  handleShiftHover = (x, y, elemStyle) => {
    const { appTimeTransform } = this;
    const timeX = appTimeTransform.screenXToTime(x);
    const selectedNetworkElement = this.findNetworkElementWrapper(y);
    const selectedObj = this.findOperation(timeX, selectedNetworkElement);
    if (selectedObj) {
      const { edge } = selectedObj;
      if (elemStyle) {
        elemStyle.cursor = edge ? 'w-resize' : 'move';
      }
    } else {
      elemStyle.cursor = 'default';
    }
  };

  handleHover = (x, y, elemStyle) => {

    super.handleHover(x, y);
    if (elemStyle) {
      elemStyle.cursor = 'default';
    }
  };

  subscribeToEvents() {
    super.subscribeToEvents();

    const { eventManager } = this;
    const x = GeneralConfig.NetworkElementLabelWidth;
    const width = this.canvas.width - GeneralConfig.NetworkElementLabelWidth;
    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'shiftdragstart',
      this.handleDragStart.bind(this),
    );
    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'shiftmousedrag',
      this.handleDrag.bind(this),
    );
    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'shiftmousedrop',
      this.handleDrop.bind(this),
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'shifthover',
      this.handleShiftHover.bind(this),
    );

    eventManager.subscribeEvent(
      this.data.Id,
      x,
      this.yOffset,
      width,
      this.height,
      'mousehover',
      this.handleHover.bind(this),
    );
  }
}
