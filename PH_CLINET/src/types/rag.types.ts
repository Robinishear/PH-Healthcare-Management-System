/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IRagQueryPayload {
  query: string;
  limit?: number;
  sourceType?: string;
}

export interface IRagSource {
  id: string;
  content: string;
  similarity: number;
  metadata?: {
    name: string;
    [key: string]: unknown;
  };
  sourceType?: string;
}

export interface IRagQueryData {
  answer: any;
  sources: IRagSource[];
  contextUsed: string;
}

export interface IIngestDoctorsData {
  success: boolean;
  message: string;
  indexedCount: number;
}