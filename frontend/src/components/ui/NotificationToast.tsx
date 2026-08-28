import React from 'react';
import { useAppStore } from '../../store/appStore';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 3).map((n) => {
          const isSuccess = n.type === 'success';
          const isError = n.type === 'error';
          const isWarning = n.type === 'warning';

          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-white border-[1.5px] border-[#0F172A] rounded-2xl shadow-xl p-3.5 flex items-start gap-2.5 text-[#0F172A]"
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isError && <XCircle className="w-4 h-4 text-rose-600" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-[#6C84A3]" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold font-display leading-tight">{n.title}</p>
                <p className="text-[11px] text-slate-500 font-tech mt-0.5 leading-snug line-clamp-2">{n.message}</p>
              </div>

              <button
                type="button"
                onClick={() => removeNotification(n.id)}
                className="shrink-0 text-slate-400 hover:text-black transition-colors p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
