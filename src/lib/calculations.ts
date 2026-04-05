import { InputData, OutputData } from "../types";

export function calculateEV(aperture: number, shutter: number): number {
  // EV = log2( (Aperture²) / Shutter )
  return Math.log2((aperture * aperture) / (1 / shutter));
}

export function calculateDOF(u: number, N: number, c: number, f: number): number {
  // DOF ≈ (2 × u² × N × c) / f²
  // u = subject distance (mm)
  // N = f-number
  // c = circle of confusion (mm)
  // f = focal length (mm)
  return (2 * u * u * N * c) / (f * f);
}

export function calculateCameraSpeed(actorSpeed: number, cameraCoupling: number): number {
  // camera_speed = actor_speed × CameraCoupling
  return actorSpeed * cameraCoupling;
}

export function calculateOffsetDistance(focalLength: number, sensorCropFactor: number, framingRatio: number): number {
  // offset_distance = focal_length × sensor_crop_factor × framing_ratio
  return focalLength * sensorCropFactor * framingRatio;
}

export function calculateDominance(screenHeightRatio: number, verticalPositionWeight: number, eyeLevelBias: number): number {
  // dominance = screen_height_ratio × vertical_position_weight × eye_level_bias
  return screenHeightRatio * verticalPositionWeight * eyeLevelBias;
}

export function calculateShotDuration(rhythm: number, pacingFactor: number): number {
  // shot_duration = 60 / Rhythm × pacing_factor
  return (60 / rhythm) * pacingFactor;
}

export function calculateCutFrequency(intensity: number, energy: number, genreMultiplier: number): number {
  // cut_frequency = Intensity × Energy × genre_multiplier
  return intensity * energy * genreMultiplier;
}

export function calculateCameraShake(stuntDensity: number, intensity: number, handheldFactor: number): number {
  // shake = StuntDensity × Intensity × handheld_factor
  return stuntDensity * intensity * handheldFactor;
}

export function calculateDynamicRange(maxSceneLux: number, minSceneLux: number): number {
  // dynamic_range = log2(max_scene_lux / min_scene_lux)
  return Math.log2(maxSceneLux / minSceneLux);
}

export function calculateCrowdDensity(peopleCount: number, usableArea: number): number {
  // density = people_count / usable_area
  return peopleCount / usableArea;
}

export function calculateSymmetry(leftVisualWeight: number, rightVisualWeight: number): number {
  // symmetry = 1 - |left_visual_weight - right_visual_weight|
  return 1 - Math.abs(leftVisualWeight - rightVisualWeight);
}

export function generateOutput(input: InputData): OutputData {
  const { scene, emotion, cast, camera, choreo, cameraIntent } = input;

  // Constants for calculations
  const circleOfConfusion = 0.03; // Typical for Full Frame
  const sensorCropFactor = camera.sensor === "Full Frame" ? 1 : 1.5;
  const genreMultiplier = scene.genre === "Action" ? 2.5 : scene.genre === "Thriller" ? 1.8 : 1.2;
  const handheldFactor = cameraIntent.rigType === "Handheld" ? 1.5 : 0.5;

  // Calculations
  const ev = calculateEV(camera.aperture, camera.shutter);
  const shotDuration = calculateShotDuration(choreo.rhythm, 1.5);
  const cutFreq = calculateCutFrequency(emotion.intensity, emotion.energy, genreMultiplier);
  const shake = calculateCameraShake(choreo.stuntDensity, emotion.intensity, handheldFactor);

  // Mocking some values for the complex geometry outputs
  const actorDistances = Array.from({ length: cast.actorCount }, () =>
    Array.from({ length: cast.actorCount }, () => Math.random() * 5 + 1)
  );

  return {
    shotSuggestions: {
      cameraFeel: `${emotion.intensity > 0.7 ? "Aggressive and visceral" : "Steady and observational"} with a ${emotion.energy > 0.6 ? "kinetic" : "contemplative"} energy.`,
      lightingMood: `${scene.timeOfDay === "Golden Hour" ? "Warm and directional" : scene.timeOfDay === "Night" ? "High contrast and moody" : "Natural and balanced"} with ${emotion.intensity > 0.8 ? "deep shadows" : "soft transitions"}.`,
      blockingPlan: `${cast.actorCount > 3 ? "Complex multi-layered staging" : "Intimate character-focused blocking"} using ${choreo.pattern.toLowerCase()} movement patterns.`,
    },
    movementPaths: Array.from({ length: cast.actorCount }, (_, i) => ({
      pathType: choreo.pattern,
      pathLength: Math.random() * 10 + 2,
      speed: Math.random() * 3 + 0.5,
      acceleration: Math.random() * 1.5,
    })),
    cameraMotionSync: {
      followStyle: cameraIntent.shotType === "Follow" ? "Tight Tracking" : "Loose Observational",
      cameraSpeed: calculateCameraSpeed(2.5, choreo.cameraCoupling),
      offsetDistance: calculateOffsetDistance(camera.focal, sensorCropFactor, 0.4),
    },
    blockingEvolution: {
      densityMap: "High concentration in center stage, radiating outwards.",
      spacingTimeline: "Compression during climax, expansion during resolution.",
      stageZones: "Zone A: Primary interaction, Zone B: Background depth.",
      focusZones: "Focus shifted to character eye-lines and key props.",
    },
    interactionGeometry: {
      actorDistances,
      relativeOrientation: actorDistances.map(row => row.map(() => Math.random() * 360)),
      powerPositions: ["Center Stage", "Elevated Platform", "Foreground Left"],
      dominanceShift: calculateDominance(0.6, 0.8, emotion.dominance),
    },
    stuntLayout: {
      stuntCount: Math.ceil(cast.actorCount * choreo.stuntDensity),
      stuntZones: "Perimeter zones for impact, central zone for choreography.",
      safetyRadius: 2.5,
      collisionRiskZones: "High risk at intersection points of actor paths.",
    },
    crowdFlow: {
      directionVectors: "Convergent towards primary actors.",
      densityHeatmap: "Peak density at 0.7 frame height.",
      speedVariance: 0.35,
    },
    choreoInfluence: {
      cameraShake: shake,
      shotDuration: shotDuration,
      cutFrequency: cutFreq,
      lensBreathingBias: emotion.intensity * 0.2,
      cameraHeightMod: emotion.dominance * 0.5,
    },
    lightingGeometry: {
      keyAngle: 45,
      fillAngle: -30,
      backAngle: 135,
      lightHeight: 2.8,
      shadowHardness: emotion.intensity,
      colorTemperature: camera.wb,
    },
    cameraMotionMetrics: {
      speed: calculateCameraSpeed(1.5, choreo.cameraCoupling),
      panSpeed: emotion.energy * 20,
      zoomDelta: emotion.intensity * 5,
    },
    cameraGeometry: {
      height: 1.6 + (emotion.dominance * 0.4),
      tilt: -5 * emotion.dominance,
      distance: camera.focal / 10,
    },
    exposurePlan: {
      exposureValue: ev,
      dynamicRange: calculateDynamicRange(1000, 10),
      noiseRisk: camera.iso > 1600 ? 0.8 : 0.1,
    },
    actorMetrics: {
      actorDistances: 3.5,
      lightCount: Math.ceil(cast.actorCount / 2) + 2,
      eyeLineDirection: 15,
      movementSpeed: 1.2,
      emotionArcPosition: emotion.intensity,
    },
    framingComposition: {
      framingType: camera.focal > 50 ? "Close-up" : "Medium",
      cameraAngleStyle: emotion.dominance > 0.5 ? "Low" : emotion.dominance < -0.5 ? "High" : "Eye-level",
      compositionStyle: "Rule of thirds",
      subjectPlacement: "Right third",
      powerFraming: emotion.dominance > 0 ? "Dominant elevated" : "Submissive low",
    },
    technicalControl: {
      headroomRatio: 0.15,
      leadRoomRatio: 0.25,
      framingSymmetryScore: calculateSymmetry(0.4, 0.6),
    },
  };
}
