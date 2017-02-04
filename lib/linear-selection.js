"use strict";
var bintrees_1 = require("bintrees");
var LinearSelection = (function () {
    function LinearSelection(indexes) {
        if (indexes === void 0) { indexes = []; }
        this.set(indexes);
    }
    LinearSelection.prototype.reset = function () {
        this._selections = this._createSelections();
        this._anchor = null;
        this._touchMode = true;
        this._pendingPositions = [];
    };
    LinearSelection.prototype.set = function (indexes) {
        var _this = this;
        this.reset();
        indexes.forEach(function (indexes) {
            _this.select(indexes);
        });
    };
    LinearSelection.prototype.setRange = function (min, max) {
        this.reset();
        for (var i = min; i <= max; i++) {
            this.select(i);
        }
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
    Object.defineProperty(LinearSelection.prototype, "min", {
        get: function () {
            return this._selections.min();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinearSelection.prototype, "max", {
        get: function () {
            return this._selections.max();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinearSelection.prototype, "size", {
        get: function () {
            return this._selections.size;
        },
        enumerable: true,
        configurable: true
    });
    LinearSelection.prototype.isSelected = function (index) {
        return this._selections.find(index) !== null;
    };
    LinearSelection.prototype.select = function (index) {
        return this._selections.insert(index);
    };
    LinearSelection.prototype.unselect = function (index) {
        return this._selections.remove(index);
    };
    LinearSelection.prototype.increment = function (increase, min, max) {
        this._shift(increase, min, max);
    };
    LinearSelection.prototype.decrement = function (decrease, min, max) {
        this._shift(-decrease, min, max);
    };
    LinearSelection.prototype._shift = function (amount, min, max) {
        var _this = this;
        if (min === void 0) { min = this._selections.min(); }
        if (max === void 0) { max = this._selections.max(); }
        if (typeof amount !== 'number') {
            throw 'increment/decrement amount must be a number';
        }
        if (amount === 0) {
            return;
        }
        var iterator = amount > 0 ? 'reach' : 'each';
        this._cloneSelections()[iterator](function (index) {
            if (min <= index && index <= max) {
                _this._selections.remove(index);
                _this._selections.insert(index + amount);
            }
        });
    };
    LinearSelection.prototype._createSelections = function () {
        return new bintrees_1.RBTree(function (a, b) { return a - b; });
    };
    LinearSelection.prototype._cloneSelections = function () {
        var clone = this._createSelections();
        this._selections.each(function (index) {
            clone.insert(index);
        });
        return clone;
    };
    LinearSelection.prototype._unselectAll = function (exception) {
        var exceptionExisted = this.unselect(exception);
        var size = this._selections.size;
        this._selections.clear();
        if (exceptionExisted) {
            this.select(exception);
        }
        return size;
    };
    LinearSelection.prototype._click = function (index, exclusive) {
        this._acceptPending();
        var isSurrounded = exclusive && this._unselectAll(index) > 0;
        if (isSurrounded) {
            this.select(index);
            this._touchMode = true;
        }
        else {
            this.isSelected(index) ? this.unselect(index) : this.select(index);
            this._touchMode = this.isSelected(index);
        }
        this._anchor = index;
    };
    LinearSelection.prototype._shiftClick = function (index, exclusive) {
        if (this._anchor === null) {
            return;
        }
        this._rejectPending();
        if (exclusive) {
            this._unselectAll();
        }
        var minIndex = Math.min(this._anchor, index);
        var maxIndex = Math.max(this._anchor, index);
        for (var index_1 = minIndex; index_1 <= maxIndex; index_1++) {
            if (this.isSelected(index_1) !== this._touchMode) {
                this._pendingPositions.push(index_1);
                this._touchMode ? this.select(index_1) : this.unselect(index_1);
            }
        }
    };
    LinearSelection.prototype._acceptPending = function () {
        this._pendingPositions = [];
        this._anchor = null;
    };
    LinearSelection.prototype._rejectPending = function () {
        var _this = this;
        this._pendingPositions.forEach(function (index) {
            _this.isSelected(index) ? _this.unselect(index) : _this.select(index);
        });
        this._pendingPositions = [];
    };
    return LinearSelection;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinearSelection;
