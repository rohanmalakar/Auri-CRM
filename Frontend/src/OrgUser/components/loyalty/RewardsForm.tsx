import { Search, RefreshCw, Trash2, Minus } from "lucide-react";
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { LoyaltyProgramFormValues } from "@/OrgUser/components/loyalty/loyaltySchema";
import { useState } from "react";

interface Props {
  register: UseFormRegister<LoyaltyProgramFormValues>;
  watch: UseFormWatch<LoyaltyProgramFormValues>;
  setValue: UseFormSetValue<LoyaltyProgramFormValues>; // Needed to set product IDs manually
  index: number;
  errors?: any; // To display validation errors for specific fields
  onRemove?: () => void; // Function to remove this reward
  canDelete?: boolean; // Whether delete button should be shown
}

// Mock Data for demonstration
const MOCK_INTERNAL_PRODUCTS = [
  { id: "101", name: "Cheese Burger", price: "15.00 SAR" },
  { id: "102", name: "Chicken Wrap", price: "12.00 SAR" },
  { id: "103", name: "Fries Large", price: "8.00 SAR" },
];

const MOCK_FOODICS_PRODUCTS = [
  { id: "F-501", name: "Pickles (Foodics)", price: "0.00 SAR" },
  { id: "F-502", name: "Ketchup (Foodics)", price: "0.00 SAR" },
  { id: "F-503", name: "Mayonnaise (Foodics)", price: "0.00 SAR" },
  { id: "F-504", name: "Cheese Sauce (Foodics)", price: "3.00 SAR" },
];

export function RewardsForm({ register, watch, setValue, index, errors, onRemove, canDelete }: Props) {
  const programType = watch("program_type");
  const rewardType = watch(`rewards.${index}.reward_type`);
  
  // Watch product source - ts-expect-error because field is optional in schema
  // ts-expect-error - dynamic field not in type definition yet
  const productSource = (watch(`rewards.${index}.product_source`) as string | undefined);
  
  // Watch free products array
  // ts-expect-error - dynamic field not in type definition yet
  const freeProducts = (watch(`rewards.${index}.free_products`) as any[]) || [];

  // Simple state for tab switching in Product List
  const [activeTab, setActiveTab] = useState<"LIST" | "SELECTED">("LIST");

  const handleProductSelect = (source: "INTERNAL" | "EXTERNAL", id: string) => {
    const currentProducts = Array.isArray(freeProducts) ? freeProducts : [];
    const productExists = currentProducts.some(p => 
      (source === "INTERNAL" ? p.internal_product_id : p.external_product_id) === id
    );
    
    if (productExists) {
      // Remove product
      // ts-expect-error - dynamic field not in type definition yet
      setValue(`rewards.${index}.free_products`, 
        currentProducts.filter(p => 
          (source === "INTERNAL" ? p.internal_product_id : p.external_product_id) !== id
        ), 
        { shouldValidate: true }
      );
    } else {
      // Add product
      const newProduct = {
        product_source: source,
        [source === "INTERNAL" ? "internal_product_id" : "external_product_id"]: id,
        qty_free: 1
      };
      // ts-expect-error - dynamic field not in type definition yet
      setValue(`rewards.${index}.free_products`, [...currentProducts, newProduct], { shouldValidate: true });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reward #{index + 1}</h3>
        {canDelete && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
            title="Delete reward"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Name & Description English */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reward (Voucher Name English) <span className="text-red-500">*</span></label>
            <input
              {...register(`rewards.${index}.voucher_name_en`)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Voucher name"
            />
             {errors?.rewards?.[index]?.voucher_name_en && (
                <p className="text-xs text-red-500">{errors.rewards[index].voucher_name_en.message}</p>
             )}
          </div>
          <div className="space-y-2">
             <input
              {...register(`rewards.${index}.voucher_description_en`)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Voucher description"
            />
          </div>
        </div>

        {/* Name & Description arabic*/}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reward (Voucher Name Arabic) <span className="text-red-500">*</span></label>
            <input
              {...register(`rewards.${index}.voucher_name_ar`)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Voucher name"
            />
             {errors?.rewards?.[index]?.voucher_name_ar && (
                <p className="text-xs text-red-500">{errors.rewards[index].voucher_name_ar.message}</p>
             )}
          </div>
          <div className="space-y-2">
             <input
              {...register(`rewards.${index}.voucher_description_ar`)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Voucher description"
            />
          </div>
        </div>

        {/* Reward Type Radio Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reward type <span className="text-red-500">*</span></label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                value="FREE_PRODUCT" 
                {...register(`rewards.${index}.reward_type`)} 
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Free product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                value="DISCOUNT" 
                {...register(`rewards.${index}.reward_type`)} 
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Discount</span>
            </label>
          </div>
        </div>

        {/* ----------------- FREE PRODUCT LOGIC ----------------- */}
        {rewardType === "FREE_PRODUCT" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            
            {/* Products Source Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Products source <span className="text-red-500">*</span></label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    value="INTERNAL" 
                    // ts-expect-error - dynamic field not in type definition yet
                    {...register(`rewards.${index}.product_source`)} 
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Internal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    value="EXTERNAL" 
                    // ts-expect-error - dynamic field not in type definition yet
                    {...register(`rewards.${index}.product_source`)} 
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">External</span>
                </label>
              </div>
               {errors?.rewards?.[index]?.product_source && (
                  <p className="text-xs text-red-500">{errors.rewards[index].product_source.message}</p>
               )}
            </div>

            {/* Free Products List */}
            {freeProducts.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Products</h4>
                {freeProducts.map((product: any, prodIndex: number) => (
                  <div key={prodIndex} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.product_source === "INTERNAL" ? "Internal" : "External"} Product ID: {product.internal_product_id || product.external_product_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={product.qty_free || 1}
                        onChange={(e) => {
                          const updated = [...freeProducts];
                          updated[prodIndex].qty_free = parseInt(e.target.value) || 1;
                          // ts-expect-error - dynamic field not in type definition yet
                          setValue(`rewards.${index}.free_products`, updated, { shouldValidate: true });
                        }}
                        className="w-12 px-2 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg bg-transparent dark:text-white text-center"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">qty</span>
                      <button
                        type="button"
                        onClick={() => {
                          // ts-expect-error - dynamic field not in type definition yet
                          setValue(`rewards.${index}.free_products`, 
                            freeProducts.filter((_: any, i: number) => i !== prodIndex), 
                            { shouldValidate: true }
                          );
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Product Selection List UI */}
            {productSource && (
              <div className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                  <button
                    type="button"
                    onClick={() => setActiveTab("LIST")}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "LIST" 
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-zinc-900" 
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    Product List
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-4 bg-white dark:bg-zinc-900 min-h-64">
                  
                  {/* Sync Button for External Products */}
                  {productSource === "EXTERNAL" && (
                    <button type="button" className="mb-4 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <RefreshCw size={14} /> Sync products
                    </button>
                  )}

                  {/* Search Bar */}
                  <div className="mb-4 relative">
                      <input className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white" placeholder="Search products..." />
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  </div>

                  {/* The List */}
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                       <div className="col-span-1"></div>
                       <div className="col-span-8">Product name</div>
                       <div className="col-span-3 text-right">Amount</div>
                    </div>

                    {/* Product List */}
                    {productSource && (productSource === "INTERNAL" ? MOCK_INTERNAL_PRODUCTS : MOCK_FOODICS_PRODUCTS).map((product) => {
                         const isSelected = freeProducts.some((p: any) => 
                            productSource === "INTERNAL" 
                              ? p.internal_product_id === product.id
                              : p.external_product_id === product.id
                         );

                         return (
                          <div 
                            key={product.id}
                            onClick={() => handleProductSelect(productSource as "INTERNAL" | "EXTERNAL", product.id)}
                            className={`grid grid-cols-12 gap-4 px-3 py-3 rounded-lg text-sm cursor-pointer transition-colors items-center ${
                               isSelected 
                                 ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800" 
                                 : "hover:bg-gray-50 dark:hover:bg-zinc-800 border border-transparent"
                            }`}
                          >
                            <div className="col-span-1 flex items-center justify-center">
                               <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-zinc-600"
                               }`}>
                                  {isSelected && <span className="text-white text-[10px]">✓</span>}
                               </div>
                            </div>
                            <div className="col-span-8 font-medium text-gray-900 dark:text-gray-100">
                               {product.name}
                            </div>
                            <div className="col-span-3 text-right text-gray-500 dark:text-gray-400">
                               {product.price}
                            </div>
                          </div>
                         );
                      })
                    }
                  </div>
                </div>
              </div>
            )}
             {/* Product Validation Error */}
             {errors?.rewards?.[index]?.free_products && (
                <p className="text-xs text-red-500 mt-2">
                   {errors.rewards[index].free_products?.message}
                </p>
             )}
          </div>
        )}

        {/* ----------------- DISCOUNT LOGIC ----------------- */}
        {rewardType === "DISCOUNT" && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount percentage <span className="text-red-500">*</span></label>
                 <div className="flex rounded-lg border border-gray-300 dark:border-zinc-700 overflow-hidden">
                    <input 
                      type="number" 
                      {...register(`rewards.${index}.discount.discount_percentage`, { 
                        setValueAs: (v) => v === "" || v === null ? undefined : parseFloat(v)
                      })} 
                      className="w-full px-3 py-2 bg-transparent dark:text-white outline-none" 
                      placeholder="Discount percentage" 
                    />
                    <div className="bg-gray-50 dark:bg-zinc-800 px-3 py-2 border-l border-gray-300 dark:border-zinc-700 text-gray-500 text-sm flex items-center">
                       %
                    </div>
                 </div>
                 {errors?.rewards?.[index]?.discount?.discount_percentage && (
                    <p className="text-xs text-red-500">{errors.rewards[index].discount.discount_percentage.message}</p>
                 )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max discount amount</label>
                <div className="flex rounded-lg border border-gray-300 dark:border-zinc-700 overflow-hidden">
                  <input 
                   type="number" 
                   {...register(`rewards.${index}.discount.max_discount_amount`, { 
                    setValueAs: (v) => v === "" || v === null ? undefined : parseFloat(v)
                   })} 
                   className="w-full px-3 py-2 bg-transparent dark:text-white outline-none" 
                   placeholder="0" 
                  />
                  <div className="bg-gray-50 dark:bg-zinc-800 px-3 py-2 border-l border-gray-300 dark:border-zinc-700 text-gray-500 text-sm flex items-center">
                    Amount
                  </div>
                </div>
                {errors?.rewards?.[index]?.discount?.max_discount_amount && (
                  <p className="text-xs text-red-500">{errors.rewards[index].discount.max_discount_amount.message}</p>
                )}
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency code</label>
                 <input 
                   type="text" 
                   {...register(`rewards.${index}.discount.currency_code`)} 
                   className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                   placeholder="SAR" 
                   defaultValue="SAR"
                 />
              </div>
           </div>
        )}

        {/* ----------------- POINTS / STAMPS COST ----------------- */}
        <div className="pt-2 mt-4 space-y-4">
           {programType === "POINTS" ? (
             <div className="space-y-2 w-full md:w-1/3">
               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Points cost <span className="text-red-500">*</span></label>
               <div className="flex rounded-lg border border-gray-300 dark:border-zinc-700 overflow-hidden">
                  <input 
                    type="number" 
                    {...register(`rewards.${index}.cost_points`, { 
                      setValueAs: (v) => v === "" || v === null ? undefined : parseFloat(v)
                    })} 
                    className="w-full px-3 py-2 bg-transparent dark:text-white outline-none" 
                    placeholder="0" 
                  />
                  <div className="bg-gray-50 dark:bg-zinc-800 px-3 py-2 border-l border-gray-300 dark:border-zinc-700 text-gray-500 text-sm flex items-center">
                     Points
                  </div>
               </div>
               {errors?.rewards?.[index]?.cost_points && (
                  <p className="text-xs text-red-500">{errors.rewards[index].cost_points.message}</p>
               )}
             </div>
           ) : (
             // For STAMPS program, cost equals stamps target automatically
             <div className="space-y-1 w-full md:w-1/2">
               <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Stamps cost</div>
               <p className="text-sm text-gray-600 dark:text-gray-400">Uses the program stamps target automatically.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}