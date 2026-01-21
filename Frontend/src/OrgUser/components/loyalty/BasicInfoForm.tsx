import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { LoyaltyProgramFormValues } from "./loyaltySchema";

interface Props {
  register: UseFormRegister<LoyaltyProgramFormValues>;
  errors: FieldErrors<LoyaltyProgramFormValues>;
}

export function BasicInfoForm({ register, errors }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Program Name (EN) <span className="text-red-500">*</span></label>
          <input
            {...register("name_en")}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Gold Tier"
          />
          {errors.name_en && <p className="text-xs text-red-500">{errors.name_en.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Program Name (AR) <span className="text-red-500">*</span></label>
          <input
            {...register("name_ar")}
            dir="rtl"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="مثال: الفئة الذهبية"
          />
          {errors.name_ar && <p className="text-xs text-red-500">{errors.name_ar.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (EN)</label>
        <textarea
          {...register("description_en")}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
          placeholder="Describe your program..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (AR)</label>
        <textarea
          {...register("description_ar")}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
          placeholder="Describe your program..."
        />
      </div>
    </div>
  );
}