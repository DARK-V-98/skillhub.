'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw';
import { ExcalidrawElement, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/element/types';
import { AppState } from '@excalidraw/excalidraw/types/types';
import { Firestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';
import { useDebouncedCallback } from 'use-debounce';

interface WhiteboardProps {
  roomId: string;
  firestore: Firestore;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ roomId, firestore }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const { user } = useUser();

  const whiteboardRef = doc(firestore, 'studyRooms', roomId, 'whiteboard', 'data');

  useEffect(() => {
    if (!excalidrawAPI) return;

    const unsubscribe = onSnapshot(whiteboardRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const incomingElements = data.elements as ExcalidrawElement[];
        const currentElements = excalidrawAPI.getSceneElements();

        // Simple check to prevent re-rendering if elements are the same
        if (JSON.stringify(incomingElements) !== JSON.stringify(currentElements)) {
          excalidrawAPI.updateScene({ elements: incomingElements });
        }
      }
    });

    return () => unsubscribe();
  }, [excalidrawAPI, whiteboardRef]);

  const debouncedSave = useDebouncedCallback(
    (elements: readonly ExcalidrawElement[]) => {
      if (elements.length > 0) {
        setDoc(whiteboardRef, { elements: JSON.parse(JSON.stringify(elements)) });
      }
    },
    500
  );

  return (
    <div style={{ height: '100%' }}>
      <Excalidraw
        excalidrawAPI={setExcalidrawAPI}
        user={{
            name: user?.displayName || 'Anonymous',
            id: user?.uid
        }}
        onChange={(elements) => debouncedSave(elements)}
        UIOptions={{
            canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                saveAsImage: false,
                clearCanvas: true
            }
        }}
        theme='dark'
      />
    </div>
  );
};

export default Whiteboard;
