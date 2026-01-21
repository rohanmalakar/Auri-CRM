import { z } from "zod";

// Base Schema for Shared Fields
const baseSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  termsEn: z.string().optional(),
  termsAr: z.string().optional(),
  howToUseEn: z.string().optional(),
  howToUseAr: z.string().optional(),
  
  // Wallet Design
  card_color: z.string().regex(/^#/, "Invalid color"),
  card_title_color: z.string().regex(/^#/, "Invalid color"),
  card_text_color: z.string().regex(/^#/, "Invalid color"),
  strip_image_url: z.string().optional(),
});

// Stamps Specific Schema
const stampsSchema = baseSchema.extend({
  program_type: z.literal("STAMPS"),
  
  // Rules (stamps_program_rules)
  stamps_target: z.number().min(1, "Target stamps must be at least 1"),
  accrual_rule: z.enum(["PER_VISIT", "PER_ITEM"]),
  time_restriction_unit: z.enum(["NONE", "DAY", "HOUR"]),
  time_restriction_value: z.number().min(0),
  visit_limit_mode: z.string().optional(),
  max_per_window: z.number().optional(),
  limit_scope: z.string().optional(),
  
  // Wallet Specifics
  fulfilled_stamp_icon_key: z.string(),
  fulfilled_stamp_color: z.string(),
  unfulfilled_stamp_icon_key: z.string(),
  unfulfilled_stamp_color: z.string(),
  
  // Terms
  termsEn: z.string().optional(),
  termsAr: z.string().optional(),
  howToUseEn: z.string().optional(),
  howToUseAr: z.string().optional(),
});

// Points Specific Schema
const pointsSchema = baseSchema.extend({
  program_type: z.literal("POINTS"),
  
  // Rules (points_program_rules)
  earn_points_per_currency: z.number().min(0.01, "Rate must be positive"), // 1 point= X SAR
  point_value_currency: z.string().default("SAR"), // Currency code like "SAR"
  point_tax_percent: z.number().min(0).max(100),
  expiry_duration_value: z.number().min(1),
  expiry_duration_unit: z.enum(["MONTH", "YEAR"]),
  min_spend_to_earn: z.number().optional(),
  rounding_mode: z.string().optional(),
  
  // Terms
  termsEn: z.string().optional(),
  termsAr: z.string().optional(),
  howToUseEn: z.string().optional(),
  howToUseAr: z.string().optional(),
});

// Free Product Item Schema
const freeProductSchema = z.object({
  product_source: z.enum(["INTERNAL", "EXTERNAL"]),
  internal_product_id: z.string().optional(),
  external_product_id: z.string().optional(),
  qty_free: z.number().min(1, "Quantity must be at least 1"),
});

// Discount Object Schema
const discountSchema = z.object({
  discount_percentage: z.number().min(0).max(100),
  currency_code: z.string().optional(),
  max_discount_amount: z.number().min(0, "Max discount amount must be at least 0").optional(),
});

// Reward Item Schema
export const rewardSchema = z.object({
  voucher_name_en: z.string().min(1, "Name is required"),
  voucher_description_en: z.string().optional(),
  voucher_name_ar: z.string().min(1, "Name is required"),
  voucher_description_ar: z.string().optional(),
  reward_type: z.enum(["DISCOUNT", "FREE_PRODUCT"]),
  
  // Cost for Stamps/Points
  cost_stamps: z.number().optional(),
  cost_points: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number().min(1, "Cost points must be at least 1").optional()
  ),
  
  // Free Product Logic
  product_source: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.enum(["INTERNAL", "EXTERNAL"]).optional()
  ),
  free_products: z.array(freeProductSchema).optional(),
  
  // Discount Object
  discount: discountSchema.optional(),
}).superRefine((data, ctx) => {
  // Custom Validation Logic
  if (data.reward_type === "DISCOUNT") {
    if (!data.discount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discount object is required",
        path: ["discount"],
      });
    }
  }

  if (data.reward_type === "FREE_PRODUCT") {
    if (!data.free_products || data.free_products.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add at least one free product",
        path: ["free_products"],
      });
    }
  }
});

// Discriminated Union for Main Form
export const loyaltyProgramFormSchema = z.discriminatedUnion("program_type", [
  stampsSchema.extend({ 
    rewards: z.array(rewardSchema).length(1, "Stamps program can only have one reward")
  }),
  pointsSchema.extend({ 
    rewards: z.array(rewardSchema).min(1, "Points program must have at least one reward")
  }),
]).superRefine((data, ctx) => {
  // Additional validation for POINTS program rewards
  if (data.program_type === "POINTS") {
    data.rewards.forEach((reward, index) => {
      if (reward.cost_points === undefined || reward.cost_points <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Point cost is required for rewards in Points program",
          path: ["rewards", index, "cost_points"],
        });
      }
    });
  }
});

export type LoyaltyProgramFormValues = z.infer<typeof loyaltyProgramFormSchema>;