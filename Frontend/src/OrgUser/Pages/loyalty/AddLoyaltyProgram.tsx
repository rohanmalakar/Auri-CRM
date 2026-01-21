import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramTypeSelector } from "@/OrgUser/components/loyalty/ProgramTypeSelector";
import { BasicInfoForm } from "@/OrgUser/components/loyalty/BasicInfoForm";
import { RulesForm } from "@/OrgUser/components/loyalty/RulesForm";
import { WalletDesignForm } from "@/OrgUser/components/loyalty/WalletDesignForm";
import { RewardsForm } from "@/OrgUser/components/loyalty/RewardsForm";
import { loyaltyProgramFormSchema } from "@/OrgUser/components/loyalty/loyaltySchema";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";

// Default Values
const defaultValues: any = {
  program_type: "STAMPS",
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  termsEn: "",
  termsAr: "",
  howToUseEn: "",
  howToUseAr: "",
  card_color: "#0000e5",
  card_title_color: "#ffffff",
  card_text_color: "#e7ecfe",
  accrual_rule: "PER_VISIT",
  stamps_target: 10,
  time_restriction_value: 0,
  time_restriction_unit: "NONE",
  fulfilled_stamp_icon_key: "CHECK",
  fulfilled_stamp_color: "#4ade80",
  point_value_currency: "SAR",
  point_tax_percent: 0,
  earn_points_per_currency: 1,
  expiry_duration_value: 12,
  expiry_duration_unit: "MONTH",
  unfulfilled_stamp_icon_key: "GIFT",
  unfulfilled_stamp_color: "#e4e4e7",
  rewards: [
    {
      voucher_name_en: "",
      voucher_name_ar: "",
      reward_type: "DISCOUNT",
      cost_stamps: undefined,
      cost_points: undefined,
      discount: {
        discount_percentage: 0,
        currency_code: "SAR",
        max_discount_amount: 0,
      },
      free_products: [],
      product_source: undefined
    }
  ]
};

export default function AddLoyaltyProgram() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loyaltyProgramFormSchema),
    defaultValues,
    mode: "onChange"
  } as any);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "rewards",
  });

  const programType = watch("program_type");

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {

      const response = await api.post(`/loyalty/programs`, data);
      return response.data;
    },
    onSuccess: () => {
      alert("Loyalty program created successfully");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || "Error creating loyalty program";
      alert(errorMsg);
    }
  });


  const onSubmit = (data: any) => {
    // Helper: Convert string numbers to actual numbers
    const toNumber = (value: any) => {
      if (value === null || value === undefined || value === '') return undefined;
      const num = Number(value);
      return isNaN(num) ? value : num;
    };

    // 1. Construct the Main Payload Object (Clean Data)
    const payload: any = {
      programType: data.program_type,
      nameEn: data.name_en,
      nameAr: data.name_ar,
    };

    // Optional fields
    if (data.description_en) payload.descriptionEn = data.description_en;
    if (data.description_ar) payload.descriptionAr = data.description_ar;
    if (data.termsEn) payload.termsEn = data.termsEn;
    if (data.termsAr) payload.termsAr = data.termsAr;
    if (data.howToUseEn) payload.howToUseEn = data.howToUseEn;
    if (data.howToUseAr) payload.howToUseAr = data.howToUseAr;

    // 2. Transform Rewards
    payload.rewards = data.rewards.map((reward: any) => {
      const transformedReward: any = {
        voucherNameEn: reward.voucher_name_en,
        voucherNameAr: reward.voucher_name_ar,
        rewardType: reward.reward_type,
      };

      if (reward.voucher_description_en)
        transformedReward.voucherDescriptionEn = reward.voucher_description_en;
      if (reward.voucher_description_ar)
        transformedReward.voucherDescriptionAr = reward.voucher_description_ar;

      if (reward.reward_type === "DISCOUNT") {
        transformedReward.discount = {
          discountPercentage: toNumber(reward.discount?.discount_percentage),
          currencyCode: reward.discount?.currency_code,
          maxDiscountAmount: toNumber(reward.discount?.max_discount_amount),
        };
      } else if (reward.reward_type === "FREE_PRODUCT") {
        transformedReward.freeProducts = reward.free_products?.map(
          (product: any) => ({
            productSource: product.product_source,
            internalProductId: toNumber(product.internal_product_id),
            externalProductId: product.external_product_id,
            qtyFree: toNumber(product.qty_free),
          })
        );
      }

      // Assign Costs
      if (data.program_type === "STAMPS") {
        transformedReward.costStamps = toNumber(data.stamps_target);
      } else if (data.program_type === "POINTS") {
        transformedReward.costPoints = toNumber(reward.cost_points);
      }

      return transformedReward;
    });

    // 3. Transform Rules & Wallet Design based on Type
    if (data.program_type === "STAMPS") {
      payload.stampsRules = {
        stampsTarget: toNumber(data.stamps_target),
        accrualRule: data.accrual_rule,
        timeRestrictionUnit: data.time_restriction_unit,
        timeRestrictionValue: toNumber(data.time_restriction_value),
        visitLimitMode: data?.visit_limit_mode || "UNLIMITED",
        limitScope: data?.limit_scope || "ORG",
      };

      // Only include maxPerWindow if it's a positive number
      const maxPerWindow = toNumber(data?.max_per_window);
      if (maxPerWindow && maxPerWindow > 0) {
        payload.stampsRules.maxPerWindow = maxPerWindow;
      }
      payload.stampsWalletDesign = {
        cardColor: data.card_color,
        cardTitleColor: data.card_title_color,
        cardTextColor: data.card_text_color,
        stripImageUrl: data.strip_image_url?.[0] || undefined, // Handles File object
        fulfilledStampIconKey: data.fulfilled_stamp_icon_key,
        fulfilledStampColor: data.fulfilled_stamp_color,
        unfulfilledStampIconKey: data.unfulfilled_stamp_icon_key,
        unfulfilledStampColor: data.unfulfilled_stamp_color,
      };
    } else if (data.program_type === "POINTS") {
      const earnPointsPerCurrency = toNumber(data.earn_points_per_currency) || 1;
      const pointValueCurrency = earnPointsPerCurrency > 0 ? (1 / earnPointsPerCurrency) : 0.01;

      payload.pointsRules = {
        currencyCode: data.point_value_currency,
        earnPointsPerCurrency: earnPointsPerCurrency,
        pointValueCurrency: pointValueCurrency, // Auto-calculated inverse
        pointTaxPercent: toNumber(data.point_tax_percent) || 0,
        minSpendToEarn: toNumber(data.min_spend_to_earn) || 0,
        expiryDurationValue: toNumber(data.expiry_duration_value),
        expiryDurationUnit: data.expiry_duration_unit,
        roundingMode: data?.rounding_mode || "ROUND",
      };
      payload.pointsWalletDesign = {
        cardColor: data.card_color,
        cardTitleColor: data.card_title_color,
        cardTextColor: data.card_text_color,
        stripImageUrl: data.strip_image_url?.[0] || undefined, // Handles File object
      };
    }

    // Debugging
    console.log('\n🚀 ========== SENDING TO API ==========');
    console.log('Final payload:', JSON.stringify(payload, null, 2));
    console.log('======================================\n');

    updateMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Program</h1>
          <nav className="text-sm text-gray-500 mt-1">
            Home / Loyalty Programs / <span className="text-gray-900 dark:text-gray-300">Add new</span>
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* 1. Program Type */}
          <ProgramTypeSelector watch={watch as any} setValue={setValue as any} />

          {/* 2. Basic Info */}
          <BasicInfoForm register={register as any} errors={errors} />

          {/* 3. Rules (Conditional) */}
          <RulesForm register={register as any} watch={watch as any} errors={errors} />

          {/* 4. Wallet Design */}
          <WalletDesignForm register={register as any} watch={watch as any} />

          {/* 5. Rewards */}
          <div className="space-y-4">
            {fields.map((field: any, index: number) => (
              <RewardsForm
                key={field.id}
                register={register as any}
                watch={watch as any}
                setValue={setValue as any}
                index={index}
                errors={errors}
                onRemove={() => remove(index)}
                canDelete={programType === "POINTS" && fields.length > 1}
              />
            ))}

            {programType === "POINTS" && (
              <button
                type="button"
                onClick={() => append({
                  voucher_name_en: "",
                  voucher_name_ar: "",
                  reward_type: "DISCOUNT",
                  cost_points: undefined,
                  cost_stamps: undefined,
                  discount: {
                    discount_percentage: 0,
                    currency_code: "SAR",
                    max_discount_amount: 0,
                  },
                  free_products: []
                })}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus size={20} /> Add more rewards
              </button>
            )}
          </div>

          {/* 6. Terms & How-To-Use */}
          <div className="space-y-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Additional Info (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Terms (English)</label>
                <textarea
                  {...register("termsEn")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                  placeholder="Points expire 24 months after earning. Non-refundable."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Terms (Arabic)</label>
                <textarea
                  {...register("termsAr")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                  placeholder="اكتب الشروط هنا"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">How to Use (English)</label>
                <textarea
                  {...register("howToUseEn")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                  placeholder="Use your member app or card to earn and spend points"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">How to Use (Arabic)</label>
                <textarea
                  {...register("howToUseAr")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                  placeholder="اكتب إرشادات الاستخدام هنا"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Program"}
            </button>
          </div>

          {/* Debugging */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">Validation Errors:</h4>
              <pre className="text-xs text-red-700 dark:text-red-400 overflow-auto">{JSON.stringify(errors, (key, value) => {
                // Remove circular references and unnecessary properties
                if (key === 'ref' || key === '_valueTracker') return undefined;
                return value;
              }, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}