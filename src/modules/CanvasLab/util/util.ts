import { PolygonDrawer, PolygonDrawerClick, SvgDrawer } from "@/object";
import type { Rect, PointType, rpsVar, MaskRectangle } from "@/type/type";
import { parseInt2, deepClone } from "@/util";
import {
  CellState,
  type CellStyle,
  Graph,
  InternalEvent,
  Cell,
  Point,
  EventObject,
  SwimlaneManager,
  StackLayout,
  LayoutManager,
  VertexParameters,
  EdgeParameters,
} from "@maxgraph/core";

const createGraph = (domRef: HTMLElement) => {
  const container = domRef;
  const graph = new Graph(container);
  // InternalEvent.disableContextMenu(container);
  graph.setEnabled(true);
  const parent = graph.getDefaultParent();
  const vertexStyle: CellStyle = {
    shape: "cylinder",
    strokeWidth: 2,
    fillColor: "#ffffff",
    strokeColor: "black",
    gradientColor: "#a0a0a0",
    fontColor: "black",
    fontStyle: 1,
    spacingTop: 14,
  };

  let e1;
  graph.batchUpdate(() => {
    const v1 = graph.insertVertex({
      parent,
      value: "Pump",
      position: [20, 20],
      size: [60, 60],
      style: vertexStyle,
    });

    const v2 = graph.insertVertex({
      parent,
      value: "Tank",
      position: [200, 150],
      size: [60, 60],
      style: vertexStyle,
    });

    e1 = graph.insertEdge({
      parent,
      source: v1,
      target: v2,
      style: {
        strokeWidth: 3,
        endArrow: "block",
        endSize: 2,
        endFill: true,
        strokeColor: "black",
        rounded: true,
      },
    });
    e1.geometry && (e1.geometry.points = [new Point(230, 50)]);
    graph.orderCells(true, [e1]);
  });

  const state = graph.view.getState(e1!);

  if (state) {
    cellAnimation(state);
  }

  return graph;
};

const cellAnimation = (state: CellState) => {
  state?.shape?.node
    .getElementsByTagName("path")[0]
    .removeAttribute("visibility");
  state?.shape?.node
    .getElementsByTagName("path")[0]
    .setAttribute("stroke-width", "6");
  state?.shape?.node
    .getElementsByTagName("path")[0]
    .setAttribute("stroke", "lightGray");
  state?.shape?.node
    .getElementsByTagName("path")[1]
    .setAttribute("class", "flow pulse");
};

const Drop = (domRef: HTMLElement) => {
  const container = domRef;
  container.style.background = "";
  InternalEvent.disableContextMenu(container);
  const graph = new Graph(container);
  const model = graph.getDataModel();
  graph.setResizeContainer(true);

  let style = graph.getStylesheet().getDefaultVertexStyle();
  style.shape = "swimlane";
  style.verticalAlign = "middle";
  style.fontSize = 11;
  style.startSize = 22;
  style.horizontal = false;
  style.fontColor = "#f5222d";
  style.strokeColor = "#fa8c16";
  delete style.fillColor;
  style.foldable = true;
  style = deepClone(style);
  style.shape = "rectangle";
  style.fontSize = 10;
  style.rounded = true;
  style.horizontal = true;
  style.verticalAlign = "middle";
  delete style.startSize;
  style.labelBackgroundColor = "none";
  style.fontColor = "#f5dc22ff";

  graph.getStylesheet().putCellStyle("process", style);
  style = deepClone(style);
  style.shape = "ellipse";
  delete style.rounded;
  style.fontColor = "#2293f5ff";

  graph.getStylesheet().putCellStyle("state", style);
  style = deepClone(style);
  style.shape = "rhombus";
  style.verticalAlign = "top";
  style.spacingTop = 40;
  style.spacingRight = 64;
  style.fontColor = "#2511d9ff";

  graph.getStylesheet().putCellStyle("condition", style);
  style = deepClone(style);
  style.shape = "doubleEllipse";
  style.spacingTop = 28;
  style.fontSize = 14;
  style.fontStyle = 1;
  delete style.spacingRight;
  style.fontColor = "#d911b4ff";

  graph.getStylesheet().putCellStyle("end", style);
  style = graph.getStylesheet().getDefaultEdgeStyle();
  style.edgeStyle = "elbowEdgeStyle";
  style.endArrow = "block";
  style.rounded = true;
  style.fontColor = "#389e0d";
  style.strokeColor = "#08979c";
  style = deepClone(style);
  style.dashed = true;
  style.endArrow = "open";
  style.startArrow = "oval";
  graph.getStylesheet().putCellStyle("crossover", style);
  style.fontColor = "#22f5c0ff";
  graph.getStylesheet().putCellStyle("image", style);
  console.log(graph.getStylesheet());
  graph.alternateEdgeStyle = {
    elbow: "vertical",
  };

  if (graph.isEnabled()) {
    graph.setConnectable(true);
    graph.setAllowDanglingEdges(false);
    const previousIsValidSource = graph.isValidSource;
    graph.isValidSource = function (cell) {
      if (previousIsValidSource.apply(this, [cell]) && cell) {
        const style = cell.getStyle();
        return style == null || !style.baseStyleNames?.includes("end");
      }
      return false;
    };

    graph.isValidTarget = function (cell) {
      if (!cell) return false;
      const style = cell.getStyle();
      return (
        !cell.isEdge() &&
        !this.isSwimlane(cell) &&
        (style == null || !!style.baseStyleNames?.includes("state"))
      );
    };

    graph.setDropEnabled(true);
    graph.setSplitEnabled(false);
    graph.isValidDropTarget = function (this: any, target, cells, evt) {
      if (this.isSplitEnabled() && this.isSplitTarget(target, cells, evt)) {
        return true;
      }
      let lane = false;
      let pool = false;
      let cell = false;

      cells ??= [];
      for (let i = 0; i < cells.length; i++) {
        const tmp = cells[i].getParent();
        lane = lane || this.isPool(tmp);
        pool = pool || this.isPool(cells[i]);
        cell = cell || !(lane || pool);
      }
      return (
        !pool &&
        cell != lane &&
        ((lane && this.isPool(target)) ||
          (cell && this.isPool(target.getParent())))
      );
    };

    (graph as any).isPool = function (cell: Cell | null) {
      const model = this.getDataModel();
      const parent = cell?.getParent();
      return parent?.getParent() == model.getRoot();
    };

    const foldingHandler = function (_sender: any, evt: EventObject) {
      const cells = evt.getProperty("cells");
      for (let i = 0; i < cells.length; i++) {
        const geo = cells[i].getGeometry();
        if (geo.alternateBounds != null) {
          geo.width = geo.alternateBounds.width;
        }
      }
    };
    graph.addListener(InternalEvent.FOLD_CELLS, foldingHandler);
  }

  const getStyle = function (this: Cell) {
    if (!this.isCollapsed()) {
      return this.style;
    }

    const style = {
      ...this.style,
    };
    style.horizontal = true;
    style.align = "left";
    style.spacingLeft = 14;
    return style;
  };

  new SwimlaneManager(graph);

  const layout = new StackLayout(graph, false);

  layout.resizeParent = true;

  layout.fill = true;

  layout.isVertexIgnored = function (vertex) {
    return !graph.isSwimlane(vertex);
  };

  const layoutMgr = new LayoutManager(graph);
  layoutMgr.getLayout = function (cell) {
    if (
      cell &&
      !cell.isEdge() &&
      cell.getChildCount() > 0 &&
      (cell.getParent() == model.getRoot() || (graph as any).isPool(cell))
    ) {
      layout.fill = (graph as any).isPool(cell);
      return layout;
    }
    return null;
  };

  const parent = graph.getDefaultParent();

  const insertVertex = (options: VertexParameters) => {
    const v = graph.insertVertex(options);
    v.getStyle = getStyle;
    return v;
  };
  const insertEdge = (options: EdgeParameters) => {
    const e = graph.insertEdge(options);
    e.getStyle = getStyle;
    return e;
  };

  graph.batchUpdate(() => {
    const pool1 = insertVertex({
      parent,
      value: "Pool 1",
      position: [0, 0],
      size: [640, 110],
    });
    pool1.setConnectable(false);
    const lane1a = insertVertex({
      parent: pool1,
      value: "Lane A",
      position: [0, 0],
      size: [640, 110],
    });
    lane1a.setConnectable(false);
    const lane1b = insertVertex({
      parent: pool1,
      value: "Lane B",
      position: [0, 0],
      size: [640, 110],
    });
    lane1b.setConnectable(false);
    const pool2 = insertVertex({
      parent,
      value: "Pool 2",
      position: [0, 0],
      size: [640, 0],
    });
    pool2.setConnectable(false);
    const lane2a = insertVertex({
      parent: pool2,
      value: "Lane A",
      position: [0, 0],
      size: [640, 140],
    });
    lane2a.setConnectable(false);
    const lane2b = insertVertex({
      parent: pool2,
      value: "Lane B",
      position: [0, 0],
      size: [640, 110],
    });
    lane2b.setConnectable(false);
    const start1 = insertVertex({
      parent: lane1a,
      position: [40, 40],
      size: [30, 30],
      style: {
        baseStyleNames: ["state"],
      },
    });
    const end1 = insertVertex({
      parent: lane1a,
      value: "A",
      position: [560, 40],
      size: [30, 30],
      style: {
        baseStyleNames: ["end"],
      },
    });
    const step1 = insertVertex({
      parent: lane1a,
      value: "Contact\nProvider",
      position: [90, 30],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const step11 = insertVertex({
      parent: lane1a,
      value: "Complete\nAppropriate\nRequest",
      position: [190, 30],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const step111 = insertVertex({
      parent: lane1a,
      value: "Receive and\nAcknowledge",
      position: [385, 30],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const start2 = insertVertex({
      parent: lane2b,
      position: [40, 40],
      size: [30, 30],
      style: {
        baseStyleNames: ["state"],
      },
    });
    const step2 = insertVertex({
      parent: lane2b,
      value: "Receive\nRequest",
      position: [90, 30],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const step22 = insertVertex({
      parent: lane2b,
      value: "Refer to Tap\nSystems\nCoordinator",
      position: [190, 30],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const step3 = insertVertex({
      parent: lane1b,
      value: "Request 1st-\nGate\nInformation",
      position: [190, 30],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const step33 = insertVertex({
      parent: lane1b,
      value: "Receive 1st-\nGate\nInformation",
      position: [290, 30],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const step4 = insertVertex({
      parent: lane2a,
      value: "Receive and\nAcknowledge",
      position: [290, 20],
      size: [80, 50],
      style: {
        baseStyleNames: ["process"],
      },
    });
    const step44 = insertVertex({
      parent: lane2a,
      value: "Contract\nConstraints?",
      position: [400, 20],
      size: [50, 50],
      style: {
        baseStyleNames: ["condition"],
      },
    });
    const step444 = insertVertex({
      parent: lane2a,
      value: "Tap for gas\ndelivery?",
      position: [480, 20],
      size: [50, 50],
      style: {
        baseStyleNames: ["condition"],
      },
    });
    const end2 = insertVertex({
      parent: lane2a,
      value: "B",
      position: [560, 30],
      size: [30, 30],
      style: {
        baseStyleNames: ["end"],
      },
    });
    const end3 = insertVertex({
      parent: lane2a,
      value: "C",
      position: [560, 84],
      size: [30, 30],
      style: {
        baseStyleNames: ["end"],
      },
    });
    insertEdge({
      parent: lane1a,
      source: start1,
      target: step1,
    });
    insertEdge({
      parent: lane1a,
      source: step1,
      target: step11,
    });
    insertEdge({
      parent: lane1a,
      source: step11,
      target: step111,
    });
    insertEdge({
      parent: lane2b,
      source: start2,
      target: step2,
    });
    insertEdge({
      parent: lane2b,
      source: step2,
      target: step22,
    });
    insertEdge({
      parent,
      source: step22,
      target: step3,
    });
    insertEdge({
      parent: lane1b,
      source: step3,
      target: step33,
    });
    insertEdge({
      parent: lane2a,
      source: step4,
      target: step44,
    });
    insertEdge({
      parent: lane2a,
      value: "No",
      source: step44,
      target: step444,
      style: {
        verticalAlign: "bottom",
      },
    });
    insertEdge({
      parent,
      value: "Yes",
      source: step44,
      target: step111,
      style: {
        verticalAlign: "bottom",
        horizontal: false,
      },
    });
    insertEdge({
      parent: lane2a,
      value: "Yes",
      source: step444,
      target: end2,
      style: {
        verticalAlign: "bottom",
      },
    });
    let e = insertEdge({
      parent: lane2a,
      value: "No",
      source: step444,
      target: end3,
      style: {
        verticalAlign: "top",
      },
    });
    e.geometry!.points = [
      new Point(
        step444.geometry!.x + step444.geometry!.width / 2,
        end3.geometry!.y + end3.geometry!.height / 2
      ),
    ];
    insertEdge({
      parent,
      source: step1,
      target: step2,
      style: {
        baseStyleNames: ["crossover"],
      },
    });
    insertEdge({
      parent,
      source: step3,
      target: step11,
      style: {
        baseStyleNames: ["crossover"],
      },
    });
    e = insertEdge({
      parent: lane1a,
      source: step11,
      target: step33,
      style: {
        baseStyleNames: ["crossover"],
      },
    });
    e.geometry!.points = [
      new Point(
        step33.geometry!.x + step33.geometry!.width / 2 + 20,
        step11.geometry!.y + (step11.geometry!.height * 4) / 5
      ),
    ];
    insertEdge({
      parent,
      source: step33,
      target: step4,
    });
    insertEdge({
      parent: lane1a,
      source: step111,
      target: end1,
    });
  });
  return graph;
};

export const getMinimumBoundingRect = (polygon: Array<PointType>): Rect => {
  if (polygon.length < 3) {
  }

  const minX = Math.min(...polygon.map((p) => p.x));
  const maxX = Math.max(...polygon.map((p) => p.x));
  const minY = Math.min(...polygon.map((p) => p.y));
  const maxY = Math.max(...polygon.map((p) => p.y));
  const width = maxX - minX;
  const height = maxY - minY;
  const points = polygon.map((p) => {
    return {
      x: parseInt2((p.x - minX) / width, 2),
      y: parseInt2((p.y - minY) / height, 2),
    };
  });

  return {
    x: parseInt2(minX),
    y: parseInt2(minY),
    width: parseInt2(width),
    height: parseInt2(height),
    points,
  };
};

export const useCanvas = (
  node: HTMLCanvasElement,
  drawer: rpsVar,
  release: Function,
  graph: Graph
) => {
  // drawer.value = new SvgDrawer(
  //   node,
  //   (points) => console.log("完成绘制", points),
  //   (hit) => console.log("点击", hit)
  // );
  drawer.value = new PolygonDrawerClick(
    node,
    (points: Array<PointType>) => {
      if (points.length < 3) {
        return;
      }
      const rect = getMinimumBoundingRect(points);
      // release?.(graph, rect);
    },
    (hit) => {
      // 点击事件回调
      if (hit.type === "vertex") {
        console.log(
          `点击了第 ${hit.polygonIndex} 个多边形的第 ${hit.pointIndex} 个顶点`
        );
      } else if (hit.type === "polygon") {
        console.log(`点击了第 ${hit.polygonIndex} 个多边形内部`);
      }
    }
  );
  return drawer;
};

export const release = (graph: Graph, rect: MaskRectangle) => {
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }

  graph.insertVertex(
    graph.getDefaultParent(),
    null,
    null,
    rect.x,
    rect.y,
    rect.width,
    rect.height
  );
};

export { createGraph, cellAnimation, Drop };
