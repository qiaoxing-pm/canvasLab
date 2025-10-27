import { lineStyle, Point } from "@/type/type";
// 新增：点击事件回调类型（返回命中的多边形索引和点）
type ClickCb = (params: {
  type: "polygon" | "vertex" | null; // 点击类型：多边形/顶点/无
  polygonIndex: number; // 命中的多边形索引
  pointIndex: number; // 命中的顶点索引（仅 vertex 类型有效）
}) => void;
// 多边形绘制类
type FinishDrawingCb = (points: { x: number; y: number }[]) => void;
class PolygonDrawer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private points: Array<Point> = [];
  private targetPoints: Array<Array<Point>> = [];
  private tempPoint: { x: number; y: number } | null = null;
  private isDrawing: boolean = false;
  private finishDrawingCb?: FinishDrawingCb;
  private clickCb?: ClickCb; // 新增：点击事件回调

  constructor(
    canvas: HTMLCanvasElement,
    finishDrawingCb?: FinishDrawingCb,
    clickCb?: ClickCb
  ) {
    this.canvas = canvas;
    this.finishDrawingCb = finishDrawingCb;
    this.clickCb = clickCb; // 绑定点击回调
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    // 绑定事件处理
    this.canvas.addEventListener("mouseup", (e) => this.handleClick(e));
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.isDrawing) {
        this.finishDrawing();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    this.render();
  }

  private handleMouseDown(e: MouseEvent) {
    const isRight = e.button === 2;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 1. 若未在绘制中，检测是否点击了已有多边形或顶点
    if (!this.isDrawing && !isRight) {
      const hitResult = this.detectClick(clickX, clickY);
      this.clickCb?.(hitResult); // 触发点击回调
      if (hitResult.pointIndex >= 0 || hitResult.polygonIndex >= 0) {
        return; // 非绘制状态下不执行绘制逻辑
      } else {
        this.isDrawing = true;
      }
    }
  }

  // 处理鼠标点击事件
  // 处理鼠标点击事件（核心修改）
  private handleClick(e: MouseEvent) {
    if (this.isDrawing) {
      const isRight = e.button === 2;

      if (isRight) {
        this.points.pop();
        e.preventDefault();
      } else {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.points.push({ x, y });
      }
      this.render(); // 替换为叠加渲染
    }
  }

  // 新增：检测点击位置是否命中多边形或顶点
  private detectClick(
    x: number,
    y: number
  ): {
    type: "polygon" | "vertex" | null;
    polygonIndex: number;
    pointIndex: number;
  } {
    // 先检测是否点击顶点（顶点优先级高于多边形内部）
    for (let i = 0; i < this.targetPoints.length; i++) {
      const polygon = this.targetPoints[i];
      for (let j = 0; j < polygon.length; j++) {
        const point = polygon[j];
        // 计算点击位置与顶点的距离（小于 6px 视为命中顶点）
        const distance = Math.hypot(x - point.x, y - point.y);
        if (distance < 6) {
          this.drawArc(this.targetPoints[i]);
          return { type: "vertex", polygonIndex: i, pointIndex: j };
        }
      }
    }

    // 再检测是否点击多边形内部
    for (let i = 0; i < this.targetPoints.length; i++) {
      const polygon = this.targetPoints[i];
      if (polygon.length >= 3 && this.isPointInPolygon(x, y, polygon)) {
        this.drawArc(this.targetPoints[i]);
        return { type: "polygon", polygonIndex: i, pointIndex: -1 };
      }
    }

    // 未命中任何目标
    return { type: null, polygonIndex: -1, pointIndex: -1 };
  }

  // 新增：判断点是否在多边形内部（射线法）
  private isPointInPolygon(x: number, y: number, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      // 检测点是否在多边形边上（可选）
      const onEdge = this.isPointOnLine(
        { x, y },
        { x: xi, y: yi },
        { x: xj, y: yj }
      );
      if (onEdge) return true;

      // 射线法核心逻辑
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // 新增：判断点是否在直线段上（辅助方法）
  private isPointOnLine(p: Point, a: Point, b: Point): boolean {
    // 点 p 到线段 ab 的距离小于 2px，且在 ab 范围内
    const cross = (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
    if (Math.abs(cross) > 2) return false; // 距离阈值

    const minX = Math.min(a.x, b.x),
      maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y),
      maxY = Math.max(a.y, b.y);
    return (
      p.x >= minX - 2 && p.x <= maxX + 2 && p.y >= minY - 2 && p.y <= maxY + 2
    );
  }

  // 处理鼠标移动事件
  private handleMouseMove(e: MouseEvent) {
    requestAnimationFrame(() => {
      if (!this.isDrawing) return;

      const rect = this.canvas.getBoundingClientRect();
      this.tempPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      this.render();
    });
  }

  // 完成绘制（双击结束）
  finishDrawing() {
    if (this.points.length >= 2) {
      this.finishDrawingCb?.(this.points);
      this.targetPoints.push([...this.points]);
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.isDrawing = false;
    this.tempPoint = null;
    this.drawOldLine();
    this.ctx.closePath();
    this.points = [];
  }

  // 渲染画布
  private render() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawOldLine();

    // 绘制已有顶点
    this.points.forEach((point) => {
      this.ctx.fillStyle = "#333";
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 绘制已确定的边
    if (this.points.length >= 2) {
      this.ctx.strokeStyle = "#333";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[0].x, this.points[0].y);

      this.points.forEach((point) => {
        this.ctx.lineTo(point.x, point.y);
      });

      this.ctx.stroke();
    }
    if (this.points.length >= 1 && this.tempPoint) {
      this.drawLine(this.points[this.points.length - 1], this.tempPoint);
    }

    // 绘制提示
    this.ctx.fillStyle = "#ffffffff";
    this.ctx.font = "14px Arial";
    if (this.points.length === 0) {
      this.ctx.fillText("点击画布开始绘制多边形顶点", 10, 20);
    } else {
      this.ctx.fillText("按 ESC 结束绘制，右键撤销上一个顶点", 10, 20);
    }
  }

  private drawLine(
    startPoint: Point,
    endPoint: Point,
    lineType: lineStyle | null = null
  ) {
    this.ctx.strokeStyle = lineType?.color ?? "#ffffff";
    this.ctx.lineWidth = lineType?.width ?? 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(startPoint.x, startPoint.y);
    this.ctx.lineTo(endPoint.x, endPoint.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  private drawOldLine() {
    this.ctx.strokeStyle = "#333";
    this.ctx.lineWidth = 2;
    for (let i = 0; i < this.targetPoints.length; i++) {
      const element = this.targetPoints[i];
      if (element.length >= 2) {
        this.ctx.beginPath();
        this.ctx.moveTo(element[0].x, element[0].y);
        for (let j = 1; j < element.length; j++) {
          const elementJ = element[j];
          this.ctx.lineTo(elementJ.x, elementJ.y);
        }
        this.ctx.stroke();
      }
    }
  }

  private drawArc(points: Array<Point>) {
    this.ctx.fillStyle = "#333";
    for (let i = 0; i < points.length; i++) {
      const element = points[i];
      this.ctx.beginPath();
      this.ctx.arc(element.x, element.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 获取当前绘制的多边形顶点
  getPolygonPoints(): { x: number; y: number }[] {
    return [...this.points];
  }
}

export default PolygonDrawer;
