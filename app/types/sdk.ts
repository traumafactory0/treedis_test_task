export interface MatterportSDK {
  Sweep: {
    getCurrent: () => Promise<Sweep>;
    on: (event: string, callback: (sweep: Sweep) => void) => void;
  };
}

export interface Sweep {
  position: {
    x: number;
    y: number;
    z: number;
  };
} 