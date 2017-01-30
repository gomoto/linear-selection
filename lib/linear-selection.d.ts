export default class LinearSelection {
    private _selections;
    private _anchor;
    private _touchMode;
    private _pendingPositions;
    constructor();
    reset(): void;
    touch(index: number, options?: TouchOptions): void;
    readonly min: number;
    readonly max: number;
    readonly size: number;
    isSelected(index: number): boolean;
    private _select(index);
    private _unselect(index);
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
