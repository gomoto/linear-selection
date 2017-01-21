export default class LinearSelection {
    private _selection;
    private _anchor;
    private _touchMode;
    private _pendingPositions;
    constructor(size?: number);
    setSize(size: number): void;
    insert(count: number, start: number, selected: boolean): void;
    touch(index: number, options?: TouchOptions): void;
    isSelected(index: number): boolean;
    private unselectAll(exception?);
    private _click(index, exclusive);
    private _shiftClick(index, exclusive);
    private _acceptPending();
    private _rejectPending();
    private static fillArray(array, value);
}
export interface TouchOptions {
    shift?: boolean;
    ctrl?: boolean;
}
