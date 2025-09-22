// Figma Plugin API Types
// This file provides basic type definitions for the Figma Plugin API

declare global {
  const figma: PluginAPI;
  const __html__: string;
}

interface PluginAPI {
  readonly apiVersion: string;
  readonly command: string;
  readonly editorType: 'figma' | 'figjam';
  
  closePlugin(message?: string): void;
  
  createRectangle(): RectangleNode;
  createEllipse(): EllipseNode;
  createText(): TextNode;
  createFrame(): FrameNode;
  createComponent(): ComponentNode;
  createPage(): PageNode;
  
  group(nodes: ReadonlyArray<SceneNode>, parent: BaseNode & ChildrenMixin, index?: number): GroupNode;
  flatten(nodes: ReadonlyArray<SceneNode>, parent?: BaseNode & ChildrenMixin, index?: number): VectorNode;
  union(nodes: ReadonlyArray<SceneNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode;
  subtract(nodes: ReadonlyArray<SceneNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode;
  intersect(nodes: ReadonlyArray<SceneNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode;
  exclude(nodes: ReadonlyArray<SceneNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode;
  
  readonly currentPage: PageNode;
  readonly root: DocumentNode;
  
  getNodeById(id: string): BaseNode | null;
  getStyleById(id: string): BaseStyle | null;
  
  readonly viewport: ViewportAPI;
  
  showUI(html: string, options?: ShowUIOptions): void;
  readonly ui: UIAPI;
  
  readonly clientStorage: ClientStorageAPI;
  
  notify(message: string, options?: NotificationOptions): NotificationHandler;
  
  on(type: 'selectionchange' | 'currentpagechange' | 'close', callback: () => void): void;
  off(type: 'selectionchange' | 'currentpagechange' | 'close', callback: () => void): void;
  once(type: 'selectionchange' | 'currentpagechange' | 'close', callback: () => void): void;
}

interface ShowUIOptions {
  visible?: boolean;
  title?: string;
  width?: number;
  height?: number;
  position?: { x: number; y: number };
  themeColors?: boolean;
}

interface UIAPI {
  show(): void;
  hide(): void;
  resize(width: number, height: number): void;
  close(): void;
  
  postMessage(pluginMessage: any, options?: { origin?: string }): void;
  onmessage: ((pluginMessage: any, props: OnMessageProperties) => void) | undefined;
}

interface OnMessageProperties {
  origin: string;
}

interface ViewportAPI {
  readonly center: Vector;
  readonly zoom: number;
  scrollAndZoomIntoView(nodes: ReadonlyArray<BaseNode>): void;
}

interface ClientStorageAPI {
  getAsync(key: string): Promise<any | undefined>;
  setAsync(key: string, value: any): Promise<void>;
  deleteAsync(key: string): Promise<void>;
  keysAsync(): Promise<string[]>;
}

interface NotificationOptions {
  timeout?: number;
  error?: boolean;
  button?: {
    text: string;
    action: () => boolean | void;
  };
}

interface NotificationHandler {
  cancel(): void;
}

// Basic node types - extend as needed
interface BaseNode {
  readonly id: string;
  readonly parent: (BaseNode & ChildrenMixin) | null;
  name: string;
  readonly removed: boolean;
  readonly type: NodeType;
}

interface ChildrenMixin {
  readonly children: ReadonlyArray<SceneNode>;
  appendChild(child: SceneNode): void;
  insertChild(index: number, child: SceneNode): void;
  findChildren(callback?: (node: SceneNode) => boolean): SceneNode[];
  findChild(callback: (node: SceneNode) => boolean): SceneNode | null;
  findAll(callback?: (node: BaseNode) => boolean): BaseNode[];
  findOne(callback: (node: BaseNode) => boolean): BaseNode | null;
}

interface SceneNode extends BaseNode {
  visible: boolean;
  locked: boolean;
}

interface RectangleNode extends SceneNode {
  readonly type: 'RECTANGLE';
  clone(): RectangleNode;
  cornerRadius: number | PluginAPI['mixed'];
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
  
  resize(width: number, height: number): void;
  resizeWithoutConstraints(width: number, height: number): void;
  rescale(scale: number): void;
  
  readonly width: number;
  readonly height: number;
  readonly absoluteTransform: Transform;
  relativeTransform: Transform;
  x: number;
  y: number;
  rotation: number;
  
  constrainProportions: boolean;
  layoutAlign: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';
  layoutGrow: number;
  
  fills: ReadonlyArray<Paint> | PluginAPI['mixed'];
  strokes: ReadonlyArray<Paint>;
  strokeWeight: number;
  strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE';
  
  effects: ReadonlyArray<Effect>;
  
  exportSettings: ReadonlyArray<ExportSettings>;
  exportAsync(settings?: ExportSettings): Promise<Uint8Array>;
}

// Add more node types as needed...
type NodeType = 'DOCUMENT' | 'PAGE' | 'FRAME' | 'GROUP' | 'VECTOR' | 'BOOLEAN_OPERATION' | 'STAR' | 'LINE' | 'ELLIPSE' | 'POLYGON' | 'RECTANGLE' | 'TEXT' | 'SLICE' | 'COMPONENT' | 'COMPONENT_SET' | 'INSTANCE' | 'STICKY' | 'SHAPE_WITH_TEXT' | 'CONNECTOR';

// Add more interfaces as needed for your specific use case...
interface Vector {
  readonly x: number;
  readonly y: number;
}

interface Transform {
  readonly 0: readonly [number, number, number];
  readonly 1: readonly [number, number, number];
}

interface Paint {
  readonly type: string;
}

interface Effect {
  readonly type: string;
  readonly visible: boolean;
}

interface ExportSettings {
  format: 'JPG' | 'PNG' | 'SVG' | 'PDF';
  suffix?: string;
}

export {};
