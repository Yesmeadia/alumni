// components/dashboard/PrintProfileHeader.tsx
'use client';

import React from 'react';

interface PrintProfileHeaderProps {
  id: string;
}

const PrintProfileHeader: React.FC<PrintProfileHeaderProps> = ({ id }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6 w-full text-left">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
      </div>
      <div className="text-right">
        <p className="text-[9px] font-bold text-slate-400 uppercase">
          ISSUED: {mounted ? new Date().toLocaleDateString() : 'LOADING...'}
        </p>
      </div>
    </div>
  );
};

export default PrintProfileHeader;
