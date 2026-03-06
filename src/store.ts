import { create } from 'zustand';

export interface ParachuteParams {
  mass: number; // grams
  dragCoefficient: number; // Cd
  referenceArea: number; // m²
  deploymentAltitude: number; // m
  targetVelocity: number; // m/s (for design mode)
  airDensity: number; // kg/m³
  hasHole: boolean; // buraco no paraquedas
  holeRadius: number; // raio da chaminé em cm
}

export interface SimulationResult {
  time: number; // s
  altitude: number; // m
  velocity: number; // m/s
  acceleration: number; // m/s²
  terminalVelocity: number; // m/s
}

interface Store {
  params: ParachuteParams;
  results: SimulationResult[];
  updateParams: (updates: Partial<ParachuteParams>) => void;
  runSimulation: () => void;
  calculateTerminalVelocity: () => number;
  calculateDesignParameters: (targetVelocity: number) => Partial<ParachuteParams>;
  loadExistingParachuteData: () => ExistingParachuteData;
  saveExistingParachuteData: (data: ExistingParachuteData) => void;
}

const G = 9.81; // m/s²
const DEFAULT_AIR_DENSITY = 1.225; // kg/m³

const calculateTerminalVelocity = (params: ParachuteParams): number => {
  // Vt = sqrt((2 * m * g) / (ρ * Cd * A_efetiva))
  const massKg = params.mass / 1000; // convert grams to kg
  
  // Calcular área efetiva (paraquedas - chaminé)
  const areaCm2 = params.referenceArea * 10000;
  const holeAreaCm2 = Math.PI * Math.pow(params.holeRadius, 2);
  const effectiveAreaCm2 = params.hasHole ? areaCm2 - holeAreaCm2 : areaCm2;
  const effectiveAreaM2 = effectiveAreaCm2 / 10000; // convert to m²
  
  const numerator = 2 * massKg * G;
  const denominator = params.airDensity * params.dragCoefficient * effectiveAreaM2;
  return Math.sqrt(numerator / denominator);
};

const calculateDragForce = (velocity: number, params: ParachuteParams): number => {
  // F_drag = 0.5 * ρ * v² * Cd * A
  return 0.5 * params.airDensity * Math.pow(velocity, 2) * params.dragCoefficient * params.referenceArea;
};

const runParachuteSimulation = (params: ParachuteParams): SimulationResult[] => {
  const dt = 0.01; // time step in seconds
  const results: SimulationResult[] = [];
  
  const massKg = params.mass / 1000; // convert grams to kg
  
  // Calcular área efetiva
  const areaCm2 = params.referenceArea * 10000;
  const holeAreaCm2 = Math.PI * Math.pow(params.holeRadius, 2);
  const effectiveAreaCm2 = params.hasHole ? areaCm2 - holeAreaCm2 : areaCm2;
  const effectiveAreaM2 = effectiveAreaCm2 / 10000;
  
  let time = 0;
  let altitude = params.deploymentAltitude;
  let velocity = 0;
  
  while (altitude > 0) {
    const terminalVelocity = calculateTerminalVelocity(params);
    const dragForce = 0.5 * params.airDensity * Math.pow(velocity, 2) * params.dragCoefficient * effectiveAreaM2;
    const weightForce = massKg * G;
    const netForce = weightForce - dragForce;
    const acceleration = netForce / massKg;
    
    results.push({
      time,
      altitude,
      velocity,
      acceleration,
      terminalVelocity,
    });
    
    // Simple Euler integration
    velocity += acceleration * dt;
    altitude -= velocity * dt;
    time += dt;
    
    // Safety break
    if (time > 1000) break;
  }
  
  return results;
};

const loadParamsFromStorage = (): ParachuteParams => {
  try {
    const saved = localStorage.getItem('parachuteParams');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load params from storage:', e);
  }
  
  return {
    mass: 1000,
    dragCoefficient: 0.78,
    referenceArea: 0.28,
    deploymentAltitude: 700,
    targetVelocity: 5,
    airDensity: DEFAULT_AIR_DENSITY,
    hasHole: false,
    holeRadius: 5,
  };
};

const saveParamsToStorage = (params: ParachuteParams) => {
  try {
    localStorage.setItem('parachuteParams', JSON.stringify(params));
  } catch (e) {
    console.error('Failed to save params to storage:', e);
  }
};

// Existing Parachute Data Storage
export interface ExistingParachuteData {
  totalMass: number; // g
  parachuteArea: number; // cm²
  dragCoefficient: number;
  hasHole: boolean;
  holeRadius: number; // cm
  deploymentAltitude: number; // m
  airDensity: number; // kg/m³
}

const loadExistingParachuteDataFromStorage = (): ExistingParachuteData => {
  try {
    const saved = localStorage.getItem('existingParachuteData');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load existing parachute data from storage:', e);
  }

  return {
    totalMass: 1000,
    parachuteArea: 2800,
    dragCoefficient: 0.78,
    hasHole: false,
    holeRadius: 5,
    deploymentAltitude: 700,
    airDensity: DEFAULT_AIR_DENSITY,
  };
};

const saveExistingParachuteDataToStorage = (data: ExistingParachuteData) => {
  try {
    localStorage.setItem('existingParachuteData', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save existing parachute data to storage:', e);
  }
};

export const useStore = create<Store>((set, get) => ({
  params: loadParamsFromStorage(),
  results: [],
  
  updateParams: (updates) => {
    set((state) => {
      const newParams = { ...state.params, ...updates };
      saveParamsToStorage(newParams);
      return { params: newParams };
    });
    // Auto-run simulation when params change
    get().runSimulation();
  },
  
  runSimulation: () => {
    const state = get();
    const results = runParachuteSimulation(state.params);
    set({ results });
  },
  
  calculateTerminalVelocity: () => {
    return calculateTerminalVelocity(get().params);
  },
  
  calculateDesignParameters: (targetVelocity: number) => {
    const params = get().params;
    const massKg = params.mass / 1000;
    
    // Given target velocity, calculate required area
    // Vt = sqrt((2 * m * g) / (ρ * Cd * A_efetiva))
    // A_efetiva = (2 * m * g) / (ρ * Cd * Vt²)
    
    const requiredEffectiveArea = (2 * massKg * G) / (params.airDensity * params.dragCoefficient * Math.pow(targetVelocity, 2));
    
    // Convert back to m² (it's already in m²)
    // If no hole, required area = required effective area
    // If hole exists, need to account for it
    
    if (params.hasHole) {
      const holeAreaM2 = (Math.PI * Math.pow(params.holeRadius, 2)) / 10000;
      const requiredTotalArea = requiredEffectiveArea + holeAreaM2;
      return {
        referenceArea: requiredTotalArea,
        dragCoefficient: params.dragCoefficient,
      };
    } else {
      return {
        referenceArea: requiredEffectiveArea,
        dragCoefficient: params.dragCoefficient,
      };
    }
  },
  
  loadExistingParachuteData: () => {
    return loadExistingParachuteDataFromStorage();
  },
  
  saveExistingParachuteData: (data) => {
    saveExistingParachuteDataToStorage(data);
  },
}));
