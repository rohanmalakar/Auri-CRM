import { Stamp, Star } from "lucide-react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { LoyaltyProgramFormValues } from "./loyaltySchema";

interface Props {
  watch: UseFormWatch<LoyaltyProgramFormValues>;
  setValue: UseFormSetValue<LoyaltyProgramFormValues>;
}

export function ProgramTypeSelector({ watch, setValue }: Props) {
  const type = watch("program_type");

  const setType = (t: "STAMPS" | "POINTS") => {
    // We cast strictly here because we are resetting defaults for the new type
    setValue("program_type", t);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Choose Program</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stamps Option */}
        <button
          type="button"
          onClick={() => setType("STAMPS")}
          className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            type === "STAMPS"
              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          <div className={`p-3 rounded-full ${type === "STAMPS" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"}`}>
            <Stamp className="w-6 h-6" />
          </div>
          <div className="text-start">
            <p className="font-bold text-gray-900 dark:text-gray-100">Stamps Program</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create your program easily</p>
          </div>
          {type === "STAMPS" && (
            <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-blue-600">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                 <span className="text-white text-xs">✓</span>
              </div>
            </div>
          )}
        </button>

        {/* Points Option */}
        <button
          type="button"
          onClick={() => setType("POINTS")}
          className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            type === "POINTS"
              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
              : "border-gray-200 dark:border-zinc-700 hover:border-amber-300 dark:hover:border-amber-700"
          }`}
        >
          <div className={`p-3 rounded-full ${type === "POINTS" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"}`}>
            <Star className="w-6 h-6" />
          </div>
          <div className="text-start">
            <p className="font-bold text-gray-900 dark:text-gray-100">Points Program</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create your program easily</p>
          </div>
          {type === "POINTS" && (
            <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-amber-500">
              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                 <span className="text-white text-xs">✓</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}