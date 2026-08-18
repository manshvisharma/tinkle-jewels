import React, { useState } from 'react';
import { phpFilesDictionary } from '../data/phpCodebase';
import { X, FileCode, Folder, Copy, Check, Download } from 'lucide-react';
import { downloadZip } from '../utils/zipGenerator';

interface PhpInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhpInspectorModal: React.FC<PhpInspectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('index.php');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fileList = Object.keys(phpFilesDictionary);
  const currentContent = phpFilesDictionary[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#1E1E2E] text-[#CDD6F4] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-[#313244] flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-4 bg-[#181825] border-b border-[#313244] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#F38BA8]" />
            <h3 className="font-mono text-sm font-bold text-[#CDD6F4]">
              cPanel PHP / MySQL Source Code Explorer &bull; {fileList.length} Files Ready
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadZip()}
              className="bg-[#F38BA8] hover:bg-[#F5C2E7] text-[#11111B] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#6C7086] hover:text-[#CDD6F4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* File Tree Left */}
          <div className="w-64 bg-[#181825] border-r border-[#313244] overflow-y-auto p-3 space-y-1 text-xs font-mono">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#6C7086] px-2 py-1 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#F9E2AF]" />
              <span>tinkle-jewels-bundle/</span>
            </div>

            {fileList.map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                  selectedFile === filename
                    ? 'bg-[#313244] text-[#F5C2E7] font-bold'
                    : 'text-[#A6ADC8] hover:bg-[#1E1E2E] hover:text-[#CDD6F4]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">{filename}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Right */}
          <div className="flex-1 flex flex-col bg-[#1E1E2E] overflow-hidden">
            {/* Action Bar */}
            <div className="px-4 py-2 bg-[#11111B] border-b border-[#313244] flex items-center justify-between text-xs font-mono">
              <span className="text-[#89B4FA]">{selectedFile}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#A6ADC8] hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <pre className="flex-1 p-4 overflow-auto text-xs font-mono leading-relaxed text-[#CDD6F4] select-text">
              <code>{currentContent}</code>
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
