import { api } from "./api";

export interface Bid {
  id: string;
  tenderId: string;
  companyId: string;
  amount: number;
  technicalDocUrl: string;
  financialDocUrl: string;
  createdAt: string;
}

export const submitBid = async (
  tenderId: string,
  amount: number,
  technicalDocUrl: string,
  financialDocUrl: string
): Promise<Bid> => {
  const response = await api.post(`api/tenders/${tenderId}/bids`, {
    amount,
    technicalDocUrl,
    financialDocUrl,
  });

  return response.data;
};

export const getMyBids = async (): Promise<Bid[]> => {
  const response = await api.get("api/bids/mine");

  return response.data;
};