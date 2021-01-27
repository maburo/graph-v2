import { platform } from "os";
import { GraphEditor } from "../components/graph-editor";

export const enum Platform {
  Win, Mac
}

const PLATFORM = window.navigator.platform.toLocaleLowerCase().startsWith('mac') ? Platform.Mac : Platform.Win;

interface KeyModifiers {
  readonly shiftKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
}

interface KeyAction {
  readonly modifiers: number;
  readonly command: (graph: GraphEditor) => void;
}

interface Binding {
  keys: string[],
  modifiers?: KeyModifiers,
  platform?: Platform,
}

export interface KeyMappingSettings {
  bindings: Binding[],
  action: (graph: GraphEditor) => void,
}

export default class KeyboardController {
  readonly onKeyPress: (e: React.KeyboardEvent) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;

  constructor(editor: GraphEditor, settings: KeyMappingSettings[]) {
    const keyMapping = mapKeys(settings);
    this.onKeyDown = onKeyDownFn.bind(editor, keyMapping);
  }
}

function mapKeys(settings: KeyMappingSettings[]) {
  return settings.flatMap(mapping =>
    mapping.bindings
    .filter(binding => !binding.platform || binding.platform === PLATFORM)
    .flatMap(binding => binding.keys.map(key => ({
      key,
      modifiers: binding.modifiers,
      action: mapping.action,
    })))
  ).reduce((acc, obj) => acc.set(obj.key, {
    command: obj.action,
    modifiers: modifiersBits(obj.modifiers)
  }), new Map<string, KeyAction>())
}


function onKeyDownFn(this: GraphEditor, keymap: Map<string, KeyAction>, e: React.KeyboardEvent) {
  const action = keymap.get(e.code);

  if (action && !(action.modifiers ^ modifiersBits(e))) {
    e.preventDefault();
    e.stopPropagation();
    action.command(this);
  }
}

function modifiersBits(modifiers?: KeyModifiers) {
  if (modifiers) {
    return (modifiers.shiftKey && 0x0001) 
         | (modifiers.ctrlKey && 0x0010) 
         | (modifiers.altKey && 0x0100) 
         | (modifiers.metaKey && 0x1000);
  }

  return 0;
}

function zoomIn(graph: GraphEditor) {
  graph.zoom(.25);
}

function zoomOut(graph: GraphEditor) {
  graph.zoom(-.25);
}

function deleteNode(graph: GraphEditor) {
  graph.deleteSelectedNodes();
}

function undo(graph: GraphEditor) {
  graph.undo();
}

function redo(graph: GraphEditor) {
  graph.redo();
}

function copy(graph: GraphEditor) {

}

function paste(graph: GraphEditor) {

}

function cut(graph: GraphEditor) {

}

function focus(graph: GraphEditor) {

}

export function defaultKeyMapping() {
  return [
    {
      bindings: [ {keys: ['KeyF']} ], 
      action: focus,
    },
    { 
      bindings: [ {keys: ['Minus', 'NumpadSubtract']} ],
      action: zoomOut,
    },
    { 
      bindings: [ {keys: ['Equal', 'NumpadAdd']} ], 
      action: zoomIn,
    },
    { 
      bindings: [ {keys: ['Delete']} ], 
      action: deleteNode,
    },
    { 
      bindings: [
        { keys: ['KeyZ'], modifiers: {ctrlKey: true}, platform: Platform.Win },
        { keys: ['KeyZ'], modifiers: {metaKey: true}, platform: Platform.Mac },
      ],
      action: undo,
    },
    { 
      bindings: [
        { keys: ['KeyY'], modifiers: {ctrlKey: true}, platform: Platform.Win },
        { keys: ['KeyZ'], modifiers: {metaKey: true, shiftKey: true}, platform: Platform.Mac },
      ],
      action: redo,
    },
    {
      bindings: [
        { keys: ['KeyC'], modifiers: {ctrlKey: true}, platform: Platform.Win },
        { keys: ['KeyX'], modifiers: {cmdKey: true}, platform: Platform.Mac }
      ],
      action: copy,
    },
    {
      bindings: [
        { keys: ['KeyV'], modifiers: {ctrlKey: true}, platform: Platform.Win },
        { keys: ['KeyX'], modifiers: {cmdKey: true}, platform: Platform.Mac }
      ],
      action: paste,
    },
    {
      bindings: [
        { keys: ['KeyX'], modifiers: {ctrlKey: true}, platform: Platform.Win },
        { keys: ['KeyX'], modifiers: {cmdKey: true}, platform: Platform.Mac }
      ],
      action: paste,
    },
  ]
}
