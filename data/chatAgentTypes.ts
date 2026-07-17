export type ChatAgentStage = "answering" | "qualifying" | "lead_capture" | "handoff" | "fallback";

export type ChatAgentLead = {
  name: string | null;
  phone: string | null;
  serviceInterest: string | null;
  summary: string | null;
};

export type ChatAgentConfig = {
  slug: string;
  businessName: string;
  niche: string;
  tone: string;
  location: string;
  phone: string;
  whatsappMessageBase: string;
  homepageUrl?: string;
  services: {
    title: string;
    description: string;
    commonQuestions: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  businessInfo: {
    hours: string;
    address: string;
    parking?: string;
    paymentMethods?: string[];
    appointmentRequired?: boolean;
    emergencyPolicy?: string;
  };
  leadGoals: {
    primaryGoal: string;
    secondaryGoal: string;
    requiredFields: string[];
  };
  suggestedReplies: string[];
  disclaimers: string[];
  forbiddenClaims: string[];
  escalationRules: string[];
  visual: {
    primary: string;
    accent: string;
    avatarLabel: string;
  };
};

export type ChatMessageInput = {
  role: "user" | "assistant";
  content: string;
};

export type ChatAgentReply = {
  reply: string;
  stage: ChatAgentStage;
  lead: ChatAgentLead;
  suggestedReplies: string[];
  handoff: {
    shouldShow: boolean;
    reason: string | null;
  };
  mockMode?: boolean;
};
