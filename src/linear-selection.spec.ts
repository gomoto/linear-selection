import * as test from 'tape';
import LinearSelection from './linear-selection';

test('selection should initialize with all positions unselected', (assert) => {
  const selection = new LinearSelection(5);
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('simple click should select a position', (assert) => {
  const selection = new LinearSelection(5);
  selection.touch(2);
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('simple click again should unselect a position', (assert) => {
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
  selection.touch(2, {ctrl: true});
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), true);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('ctrl-click again should unselect a position', (assert) => {
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
  selection.touch(0, {shift: true});
  assert.equal(selection.isSelected(0), false);
  assert.equal(selection.isSelected(1), false);
  assert.equal(selection.isSelected(2), false);
  assert.equal(selection.isSelected(3), false);
  assert.equal(selection.isSelected(4), false);
  assert.end();
});

test('shift-ctrl-click should select multiple ranges of positions', (assert) => {
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
  const selection = new LinearSelection(5);
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
