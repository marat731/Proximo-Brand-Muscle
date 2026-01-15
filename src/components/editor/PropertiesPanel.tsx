'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { TemplateElement, SKU } from '@/types';
import {
  Type,
  Image as ImageIcon,
  DollarSign,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Lock,
  Unlock,
  Info,
} from 'lucide-react';
import clsx from 'clsx';

export function PropertiesPanel() {
  const {
    selectedElement,
    updateElement,
    skus,
    currentAsset,
    brands,
  } = useStore();

  const [localText, setLocalText] = useState('');

  // Get brand info for the current template
  const brand = brands.find(
    (b) => b.id === currentAsset?.elements.find((e) => e.type === 'logo')?.content.skuId
  );

  useEffect(() => {
    if (selectedElement?.content.text) {
      setLocalText(selectedElement.content.text);
    }
  }, [selectedElement?.id, selectedElement?.content.text]);

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Select an Element</h3>
          <p className="text-sm text-gray-500">
            Click on an editable element in the canvas to customize its properties.
          </p>
          <div className="mt-6 p-4 bg-proximo-gold/5 rounded-lg text-left">
            <p className="text-xs text-proximo-gold font-medium mb-2">Tip</p>
            <p className="text-xs text-gray-600">
              Elements with a gold outline are editable. Locked elements cannot be modified to maintain brand consistency.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleTextChange = (text: string) => {
    setLocalText(text);
    const constraints = selectedElement.constraints;
    if (constraints?.maxCharacters && text.length > constraints.maxCharacters) {
      return;
    }
    updateElement(selectedElement.id, {
      content: { ...selectedElement.content, text },
    });
  };

  const handleSKUChange = (skuId: string) => {
    const sku = skus.find((s) => s.id === skuId);
    if (sku) {
      updateElement(selectedElement.id, {
        content: {
          ...selectedElement.content,
          imageUrl: sku.imageUrl,
          skuId: sku.id,
        },
      });
    }
  };

  const handleAlignmentChange = (align: 'left' | 'center' | 'right') => {
    updateElement(selectedElement.id, {
      style: { ...selectedElement.style, textAlign: align },
    });
  };

  // Get available SKUs based on constraints
  const availableSKUs = selectedElement.constraints?.allowedSkus
    ? skus.filter((s) => selectedElement.constraints?.allowedSkus?.includes(s.id))
    : skus;

  const elementTypeLabel = {
    text: 'Text',
    price: 'Price',
    image: 'Image',
    logo: 'Logo',
    sku: 'Product',
    shape: 'Shape',
    qr: 'QR Code',
  }[selectedElement.type];

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Editing
          </span>
          {selectedElement.locked ? (
            <Lock className="w-4 h-4 text-gray-400" />
          ) : (
            <Unlock className="w-4 h-4 text-proximo-gold" />
          )}
        </div>
        <h3 className="font-medium text-gray-900">{elementTypeLabel}</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Text Content */}
        {(selectedElement.type === 'text' || selectedElement.type === 'price') &&
          selectedElement.editableProperties.includes('content') && (
            <div>
              <label className="label flex items-center gap-2">
                {selectedElement.type === 'price' ? (
                  <DollarSign className="w-4 h-4" />
                ) : (
                  <Type className="w-4 h-4" />
                )}
                {selectedElement.type === 'price' ? 'Price' : 'Text Content'}
              </label>
              <textarea
                value={localText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={selectedElement.content.placeholder}
                className="input-field resize-none"
                rows={3}
              />
              {selectedElement.constraints?.maxCharacters && (
                <p className="text-xs text-gray-500 mt-1">
                  {localText.length} / {selectedElement.constraints.maxCharacters} characters
                </p>
              )}
            </div>
          )}

        {/* Text Alignment */}
        {(selectedElement.type === 'text' || selectedElement.type === 'price') && (
          <div>
            <label className="label">Alignment</label>
            <div className="flex gap-1">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleAlignmentChange(value as 'left' | 'center' | 'right')}
                  className={clsx(
                    'flex-1 p-2 rounded-lg border transition-colors',
                    selectedElement.style.textAlign === value
                      ? 'border-proximo-gold bg-proximo-gold/10 text-proximo-gold'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SKU Selection */}
        {selectedElement.type === 'sku' &&
          selectedElement.editableProperties.includes('image') && (
            <div>
              <label className="label flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Select Product
              </label>
              <div className="relative">
                <select
                  value={selectedElement.content.skuId || ''}
                  onChange={(e) => handleSKUChange(e.target.value)}
                  className="select-field pr-8 appearance-none"
                >
                  <option value="">Select a product...</option>
                  {availableSKUs.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.name} - {sku.variant}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* SKU Preview Grid */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {availableSKUs.slice(0, 6).map((sku) => (
                  <button
                    key={sku.id}
                    onClick={() => handleSKUChange(sku.id)}
                    className={clsx(
                      'aspect-square rounded-lg border-2 p-1 transition-colors overflow-hidden',
                      selectedElement.content.skuId === sku.id
                        ? 'border-proximo-gold bg-proximo-gold/5'
                        : 'border-gray-200 hover:border-proximo-gold/50'
                    )}
                  >
                    <div
                      className="w-full h-full bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${sku.imageUrl})` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Element Info */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Element Info
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-medium">{elementTypeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Position</span>
              <span className="font-mono text-xs">
                {selectedElement.x}, {selectedElement.y}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Size</span>
              <span className="font-mono text-xs">
                {selectedElement.width} x {selectedElement.height}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Editable</span>
              <span className={selectedElement.editable ? 'text-green-600' : 'text-gray-400'}>
                {selectedElement.editable ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Constraints Info */}
        {selectedElement.constraints && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Constraints</h4>
            <ul className="text-xs text-gray-500 space-y-1">
              {selectedElement.constraints.maxCharacters && (
                <li>Max {selectedElement.constraints.maxCharacters} characters</li>
              )}
              {selectedElement.constraints.minFontSize && (
                <li>Font size: {selectedElement.constraints.minFontSize}-{selectedElement.constraints.maxFontSize}px</li>
              )}
              {selectedElement.constraints.allowedSkus && (
                <li>{selectedElement.constraints.allowedSkus.length} approved products</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
