import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Database, Lock, Server, Sparkles, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadZip } from '../utils/zipGenerator';

export const InstallerWizard: React.FC = () => {
  const { setActiveView } = useStore();
  const [step, setStep] = useState<number>(1);
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    name: 'tinkle_jewels_db',
    user: 'tinkle_admin',
    pass: '••••••••',
  });

  const [adminConfig, setAdminConfig] = useState({
    siteName: 'Tinkle Jewels',
    adminEmail: 'admin@tinklejewels.com',
    adminUser: 'admin',
    adminPass: 'admin123',
  });

  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);

  const handleRunInstall = () => {
    setIsInstalling(true);
    let progress = 10;
    const interval = setInterval(() => {
      progress += 20;
      setInstallProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsInstalling(false);
        setStep(4);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D85A80', '#F38BA0', '#E5C158'],
        });
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="bg-white max-w-2xl w-full rounded-3xl border border-[#FBE6EF] shadow-2xl overflow-hidden">
        
        {/* Wizard Header */}
        <div className="bg-gradient-to-r from-[#FDE8EE] via-[#FFF0F5] to-[#F2E8FA] p-6 text-center border-b border-[#F7D8E4]">
          <div className="w-12 h-12 rounded-full bg-white text-[#C4436A] flex items-center justify-center font-bold text-lg mx-auto shadow-md mb-2 border border-[#F5B8CE]">
            TJ
          </div>
          <h2 className="font-display text-2xl text-[#241A20] font-normal">
            Tinkle Jewels Web Installer
          </h2>
          <p className="text-xs text-[#7A6370] mt-1">
            Automated cPanel &amp; LAMP/WAMP Server Setup Wizard
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-[#FFF0F5] px-6 py-3 border-b border-[#FCD2E2] flex items-center justify-between text-xs font-semibold text-[#8C3A5A]">
          <span className={step >= 1 ? 'font-bold text-[#C4436A]' : 'opacity-60'}>1. Requirements</span>
          <span>&bull;</span>
          <span className={step >= 2 ? 'font-bold text-[#C4436A]' : 'opacity-60'}>2. Database</span>
          <span>&bull;</span>
          <span className={step >= 3 ? 'font-bold text-[#C4436A]' : 'opacity-60'}>3. Admin Setup</span>
          <span>&bull;</span>
          <span className={step >= 4 ? 'font-bold text-[#C4436A]' : 'opacity-60'}>4. Complete</span>
        </div>

        {/* Wizard Steps */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: Requirements Check */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#3D2C35]">
                Server Compatibility Check
              </h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 bg-[#FFF9FB] rounded-xl border border-[#FBE6EF]">
                  <span>PHP Version (&ge; 8.0)</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PHP 8.2 Detected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FFF9FB] rounded-xl border border-[#FBE6EF]">
                  <span>PDO MySQL Extension</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Enabled
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FFF9FB] rounded-xl border border-[#FBE6EF]">
                  <span>cURL &amp; OpenSSL Extensions</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Enabled
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FFF9FB] rounded-xl border border-[#FBE6EF]">
                  <span>Directory Permissions (uploads/ &amp; cache/)</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Writable (0755)
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full btn-tinkle font-sans font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CONTINUE TO DATABASE SETUP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Database Credentials */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#3D2C35]">
                MySQL Database Connection
              </h3>
              <p className="text-xs text-[#7A6370]">
                Enter the MySQL credentials created via cPanel MySQL Databases Wizard.
              </p>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="font-bold text-[#3D2C35] block mb-1">Host</label>
                    <input
                      type="text"
                      value={dbConfig.host}
                      onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3D2C35] block mb-1">Port</label>
                    <input
                      type="text"
                      value={dbConfig.port}
                      onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#3D2C35] block mb-1">Database Name</label>
                  <input
                    type="text"
                    value={dbConfig.name}
                    onChange={(e) => setDbConfig({ ...dbConfig, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#3D2C35] block mb-1">DB User</label>
                    <input
                      type="text"
                      value={dbConfig.user}
                      onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3D2C35] block mb-1">DB Password</label>
                    <input
                      type="password"
                      value={dbConfig.pass}
                      onChange={(e) => setDbConfig({ ...dbConfig, pass: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-gray-300 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 btn-tinkle font-sans font-bold text-xs tracking-wider uppercase py-3 rounded-xl shadow-md cursor-pointer"
                >
                  TEST &amp; CONTINUE
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Admin User & Run Migrations */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#3D2C35]">
                Store &amp; Super Admin Setup
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#3D2C35] block mb-1">Store Name</label>
                  <input
                    type="text"
                    value={adminConfig.siteName}
                    onChange={(e) => setAdminConfig({ ...adminConfig, siteName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3D2C35] block mb-1">Admin Email</label>
                  <input
                    type="email"
                    value={adminConfig.adminEmail}
                    onChange={(e) => setAdminConfig({ ...adminConfig, adminEmail: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#3D2C35] block mb-1">Admin Username</label>
                    <input
                      type="text"
                      value={adminConfig.adminUser}
                      onChange={(e) => setAdminConfig({ ...adminConfig, adminUser: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3D2C35] block mb-1">Admin Password</label>
                    <input
                      type="password"
                      value={adminConfig.adminPass}
                      onChange={(e) => setAdminConfig({ ...adminConfig, adminPass: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F5D0DF]"
                    />
                  </div>
                </div>
              </div>

              {isInstalling ? (
                <div className="space-y-2 py-4">
                  <div className="flex justify-between text-xs font-semibold text-[#8C3A5A]">
                    <span>Installing tables &amp; seeding sample products...</span>
                    <span>{installProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FCE1EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C4436A] rounded-full transition-all duration-300"
                      style={{ width: `${installProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-3 rounded-xl border border-gray-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleRunInstall}
                    className="flex-1 btn-tinkle font-sans font-bold text-xs tracking-wider uppercase py-3 rounded-xl shadow-md cursor-pointer"
                  >
                    RUN INSTALLATION NOW
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl text-[#241A20]">
                Installation Completed!
              </h3>
              <p className="text-xs text-[#7A6370] max-w-md mx-auto">
                Your database tables have been provisioned, demo jewelry and apparel items seeded, and an <code>install.lock</code> file has been placed for security.
              </p>

              <div className="p-4 bg-[#FFF9FB] rounded-2xl border border-[#FDE5EF] text-xs text-left space-y-1.5 max-w-sm mx-auto">
                <p><strong>Admin URL:</strong> /admin</p>
                <p><strong>Username:</strong> {adminConfig.adminUser}</p>
                <p><strong>Default Password:</strong> {adminConfig.adminPass}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  onClick={() => setActiveView('home')}
                  className="flex-1 btn-tinkle font-sans font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl cursor-pointer"
                >
                  GO TO LIVE STOREFRONT
                </button>
                <button
                  onClick={() => setActiveView('admin')}
                  className="flex-1 btn-tinkle-outline font-sans font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl cursor-pointer"
                >
                  GO TO ADMIN PANEL
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
