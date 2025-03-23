'use client';

import { useState, useEffect, useRef } from 'react';

const SDK_KEY = process.env.NEXT_PUBLIC_MATTER_PORT_SDK ?? '';

export const MapFrame = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const mapRef = useRef<HTMLIFrameElement>(null);
  const maxAttempts = 3;

  useEffect(() => {
    const connectMatterport = async () => {
      if (!mapRef.current) {
        console.log("iframe not ready");
        return;
      }

      if (!(window as any).MP_SDK) {
        console.log('SDK not loaded');
        if (connectionAttempts < maxAttempts) {
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
          }, 2000);
        } else {
          setHasError(true);
          setIsConnecting(false);
          console.error('Failed connect SDK after several attempts');
        }
        return;
      }

      try {
        console.log('Retry connection to SDK...');
        const sdk = await (window as any).MP_SDK.connect(
          mapRef.current,
          SDK_KEY,
          ''
        );
        
        console.log('SDK connection success');
        
        // Ждем, пока приложение будет готово к работе
        await sdk.App.state.waitUntil(state => state.phase === sdk.App.Phase.PLAYING);
        
        // Добавляем тег
        const tagId = await sdk.Tag.add({
          label: 'Office',
          description: 'Office',
          anchorPosition: { x: 0, y: 0, z: 0 }, // Позиция тега в пространстве
          stemVector: { x: 0, y: 1, z: 0 }, // Направление стебля тега
          color: { r: 1, g: 0, b: 0 }, // Красный цвет
          billboard: {
            htmlContent: '<div style="background: white; padding: 10px; border-radius: 5px;">Office</div>'
          }
        });

        console.log('Tag added successfully:', tagId);
        setIsConnecting(false);

      } catch (error) {
        console.error('Error connecting to SDK:', error);
        setHasError(true);
        setIsConnecting(false);
      }
    };

    connectMatterport();
  }, [connectionAttempts]);

  if (hasError) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: 'red' 
      }}>
        Connection Error Matterport SDK. Please, update page.
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {isConnecting && (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            color: 'white'
        }}>
          Connection to Matterport... Try {connectionAttempts + 1} from {maxAttempts}
        </div>
      )}
      <iframe
        ref={mapRef}
        src="/bundle/showcase.html?m=m72PGKzeknR&applicationKey=295ba0c0f04541318359a8e75af33043"
        allow="fullscreen; vr"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0
        }}
      />
    </div>
  );
};
