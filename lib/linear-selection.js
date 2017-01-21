"use strict";
var LinearSelection = (function () {
    function LinearSelection(size) {
        if (size === void 0) { size = 0; }
        this.setSize(size);
    }
    LinearSelection.prototype.setSize = function (size) {
        this._selection = new Array(size);
        LinearSelection.fillArray(this._selection, false);
        this._anchor = null;
        this._touchMode = true;
        this._pendingPositions = [];
    };
    LinearSelection.prototype.insert = function (count, start, selected) {
        var insertion = new Array(count);
        LinearSelection.fillArray(insertion, !!selected);
        (_a = this._selection).splice.apply(_a, [start, 0].concat(insertion));
        var _a;
    };
    LinearSelection.prototype.touch = function (index, options) {
        if (options === void 0) { options = {}; }
        if (options.shift) {
            if (options.ctrl) {
                this._shiftClick(index, false);
            }
            else {
                this._shiftClick(index, true);
            }
        }
        else {
            if (options.ctrl) {
                this._click(index, false);
            }
            else {
                this._click(index, true);
            }
        }
    };
    LinearSelection.prototype.isSelected = function (index) {
        return this._selection[index];
    };
    LinearSelection.prototype.unselectAll = function (exception) {
        var sum = 0;
        this._selection.forEach(function (isSelected, index, array) {
            if (index === exception)
                return;
            if (isSelected) {
                sum++;
                array[index] = false;
            }
        });
        return sum;
    };
    LinearSelection.prototype._click = function (index, exclusive) {
        this._acceptPending();
        var isSurrounded = exclusive && this.unselectAll(index) > 0;
        if (isSurrounded) {
            this._selection[index] = true;
            this._touchMode = true;
        }
        else {
            var isOn = this._selection[index];
            this._selection[index] = !isOn;
            this._touchMode = !isOn;
        }
        this._anchor = index;
    };
    LinearSelection.prototype._shiftClick = function (index, exclusive) {
        if (this._anchor === null) {
            return;
        }
        this._rejectPending();
        if (exclusive) {
            this.unselectAll();
        }
        var minIndex = Math.min(this._anchor, index);
        var maxIndex = Math.max(this._anchor, index);
        for (var i = minIndex; i <= maxIndex; i++) {
            if (this._selection[i] !== this._touchMode) {
                this._pendingPositions.push(i);
                this._selection[i] = this._touchMode;
            }
        }
    };
    LinearSelection.prototype._acceptPending = function () {
        this._pendingPositions = [];
        this._anchor = null;
    };
    LinearSelection.prototype._rejectPending = function () {
        var _this = this;
        this._pendingPositions.forEach(function (pendingPosition) {
            _this._selection[pendingPosition] = !_this._selection[pendingPosition];
        });
        this._pendingPositions = [];
    };
    LinearSelection.fillArray = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            array[i] = value;
        }
    };
    return LinearSelection;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinearSelection;
