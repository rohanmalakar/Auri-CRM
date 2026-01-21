import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";
import { 
  ArrowLeft, 
  Loader2, 
  Coins, 
  Stamp, 
  Gift, 
  Palette, 
  FileText, 
  Settings,
  CalendarClock,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// --- Types based on provided JSON ---
interface PointsRules {
  earn_points_per_currency: string;
  currency_code: string;
  min_spend_to_earn: string;
  point_value_currency: string;
  expiry_duration_value: number;
  expiry_duration_unit: string;
}

interface WalletDesign {
  card_color: string;
  card_title_color: string;
  card_text_color: string;
  strip_image_url: string;
  logo_url: string;
}

interface RewardCost {
  cost_points: number | null;
  cost_stamps: number | null;
}

interface Discount {
  discount_percentage: string;
  max_discount_amount: string;
}

interface FreeProduct {
  qty_free: number;
  product_source: string;
}

interface Reward {
  id: string;
  voucher_name_en: string;
  voucher_name_ar: string;
  voucher_description_en: string | null;
  voucher_description_ar: string | null;
  reward_type: 'DISCOUNT' | 'FREE_PRODUCT';
  status: string;
  cost: RewardCost;
  discount: Discount | null;
  freeProducts: FreeProduct[];
}

interface LoyaltyProgramDetail {
  program_id: string;
  program_type: 'POINTS' | 'STAMPS';
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  terms_en: string;
  terms_ar: string;
  how_to_use_en: string;
  how_to_use_ar: string;
  status: string;
  pointsRules: PointsRules | null;
  stampsRules: any | null; // Define if you have stamp structure
  pointsWallet: WalletDesign | null;
  stampsWallet: WalletDesign | null;
  rewards: Reward[];
}

export default function LoyaltyProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useAppSelector((state) => state.settings);
  const isEn = language === 'en';

  // Fetch Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['loyalty-program', id],
    queryFn: async () => {
      // Adjusted API call based on your prompt
      const response = await api.get(`/loyalty/programs/detail/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 font-semibold">Failed to load program details</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const program: LoyaltyProgramDetail = data.data.program;
  const isPoints = program.program_type === 'POINTS';
  const wallet = isPoints ? program.pointsWallet : program.stampsWallet;

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-zinc-950 min-h-screen" dir={isEn ? "ltr" : "rtl"}>
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEn ? program.name_en : program.name_ar}
              </h1>
              <Badge variant={program.status === 'ACTIVE' ? 'default' : 'secondary'} 
                className={program.status === 'ACTIVE' ? "bg-green-600" : ""}>
                {program.status}
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              {isPoints ? <Coins className="w-4 h-4 text-purple-500" /> : <Stamp className="w-4 h-4 text-blue-500" />}
              <span className="font-medium">{program.program_type} Program</span>
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/admin/loyalty/edit/${program.program_id}`)}>
          Edit Program
        </Button>
      </div>

      {/* --- Main Content Tabs --- */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-white dark:bg-zinc-900 border dark:border-zinc-800">
          <TabsTrigger value="overview">{isEn ? "Overview" : "نظرة عامة"}</TabsTrigger>
          <TabsTrigger value="rules">{isEn ? "Rules" : "القواعد"}</TabsTrigger>
          <TabsTrigger value="wallet">{isEn ? "Wallet Design" : "تطيم المحفظة"}</TabsTrigger>
          <TabsTrigger value="rewards">{isEn ? "Rewards" : "المكافآت"}</TabsTrigger>
        </TabsList>

        {/* 1. Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                {isEn ? "Program Details" : "تفاصيل البرنامج"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {isEn ? "Description" : "الوصف"}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {isEn ? program.description_en : program.description_ar}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {isEn ? "How to Use" : "كيفية الاستخدام"}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {isEn ? program.how_to_use_en : program.how_to_use_ar}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {isEn ? "Terms & Conditions" : "الشروط والأحكام"}
                </h3>
                <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300 border dark:border-zinc-800">
                  {isEn ? program.terms_en : program.terms_ar}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Rules Tab */}
        <TabsContent value="rules" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-500" />
                  {isEn ? "Earning Logic" : "قواعد الكسب"}
                </CardTitle>
                <CardDescription>
                  {isPoints 
                    ? "How customers earn points per currency spent" 
                    : "How customers earn stamps"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPoints && program.pointsRules ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800">
                      <span className="text-gray-500">Earn Rate</span>
                      <span className="font-bold">
                        {Math.round(Number(program.pointsRules.earn_points_per_currency))} Points / 1 {program.pointsRules.currency_code}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800">
                      <span className="text-gray-500">Minimum Spend</span>
                      <span className="font-medium">
                        {program.pointsRules.min_spend_to_earn} {program.pointsRules.currency_code}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800">
                      <span className="text-gray-500">Point Value</span>
                      <span className="font-medium">
                        1 Point = {program.pointsRules.point_value_currency} {program.pointsRules.currency_code}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No rules configuration found.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-orange-500" />
                  {isEn ? "Expiration" : "انتهاء الصلاحية"}
                </CardTitle>
                <CardDescription>Validity of points/stamps</CardDescription>
              </CardHeader>
              <CardContent>
                 {isPoints && program.pointsRules ? (
                   <div className="flex flex-col gap-2">
                      <span className="text-3xl font-bold">
                        {program.pointsRules.expiry_duration_value}
                      </span>
                      <span className="text-gray-500 uppercase tracking-wide font-semibold">
                        {program.pointsRules.expiry_duration_unit}(s)
                      </span>
                      <p className="text-sm text-gray-400 mt-2">
                        Points earned will expire automatically after this period if not redeemed.
                      </p>
                   </div>
                 ) : (
                   <p className="text-gray-500">No expiration set.</p>
                 )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. Wallet Design Tab */}
        <TabsContent value="wallet" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-500" />
                {isEn ? "Digital Card Preview" : "معاينة البطاقة الرقمية"}
              </CardTitle>
              <CardDescription>This is how the card appears in the customer's wallet</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8 items-center">
              
              {/* Preview Box */}
              {wallet ? (
                <div 
                  className="w-[340px] h-[200px] rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between p-6 transition-all hover:scale-105"
                  style={{ backgroundColor: wallet.card_color }}
                >
                  <div className="flex justify-between items-start z-10">
                    <div className="flex items-center gap-3">
                       {/* Logo Mockup */}
                       <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                         {wallet.logo_url ? <img src={wallet.logo_url} className="w-8 h-8 rounded-full" /> : <Wallet className="text-white w-5 h-5" />}
                       </div>
                       <span className="font-bold text-lg" style={{ color: wallet.card_title_color }}>
                         {isEn ? program.name_en : program.name_ar}
                       </span>
                    </div>
                  </div>

                  <div className="z-10">
                    <p className="text-sm mb-1 opacity-80" style={{ color: wallet.card_text_color }}>Balance</p>
                    <p className="text-3xl font-bold" style={{ color: wallet.card_text_color }}>
                      2,500 {isPoints ? 'Pts' : 'Stamps'}
                    </p>
                  </div>

                  {/* Decorative Background Circles */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/5 rounded-full blur-xl"></div>
                </div>
              ) : (
                <div className="w-[340px] h-[200px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  No design config
                </div>
              )}

              {/* Design Details */}
              <div className="flex-1 w-full grid grid-cols-2 gap-4">
                 <div className="p-4 border rounded-lg dark:border-zinc-800">
                    <span className="text-xs text-gray-500 uppercase">Card Color</span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded border shadow-sm" style={{ backgroundColor: wallet?.card_color }}></div>
                      <span className="font-mono">{wallet?.card_color}</span>
                    </div>
                 </div>
                 <div className="p-4 border rounded-lg dark:border-zinc-800">
                    <span className="text-xs text-gray-500 uppercase">Title Color</span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded border shadow-sm" style={{ backgroundColor: wallet?.card_title_color }}></div>
                      <span className="font-mono">{wallet?.card_title_color}</span>
                    </div>
                 </div>
                 <div className="p-4 border rounded-lg dark:border-zinc-800">
                    <span className="text-xs text-gray-500 uppercase">Text Color</span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded border shadow-sm" style={{ backgroundColor: wallet?.card_text_color }}></div>
                      <span className="font-mono">{wallet?.card_text_color}</span>
                    </div>
                 </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4 mt-6">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Rewards ({program.rewards.length})</h2>
              <Button size="sm" variant="outline">Add Reward</Button>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {program.rewards.map((reward) => (
               <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow">
                 <div className="h-2 bg-pink-500 w-full"></div>
                 <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                       <CardTitle className="text-base">
                         {isEn ? reward.voucher_name_en : reward.voucher_name_ar}
                       </CardTitle>
                       <Badge variant="outline">{reward.reward_type.replace('_', ' ')}</Badge>
                    </div>
                    <CardDescription>
                      {isEn ? reward.voucher_description_en : reward.voucher_description_ar}
                    </CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-2 text-sm font-semibold text-pink-600 bg-pink-50 dark:bg-pink-900/20 p-2 rounded-md w-fit">
                       <Gift className="w-4 h-4" />
                       <span>
                         {reward.cost.cost_points ? `${reward.cost.cost_points} Points` : `${reward.cost.cost_stamps} Stamps`}
                       </span>
                    </div>
                    
                    {/* Specific details based on type */}
                    {reward.reward_type === 'DISCOUNT' && reward.discount && (
                      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                        <p>Discount: {Math.floor(Number(reward.discount.discount_percentage))}%</p>
                        <p>Max Amount: {reward.discount.max_discount_amount} {program.pointsRules?.currency_code}</p>
                      </div>
                    )}

                    {reward.reward_type === 'FREE_PRODUCT' && reward.freeProducts.length > 0 && (
                      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                        <p>Quantity: {reward.freeProducts[0].qty_free}</p>
                        <p>Item Source: {reward.freeProducts[0].product_source}</p>
                      </div>
                    )}
                 </CardContent>
               </Card>
             ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}