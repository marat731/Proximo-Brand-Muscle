'use client';

import React, { useRef, useState } from 'react';
import { useStore } from '@/store';
import { TemplateElement } from '@/types';
import { Lock, Move, Edit3 } from 'lucide-react';
import clsx from 'clsx';

interface EditorCanvasProps {
  scale?: number;
}

export function EditorCanvas({ scale = 1 }: EditorCanvasProps) {
  const { currentAsset, selectedElement, setSelectedElement, updateElement } = useStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!currentAsset) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No template loaded</p>
      </div>
    );
  }

  const handleElementClick = (element: TemplateElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.editable) {
      setSelectedElement(element);
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  const renderElement = (element: TemplateElement) => {
    const isSelected = selectedElement?.id === element.id;
    const isEditable = element.editable;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x * scale,
      top: element.y * scale,
      width: element.width * scale,
      height: element.height * scale,
      transform: `rotate(${element.rotation}deg)`,
      backgroundColor: element.style.backgroundColor,
      borderRadius: element.style.borderRadius
        ? element.style.borderRadius * scale
        : undefined,
      borderWidth: element.style.borderWidth
        ? element.style.borderWidth * scale
        : undefined,
      borderColor: element.style.borderColor,
      borderStyle: element.style.borderWidth ? 'solid' : undefined,
      opacity: element.style.opacity,
    };

    const textStyle: React.CSSProperties = {
      fontFamily: element.style.fontFamily,
      fontSize: element.style.fontSize ? element.style.fontSize * scale : undefined,
      fontWeight: element.style.fontWeight,
      color: element.style.textColor,
      textAlign: element.style.textAlign,
      display: 'flex',
      alignItems: 'center',
      justifyContent:
        element.style.textAlign === 'center'
          ? 'center'
          : element.style.textAlign === 'right'
          ? 'flex-end'
          : 'flex-start',
      padding: 4 * scale,
      lineHeight: 1.2,
      overflow: 'hidden',
    };

    return (
      <div
        key={element.id}
        onClick={(e) => handleElementClick(element, e)}
        className={clsx(
          'transition-all duration-150',
          isEditable && 'cursor-pointer',
          isEditable && !element.locked && 'hover:ring-2 hover:ring-proximo-gold/50',
          isSelected && 'ring-2 ring-proximo-gold',
          !isEditable && 'pointer-events-none'
        )}
        style={baseStyle}
      >
        {/* Locked indicator */}
        {element.locked && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center z-10">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Editable indicator */}
        {isEditable && !element.locked && !isSelected && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-proximo-gold rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100">
            <Edit3 className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Element content based on type */}
        {element.type === 'text' || element.type === 'price' ? (
          <div style={textStyle} className="w-full h-full">
            {element.content.text || element.content.placeholder}
          </div>
        ) : element.type === 'image' ||
          element.type === 'logo' ||
          element.type === 'sku' ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {element.content.imageUrl ? (
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${element.content.imageUrl})` }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                {element.content.placeholder || 'Select image'}
              </div>
            )}
          </div>
        ) : element.type === 'shape' ? (
          <div className="w-full h-full" />
        ) : null}

        {/* Selection handles */}
        {isSelected && (
          <>
            <div className="element-handle -top-1.5 -left-1.5" />
            <div className="element-handle -top-1.5 -right-1.5" />
            <div className="element-handle -bottom-1.5 -left-1.5" />
            <div className="element-handle -bottom-1.5 -right-1.5" />
          </>
        )}
      </div>
    );
  };

  // Calculate canvas dimensions
  const canvasWidth = 400 * scale; // Base width, adjust per template
  const canvasHeight = 300 * scale; // Base height, adjust per template

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 overflow-auto">
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="editor-canvas relative"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Render elements in order (background first) */}
        {currentAsset.elements
          .sort((a, b) => {
            // Sort by type to ensure proper layering
            const typeOrder: Record<string, number> = {
              shape: 0,
              image: 1,
              logo: 2,
              sku: 3,
              text: 4,
              price: 5,
            };
            return (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0);
          })
          .map(renderElement)}
      </div>
    </div>
  );
}
