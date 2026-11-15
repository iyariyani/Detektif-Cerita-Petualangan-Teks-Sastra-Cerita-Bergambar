import React from 'react';
import {
  ExternalLink,
  GraduationCap,
  Instagram,
  Mail,
  X,
  Youtube,
} from 'lucide-react';

interface DeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperProfileModal: React.FC<DeveloperProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Profil Pengembang Media"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-sky-700">
                Profil Pengembang Media
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                Iya Riyani, S.Pd.
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70"
            aria-label="Tutup Profil Pengembang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Identity Banner */}
          <div className="p-5 rounded-xl border border-slate-200 bg-sky-50/50">
            <p className="text-xs font-mono font-semibold text-sky-800 mb-1">
              Pendidik &amp; Pengembang Media Pembelajaran
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              Iya Riyani, S.Pd.
            </h3>
            <p className="text-sm text-slate-700 mt-0.5">
              Pendidikan Guru Sekolah Dasar (PGSD)
            </p>
          </div>

          {/* Identitas Akademik & Pendidikan */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900">
              Identitas Akademik &amp; Pendidikan
            </h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-3.5">
                <span className="text-slate-500 font-medium">NIM</span>
                <span className="sm:col-span-2 font-mono font-semibold text-slate-900 tabular-nums">
                  2506733048
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-3.5">
                <span className="text-slate-500 font-medium">Program Studi</span>
                <span className="sm:col-span-2 font-medium text-slate-900">
                  Pendidikan Guru Sekolah Dasar
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-3.5">
                <span className="text-slate-500 font-medium">
                  LPTK (Perguruan Tinggi)
                </span>
                <span className="sm:col-span-2 font-medium text-slate-900">
                  Universitas Muhammadiyah Cirebon
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-3.5">
                <span className="text-slate-500 font-medium">
                  Program Pendidikan
                </span>
                <span className="sm:col-span-2 font-medium text-slate-900">
                  Pendidikan Profesi Guru (PPG) Calon Guru Gelombang 1 Tahun 2026
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-3.5 bg-slate-50/70">
                <span className="text-slate-500 font-medium">
                  Fokus Media Pembelajaran
                </span>
                <span className="sm:col-span-2 text-slate-700 leading-relaxed">
                  Media ini dirancang untuk Pembelajaran Bahasa Indonesia Fase C Kelas VI SD Topik Teks Sastra (Cerita Bergambar) menggunakan model Problem Based Learning (PBL) dan pendekatan Deep Learning, terarah untuk melatih kemampuan C4 (Menganalisis), A5 (Percaya Diri &amp; Menghargai), dan P4 (Rekonstruksi Alur).
                </span>
              </div>
            </div>
          </div>

          {/* Hubungi Pengembang */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900">
              Hubungi Pengembang (Contact Me)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="mailto:iyariyani0126@gmail.com"
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-400 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-sky-700">
                  <Mail className="w-4 h-4" />
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Email Resmi
                </span>
                <span className="text-xs font-semibold text-slate-900 break-all">
                  iyariyani0126@gmail.com
                </span>
              </a>

              <a
                href="https://www.instagram.com/iyariyani06_?stkn=c2g3YnQ4ZHpqZGZp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-400 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-amber-700">
                  <Instagram className="w-4 h-4" />
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Instagram
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  @iyariyani06_
                </span>
              </a>

              <a
                href="https://www.youtube.com/@iyariyani2737"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-400 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-red-700">
                  <Youtube className="w-4 h-4" />
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Kanal YouTube Edukasi
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  @iyariyani2737
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
