export const parseInt2 = (a: number, p = 0) => {
  return Number(a.toFixed(p));
};
export const deepClone = <T>(data: T): T => {
  // 用于存储已拷贝的对象，解决循环引用问题
  const visited = new Map();

  // 创建一个处理函数，使用循环代替递归
  const clone = (source: any): any => {
    // 非对象类型直接返回
    if (typeof source !== "object" || source === null) {
      return source;
    }

    // 如果已经拷贝过，直接返回缓存的结果（处理循环引用）
    if (visited.has(source)) {
      return visited.get(source);
    }

    let result: any;

    // 处理数组
    if (source instanceof Array) {
      result = [];
      visited.set(source, result); // 先缓存空数组，处理循环引用

      // 使用循环遍历数组元素
      for (let i = 0; i < source.length; i++) {
        result.push(clone(source[i]));
      }
    }
    // 处理对象
    else {
      result = {};
      visited.set(source, result); // 先缓存空对象，处理循环引用

      // 使用循环遍历对象属性
      const keys = Object.keys(source);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result[key] = clone(source[key]);
      }
    }

    return result;
  };

  return clone(data) as T;
};
