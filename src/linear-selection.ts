export default class LinearSelection {

  /**
   * List tracking which positions are selected.
   */
  private _selection: boolean[];


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


  constructor(size = 0) {
    this.setSize(size);
  }


  /**
   * Set selection size.
   * @param {number} size
   */
  public setSize(size: number): void {
    // create an array filled with false
    this._selection = new Array<boolean>(size);
    LinearSelection.fillArray(this._selection, false);
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
    const insertion = new Array<boolean>(count);
    LinearSelection.fillArray(insertion, !!selected);
    this._selection.splice(start, 0, ...insertion);
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
    return this._selection[index];
  }


  /**
   * Unselect all positions, except the specified exception.
   * @return {number} number of positions that were selected
   */
  private unselectAll(exception?: number): number {
    let sum = 0;
    this._selection.forEach((isSelected, index, array) => {
      if (index === exception) return;
      if (isSelected) {
        sum++;
        array[index] = false;
      }
    });
    return sum;
  }


  private _click(index: number, exclusive: boolean): void {
    this._acceptPending();

    // In exclusive mode, turn off all nodes except this one.
    // In non-exclusive mode, node does not worry about other nodes around it.
    const isSurrounded = exclusive && this.unselectAll(index) > 0;

    if (isSurrounded) {
      // turn on
      this._selection[index] = true;
      this._touchMode = true;
    } else {
      // toggle
      const isOn = this._selection[index];
      this._selection[index] = !isOn;
      this._touchMode = !isOn;
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
    for (let i = minIndex; i <= maxIndex; i++) {
      if (this._selection[i] !== this._touchMode) {
        // inversion
        this._pendingPositions.push(i);
        this._selection[i] = this._touchMode;
      }
    }
  }


  private _acceptPending(): void {
    this._pendingPositions = [];

    // this anchor should not be used to make any more pending nodes
    this._anchor = null;
  }


  private _rejectPending(): void {
    this._pendingPositions.forEach((pendingPosition) => {
      this._selection[pendingPosition] = !this._selection[pendingPosition];
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
