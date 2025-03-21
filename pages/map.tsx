'use client'
import { useState, useEffect, useRef } from 'react';
import { ShowcaseEmbedWindow } from '@/types/sdk';

const SDK_KEY = process.env.NEXT_PUBLIC_MATTER_PORT_SDK ?? '';

const MapPage = () => {
  const showcase = document.getElementById('showcase');
  if (!showcase) return;
  const showcaseWindow = showcase as HTMLIFrameElement;
  showcaseWindow.addEventListener('load', async function() {
    let mpSdk;
    try {
      mpSdk = await (showcaseWindow.contentWindow as any).MP_SDK.connect(showcaseWindow.contentWindow);
    }
    catch(e) {
      console.error(e);
      return;
  }

  console.log('Hello Bundle SDK', mpSdk);
});
  const [ matterWindow, setMatterWindow ] = useState<ShowcaseEmbedWindow>();
  const [ hasError, setHasError ] = useState<boolean>( false );
  const mapRef = useRef<HTMLIFrameElement>( null );

  useEffect(() => {
    setMatterWindow( window as ShowcaseEmbedWindow );
  }, [])
  
  useEffect(() => {

    const connectMatterport = async () => {

      // <--- Validates the HTML Object already exists --->
      if( !mapRef.current ) return;
      // <--- Validates if current window is already set --->
      if( !matterWindow?.MP_SDK ) return;

      try {
        
        await matterWindow.MP_SDK.connect(
          mapRef.current,
          SDK_KEY,
          ''
        );

      } catch ( error ) {
        console.error( error );
        setHasError( true );
      }

    }

    connectMatterport();

  }, [ mapRef, matterWindow ])
  
  // <--- Feel free to add a validation here in case an error ocurred --->
  // <--- It can be done thanks to our local state hasError --->
if( hasError ) return (<>Ups, someting went wrong...</>)

  return (
    <>
    <iframe id="showcase" width="740" height="480" src="/bundle/showcase.html?m=m72PGKzeknR&applicationKey=295ba0c0f04541318359a8e75af33043" frameBorder="0" allowFullScreen allow="vr"></iframe>
    </>
  )

}

export default MapPage