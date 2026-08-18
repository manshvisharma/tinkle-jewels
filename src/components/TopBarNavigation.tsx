import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Download, LayoutDashboard, ShoppingBag, Terminal, Sparkles, CheckCircle2, Code2, Layers } from 'lucide-react';
import { generateProductionZip } from '../utils/zipGenerator';
import confetti from 'canvas-confetti';

interface TopBarNavigationProps {
  onOpenPhpInspector?: () => void;
}

export const TopBarNavigation: React.FC<TopBarNavigationProps> = ({ onOpenPhpInspector }) => {
  const { activeView, setActiveView, cartCount, wishlist } = useStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(10);
      setCurrentFile('Initializing ZIP archive...');

      const zipBlob = await generateProductionZip((percent, file) => {
        setDownloadProgress(percent);
        setCurrentFile(file);
      });

      // Trigger browser download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tinkle-jewels-php-ecommerce-v1.0.0.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      setDownloadSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.1 },
        colors: ['#D85A80', '#F38BA0', '#E5C158', '#D8B4E2'],
      });

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
      setIsDownloading(false);
    }
  };

  return (
    <header className="bg-[#241A20] text-[#F7E7ED] border-b border-[#3D2934] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Mode Badge & Quick Status */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F38BA0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F38BA0]"></span>
          </span>
          <span className="font-semibold tracking-wider text-[#FFD6E5] uppercase text-[11px]">
            Tinkle Jewels Commercial PHP Script
          </span>
          <span className="hidden sm:inline-block bg-[#3D2934] text-[#E5A4BD] text-[10px] px-2 py-0.5 rounded-full font-mono">
            v1.0.0 cPanel Ready
          </span>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center bg-[#1A1217] rounded-lg p-1 border border-[#3D2934] overflow-x-auto">
          <button
            id="nav-btn-storefront"
            onClick={() => setActiveView('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'home' || activeView === 'storefront'
                ? 'bg-[#C4436A] text-white shadow-sm'
                : 'text-[#C9B3BE] hover:text-white hover:bg-[#2A1D25]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Store</span>
          </button>

          <button
            id="nav-btn-shop"
            onClick={() => setActiveView('shop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'shop'
                ? 'bg-[#C4436A] text-white shadow-sm'
                : 'text-[#C9B3BE] hover:text-white hover:bg-[#2A1D25]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>

          <button
            id="nav-btn-admin"
            onClick={() => setActiveView('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'admin'
                ? 'bg-[#C4436A] text-white shadow-sm'
                : 'text-[#C9B3BE] hover:text-white hover:bg-[#2A1D25]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin CMS</span>
          </button>

          <button
            id="nav-btn-installer"
            onClick={() => setActiveView('installer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'installer'
                ? 'bg-[#C4436A] text-white shadow-sm'
                : 'text-[#C9B3BE] hover:text-white hover:bg-[#2A1D25]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>/install Wizard</span>
          </button>

          <button
            id="nav-btn-php-source"
            onClick={() => {
              if (onOpenPhpInspector) onOpenPhpInspector();
              else setActiveView('php-source');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'php-source'
                ? 'bg-[#C4436A] text-white shadow-sm'
                : 'text-[#C9B3BE] hover:text-white hover:bg-[#2A1D25]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>PHP Code</span>
          </button>
        </div>

        {/* Right: ZIP Download Button */}
        <div className="flex items-center gap-2">
          {downloadSuccess ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Downloaded ZIP!</span>
            </div>
          ) : (
            <button
              id="btn-download-cpanel-zip"
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-gradient-to-r from-[#D85A80] to-[#C4436A] hover:from-[#C4436A] hover:to-[#AD3357] text-white font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-all hover:scale-102 cursor-pointer disabled:opacity-60"
              title="Download full PHP MVC & MySQL zip file ready for cPanel File Manager"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? `Packaging (${downloadProgress}%)` : 'Download cPanel ZIP'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar when packaging */}
      {isDownloading && (
        <div className="w-full bg-[#181115] border-t border-[#3D2934] px-4 py-1.5 text-[11px] text-[#C9B3BE] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="animate-spin text-[#F38BA0]">⚙️</span>
            <span className="truncate">{currentFile}</span>
          </div>
          <span className="font-mono text-[#F38BA0] font-bold shrink-0">{downloadProgress}%</span>
        </div>
      )}
    </header>
  );
};
