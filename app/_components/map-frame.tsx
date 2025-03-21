'use client';

import { useState, useEffect, useRef } from 'react';
import { ShowcaseEmbedWindow } from '@/types/sdk';

const SDK_KEY = process.env.NEXT_PUBLIC_MATTER_PORT_SDK ?? '';

export const MapFrame = () => {
  const [matterWindow, setMatterWindow] = useState<ShowcaseEmbedWindow>();
  const [hasError, setHasError] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const mapRef = useRef<HTMLIFrameElement>(null);
  const maxAttempts = 3;

  useEffect(() => {
    const connectMatterport = async () => {
      if (!mapRef.current) {
        console.log('iframe не готов');
        return;
      }

      if (!(window as any).MP_SDK) {
        console.log('SDK не загружен');
        if (connectionAttempts < maxAttempts) {
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
          }, 2000);
        } else {
          setHasError(true);
          setIsConnecting(false);
          console.error('Не удалось загрузить SDK после нескольких попыток');
        }
        return;
      }

      try {
        console.log('Попытка подключения к SDK...');
        const sdk = await (window as any).MP_SDK.connect(
          mapRef.current,
          SDK_KEY,
          ''
        );
        
        console.log('SDK успешно подключен');
        
        // Ждем, пока приложение будет готово к работе
        await sdk.App.state.waitUntil(state => state.phase === sdk.App.Phase.PLAYING);
        
        // Добавляем тег
        const tagId = await sdk.Tag.add({
          label: 'Office',
          description: 'Офисное помещение',
          anchorPosition: { x: 0, y: 0, z: 0 }, // Позиция тега в пространстве
          stemVector: { x: 0, y: 1, z: 0 }, // Направление стебля тега
          color: { r: 1, g: 0, b: 0 }, // Красный цвет
          billboard: {
            htmlContent: '<div style="background: white; padding: 10px; border-radius: 5px;">Office</div>'
          }
        });

        console.log('Тег успешно добавлен:', tagId);
        setIsConnecting(false);

      } catch (error) {
        console.error('Ошибка подключения к SDK:', error);
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
        Ошибка подключения к Matterport SDK. Пожалуйста, обновите страницу.
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
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          Подключение к Matterport... Попытка {connectionAttempts + 1} из {maxAttempts}
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
