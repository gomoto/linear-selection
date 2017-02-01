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


  constructor(indexes = [] as number[]) {
    this.set(indexes);
  }


  /**
   * Reset state of this.
   */
  public reset(): void {
    this._selections = this._createSelections();
    this._anchor = null;
    this._touchMode = true;
    this._pendingPositions = [];
  }


  /**
   * Declare which positions should be selected.
   * @param {number[]} indexes
   */
  public set(indexes: number[]): void {
    this.reset();
    indexes.forEach((indexes) => {
      this.select(indexes);
    });
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
   * Get smallest index selected.
   * @return {number} or null if selection is empty
   */
  public get min(): number {
    return this._selections.min();
  }


  /**
   * Get largest index selected.
   * @return {number} or null if selection is empty
   */
  public get max(): number {
    return this._selections.max();
  }


  /**
   * How many positions are selected?
   * @return {number}
   */
  public get size(): number {
    return this._selections.size;
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
  public select(index: number): boolean {
    return this._selections.insert(index);
  }


  /**
   * Unselect a position.
   * @param {number} index
   * @return {boolean} false if not yet selected
   */
  public unselect(index: number): boolean {
    return this._selections.remove(index);
  }


  /**
   * To increment only part of the selection, specify a min and max.
   * @param {number} increase
   * @param {number} min
   * @param {number} max
   */
  public increment(increase: number, min = this._selections.min(), max = this._selections.max()): void {
    // iterate backwards for proper overwriting behavior
    this._cloneSelections().reach((index: any /*number*/) => {
      if (min <= index && index <= max) {
        this._selections.remove(index);
        this._selections.insert(index + increase);
      }
    });
  }


  /**
   * To decrement only part of the selection, specify a min and max.
   * @param {number} decrease
   * @param {number} min
   * @param {number} max
   */
  public decrement(decrease: number, min = this._selections.min(), max = this._selections.max()): void {
    // iterate forwards for proper overwriting behavior
    this._cloneSelections().each((index: any /*number*/) => {
      if (min <= index && index <= max) {
        this._selections.remove(index);
        this._selections.insert(index - decrease);
      }
    });
  }


  private _createSelections(): RBTree<number> {
    return new RBTree<number>((a: number, b: number) => a - b);
  }


  private _cloneSelections(): RBTree<number> {
    const clone = this._createSelections();
    this._selections.each((index: any /*number*/) => {
      clone.insert(index);
    });
    return clone;
  }


  /**
   * Unselect all positions, except the specified exception.
   * @return {number} number of positions that were selected
   */
  private _unselectAll(exception?: number): number {
    // set aside exception before measuring size
    const exceptionExisted = this.unselect(exception);
    const size = this._selections.size;
    this._selections.clear();
    // restore exception
    if (exceptionExisted) {
      this.select(exception);
    }
    return size;
  }


  private _click(index: number, exclusive: boolean): void {
    this._acceptPending();

    // In exclusive mode, turn off all nodes except this one.
    // In non-exclusive mode, node does not worry about other nodes around it.
    const isSurrounded = exclusive && this._unselectAll(index) > 0;

    if (isSurrounded) {
      // turn on
      this.select(index);
      this._touchMode = true;
    } else {
      // toggle
      this.isSelected(index) ? this.unselect(index) : this.select(index);
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
      this._unselectAll();
    }

    // Turn on/off (depending on touchType) all positions between min and max, inclusive.
    // Pending positions are those that get inverted.
    const minIndex = Math.min(this._anchor, index);
    const maxIndex = Math.max(this._anchor, index);
    for (let index = minIndex; index <= maxIndex; index++) {
      if (this.isSelected(index) !== this._touchMode) {
        // inversion
        this._pendingPositions.push(index);
        this._touchMode ? this.select(index) : this.unselect(index);
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
      this.isSelected(index) ? this.unselect(index) : this.select(index);
    });
    this._pendingPositions = [];
  }

}


export interface TouchOptions {
  shift?: boolean;
  ctrl?: boolean;
}
