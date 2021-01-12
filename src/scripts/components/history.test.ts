import { StateHistory } from './graph';

test('empty history undo', () => {
  const history = new StateHistory(3);
  history.undo();
})

test('undo all', () => {
  const history = new StateHistory(3);
  let result = {};

  history.push(createCommand(result, 'a'));
  history.push(createCommand(result, 'b'));
  history.push(createCommand(result, 'c'));
  expect(result).toEqual({a: true, b: true, c: true});

  history.undo();
  history.undo();
  history.undo();
  expect(result).toEqual({});
});

test('undo and max history size = 1', () => {
  const history = new StateHistory(1);
  let result = {};
  
  history.push(createCommand(result, 'a'));
  history.push(createCommand(result, 'b'));
  history.push(createCommand(result, 'c'));
  expect(result).toEqual({a: true, b: true, c: true});

  history.undo();
  history.undo();
  history.undo();
  expect(result).toEqual({a: true, b: true});
});

test('undo/redo', () => {
  const history = new StateHistory(5);
  const result: any = {};
  
  history.push(createCommand(result, 'a'));
  expect((history as any).idx).toBe(1);
  expect(result).toEqual({a: true});

  history.push(createCommand(result, 'b'));
  expect((history as any).idx).toBe(2);
  expect(result).toEqual({a: true, b: true});

  history.push(createCommand(result, 'c'));
  expect((history as any).idx).toBe(3);
  expect(result).toEqual({a: true, b: true, c: true});

  history.undo();
  expect((history as any).idx).toBe(2);
  expect(result).toEqual({a: true, b: true});

  history.undo();
  expect((history as any).idx).toBe(1);
  expect(result).toEqual({a: true});

  history.redo();
  expect((history as any).idx).toBe(2);
  expect(result).toEqual({a: true, b: true});

  history.undo();
  expect((history as any).idx).toBe(1);
  expect(result).toEqual({a: true});
});

function createCommand(ctx: any, letter: string) {
  return {execute: () => ctx[letter] = true, undo: () => delete ctx[letter]}
}

test('undo/rewrite redo', () => {
  const history = new StateHistory(5);
  const result: any = {};
  
  history.push(createCommand(result, 'a'));
  history.push(createCommand(result, 'b'));
  history.push(createCommand(result, 'c'));

  history.undo();
  expect((history as any).idx).toBe(2);
  expect(result).toEqual({a: true, b: true});

  history.push(createCommand(result, 'd'));
  expect(result).toEqual({a: true, b: true, d: true});
  expect((history as any).idx).toBe(3);

  history.undo();
  expect((history as any).idx).toBe(2);
  expect(result).toEqual({a: true, b: true});
});