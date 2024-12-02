// import { Division } from "./division";
// import { Person } from "./person";

// export interface KpiFrequencyData {
//   target: Record<string, number>;
//   actual: Record<string, number>;
//   percentage: Record<string, number>;
// }

// export interface ReportingPersonCompany {
//   id: string;
//   is_active: boolean;
//   name: string;
// }

// export interface KpiReportingPerson {
//   id: string;
//   company_details: ReportingPersonCompany;
//   username: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   profile_image: string;
//   profile_color_hash: string;
// }

// export interface KpiFrequency {
//   kpi_data: KpiFrequencyData;
//   reporting_person: KpiReportingPerson;
// }

// export interface KpiReport {
//   id: string;
//   kpi_frequency: KpiFrequency;
//   unit: string;
//   name: string;
//   unit_type: string;
//   logic_level: string;
//   created_at: string;
// }

// export interface Reportee {
//   id: string;
//   reportee: Person;
//   created_at: string;
//   modified_at: string;
//   is_active: boolean;
//   senior_id: string;
//   reportee_id: string;
//   totalKpiCount?: number;
//   kpiReports?: KpiReport[];
//   reportee_division: Division;
//   reportee_found: boolean;
//   direct_report: string;
//   kpi_count: number;
// }
