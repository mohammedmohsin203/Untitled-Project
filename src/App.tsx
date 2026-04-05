import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  Film, 
  Users, 
  Activity, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  CheckCircle2,
  Settings,
  Eye,
  Maximize2,
  Layers,
  Thermometer,
  Sun,
  Wind,
  CloudRain,
  Compass
} from "lucide-react";
import { InputData, OutputData, Genre, Location, TimeOfDay, SensorSize, InteractionType, MotionPattern, CameraMovementType, RigType, PathType, ShotType } from "./types";
import { generateOutput } from "./lib/calculations";
import { cn } from "./lib/utils";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

const STEPS = [
  { id: "scene", title: "Scene Context", icon: Film },
  { id: "emotion", title: "Emotional State", icon: Activity },
  { id: "cast", title: "Cast & Set", icon: Users },
  { id: "camera", title: "Camera Specs", icon: Camera },
  { id: "choreo", title: "Choreo Intent", icon: Zap },
  { id: "intent", title: "Camera Intent", icon: Settings },
];

const INITIAL_DATA: InputData = {
  scene: {
    title: "",
    description: "",
    genre: "Action",
    location: "Interior",
    timeOfDay: "Day",
  },
  emotion: {
    energy: 0.5,
    intensity: 0.5,
    dominance: 0,
    toneTags: [],
  },
  cast: {
    actorCount: 1,
    objectCount: 0,
    heights: [175],
    primaryCount: 1,
    backgroundCount: 0,
    crowdDensity: 0,
    setDepth: 10,
  },
  camera: {
    focal: 35,
    aperture: 2.8,
    iso: 800,
    shutter: 120,
    fps: 24,
    sensor: "Full Frame",
    aspect: "2.39:1",
    wb: 5600,
    log: true,
  },
  choreo: {
    interactionType: "Dialogue",
    pattern: "Linear",
    direction: { x: 1, y: 0 },
    rhythm: 100,
    stuntDensity: 0,
    cameraCoupling: 0.5,
  },
  cameraIntent: {
    movementType: "Static",
    rigType: "Tripod",
    pathType: "Linear",
    shotType: "Medium",
  },
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<InputData>(INITIAL_DATA);
  const [output, setOutput] = useState<OutputData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (section: keyof InputData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const results = generateOutput(formData);
      setOutput(results);
      setIsGenerating(false);
    }, 1500);
  };

  const downloadPDF = async () => {
    if (!resultsRef.current || isExporting) return;
    
    try {
      setIsExporting(true);
      
      // Wait a bit for any layout shifts to settle
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use html-to-image for better CSS support (OKLCH) and stability
      const imgData = await toPng(resultsRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Scale to fit width, and handle height
      let finalWidth = pdfWidth;
      let finalHeight = imgHeight;

      pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight, undefined, 'FAST');
      pdf.save(`${formData.scene.title.replace(/\s+/g, '-').toLowerCase() || "previz-plan"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderStep = () => {
    const step = STEPS[currentStep];
    
    switch (step.id) {
      case "scene":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Scene Title</label>
              <input
                type="text"
                value={formData.scene.title}
                onChange={(e) => handleInputChange("scene", "title", e.target.value)}
                placeholder="e.g. Warehouse Chase"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={formData.scene.description}
                onChange={(e) => handleInputChange("scene", "description", e.target.value)}
                placeholder="Describe the scene summary..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none h-32 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Genre</label>
                <select
                  value={formData.scene.genre}
                  onChange={(e) => handleInputChange("scene", "genre", e.target.value as Genre)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Action">Action</option>
                  <option value="Drama">Drama</option>
                  <option value="Thriller">Thriller</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Location</label>
                <select
                  value={formData.scene.location}
                  onChange={(e) => handleInputChange("scene", "location", e.target.value as Location)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Time of Day</label>
                <select
                  value={formData.scene.timeOfDay}
                  onChange={(e) => handleInputChange("scene", "timeOfDay", e.target.value as TimeOfDay)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                  <option value="Golden Hour">Golden Hour</option>
                </select>
              </div>
            </div>
          </div>
        );
      case "emotion":
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Energy Level ({formData.emotion.energy})</label>
                <span className="text-xs text-slate-400">0.0 — 1.0</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.emotion.energy}
                onChange={(e) => handleInputChange("emotion", "energy", parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Intensity ({formData.emotion.intensity})</label>
                <span className="text-xs text-slate-400">0.0 — 1.0</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.emotion.intensity}
                onChange={(e) => handleInputChange("emotion", "intensity", parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Dominance ({formData.emotion.dominance})</label>
                <span className="text-xs text-slate-400">-1.0 — +1.0</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={formData.emotion.dominance}
                onChange={(e) => handleInputChange("emotion", "dominance", parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tone Tags (comma separated)</label>
              <input
                type="text"
                value={formData.emotion.toneTags.join(", ")}
                onChange={(e) => handleInputChange("emotion", "toneTags", e.target.value.split(",").map(t => t.trim()))}
                placeholder="e.g. Tense, Gritty, Urgent"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        );
      case "cast":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Actor Count</label>
              <input
                type="number"
                value={formData.cast.actorCount}
                onChange={(e) => handleInputChange("cast", "actorCount", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Object/Prop Count</label>
              <input
                type="number"
                value={formData.cast.objectCount}
                onChange={(e) => handleInputChange("cast", "objectCount", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Primary Actors</label>
              <input
                type="number"
                value={formData.cast.primaryCount}
                onChange={(e) => handleInputChange("cast", "primaryCount", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Set Depth (meters)</label>
              <input
                type="number"
                value={formData.cast.setDepth}
                onChange={(e) => handleInputChange("cast", "setDepth", parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="col-span-full space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Crowd Density ({formData.cast.crowdDensity})</label>
                <span className="text-xs text-slate-400">0.0 — 1.0</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.cast.crowdDensity}
                onChange={(e) => handleInputChange("cast", "crowdDensity", parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        );
      case "camera":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Focal Length (mm)</label>
              <input
                type="number"
                value={formData.camera.focal}
                onChange={(e) => handleInputChange("camera", "focal", parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Aperture (f-stop)</label>
              <input
                type="number"
                step="0.1"
                value={formData.camera.aperture}
                onChange={(e) => handleInputChange("camera", "aperture", parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">ISO</label>
              <input
                type="number"
                value={formData.camera.iso}
                onChange={(e) => handleInputChange("camera", "iso", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Shutter (1/x sec)</label>
              <input
                type="number"
                value={formData.camera.shutter}
                onChange={(e) => handleInputChange("camera", "shutter", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sensor Size</label>
              <select
                value={formData.camera.sensor}
                onChange={(e) => handleInputChange("camera", "sensor", e.target.value as SensorSize)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Full Frame">Full Frame</option>
                <option value="Super 35">Super 35</option>
                <option value="APS-C">APS-C</option>
                <option value="Micro Four Thirds">Micro Four Thirds</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">White Balance (K)</label>
              <input
                type="number"
                value={formData.camera.wb}
                onChange={(e) => handleInputChange("camera", "wb", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        );
      case "choreo":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Interaction Type</label>
                <select
                  value={formData.choreo.interactionType}
                  onChange={(e) => handleInputChange("choreo", "interactionType", e.target.value as InteractionType)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Combat">Combat</option>
                  <option value="Dialogue">Dialogue</option>
                  <option value="Chase">Chase</option>
                  <option value="Suspense">Suspense</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Motion Pattern</label>
                <select
                  value={formData.choreo.pattern}
                  onChange={(e) => handleInputChange("choreo", "pattern", e.target.value as MotionPattern)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Circular">Circular</option>
                  <option value="Linear">Linear</option>
                  <option value="Arc">Arc</option>
                  <option value="Static">Static</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Rhythm (BPM-like: {formData.choreo.rhythm})</label>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="1"
                value={formData.choreo.rhythm}
                onChange={(e) => handleInputChange("choreo", "rhythm", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Stunt Density ({formData.choreo.stuntDensity})</label>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.choreo.stuntDensity}
                onChange={(e) => handleInputChange("choreo", "stuntDensity", parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        );
      case "intent":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Movement Type</label>
              <select
                value={formData.cameraIntent.movementType}
                onChange={(e) => handleInputChange("cameraIntent", "movementType", e.target.value as CameraMovementType)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Static">Static</option>
                <option value="Tracking">Tracking</option>
                <option value="Pan">Pan</option>
                <option value="Tilt">Tilt</option>
                <option value="Dolly">Dolly</option>
                <option value="Crane">Crane</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Rig Type</label>
              <select
                value={formData.cameraIntent.rigType}
                onChange={(e) => handleInputChange("cameraIntent", "rigType", e.target.value as RigType)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Steadicam">Steadicam</option>
                <option value="Tripod">Tripod</option>
                <option value="Handheld">Handheld</option>
                <option value="Gimbal">Gimbal</option>
                <option value="Dolly">Dolly</option>
                <option value="Crane">Crane</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Shot Type</label>
              <select
                value={formData.cameraIntent.shotType}
                onChange={(e) => handleInputChange("cameraIntent", "shotType", e.target.value as ShotType)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Reveal">Reveal</option>
                <option value="Follow">Follow</option>
                <option value="Establishing">Establishing</option>
                <option value="Close-up">Close-up</option>
                <option value="Medium">Medium</option>
                <option value="Wide">Wide</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Path Type</label>
              <select
                value={formData.cameraIntent.pathType}
                onChange={(e) => handleInputChange("cameraIntent", "pathType", e.target.value as PathType)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Arc">Arc</option>
                <option value="Linear">Linear</option>
                <option value="Zigzag">Zigzag</option>
                <option value="Circular">Circular</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (output) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{formData.scene.title || "Untitled Production"}</h1>
              <p className="text-slate-500">Cinematography & Previz Analysis Report</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOutput(null)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 transition-all"
              >
                Edit Plan
              </button>
              <button
                onClick={downloadPDF}
                disabled={isExporting}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200",
                  isExporting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>

          <div ref={resultsRef} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12 space-y-12">
              {/* Header Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Genre</p>
                  <p className="font-semibold text-slate-800">{formData.scene.genre}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-semibold text-slate-800">{formData.scene.location}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time of Day</p>
                  <p className="font-semibold text-slate-800">{formData.scene.timeOfDay}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Camera Rig</p>
                  <p className="font-semibold text-slate-800">{formData.cameraIntent.rigType}</p>
                </div>
              </div>

              {/* Shot Suggestions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Shot Suggestions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Camera Feel</p>
                    <p className="text-slate-700 leading-relaxed">{output.shotSuggestions.cameraFeel}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lighting Mood</p>
                    <p className="text-slate-700 leading-relaxed">{output.shotSuggestions.lightingMood}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Blocking Plan</p>
                    <p className="text-slate-700 leading-relaxed">{output.shotSuggestions.blockingPlan}</p>
                  </div>
                </div>
              </section>

              {/* Technical Metrics */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Maximize2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Technical Metrics</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Exposure Value</p>
                    <p className="text-2xl font-bold text-slate-900">{output.exposurePlan.exposureValue.toFixed(2)} <span className="text-sm font-normal text-slate-400">EV</span></p>
                  </div>
                  <div className="p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Shot Duration</p>
                    <p className="text-2xl font-bold text-slate-900">{output.choreoInfluence.shotDuration.toFixed(1)} <span className="text-sm font-normal text-slate-400">sec</span></p>
                  </div>
                  <div className="p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Camera Height</p>
                    <p className="text-2xl font-bold text-slate-900">{output.cameraGeometry.height.toFixed(2)} <span className="text-sm font-normal text-slate-400">m</span></p>
                  </div>
                  <div className="p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Symmetry Score</p>
                    <p className="text-2xl font-bold text-slate-900">{(output.technicalControl.framingSymmetryScore * 100).toFixed(0)} <span className="text-sm font-normal text-slate-400">%</span></p>
                  </div>
                </div>
              </section>

              {/* Stunt & Choreo */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Stunt & Choreo</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50">
                      <span className="text-slate-600">Stunt Count</span>
                      <span className="font-bold text-slate-900">{output.stuntLayout.stuntCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50">
                      <span className="text-slate-600">Safety Radius</span>
                      <span className="font-bold text-slate-900">{output.stuntLayout.safetyRadius}m</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Risk Zones</span>
                      <p className="text-sm text-slate-700">{output.stuntLayout.collisionRiskZones}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Sun className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Lighting Geometry</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Key Angle</p>
                      <p className="font-bold text-slate-900">{output.lightingGeometry.keyAngle}°</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Color Temp</p>
                      <p className="font-bold text-slate-900">{output.lightingGeometry.colorTemperature}K</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Light Height</p>
                      <p className="font-bold text-slate-900">{output.lightingGeometry.lightHeight}m</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Shadow Hardness</p>
                      <p className="font-bold text-slate-900">{output.lightingGeometry.shadowHardness.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Framing & Composition */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Layers className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Framing & Composition</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Framing Type</p>
                    <p className="font-semibold text-slate-800">{output.framingComposition.framingType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Camera Angle</p>
                    <p className="font-semibold text-slate-800">{output.framingComposition.cameraAngleStyle}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Composition</p>
                    <p className="font-semibold text-slate-800">{output.framingComposition.compositionStyle}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Power Framing</p>
                    <p className="font-semibold text-slate-800">{output.framingComposition.powerFraming}</p>
                  </div>
                </div>
              </section>

              {/* Movement Paths */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Compass className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Movement Paths Per Actor</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">Actor</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">Path Type</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">Length</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">Speed</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">Accel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {output.movementPaths.map((path, i) => (
                        <tr key={i} className="border-b border-slate-50 last:border-0">
                          <td className="py-4 px-4 font-medium text-slate-700">Actor {i + 1}</td>
                          <td className="py-4 px-4 text-slate-600">{path.pathType}</td>
                          <td className="py-4 px-4 text-slate-600">{path.pathLength.toFixed(1)}m</td>
                          <td className="py-4 px-4 text-slate-600">{path.speed.toFixed(1)}m/s</td>
                          <td className="py-4 px-4 text-slate-600">{path.acceleration.toFixed(2)}m/s²</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Production Sheets */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Settings className="w-5 h-5 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Production Sheets</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Stunt Sheet</p>
                      <p className="text-xs text-slate-400">Safety protocols & zoning</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Movement Sheet</p>
                      <p className="text-xs text-slate-400">Actor choreography paths</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">AD Blocking Sheet</p>
                      <p className="text-xs text-slate-400">Staging & timing markers</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Shot List */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Film className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Shot List Preview</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "1.1", type: "Master", description: "Wide establishing shot of the entire scene." },
                    { id: "1.2", type: "Medium", description: "Primary character interaction and dialogue." },
                    { id: "1.3", type: "Close-up", description: "Emotional reaction and key prop interaction." },
                  ].map((shot) => (
                    <div key={shot.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="px-2 py-1 bg-white rounded-md border border-slate-200 text-[10px] font-bold text-slate-500">
                        {shot.id}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{shot.type}</p>
                        <p className="text-xs text-slate-500">{shot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>


        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Previz Planner</h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Industrial Cinematography</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {STEPS.map((step, idx) => (
            <div 
              key={step.id}
              className={cn(
                "flex items-center gap-2 transition-all",
                idx === currentStep ? "text-blue-600" : idx < currentStep ? "text-emerald-500" : "text-slate-400"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                idx === currentStep ? "border-blue-600 bg-blue-50" : idx < currentStep ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
              )}>
                {idx < currentStep ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{step.title}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    {React.createElement(STEPS[currentStep].icon, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{STEPS[currentStep].title}</h2>
                    <p className="text-slate-500 text-sm">Step {currentStep + 1} of {STEPS.length}</p>
                  </div>
                </div>

                {renderStep()}

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                      currentStep === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        {currentStep === STEPS.length - 1 ? "Generate Plan" : "Continue"}
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Weather Intelligence Preview */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <div className="text-[10px] font-bold text-slate-400 uppercase">Atmospheric Haze</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
              <Wind className="w-4 h-4 text-blue-400" />
              <div className="text-[10px] font-bold text-slate-400 uppercase">Wind Motion</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
              <CloudRain className="w-4 h-4 text-slate-400" />
              <div className="text-[10px] font-bold text-slate-400 uppercase">Rain Visibility</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
              <Compass className="w-4 h-4 text-emerald-500" />
              <div className="text-[10px] font-bold text-slate-400 uppercase">Sky Kelvin</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

