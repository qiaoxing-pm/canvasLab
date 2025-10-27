enum command {
  // 上对齐
  ALIGN_TOP = "ALIGN_TOP",
  // 下对齐
  ALIGN_DOWN = "ALIGN_DOWN",
  // 左对齐
  ALIGN_LEFT = "ALIGN_LEFT",
  // 右对齐
  ALIGN_RIGHT = "ALIGN_RIGHT",
  // 新建窗口
  NEW_WINDOW = "NEW_WINDOW",
  // 保存
  SAVE = "SAVE",
  // 撤销
  UNDO = "UNDO",
  // 恢复
  REDO = "REDO",
  // 打开工程
  OPEN_PROJECT = "OPEN_PROJECT",
  // 新建工程
  NEW_PROJECT = "NEW_PROJECT",
  // 复原
  RESTORE = "RESTORE",
  // 垂直翻转
  FLIP_VERTICAL = "FLIP_VERTICAL",
  // 水平翻转
  FLIP_HORIZONTAL = "FLIP_HORIZONTAL",
  // 删除
  DELETE = "DELETE",
  // 缩小
  ZOOM_OUT = "ZOOM_OUT",
  // 放大
  ZOOM_IN = "ZOOM_IN",
  // 粘贴
  PASTE = "PASTE",
  // 替换
  REPLACE = "REPLACE",
  // 复制
  COPY = "COPY",
  // 剪切
  CUT = "CUT",
  // 锁定
  LOCK = "LOCK",
  // 取消锁定
  UNLOCK = "UNLOCK",
  // 取消组合
  UNGROUP = "UNGROUP",
  // 组合
  GROUP = "GROUP",
  // 水平居中
  ALIGN_CENTER_HORIZONTAL = "ALIGN_CENTER_HORIZONTAL",
  // 垂直居中
  ALIGN_CENTER_VERTICAL = "ALIGN_CENTER_VERTICAL",
  // 移动到最上层
  BRING_TO_FRONT = "BRING_TO_FRONT",
  // 移动到最下层
  SEND_TO_BACK = "SEND_TO_BACK",
  // 移动到下一层
  SEND_BACKWARD = "SEND_BACKWARD",
  // 移动到上一层
  BRING_FORWARD = "BRING_FORWARD",
  // 水平等间距
  DISTRIBUTE_HORIZONTALLY = "DISTRIBUTE_HORIZONTALLY",
  // 垂直等间距
  DISTRIBUTE_VERTICALLY = "DISTRIBUTE_VERTICALLY",
  // 高度相同
  MAKE_SAME_HEIGHT = "MAKE_SAME_HEIGHT",
  // 宽度相同
  MAKE_SAME_WIDTH = "MAKE_SAME_WIDTH",
}

export default command;
