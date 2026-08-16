"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserInfo } from "@/services/auth.services";
import { ingestDoctorService, queryRagService } from "@/services/rag.services";

export interface IQueryRagResult {
  success: boolean;
  answer?: string;
  sources?: string;
  error?: string;
}

export interface IIngestDoctorsResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export const queryRagAction = async (query: string): Promise<IQueryRagResult> => {
  try {
    if (!query || !query.trim()) {
      return {
        success: false,
        error: "Query cannot be empty",
      };
    }

    const response = await queryRagService({ query: query.trim() });

    if (!response?.data?.answer) {
      return {
        success: false,
        error: "No answer received from AI Assistant. Please try again.",
      };
    }

    let answer = response?.data?.answer;

    // if the answer is an object {doctors: [...]} convert it to readable string
    if (typeof answer === "object" && answer !== null) {
      if ("doctors" in answer && Array.isArray(answer.doctors)) {
        const doctors = answer.doctors.slice(0, 5);

        if (doctors.length > 0) {
          answer =
            `I found ${doctors.length} doctor${doctors.length > 1 ? "s" : ""} who may help you:\n\n` +
            doctors
              .map((d: any, i: number) => {
                let text = `Doctor ${i + 1}:\n`;
                if (d.name) text += `${i + 1}. **${d.name}**\n`;
                if (d.specialty) text += `Specialization: **${d.specialty}**\n`;
                if (d.reason) text += `Why: ${d.reason}\n`;
                return text + "\n";
              })
              .join("");
        } else {
          answer =
            "I couldn't find any doctors matching your query. Please try another query.";
        }
      }
    }

    let formattedSources: string | undefined = undefined;
    const similarityRaw = response?.data?.sources?.[0]?.similarity;
    if (similarityRaw !== undefined && similarityRaw !== null) {
      const matchScore = 100 - Number(similarityRaw) * 100;
      if (!Number.isNaN(matchScore)) {
        formattedSources = `${Math.max(0, Math.min(100, matchScore)).toFixed(2)}% match`;
      }
    }

    return {
      success: true,
      answer: typeof answer === "string" ? answer : JSON.stringify(answer),
      sources: formattedSources,
    };
  } catch (error: any) {
    console.error("queryRagAction error:", error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to query AI Assistant. Please try again.";
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const ingestDoctorsAction = async (): Promise<IIngestDoctorsResult> => {
  try {
    const userInfo = await getUserInfo();

    if (
      !userInfo ||
      (userInfo.role !== "ADMIN" && userInfo.role !== "SUPER_ADMIN")
    ) {
      return {
        success: false,
        error: "Unauthorized. Doctor knowledge synchronization is only available to Admins and Super Admins.",
      };
    }

    const response = await ingestDoctorService();

    return {
      success: true,
      message: response?.message || "Doctor knowledge base synced successfully.",
      data: response?.data,
    };
  } catch (error: any) {
    console.error("ingestDoctorsAction error:", error);
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to sync doctor knowledge base. Please try again later.";
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const getCurrentUserRoleAction = async (): Promise<{
  isAuthenticated: boolean;
  role: string | null;
}> => {
  try {
    const userInfo = await getUserInfo();
    return {
      isAuthenticated: Boolean(userInfo),
      role: userInfo?.role ?? null,
    };
  } catch {
    return {
      isAuthenticated: false,
      role: null,
    };
  }
};