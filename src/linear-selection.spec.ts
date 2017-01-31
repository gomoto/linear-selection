import * as test from 'tape';
import LinearSelection from './linear-selection';

// constructor()

test('selection should initialize with all positions unselected', (assert) => {
  const selection = new LinearSelection();
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('selection can initialize from an array of numbers', (assert) => {
  const selection = new LinearSelection([0, 1, 3]);
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), true);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

// set()

test('selection can be set from an array of numbers', (assert) => {
  const selection = new LinearSelection();
  selection.set([0, 1, 3]);
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), true);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

// touch()

test('simple click should select a position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(2);
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('simple click again should unselect a position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(2);
  selection.touch(2);
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('ctrl-click should select a position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(2, {ctrl: true});
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('ctrl-click again should unselect a position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(2, {ctrl: true});
  selection.touch(2, {ctrl: true});
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('ctrl-click another position should NOT unselect a position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(2, {ctrl: true});
  selection.touch(3, {ctrl: true});
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), true);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-click should select a range of positions', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0);
  selection.touch(2, {shift: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-click again should select a range of positions', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0);
  selection.touch(2, {shift: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-click yet again should adjust a range of positions', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0);
  selection.touch(2, {shift: true});
  selection.touch(1, {shift: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-click should not select any position on first touch', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0, {shift: true});
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-ctrl-click should select multiple ranges of positions', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0);
  selection.touch(1, {shift: true});
  selection.touch(3, {ctrl: true});
  selection.touch(4, {shift: true, ctrl: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), true);
  assert.equal(selection.isSelected(4), true);
  assert.end();
});

test('shift-ctrl-click over a selected position should not unselect that position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(2);
  selection.touch(0, {ctrl: true});
  selection.touch(4, {shift: true, ctrl: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), true);
  assert.equal(selection.isSelected(4), true);
  assert.end();
});

test('shift-ctrl-click temporarily over a selected position should not unselect that position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(2);
  selection.touch(0, {ctrl: true});
  selection.touch(4, {shift: true, ctrl: true});
  selection.touch(0, {shift: true, ctrl: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-ctrl-click should unselect a range of positions when starting another range at a selected position', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0);
  selection.touch(4, {shift: true});
  selection.touch(2, {ctrl: true});
  selection.touch(4, {shift: true, ctrl: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-ctrl-click should unselect a range of positions even when ending beyond the range', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0);
  selection.touch(2, {shift: true});
  selection.touch(1, {ctrl: true});
  selection.touch(4, {shift: true, ctrl: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-ctrl-click should not unselect a position that is temporarily unselected', (assert) => {
  const selection = new LinearSelection();
  selection.touch(0);
  selection.touch(2, {shift: true});
  selection.touch(1, {ctrl: true});
  selection.touch(4, {shift: true, ctrl: true});
  selection.touch(1, {shift: true, ctrl: true});
  assert.equal(selection.isSelected(0), true);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

// min

test('min should return null if selection is empty', (assert) => {
  const selection = new LinearSelection();
  assert.equal(selection.min, null);
  assert.end();
});

test('min should return smallest index selected', (assert) => {
  const selection = new LinearSelection();
  selection.touch(27);
  selection.touch(2, {ctrl: true});
  assert.equal(selection.min, 2);
  assert.end();
});

// max

test('max should return null if selection is empty', (assert) => {
  const selection = new LinearSelection();
  assert.equal(selection.max, null);
  assert.end();
});

test('max should return largest index selected', (assert) => {
  const selection = new LinearSelection();
  selection.touch(27);
  selection.touch(2, {ctrl: true});
  assert.equal(selection.max, 27);
  assert.end();
});

// size

test('size should return number of selected positions', (assert) => {
  const selection = new LinearSelection();
  assert.equal(selection.size, 0);
  selection.touch(41);
  assert.equal(selection.size, 1);
  selection.touch(50, {shift: true});
  assert.equal(selection.size, 10);
  assert.end();
});

// reset()

test('reset() should unselect all positions', (assert) => {
  const selection = new LinearSelection();
  selection.touch(41);
  selection.reset();
  assert.equal(selection.size, 0);
  assert.end();
});

// increment()

test('increment() should increase selected positions by a given amount', (assert) => {
  const selection = new LinearSelection([0, 1, 3]);
  selection.increment(2);
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), true);
  assert.equal(selection.isSelected(4), false);
  assert.equal(selection.isSelected(5), true);
  assert.end();
});

// decrement()

test('decrement() should decrease selected positions by a given amount', (assert) => {
  const selection = new LinearSelection([0, 1, 3]);
  selection.decrement(2);
  assert.equal(selection.isSelected(-2), true);
  assert.equal(selection.isSelected(-1), true);
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), true);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.end();
});
