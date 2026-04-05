export type Genre = "Action" | "Drama" | "Thriller";
export type Location = "Interior" | "Exterior";
export type TimeOfDay = "Day" | "Night" | "Golden Hour";
export type SensorSize = "Full Frame" | "Super 35" | "APS-C" | "Micro Four Thirds";
export type InteractionType = "Combat" | "Dialogue" | "Chase" | "Suspense";
export type MotionPattern = "Circular" | "Linear" | "Arc" | "Static";
export type CameraMovementType = "Static" | "Tracking" | "Pan" | "Tilt" | "Dolly" | "Crane";
export type RigType = "Steadicam" | "Tripod" | "Handheld" | "Gimbal" | "Dolly" | "Crane";
export type PathType = "Arc" | "Linear" | "Zigzag" | "Circular";
export type ShotType = "Reveal" | "Follow" | "Establishing" | "Close-up" | "Medium" | "Wide";
export type FramingType = "Wide" | "Medium" | "Close-up" | "Two-shot" | "OTS" | "Master";
export type CameraAngleStyle = "Eye-level" | "Low" | "High" | "Dutch";
export type CompositionStyle = "Rule of thirds" | "Centered" | "Symmetrical" | "Leading lines" | "Negative space" | "Frame within frame";
export type SubjectPlacement = "Left third" | "Right third" | "Center" | "Top bias" | "Bottom bias";

export interface SceneContext {
  title: string;
  description: string;
  genre: Genre;
  location: Location;
  timeOfDay: TimeOfDay;
}

export interface EmotionalState {
  energy: number; // 0-1
  intensity: number; // 0-1
  dominance: number; // -1 to +1
  toneTags: string[];
}

export interface CastInfo {
  actorCount: number;
  objectCount: number;
  heights: number[]; // cm
  primaryCount: number;
  backgroundCount: number;
  crowdDensity: number; // 0-1
  setDepth: number; // meters
}

export interface CameraSpecs {
  focal: number; // mm
  aperture: number; // f-stop
  iso: number;
  shutter: number; // 1/x
  fps: number;
  sensor: SensorSize;
  aspect: string;
  wb: number; // Kelvin
  log: boolean;
}

export interface ChoreoIntent {
  interactionType: InteractionType;
  pattern: MotionPattern;
  direction: { x: number; y: number };
  rhythm: number; // BPM
  stuntDensity: number; // 0-1
  cameraCoupling: number; // 0-1
}

export interface CameraIntent {
  movementType: CameraMovementType;
  rigType: RigType;
  pathType: PathType;
  shotType: ShotType;
}

export interface InputData {
  scene: SceneContext;
  emotion: EmotionalState;
  cast: CastInfo;
  camera: CameraSpecs;
  choreo: ChoreoIntent;
  cameraIntent: CameraIntent;
}

export interface OutputData {
  shotSuggestions: {
    cameraFeel: string;
    lightingMood: string;
    blockingPlan: string;
  };
  movementPaths: {
    pathType: string;
    pathLength: number;
    speed: number;
    acceleration: number;
  }[];
  cameraMotionSync: {
    followStyle: string;
    cameraSpeed: number;
    offsetDistance: number;
  };
  blockingEvolution: {
    densityMap: string;
    spacingTimeline: string;
    stageZones: string;
    focusZones: string;
  };
  interactionGeometry: {
    actorDistances: number[][];
    relativeOrientation: number[][];
    powerPositions: string[];
    dominanceShift: number;
  };
  stuntLayout: {
    stuntCount: number;
    stuntZones: string;
    safetyRadius: number;
    collisionRiskZones: string;
  };
  crowdFlow: {
    directionVectors: string;
    densityHeatmap: string;
    speedVariance: number;
  };
  choreoInfluence: {
    cameraShake: number;
    shotDuration: number;
    cutFrequency: number;
    lensBreathingBias: number;
    cameraHeightMod: number;
  };
  lightingGeometry: {
    keyAngle: number;
    fillAngle: number;
    backAngle: number;
    lightHeight: number;
    shadowHardness: number;
    colorTemperature: number;
  };
  cameraMotionMetrics: {
    speed: number;
    panSpeed: number;
    zoomDelta: number;
  };
  cameraGeometry: {
    height: number;
    tilt: number;
    distance: number;
  };
  exposurePlan: {
    exposureValue: number;
    dynamicRange: number;
    noiseRisk: number;
  };
  actorMetrics: {
    actorDistances: number;
    lightCount: number;
    eyeLineDirection: number;
    movementSpeed: number;
    emotionArcPosition: number;
  };
  framingComposition: {
    framingType: FramingType;
    cameraAngleStyle: CameraAngleStyle;
    compositionStyle: CompositionStyle;
    subjectPlacement: SubjectPlacement;
    powerFraming: string;
  };
  technicalControl: {
    headroomRatio: number;
    leadRoomRatio: number;
    framingSymmetryScore: number;
  };
}
