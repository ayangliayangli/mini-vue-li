// 全局当前的副作用
let currentEffect;

export class Dep {
  constructor(value) {
    this._val = value;
    this.effects = new Set();
  }

  get value() {
    console.log('get');
    // get 触发依赖收集, 手机属性和副作用的对应关系
    this.depend();
    return this._val;
  }

  set value(val) {
    console.log('set');
    this._val = val;
    // set 触发执行副作用
    this.notice();
  }

  depend() {
    if (currentEffect) {
      console.log('收集依赖');
      this.effects.add(currentEffect);
    }
  }

  notice() {
    console.log('触发依赖');
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

export function watchEffect(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}

// {target: { key: [effect1, effect2] }}
const targetEffectMap = new Map();
function getTargetKeyEffects(target, key) {
  let keyEffectMap = targetEffectMap.get(target);
  if (!keyEffectMap) {
    keyEffectMap = new Map();
    targetEffectMap.set(target, keyEffectMap);
  }

  let keyEffects = keyEffectMap.get(key);
  if (!keyEffects) {
    keyEffects = new Set();
    keyEffectMap.set(key, keyEffects);
  }

  return keyEffects;
}

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const effects = getTargetKeyEffects(target, key);
      //  收集一个副作用
      if (currentEffect) {
          effects.add(currentEffect);
      }
      return Reflect.get(target, key);
    },
    set(target, key, val) {
      Reflect.set(target, key, val);
      const effects = getTargetKeyEffects(target, key);
      //   执行副作用
      effects.forEach((effect) => {
        effect();
      });

      return true
    },
  });
}
