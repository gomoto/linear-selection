import { RBTree } from 'bintrees';


export default class LinearSelection {

  /**
   * Track which positions are selected.
   */
  private _selections: RBTree<number>;


  /**
   * Most recently clicked position.
   */
  private _anchor: number;


  /**
   * Positive touch mode: most recent click turned on a position.
   * Negative touch mode: most recent click turned off a position.
   */
  private _touchMode: boolean;


  /**
   * Pending positions.
   */
  private _pendingPositions: number[];


  constructor() {
    this.reset();
  }


  /**
   * Reset state of this.
   */
  public reset(): void {
    this._selections = new RBTree<number>((a: number, b: number) => a - b);
    this._anchor = null;
    this._touchMode = true;
    this._pendingPositions = [];
  }


  /**
   * Insert items into the selection.
   * @param {number} count
   * @param {number} start
   * @param {boolean} selected true if already selected at time of insertion
   */
  public insert(count: number, start: number, selected: boolean): void {
    // const insertion = new Array<boolean>(count);
    // LinearSelection.fillArray(insertion, !!selected);
    // this._selection.splice(start, 0, ...insertion);
  }


  /**
   * Touch a position.
   * @param {number} index
   * @param {TouchOptions} options
   */
  public touch(index: number, options = {} as TouchOptions): void {
    if (options.shift) {
      // shift-ctrl-click
      if (options.ctrl) {
        this._shiftClick(index, false);
      }
      // shift-click
      else {
        this._shiftClick(index, true);
      }
    }
    else {
      // ctrl-click
      if (options.ctrl) {
        this._click(index, false);
      }
      // click
      else {
        this._click(index, true);
      }
    }
  }


  /**
   * Is a position selected?
   * @param {number} index
   * @return {boolean}
   */
  public isSelected(index: number): boolean {
    return this._selections.find(index) !== null;
  }


  /**
   * Select a position.
   * @param {number} index
   * @return {boolean} false if already selected
   */
  private _select(index: number): boolean {
    return this._selections.insert(index);
  }


  /**
   * Unselect a position.
   * @param {number} index
   * @return {boolean} false if not yet selected
   */
  private _unselect(index: number): boolean {
    return this._selections.remove(index);
  }


  /**
   * Unselect all positions, except the specified exception.
   * @return {number} number of positions that were selected
   */
  private unselectAll(exception?: number): number {
    // set aside exception before measuring size
    const exceptionExisted = this._unselect(exception);
    const size = this._selections.size;
    this._selections.clear();
    // restore exception
    if (exceptionExisted) {
      this._select(exception);
    }
    return size;
  }


  private _click(index: number, exclusive: boolean): void {
    this._acceptPending();

    // In exclusive mode, turn off all nodes except this one.
    // In non-exclusive mode, node does not worry about other nodes around it.
    const isSurrounded = exclusive && this.unselectAll(index) > 0;

    if (isSurrounded) {
      // turn on
      this._select(index);
      this._touchMode = true;
    } else {
      // toggle
      this.isSelected(index) ? this._unselect(index) : this._select(index);
      this._touchMode = this.isSelected(index);
    }

    this._anchor = index;
  }


  private _shiftClick(index: number, exclusive: boolean): void {
    if (this._anchor === null) {
      return;
    }

    this._rejectPending();

    if (exclusive) {
      this.unselectAll();
    }

    // Turn on/off (depending on touchType) all positions between min and max, inclusive.
    // Pending positions are those that get inverted.
    const minIndex = Math.min(this._anchor, index);
    const maxIndex = Math.max(this._anchor, index);
    for (let index = minIndex; index <= maxIndex; index++) {
      if (this.isSelected(index) !== this._touchMode) {
        // inversion
        this._pendingPositions.push(index);
        this._touchMode ? this._select(index) : this._unselect(index);
      }
    }
  }


  private _acceptPending(): void {
    this._pendingPositions = [];

    // this anchor should not be used to make any more pending nodes
    this._anchor = null;
  }


  private _rejectPending(): void {
    this._pendingPositions.forEach((index) => {
      this.isSelected(index) ? this._unselect(index) : this._select(index);
    });
    this._pendingPositions = [];
  }


  /**
   * Fill the given array with true or false.
   * @param {Array<boolean>} array
   * @param {boolean} value
   */
  private static fillArray(array: Array<boolean>, value: boolean): void {
    for (let i = 0; i < array.length; i++) {
      array[i] = value;
    }
  }

}


export interface TouchOptions {
  shift?: boolean;
  ctrl?: boolean;
}
