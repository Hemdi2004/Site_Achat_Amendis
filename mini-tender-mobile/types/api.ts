export type TenderStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface Tender {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: TenderStatus;
  companyId: string;
  createdAt?: string;
}

export interface CreateTenderPayload {
  title: string;
  description: string;
  deadline: string;
}