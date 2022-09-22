import { Set } from "typescript";
import { extend } from "../shared";

let activeEffect: ReactiveEffect | undefined;
const targetDepsMap = new Map()

function getTargetKeyDeps(target, key): Set<ReactiveEffect> {
    let keyDepsMap = targetDepsMap.get(target);
    if (!keyDepsMap) {
        keyDepsMap = new Map();
        targetDepsMap.set(target, keyDepsMap);
    }
  
    let deps = keyDepsMap.get(key);
    if (!deps) {
        deps = new Set();
        keyDepsMap.set(key, deps);
    }
  
    return deps;
  }

export function track(target, key) {
    const deps = getTargetKeyDeps(target, key)
    if (activeEffect) {
        deps.add(activeEffect)
        activeEffect.effectsSet.add(deps)
    }
    
}

export function trigger(target, key) {
    const deps = getTargetKeyDeps(target, key)
    deps.forEach(dep => {
        if (dep.scheduler) {
            dep.scheduler()
        } else {
            dep.run()
        }
    })
}


class ReactiveEffect {
    public effectsSet: Set<Set<ReactiveEffect> | void> = new Set();
    constructor(private fn: () => any, public scheduler?: () => any) {

    }

    public onStop?: () => any

    run() {
        activeEffect = this
        const ret = this.fn()
        activeEffect = undefined
        return ret;
    }

    stop() {
        this.effectsSet.forEach(effects => {
            if (effects) {
                effects.delete(this)
            }
        })

        if (this.onStop) {
            this.onStop()
        }
    }
}

export function effect(fn: () => any, options?) {
    const _effect = new ReactiveEffect(fn, options?.scheduler)
    extend(_effect, options)

    _effect.run()

    const runner: any = _effect.run.bind(_effect)
    runner._effect = _effect
    return runner
}

export function stop(runner) {
    runner._effect.stop()
}