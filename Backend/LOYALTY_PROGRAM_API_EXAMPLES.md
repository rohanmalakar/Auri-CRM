# Loyalty Program API - Complete Examples

## Endpoint
```
POST /api/v1/loyalty/programs
```

## Authentication
Requires Bearer token in Authorization header

---

## Example 1: Points Program (Complete)

### Request Body
```json
{
  "programType": "POINTS",
  "nameEn": "VIP Points Rewards",
  "nameAr": "مكافآت النقاط الكبار",
  "descriptionEn": "Earn points on every purchase and redeem for exclusive rewards",
  "descriptionAr": "احصل على نقاط في كل عملية شراء واستبدلها بمكافآت حصرية",
  "termsEn": "Points are non-transferable and expire after 12 months. See full terms and conditions.",
  "termsAr": "النقاط غير قابلة للتحويل وتنتهي صلاحيتها بعد 12 شهرًا. انظر الشروط والأحكام الكاملة.",
  "howToUseEn": "Show your loyalty card at checkout to earn and redeem points",
  "howToUseAr": "أظهر بطاقة الولاء الخاصة بك عند الدفع لكسب النقاط واستردادها",
  "status": "ACTIVE",
  
  "pointsRules": {
    "currencyCode": "SAR",
    "earnPointsPerCurrency": 1,
    "minSpendToEarn": 10,
    "roundingMode": "FLOOR",
    "pointValueCurrency": 0.1,
    "pointTaxPercent": 5,
    "expiryDurationValue": 12,
    "expiryDurationUnit": "MONTH"
  },
  
  "pointsWalletDesign": {
    "cardColor": "#0000e5",
    "cardTitleColor": "#ffffff",
    "cardTextColor": "#e7ecfe",
    "stripImageUrl": "https://example.com/strip.png",
    "logoUrl": "https://example.com/logo.png"
  },
  
  "rewards": [
    {
      "voucherNameEn": "10% Off Discount",
      "voucherNameAr": "خصم 10٪",
      "voucherDescriptionEn": "Get 10% off your next purchase",
      "voucherDescriptionAr": "احصل على خصم 10٪ على عملية الشراء التالية",
      "rewardType": "DISCOUNT",
      "costPoints": 100,
      "discount": {
        "discountPercentage": 10,
        "maxDiscountAmount": 50,
        "currencyCode": "SAR"
      }
    },
    {
      "voucherNameEn": "Free Coffee",
      "voucherNameAr": "قهوة مجانية",
      "voucherDescriptionEn": "Redeem for a free coffee of your choice",
      "voucherDescriptionAr": "استبدل بقهوة مجانية من اختيارك",
      "rewardType": "FREE_PRODUCT",
      "costPoints": 50,
      "freeProducts": [
        {
          "productSource": "INTERNAL",
          "internalProductId": 123,
          "qtyFree": 1
        }
      ]
    },
    {
      "voucherNameEn": "20% Off Premium Items",
      "voucherNameAr": "خصم 20٪ على العناصر المميزة",
      "rewardType": "DISCOUNT",
      "costPoints": 200,
      "discount": {
        "discountPercentage": 20,
        "maxDiscountAmount": 100,
        "currencyCode": "SAR"
      }
    }
  ]
}
```

---

## Example 2: Stamps Program with PER_VISIT (Simple)

### Request Body
```json
{
  "programType": "STAMPS",
  "nameEn": "Coffee Loyalty Card",
  "nameAr": "بطاقة ولاء القهوة",
  "descriptionEn": "Collect 10 stamps and get a free coffee",
  "descriptionAr": "اجمع 10 طوابع واحصل على قهوة مجانية",
  "termsEn": "One stamp per visit. Card valid for 6 months from first stamp.",
  "termsAr": "ختم واحد لكل زيارة. البطاقة صالحة لمدة 6 أشهر من الختم الأول.",
  "howToUseEn": "Present your digital card at each visit to collect stamps",
  "howToUseAr": "قدم بطاقتك الرقمية في كل زيارة لجمع الطوابع",
  "status": "ACTIVE",
  
  "stampsRules": {
    "stampsTarget": 10,
    "accrualRule": "PER_VISIT",
    "timeRestrictionUnit": "NONE",
    "timeRestrictionValue": 0,
    "visitLimitMode": "UNLIMITED",
    "limitScope": "ORG"
  },
  
  "stampsWalletDesign": {
    "cardColor": "#ff6b35",
    "cardTitleColor": "#ffffff",
    "cardTextColor": "#ffe5d9",
    "stripImageUrl": "https://example.com/coffee-strip.png",
    "logoUrl": "https://example.com/coffee-logo.png",
    "fulfilledStampIconKey": "CHECK",
    "fulfilledStampColor": "#00ff00",
    "unfulfilledStampIconKey": "CIRCLE",
    "unfulfilledStampColor": "#cccccc"
  },
  
  "rewards": [
    {
      "voucherNameEn": "Free Coffee Reward",
      "voucherNameAr": "مكافأة القهوة المجانية",
      "voucherDescriptionEn": "Redeem your completed card for a free coffee",
      "voucherDescriptionAr": "استبدل بطاقتك المكتملة بقهوة مجانية",
      "rewardType": "FREE_PRODUCT",
      "costStamps": 10,
      "freeProducts": [
        {
          "productSource": "INTERNAL",
          "internalProductId": 456,
          "qtyFree": 1
        }
      ]
    }
  ]
}
```

---

## Example 3: Stamps Program with PER_ITEM (Complex)

### Request Body
```json
{
  "programType": "STAMPS",
  "nameEn": "Meal Stamps Program",
  "nameAr": "برنامج طوابع الوجبات",
  "descriptionEn": "Buy specific items and collect stamps to earn rewards",
  "descriptionAr": "اشتر عناصر محددة واجمع الطوابع لكسب المكافآت",
  "status": "ACTIVE",
  
  "stampsRules": {
    "stampsTarget": 15,
    "accrualRule": "PER_ITEM",
    "timeRestrictionUnit": "DAY",
    "timeRestrictionValue": 1,
    "visitLimitMode": "MAX_PER_WINDOW",
    "maxPerWindow": 3,
    "limitScope": "BRANCH"
  },
  
  "stampsWalletDesign": {
    "cardColor": "#2a9d8f",
    "cardTitleColor": "#ffffff",
    "cardTextColor": "#e9f5f4",
    "stripImageUrl": "https://example.com/meal-strip.png",
    "fulfilledStampIconKey": "STAR",
    "fulfilledStampColor": "#ffd700",
    "unfulfilledStampIconKey": "STAR_OUTLINE",
    "unfulfilledStampColor": "#d3d3d3"
  },
  
  "stampsAccrualProducts": [
    {
      "productSource": "INTERNAL",
      "internalProductId": 101,
      "stampsPerItem": 1
    },
    {
      "productSource": "INTERNAL",
      "internalProductId": 102,
      "stampsPerItem": 2
    },
    {
      "productSource": "FOODICS",
      "externalProductId": "foodics-product-abc123",
      "stampsPerItem": 1
    }
  ],
  
  "rewards": [
    {
      "voucherNameEn": "Free Burger",
      "voucherNameAr": "برغر مجاني",
      "rewardType": "FREE_PRODUCT",
      "costStamps": 15,
      "freeProducts": [
        {
          "productSource": "INTERNAL",
          "internalProductId": 201,
          "qtyFree": 1
        }
      ]
    },
    {
      "voucherNameEn": "50% Off Any Meal",
      "voucherNameAr": "خصم 50٪ على أي وجبة",
      "rewardType": "DISCOUNT",
      "costStamps": 20,
      "discount": {
        "discountPercentage": 50,
        "currencyCode": "SAR"
      }
    }
  ]
}
```

---

## Example 4: Points Program with Multiple Rewards

### Request Body
```json
{
  "programType": "POINTS",
  "nameEn": "Gold Member Rewards",
  "nameAr": "مكافآت الأعضاء الذهبيين",
  "descriptionEn": "Premium rewards program for our valued customers",
  "status": "ACTIVE",
  
  "pointsRules": {
    "currencyCode": "SAR",
    "earnPointsPerCurrency": 2,
    "minSpendToEarn": 5,
    "roundingMode": "ROUND",
    "pointValueCurrency": 0.05,
    "pointTaxPercent": 0,
    "expiryDurationValue": 24,
    "expiryDurationUnit": "MONTH"
  },
  
  "pointsWalletDesign": {
    "cardColor": "#d4af37",
    "cardTitleColor": "#000000",
    "cardTextColor": "#333333"
  },
  
  "rewards": [
    {
      "voucherNameEn": "5 SAR Off",
      "voucherNameAr": "خصم 5 ريال",
      "rewardType": "DISCOUNT",
      "costPoints": 100,
      "discount": {
        "discountPercentage": 100,
        "maxDiscountAmount": 5,
        "currencyCode": "SAR"
      }
    },
    {
      "voucherNameEn": "Free Dessert",
      "voucherNameAr": "حلوى مجانية",
      "rewardType": "FREE_PRODUCT",
      "costPoints": 150,
      "freeProducts": [
        {
          "productSource": "FOODICS",
          "externalProductId": "dessert-001",
          "qtyFree": 1
        }
      ]
    },
    {
      "voucherNameEn": "25% Off Total Bill",
      "voucherNameAr": "خصم 25٪ على الفاتورة الإجمالية",
      "rewardType": "DISCOUNT",
      "costPoints": 300,
      "discount": {
        "discountPercentage": 25,
        "maxDiscountAmount": 75,
        "currencyCode": "SAR"
      }
    },
    {
      "voucherNameEn": "Combo Meal Deal",
      "voucherNameAr": "صفقة وجبة كومبو",
      "rewardType": "FREE_PRODUCT",
      "costPoints": 250,
      "freeProducts": [
        {
          "productSource": "INTERNAL",
          "internalProductId": 301,
          "qtyFree": 1
        },
        {
          "productSource": "INTERNAL",
          "internalProductId": 302,
          "qtyFree": 1
        }
      ]
    }
  ]
}
```

---

## Validation Rules

### For POINTS Program:
- ✅ `pointsRules` is **required**
- ✅ `pointsWalletDesign` is **required**
- ✅ All rewards must have `costPoints` (not `costStamps`)
- ✅ `earnPointsPerCurrency` must be > 0
- ✅ `pointValueCurrency` must be > 0
- ✅ `currencyCode` is required (e.g., "SAR")

### For STAMPS Program:
- ✅ `stampsRules` is **required**
- ✅ `stampsWalletDesign` is **required**
- ✅ All rewards must have `costStamps` (not `costPoints`)
- ✅ `stampsTarget` must be > 0
- ✅ `accrualRule` is required ("PER_VISIT" or "PER_ITEM")
- ✅ If `accrualRule` = "PER_ITEM", `stampsAccrualProducts` is **required** and must be non-empty

### For DISCOUNT Rewards:
- ✅ `discount` object is **required**
- ✅ `discountPercentage` must be between 0 and 100
- ✅ Cannot have `freeProducts`

### For FREE_PRODUCT Rewards:
- ✅ `freeProducts` array is **required** and must be non-empty
- ✅ Cannot have `discount` object
- ✅ INTERNAL products must have `internalProductId`
- ✅ FOODICS products must have `externalProductId`

---

## Response Example

```json
{
  "success": true,
  "data": {
    "program": {
      "program_id": "uuid-here",
      "org_id": "org-uuid",
      "program_type": "POINTS",
      "name_en": "VIP Points Rewards",
      "name_ar": "مكافآت النقاط الكبار",
      "description_en": "Earn points on every purchase...",
      "description_ar": "احصل على نقاط في كل عملية شراء...",
      "status": "ACTIVE",
      "created_at": "2026-01-20T...",
      "updated_at": "2026-01-20T...",
      "pointsRules": { ... },
      "pointsWallet": { ... },
      "rewards": [
        {
          "id": "reward-uuid-1",
          "voucher_name_en": "10% Off Discount",
          "reward_type": "DISCOUNT",
          "cost": { "cost_points": 100 },
          "discount": { "discount_percentage": 10, ... }
        },
        ...
      ]
    }
  }
}
```

---

## Error Examples

### Missing Required Fields (POINTS)
```json
{
  "programType": "POINTS",
  "nameEn": "Test",
  "rewards": []
}
```
**Error:** "At least one reward is required" (400)

### Wrong Cost Type
```json
{
  "programType": "POINTS",
  "pointsRules": { ... },
  "pointsWalletDesign": { ... },
  "rewards": [
    {
      "voucherNameEn": "Test",
      "rewardType": "DISCOUNT",
      "costStamps": 10,  // ❌ Should be costPoints for POINTS program
      "discount": { "discountPercentage": 10 }
    }
  ]
}
```
**Error:** "Reward 'Test' must have costPoints for POINTS program" (400)

### Missing Accrual Products
```json
{
  "programType": "STAMPS",
  "stampsRules": {
    "stampsTarget": 10,
    "accrualRule": "PER_ITEM"  // ❌ No stampsAccrualProducts provided
  },
  "stampsWalletDesign": { ... },
  "rewards": [ ... ]
}
```
**Error:** "Stamps accrual products are required when accrual rule is PER_ITEM" (400)
