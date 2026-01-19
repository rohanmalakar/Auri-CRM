import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { orgUserApiService, branchApiService } from "@/utils/orgUserApi";
import { USER_TRANSLATIONS } from "./constants";
import type { CreateOrgUserPayload } from "./types";
import type { Branch } from "@/OrgUser/components/branches/types";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  orgId: string;
}

export default function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess,
  orgId,
}: CreateUserDialogProps) {
  const { language } = useAppSelector((state) => state.settings);
  const t = USER_TRANSLATIONS[language];
  const isRtl = language === 'ar';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string>("");

  const [form, setForm] = useState<CreateOrgUserPayload>({
    org_id: orgId,
    name: "",
    email: "",
    password: "",
    tel: "",
    address: "",
    picture: "",
    branch_id: undefined,
    designation: undefined,
  });

  // Fetch active branches
  const { data: branchesData, isLoading: branchesLoading } = useQuery({
    queryKey: ['active-branches', orgId],
    queryFn: async () => {
      const response = await branchApiService.getActiveBranches(orgId);
      return response.data.data.branches;
    },
    enabled: !!orgId && open,
  });

  const branches: Branch[] = branchesData || [];

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setForm({
        org_id: orgId,
        name: "",
        email: "",
        password: "",
        tel: "",
        address: "",
        picture: "",
        branch_id: undefined,
        designation: undefined,
      });
      setError("");
      setPictureFile(null);
      setPicturePreview("");
    }
  }, [open, orgId]);

  const handleChange = (field: string, value: string | number | undefined) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image');
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size must be less than 2MB');
      return;
    }

    setPictureFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPicturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setPictureFile(null);
    setPicturePreview('');
    setForm({ ...form, picture: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('org_id', form.org_id);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      
      if (form.tel) formData.append('tel', form.tel);
      if (form.address) formData.append('address', form.address);
      if (form.branch_id) formData.append('branch_id', form.branch_id);
      if (form.designation) formData.append('designation', form.designation);
      
      // Append the actual file if selected
      if (pictureFile) {
        formData.append('picture', pictureFile);
      }

      await orgUserApiService.createUser(formData);
      
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white dark:bg-black overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>{t.titles.createUser}</DialogTitle>
          <DialogDescription>
            {t.messages.createDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t.fields.name} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {t.fields.email} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {t.fields.password} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="space-y-2 bg-white dark:bg-black">
              <Label htmlFor="designation">
                {t.fields.designation} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.designation}
                onValueChange={(value) => handleChange("designation", value as 'Cashier' | 'Manager')}
                disabled={loading}
              >
                <SelectTrigger id="designation">
                  <SelectValue placeholder={t.placeholders.selectDesignation} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-black">
                  <SelectItem value="Cashier">{t.designations.cashier}</SelectItem>
                  <SelectItem value="Manager">{t.designations.manager}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch_id">
                {t.fields.branch} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.branch_id}
                onValueChange={(value) => handleChange("branch_id", value)}
                disabled={loading || branchesLoading}
              >
                <SelectTrigger id="branch_id">
                  <SelectValue placeholder={branchesLoading ? t.messages.loadingBranches : t.placeholders.selectBranch} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-black">
                  {branches.map((branch) => (
                    <SelectItem key={branch.branch_id} value={branch.branch_id}>
                      {branch.name_en} - {branch.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-2">
              <Label htmlFor="tel">{t.fields.phone}</Label>
              <Input
                id="tel"
                type="tel"
                value={form.tel}
                onChange={(e) => handleChange("tel", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t.fields.address}</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">{t.fields.picture}</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="picture-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">
                    {pictureFile ? pictureFile.name : (language === 'ar' ? 'اختر صورة' : 'Choose Image')}
                  </span>
                </label>
                <Input
                  id="picture-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                />
                {pictureFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'ar' 
                  ? 'JPG أو PNG، أقل من 2 ميجابايت' 
                  : 'JPG or PNG, less than 2MB'}
              </p>
              {picturePreview && (
                <div className="mt-2">
                  <img
                    src={picturePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t.actions.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
                  {t.messages.creating}
                </>
              ) : (
                t.actions.create
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
