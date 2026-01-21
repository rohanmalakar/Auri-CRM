import { Upload } from "lucide-react";
import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { LoyaltyProgramFormValues } from "./loyaltySchema";

interface Props {
  register: UseFormRegister<LoyaltyProgramFormValues>;
  watch: UseFormWatch<LoyaltyProgramFormValues>;
}

export function WalletDesignForm({ register, watch }: Props) {
  const type = watch("program_type");

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Wallet Pass Design</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colors Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Card Color</label>
            <div className="flex items-center gap-2">
              <input type="color" {...register("card_color")} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
              <span className="text-xs text-gray-500 uppercase">{watch("card_color")}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Card Title Color</label>
            <div className="flex items-center gap-2">
              <input type="color" {...register("card_title_color")} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
              <span className="text-xs text-gray-500 uppercase">{watch("card_title_color")}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Strip Image</label>
            <div className="flex items-center gap-2">
              <button type="button" className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2">
                <Upload size={16} /> Upload
              </button>
            </div>
          </div>
        </div>

        {/* Stamps Icons (Only for Stamps) */}
        {type === "STAMPS" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fulfilled Stamp Icon</label>
               <div className="flex gap-2">
                  <select {...register("fulfilled_stamp_icon_key")} className="px-2 py-1 rounded border dark:bg-zinc-800 dark:border-zinc-700">
                    <option value="CHECK">✓ Check</option>
                    <option value="STAR">★ Star</option>
                  </select>
                  <input type="color" {...register("fulfilled_stamp_color")} className="w-8 h-8 rounded p-0 border-0" />
               </div>
            </div>

            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unfulfilled Stamp Icon</label>
               <div className="flex gap-2">
                  <select {...register("unfulfilled_stamp_icon_key")} className="px-2 py-1 rounded border dark:bg-zinc-800 dark:border-zinc-700">
                    <option value="GIFT">🎁 Gift</option>
                    <option value="CIRCLE">○ Circle</option>
                  </select>
                  <input type="color" {...register("unfulfilled_stamp_color")} className="w-8 h-8 rounded p-0 border-0" />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}