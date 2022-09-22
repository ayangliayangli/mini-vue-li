import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
    it('get track set trigger', () => {
        const raw = {count: 1}
        const obsered = reactive(raw)
        let dummy = 0

        effect(() => {
            dummy = obsered.count + 1
        })

        expect(dummy).toBe(2)
        obsered.count = 2
        expect(dummy).toBe(3)
    });

    it('runner', () => {
        const raw = {count: 1}
        const obsered = reactive(raw)
        let dummy = 0

        const runner = effect(() => {
            dummy = obsered.count + 1

            return 'foo'
        })

        expect(dummy).toBe(2)
        const runnerRes = runner()
        expect(runnerRes).toBe('foo')
    });

    it('scheduler', () => {
        let run;
        let runner;
        const scheduler = jest.fn(() => {
            run = runner
        })

        const raw = {count: 1}
        const obsered = reactive(raw)
        let dummy = 0
        runner = effect(() => {
            dummy = obsered.count + 1

            return 'foo'
        }, {
            scheduler,
        })

        expect(dummy).toBe(2)
        obsered.count = 3
        expect(dummy).toBe(2)
        expect(scheduler).toBeCalledTimes(1)

        run()
        expect(dummy).toBe(4)

    });

    it('stop', () => {
        const raw = {count: 1}
        const obsered = reactive(raw)
        let dummy = 0

        const runner = effect(() => {
            dummy = obsered.count + 1

            return 'foo'
        })
        expect(dummy).toBe(2)

        stop(runner)
        obsered.count = 3
        expect(dummy).toBe(2)

        runner()
        expect(dummy).toBe(4)


    });

    it('onStop', () => {
        const raw = {count: 1}
        const obsered = reactive(raw)
        let dummy = 0
        const onStop = jest.fn(() => {

        })

        const runner = effect(() => {
            dummy = obsered.count + 1

            return 'foo'
        }, {
            onStop,
        })
        expect(dummy).toBe(2)

        stop(runner)
        expect(onStop).toBeCalled()
    });
});