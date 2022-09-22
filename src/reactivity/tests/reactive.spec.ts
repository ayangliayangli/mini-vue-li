import { add } from "../add";
import { reactive } from "../reactive";


describe('init', () => {
    it('1 is 1', () => {
        expect(1).toBe(1)
    });

    it('add in esm', () => {
        expect(add(1,2)).toBe(3)
    });
});

describe('reactive', () => {
    it('happy path ', () => {
        const raw = {k1: 1}
        const observed = reactive(raw)

        expect(raw).not.toBe(observed)
        expect(raw.k1).toBe(observed.k1)
    });
});