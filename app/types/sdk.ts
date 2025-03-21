export interface ShowcaseEmbedWindow extends Window {
  MP_SDK: {
    connect: (iframe: HTMLIFrameElement, sdkKey: string, options?: string) => Promise<MatterportSDK>;
  };
}

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