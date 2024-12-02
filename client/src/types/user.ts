import { Person } from "./person";

export interface UserLevel {
  c_level: boolean;
  ceo_level: boolean;
}

interface IPlanningYear {
  year: number
}

export interface UserDetail {
  access: string;
  refresh: string;
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  forecast_id: string;
  company_id: string;
  company_name: string;
  created_at: string;
  modified_at: string;
  profile: string;
  profile_color_hash: string;
  is_active: boolean;
  is_ceo: boolean;
  is_success_manager: boolean;
  is_verified: boolean;
  user_level: UserLevel;
  direct_report: string;
  company_created_at: string;
  company_division_id: string;
  division_name: string;
  page_level_permission_id: string;
  planing_years: IPlanningYear[];
  ceo_details: Person,
}

export interface IPermission {
  r: boolean;
  w: boolean;
}
