import type { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import type { LoyaltyProgramFormValues } from "./loyaltySchema";

interface Props {
  register: UseFormRegister<LoyaltyProgramFormValues>;
  watch: UseFormWatch<LoyaltyProgramFormValues>;
  errors: FieldErrors<LoyaltyProgramFormValues>;
}

export function RulesForm({ register, watch, errors }: Props) {
  const type = watch("program_type");

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Program Rules</h3>

      {/* STAMPS RULES */}
      {type === "STAMPS" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Stamps <span className="text-red-500">*</span></label>
              <input
                type="number"
                {...register("stamps_target", { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white"
                placeholder="e.g. 10"
              />
               {/* @ts-ignore - Conditional type handling in TS inside forms is tricky without casting */}
              {errors.stamps_target && <p className="text-xs text-red-500">{errors.stamps_target.message}</p>}
            </div>
            
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Accrual Rule</label>
               <div className="flex gap-4 mt-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="radio" value="PER_VISIT" {...register("accrual_rule")} className="text-blue-600 focus:ring-blue-500" />
                   <span className="text-sm text-gray-700 dark:text-gray-300">Per Visit</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="radio" value="PER_ITEM" {...register("accrual_rule")} className="text-blue-600 focus:ring-blue-500" />
                   <span className="text-sm text-gray-700 dark:text-gray-300">Per Item</span>
                 </label>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Restriction</label>
              <div className="flex rounded-lg border border-gray-300 dark:border-zinc-700 overflow-hidden">
                <input
                  type="number"
                  {...register("time_restriction_value", { valueAsNumber: true })}
                  className="w-20 px-3 py-2 bg-transparent dark:text-white border-r border-gray-300 dark:border-zinc-700 outline-none"
                  placeholder="0"
                />
                <select
                  {...register("time_restriction_unit")}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-800 dark:text-white outline-none"
                >
                  <option value="NONE">None</option>
                  <option value="DAY">Day(s)</option>
                  <option value="HOUR">Hour(s)</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Restrict multiple stamps within a specific timeframe.
            </p>
          </div>
        </div>
      )}

      {/* POINTS RULES */}
      {type === "POINTS" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Point Cost (Valuation)</label>
               <div className="flex items-center gap-3">
                 <span className="text-sm font-bold dark:text-white">1 Point =</span>
                 <input
                   type="number"
                   step="0.01"
                   {...register("earn_points_per_currency", { valueAsNumber: true })}
                   className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white"
                   placeholder="0.10"
                 />
                 <span className="text-sm font-bold dark:text-white">SAR</span>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Point Tax %</label>
               <div className="flex items-center gap-2">
                 <input
                   type="number"
                   {...register("point_tax_percent", { valueAsNumber: true })}
                   className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white"
                   placeholder="0"
                 />
                 <span className="text-gray-500">%</span>
               </div>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Duration</label>
             <div className="flex rounded-lg border border-gray-300 dark:border-zinc-700 overflow-hidden w-full md:w-1/2">
                <input
                  type="number"
                  {...register("expiry_duration_value", { valueAsNumber: true })}
                  className="w-20 px-3 py-2 bg-transparent dark:text-white border-r border-gray-300 dark:border-zinc-700 outline-none"
                  defaultValue={1}
                />
                <select
                  {...register("expiry_duration_unit")}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-800 dark:text-white outline-none"
                >
                  <option value="YEAR">Year(s)</option>
                  <option value="MONTH">Month(s)</option>
                </select>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}