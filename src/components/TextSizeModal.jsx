import React from 'react';
import { X, Type } from 'lucide-react';

export default function TextSizeModal({ currentSize, onSizeChange, onClose, theme, nativeLang }) {
  const isMl = nativeLang?.id === 'ml';
  const sizes = [
    { id: 'small', label: 'Small / ചെറുത്', iconClass: 'text-sm font-medium' },
    { id: 'medium', label: 'Medium / ഇടത്തരം', iconClass: 'text-base font-semibold' },
    { id: 'large', label: 'Large / വലുത്', iconClass: 'text-xl font-bold' },
    { id: 'xlarge', label: 'Extra Large / ഏറ്റവും വലുത്', iconClass: 'text-2xl font-black' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme.cardBg} w-full max-w-sm rounded-3xl p-6 shadow-2xl relative`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <Type className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            {isMl ? 'അക്ഷര വലിപ്പം മാറ്റുക' : 'Adjust Text Size'}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {sizes.map(size => (
            <button
              key={size.id}
              onClick={() => {
                onSizeChange(size.id);
                onClose();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                currentSize === size.id 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <span className={size.iconClass}>{size.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
