import { api } from "./api";
import { Tender, CreateTenderPayload } from "../types/api";

export const getTenders = async (): Promise<Tender[]> => {
  const response = await api.get("/tenders");

  return response.data;
};

export const getDraftTenders = async (): Promise<Tender[]> => {
   const response = await api.get("/tenders/draft");

  return response.data;
};

export const createTender = async (
  payload: CreateTenderPayload
): Promise<Tender> => {
  const response = await api.post("/tenders", payload);

  return response.data;
};

export const publishTender = async (
  tenderId: string
): Promise<Tender> => {
  const response = await api.patch(`/tenders/${tenderId}/publish`);

  return response.data;
};