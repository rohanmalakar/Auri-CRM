// Branch Types
export interface Branch {
  branch_id: string;
  org_id: string;
  name_en: string;
  name_ar: string;
  branch_phone_number: string;
  city: string;
  address: string;
  location_link?: string;
  status: 'Active' | 'Inactive' | 'Deleted';
  creation_datetime: string | Date;
}

export interface BranchFormData {
  name_en: string;
  name_ar: string;
  branch_phone_number: string;
  city: string;
  address: string;
  location_link?: string;
  status?: 'Active' | 'Inactive';
}

export interface BranchApiResponse {
  success: boolean;
  data: {
    branches: Branch[];
  };
}

export interface BranchDetailResponse {
  success: boolean;
  data: {
    branch: Branch;
  };
}
