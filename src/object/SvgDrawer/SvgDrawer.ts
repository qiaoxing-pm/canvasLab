import { lineStyle, Point } from "@/type/type";

// 点击事件回调类型
type ClickCb = (params: {
  type: "polygon" | "vertex" | null;
  polygonIndex: number;
  pointIndex: number;
}) => void;

// 完成绘制回调
type FinishDrawingCb = (points: { x: number; y: number }[]) => void;

class PolygonDrawerSVG {
  private svg: SVGElement;
  private points: Point[] = [];
  private targetPoints: Point[][] = [];
  private tempLine: SVGLineElement | null = null;
  private isDrawing: boolean = false;
  private finishDrawingCb?: FinishDrawingCb;
  private clickCb?: ClickCb;
  private svgNS = "http://www.w3.org/2000/svg";
  private instructions: SVGTextElement; // 保存提示文本元素引用

  constructor(
    container: HTMLElement,
    finishDrawingCb?: FinishDrawingCb,
    clickCb?: ClickCb
  ) {
    // 创建SVG元素
    this.svg = document.createElementNS(this.svgNS, "svg");
    this.svg.setAttribute("width", container.offsetWidth.toString());
    this.svg.setAttribute("height", container.offsetHeight.toString());
    this.svg.style.cursor = "crosshair";
    container.appendChild(this.svg);

    this.finishDrawingCb = finishDrawingCb;
    this.clickCb = clickCb;

    // 绑定事件
    this.svg.addEventListener("click", (e) => this.handleClick(e));
    this.svg.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.svg.addEventListener("contextmenu", (e) => e.preventDefault()); // 阻止右键菜单

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.isDrawing) {
        this.finishDrawing();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    this.instructions = this.addInstructions(); // 保存提示文本元素引用
  }

  // 添加操作提示并返回元素引用
  private addInstructions(): SVGTextElement {
    const text = document.createElementNS(this.svgNS, "text");
    text.setAttribute("x", "10");
    text.setAttribute("y", "20");
    text.setAttribute("fill", "#000");
    text.setAttribute("font-family", "Arial");
    text.setAttribute("font-size", "14");
    text.textContent = "点击画布开始绘制多边形顶点";
    text.id = "svg-instructions"; // 使用唯一ID
    this.svg.appendChild(text);
    return text; // 返回元素引用
  }

  // 更新操作提示
  private updateInstructions() {
    // 直接使用实例保存的元素引用，避免getElementById
    if (this.points.length === 0) {
      this.instructions.textContent = "点击画布开始绘制多边形顶点";
    } else {
      this.instructions.textContent = "按 ESC 结束绘制，右键撤销上一个顶点";
    }
  }

  private getSVGPoint(e: MouseEvent): Point {
    const rect = this.svg.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private handleClick(e: MouseEvent) {
    const isRight = e.button === 2;
    const point = this.getSVGPoint(e);

    if (isRight) {
      // 右键撤销
      if (this.isDrawing && this.points.length > 0) {
        this.points.pop();
        this.removeLastDrawingElement();
        this.updateTempLine();
        this.updateInstructions();
      }
      e.preventDefault();
      return;
    }

    // 未绘制状态下检测点击
    if (!this.isDrawing) {
      const hitResult = this.detectClick(point.x, point.y);
      this.clickCb?.(hitResult);
      if (hitResult.type) return;
      
      // 开始绘制
      this.isDrawing = true;
    }

    if (this.isDrawing) {
      // 添加新顶点
      this.points.push(point);
      this.drawVertex(point);
      
      // 绘制边
      if (this.points.length >= 2) {
        this.drawEdge(
          this.points[this.points.length - 2],
          this.points[this.points.length - 1]
        );
      }
      
      this.updateInstructions();
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDrawing || this.points.length === 0) return;

    const point = this.getSVGPoint(e);
    this.updateTempLine(point);
  }

  // 更新临时线条（当前鼠标位置到最后一个顶点）
  private updateTempLine(endPoint?: Point) {
    // 移除现有临时线
    if (this.tempLine) {
      this.svg.removeChild(this.tempLine);
      this.tempLine = null;
    }

    if (this.isDrawing && this.points.length > 0 && endPoint) {
      // 创建新的临时线
      this.tempLine = this.createLine(
        this.points[this.points.length - 1],
        endPoint,
        { color: "#333", width: 2, dashed: true }
      );
      this.svg.appendChild(this.tempLine);
    }
  }

  // 绘制顶点
  private drawVertex(point: Point) {
    const circle = document.createElementNS(this.svgNS, "circle");
    circle.setAttribute("cx", point.x.toString());
    circle.setAttribute("cy", point.y.toString());
    circle.setAttribute("r", "4");
    circle.setAttribute("fill", "#333");
    circle.setAttribute("class", "drawing-vertex");
    this.svg.appendChild(circle);
  }

  // 绘制边
  private drawEdge(start: Point, end: Point, style?: lineStyle & { dashed?: boolean }) {
    const line = this.createLine(start, end, style);
    line.setAttribute("class", "drawing-edge");
    this.svg.appendChild(line);
    return line;
  }

  // 创建线条元素
  private createLine(
    start: Point,
    end: Point,
    style?: lineStyle & { dashed?: boolean }
  ): SVGLineElement {
    const line = document.createElementNS(this.svgNS, "line");
    line.setAttribute("x1", start.x.toString());
    line.setAttribute("y1", start.y.toString());
    line.setAttribute("x2", end.x.toString());
    line.setAttribute("y2", end.y.toString());
    line.setAttribute("stroke", style?.color || "#333");
    line.setAttribute("stroke-width", (style?.width || 2).toString());
    
    if (style?.dashed) {
      line.setAttribute("stroke-dasharray", "5,5");
    }
    
    return line;
  }

  // 移除最后绘制的元素
  private removeLastDrawingElement() {
    // 移除最后一个顶点
    const vertices = this.svg.getElementsByClassName("drawing-vertex");
    if (vertices.length > 0) {
      this.svg.removeChild(vertices[vertices.length - 1]);
    }

    // 移除最后一条边
    const edges = this.svg.getElementsByClassName("drawing-edge");
    if (edges.length > 0) {
      this.svg.removeChild(edges[edges.length - 1]);
    }
  }

  // 完成绘制
  finishDrawing() {
    if (this.points.length >= 3) {
      // 闭合多边形
      this.drawEdge(this.points[this.points.length - 1], this.points[0]);
      
      // 保存多边形
      this.targetPoints.push([...this.points]);
      this.finishDrawingCb?.(this.points);
      
      // 标记为已完成的多边形
      const elements = [
        ...this.svg.getElementsByClassName("drawing-vertex"),
        ...this.svg.getElementsByClassName("drawing-edge")
      ];
      elements.forEach(el => {
        el.classList.remove("drawing-vertex", "drawing-edge");
        el.classList.add("completed-polygon");
      });
    } else {
      // 清除不完整的绘制
      const elements = [
        ...this.svg.getElementsByClassName("drawing-vertex"),
        ...this.svg.getElementsByClassName("drawing-edge")
      ];
      elements.forEach(el => this.svg.removeChild(el));
    }

    // 清除临时线
    if (this.tempLine) {
      this.svg.removeChild(this.tempLine);
      this.tempLine = null;
    }

    // 重置状态
    this.isDrawing = false;
    this.points = [];
    this.updateInstructions();
  }

  // 检测点击
  private detectClick(
    x: number,
    y: number
  ): {
    type: "polygon" | "vertex" | null;
    polygonIndex: number;
    pointIndex: number;
  } {
    // 检测顶点
    for (let i = 0; i < this.targetPoints.length; i++) {
      const polygon = this.targetPoints[i];
      for (let j = 0; j < polygon.length; j++) {
        const point = polygon[j];
        const distance = Math.hypot(x - point.x, y - point.y);
        if (distance < 6) {
          return { type: "vertex", polygonIndex: i, pointIndex: j };
        }
      }
    }

    // 检测多边形内部
    for (let i = 0; i < this.targetPoints.length; i++) {
      const polygon = this.targetPoints[i];
      if (polygon.length >= 3 && this.isPointInPolygon(x, y, polygon)) {
        return { type: "polygon", polygonIndex: i, pointIndex: -1 };
      }
    }

    return { type: null, polygonIndex: -1, pointIndex: -1 };
  }

  // 判断点是否在多边形内
  private isPointInPolygon(x: number, y: number, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      if (this.isPointOnLine({ x, y }, { x: xi, y: yi }, { x: xj, y: yj })) {
        return true;
      }

      const intersect = 
        ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // 判断点是否在线段上
  private isPointOnLine(p: Point, a: Point, b: Point): boolean {
    const cross = (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
    if (Math.abs(cross) > 2) return false;

    const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
    
    return p.x >= minX - 2 && p.x <= maxX + 2 && 
           p.y >= minY - 2 && p.y <= maxY + 2;
  }

  // 获取当前绘制的多边形顶点
  getPolygonPoints(): Point[] {
    return [...this.points];
  }

  // 清除所有绘制
  clearAll() {
    // 保留提示文字，清除其他所有元素
    while (this.svg.firstChild) {
      const child = this.svg.firstChild;
      if (child !== this.instructions) { // 保留提示文本
        this.svg.removeChild(child);
      } else {
        break; // 提示文本在最前面，找到后跳出循环
      }
    }
    
    this.points = [];
    this.targetPoints = [];
    this.tempLine = null;
    this.isDrawing = false;
    this.updateInstructions();
  }
}

export default PolygonDrawerSVG;