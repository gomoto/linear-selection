export default class LinearSelection {
    private _selections;
    private _anchor;
    private _touchMode;
    private _pendingPositions;
    constructor(indexes?: number[]);
    reset(): void;
    set(indexes: number[]): void;
    touch(index: number, options?: TouchOptions): void;
    readonly min: number;
    readonly max: number;
    readonly size: number;
    isSelected(index: number): boolean;
    select(index: number): boolean;
    unselect(index: number): boolean;
    increment(increase: number, min?: number, max?: number): void;
    decrement(decrease: number, min?: number, max?: number): void;
    private _createSelections();
    private _cloneSelections();
    private _unselectAll(exception?);
    private _click(index, exclusive);
    private _shiftClick(index, exclusive);
    private _acceptPending();
    private _rejectPending();
}
export interface TouchOptions {
    shift?: boolean;
    ctrl?: boolean;
}
