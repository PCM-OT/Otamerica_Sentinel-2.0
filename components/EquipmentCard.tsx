import React from 'react';
import { Eye, MapPin, Calendar, Layers, ArrowRightLeft } from 'lucide-react';
import { Equipment } from '../types';
import { formatDateBR, getDaysUntilExpiry, parseDateSafe } from '../utils';

interface EquipmentCardProps {
  item: Equipment;
  onViewDetails: (item: Equipment) => void;
  statusOverride?: string;
  isTwin?: boolean;
  swapAction?: 'replace' | 'install'; // Nova prop para ação de troca
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ item, onViewDetails, statusOverride, isTwin, swapAction }) => {
  const days = getDaysUntilExpiry(item);
  
  // Initialize default status variables
  let statusColor = 'from-brand-primary to-brand-secondary'; 
  let statusText = 'EM DIA';
  let badgeClass = 'bg-[rgba(16,185,129,0.1)] text-[#34d399] border-[rgba(16,185,129,0.3)]';
  let themeStatus = 'VALIDO'; // VALIDO, ATENCAO, VENCIDO, REPROVADO, OBSOLETO

  // Determine Status Logic
  if (statusOverride === 'Reprovado' || item.status === 'Reprovado') {
    statusColor = 'from-[#ff003c] to-[#ff4d73]'; // Bright neon red gradient
    statusText = 'REPROVADO';
    badgeClass = 'bg-[rgba(255,0,60,0.15)] text-[#ff4d73] border-[rgba(255,0,60,0.4)] shadow-[0_0_10px_rgba(255,0,60,0.2)]';
    themeStatus = 'REPROVADO';
  } else if (statusOverride === 'Obsoleto' || item.status === 'Obsoleto') {
    statusColor = 'from-slate-600 to-slate-700';
    statusText = 'OBSOLETO';
    badgeClass = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    themeStatus = 'OBSOLETO';
  } else if (days !== null) {
    if (days < 0) {
      statusColor = 'from-[#ef4444] to-[#f87171]';
      statusText = 'VENCIDO';
      badgeClass = 'bg-[rgba(239,68,68,0.1)] text-[#f87171] border-[rgba(239,68,68,0.3)]';
      themeStatus = 'VENCIDO';
    } else if (days <= 45) { // Adjusted to 45 days
      statusColor = 'from-[#f59e0b] to-[#fbbf24]';
      statusText = 'PRÓXIMO';
      badgeClass = 'bg-[rgba(245,158,11,0.1)] text-[#fbbf24] border-[rgba(245,158,11,0.3)]';
      themeStatus = 'ATENCAO';
    } else {
      statusColor = 'from-[#10b981] to-[#34d399]';
      statusText = 'EM DIA';
      badgeClass = 'bg-[rgba(16,185,129,0.1)] text-[#34d399] border-[rgba(16,185,129,0.3)]';
      themeStatus = 'VALIDO';
    }
  } else {
    // Caso sem data (null) - Correção para evitar "VÁLIDO" laranja
    statusColor = 'from-slate-600 to-slate-700';
    statusText = 'N/A';
    badgeClass = 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    themeStatus = 'VALIDO'; // Mantém tema neutro/valido mas visualmente cinza
  }

  // Define Theme based on Status
  const getStatusTheme = () => {
    switch (themeStatus) {
      case 'REPROVADO':
        return {
          hoverBorder: 'hover:border-[#ff003c]', // Neon Red
          hoverShadow: 'hover:shadow-[0_0_35px_rgba(255,0,60,0.35)]',
          iconColor: 'text-[#ff003c]',
          btnHover: 'hover:bg-[#ff003c]/10 hover:border-[#ff003c]/50 hover:text-[#ff4d73]'
        };
      case 'VENCIDO':
        return {
          hoverBorder: 'hover:border-red-500',
          hoverShadow: 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]',
          iconColor: 'text-red-500',
          btnHover: 'hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400'
        };
      case 'ATENCAO':
        return {
          hoverBorder: 'hover:border-amber-500',
          hoverShadow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
          iconColor: 'text-amber-500',
          btnHover: 'hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-400'
        };
      case 'OBSOLETO':
        return {
          hoverBorder: 'hover:border-slate-500',
          hoverShadow: 'hover:shadow-[0_8px_30px_rgba(100,116,139,0.15)]',
          iconColor: 'text-slate-500',
          btnHover: 'hover:bg-slate-500/10 hover:border-slate-500/50 hover:text-slate-400'
        };
      case 'VALIDO':
      default:
        // Diferenciar visualmente VÁLIDO (verde) de N/A (cinza) no hover
        if (statusText === 'N/A') {
             return {
                hoverBorder: 'hover:border-slate-400',
                hoverShadow: 'hover:shadow-[0_8px_30px_rgba(148,163,184,0.15)]',
                iconColor: 'text-slate-400',
                btnHover: 'hover:bg-slate-500/10 hover:border-slate-500/50 hover:text-slate-300'
             };
        }
        return {
          hoverBorder: 'hover:border-emerald-500',
          hoverShadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
          iconColor: 'text-emerald-500',
          btnHover: 'hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400'
        };
    }
  };

  const theme = getStatusTheme();

  // Lógica visual para sugestão de troca
  const getSwapStyle = () => {
    if (swapAction === 'replace') {
        return {
            borderClass: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse',
            message: 'SUG. TROCA',
            msgColor: 'text-amber-400',
            bg: 'bg-amber-500/20'
        };
    }
    if (swapAction === 'install') {
        return {
            borderClass: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
            message: 'INSTALAR',
            msgColor: 'text-emerald-400',
            bg: 'bg-emerald-500/20'
        };
    }
    return null;
  };

  const swapStyle = getSwapStyle();

  return (
    <div 
        onClick={() => onViewDetails(item)}
        className={`group relative bg-[rgba(17,24,39,0.8)] rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer 
        ${swapStyle ? swapStyle.borderClass : `border-[rgba(148,163,184,0.15)] ${theme.hoverBorder} ${theme.hoverShadow}`}`}
    >
        {/* Top Status Strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${statusColor}`} />

        <div className="p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-[1px] mb-1">TAG</span>
                    <h3 className="text-lg font-bold text-white font-mono tracking-tight">{item.tag}</h3>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <div className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {statusText}
                    </div>
                    {isTwin && (
                        <div className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border shadow-sm backdrop-blur-md ${swapStyle ? `${swapStyle.bg} border-transparent ${swapStyle.msgColor}` : 'text-cyan-300 bg-cyan-950/40 border-cyan-800/50'}`}>
                            {swapStyle ? (
                                <><ArrowRightLeft size={10} className={swapAction === 'replace' ? 'animate-spin-slow' : ''} /> {swapStyle.message}</>
                            ) : (
                                <><span className="text-xs">∞</span> GÊMEO</>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                    <Layers size={14} className={theme.iconColor} />
                    <span className="truncate max-w-[180px]">{item.equipamento || item.modelo || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                    <MapPin size={14} className={theme.iconColor} />
                    <span className="truncate max-w-[180px]">{item.local || item.localizacao || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#94a3b8]">
                    <Calendar size={14} className={theme.iconColor} />
                    <span>{formatDateBR(parseDateSafe(item.dataProximaCalibracao || item.dataProximaInspecao || item.dataValidade))}</span>
                </div>
            </div>

            <div 
                className={`w-full py-2.5 rounded-xl bg-[#1e293b] text-[#94a3b8] text-sm font-semibold border border-[rgba(148,163,184,0.1)] transition-all flex items-center justify-center gap-2 group-hover:shadow-lg ${theme.btnHover}`}
            >
                <Eye size={16} /> Ver Detalhes
            </div>
        </div>
    </div>
  );
};

export default EquipmentCard;