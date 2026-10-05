export const sectors = [
  "Healthcare",
  "Education",
  "Retail",
  "Finance",
  "Charity / Non-profit",
  "Technology",
  "Other",
];

export const sizes = [
  "1-10 people",
  "11-50 people",
  "51-250 people",
  "250+ people",
];

export const questions = [
  {
    id: "backups",
    label: "How do you back up important data?",
    options: [
      "Automatic backups, and we test restoring them",
      "Automatic backups, never tested",
      "Manual backups sometimes",
      "No backups",
    ],
  },
  {
    id: "mfa",
    label: "Is multi-factor authentication (MFA) used on accounts?",
    options: [
      "Yes, on all accounts",
      "Yes, on some accounts (e.g. email only)",
      "No",
      "Not sure",
    ],
  },
  {
    id: "patching",
    label: "How are software and device updates handled?",
    options: [
      "Automatically and monitored",
      "Automatic but not checked",
      "Left to individual staff",
      "Rarely updated",
    ],
  },
  {
    id: "incident_plan",
    label: "Do you have a plan for what to do during a cyber incident?",
    options: [
      "Written plan, practised regularly",
      "Written plan, never practised",
      "Informal / in people's heads",
      "No plan",
    ],
  },
  {
    id: "training",
    label: "Do staff receive security awareness training (e.g. phishing)?",
    options: ["Yes, regularly", "Once, at induction", "Rarely", "Never"],
  },
  {
    id: "access",
    label: "How is access to systems and data controlled?",
    options: [
      "Role-based, reviewed regularly",
      "Role-based, rarely reviewed",
      "Most people have access to most things",
      "Shared logins are common",
    ],
  },
  {
    id: "suppliers",
    label: "Do you check the security of suppliers and third-party tools?",
    options: ["Yes, formally", "Informally", "Rarely", "No"],
  },
  {
    id: "recovery",
    label: "If your systems went down, how long could you keep operating?",
    options: [
      "Several days with a tested fallback",
      "A day or so",
      "A few hours",
      "We would stop immediately",
    ],
  },
];
