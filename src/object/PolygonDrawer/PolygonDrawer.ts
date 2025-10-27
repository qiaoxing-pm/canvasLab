import { lineStyle, Point } from "@/type/type";

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

  constructor(canvas: HTMLCanvasElement, finishDrawingCb?: FinishDrawingCb) {
    this.canvas = canvas;
    this.finishDrawingCb = finishDrawingCb;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    // 绑定事件处理
    this.canvas.addEventListener("mouseup", (e) => this.handleClick(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("click", (e) => {
      console.log(e.target);
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.isDrawing) {
        this.finishDrawing();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    this.render();
  }

  // 处理鼠标点击事件
  private handleClick(e: MouseEvent) {
    const isRight = e.button === 2;
    this.isDrawing = true;
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

  // 处理鼠标移动事件
  private handleMouseMove(e: MouseEvent) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    this.tempPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    this.render();
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

  // 获取当前绘制的多边形顶点
  getPolygonPoints(): { x: number; y: number }[] {
    return [...this.points];
  }
}

export default PolygonDrawer;
