
export type DiagnosisResult = {
  title: string;
  possibleCauses: string[];
  recommendations: string[];
  severity: "low" | "medium" | "high";
  needsProfessional: boolean;
};

type Category =
  | "phone"
  | "laptop"
  | "headphones"
  | "home appliance"
  | "other";

type DiagnosisRule = {
  id: string;
  categories: Category[];
  keywords: string[];
  title: string;
  possibleCauses: string[];
  recommendations: string[];
  severity: DiagnosisResult["severity"];
  needsProfessional: boolean;
};

const allCategories: Category[] = [
  "phone",
  "laptop",
  "headphones",
  "home appliance",
  "other",
];

const diagnosisRules: DiagnosisRule[] = [
  {
    id: "charging",
    categories: ["phone", "laptop", "headphones", "home appliance", "other"],
    keywords: [
      "not charging",
      "won't charge",
      "wont charge",
      "charging problem",
      "charger not working",
      "slow charging",
    ],
    title: "Charging problem",
    possibleCauses: [
      "Damaged cable or adapter",
      "Debris or damage in the charging port",
      "Battery or charging circuit fault",
    ],
    recommendations: [
      "Try a compatible, undamaged charging cable and adapter.",
      "Check for visible debris without inserting objects into the port.",
      "If the problem continues, consult a technician.",
    ],
    severity: "medium",
    needsProfessional: true,
  },
  {
    id: "overheating",
    categories: allCategories,
    keywords: [
      "overheating",
      "too hot",
      "gets hot",
      "getting hot",
      "heating up",
    ],
    title: "Overheating problem",
    possibleCauses: [
      "Heavy usage or poor ventilation",
      "Battery or internal component fault",
      "A faulty power accessory",
    ],
    recommendations: [
      "Stop using the item and disconnect power if safe.",
      "Allow it to cool naturally in a ventilated place.",
      "If it is swollen, smoking, leaking, or dangerously hot, do not use or charge it; seek professional help.",
    ],
    severity: "high",
    needsProfessional: true,
  },
  {
    id: "screen",
    categories: ["phone", "laptop", "other"],
    keywords: [
      "cracked screen",
      "broken screen",
      "screen broken",
      "display broken",
      "screen not working",
      "touch not working",
    ],
    title: "Screen or display problem",
    possibleCauses: [
      "Physical damage to the display",
      "A fault with the display or touch components",
    ],
    recommendations: [
      "Avoid pressing on cracked glass.",
      "Back up important data if the device works safely.",
      "Ask a technician to assess the display.",
    ],
    severity: "medium",
    needsProfessional: true,
  },
  {
    id: "power",
    categories: ["phone", "laptop", "headphones", "home appliance", "other"],
    keywords: [
      "not turning on",
      "won't turn on",
      "wont turn on",
      "does not turn on",
      "no power",
      "won't start",
      "wont start",
    ],
    title: "Power problem",
    possibleCauses: [
      "Power supply or drained battery",
      "Faulty power connection",
      "Internal hardware fault",
    ],
    recommendations: [
      "Check the power connection if it is safe.",
      "Do not use a damaged cable or power adapter.",
      "If the item still will not start, consult a technician.",
    ],
    severity: "medium",
    needsProfessional: true,
  },
  {
    id: "performance",
    categories: ["phone", "laptop", "other"],
    keywords: [
      "slow",
      "lagging",
      "freezing",
      "freezes",
      "hanging",
      "hangs",
      "keeps crashing",
      "crashing",
    ],
    title: "Performance problem",
    possibleCauses: [
      "Limited storage or memory",
      "Too many apps or processes running",
      "Software or hardware issue",
    ],
    recommendations: [
      "Restart the device if it is safe.",
      "Check available storage and close unused apps.",
      "If the problem persists, check for software updates or consult a technician.",
    ],
    severity: "low",
    needsProfessional: false,
  },
  {
    id: "liquid",
    categories: ["phone", "laptop", "headphones", "home appliance", "other"],
    keywords: [
      "water damage",
      "liquid damage",
      "spilled water",
      "water inside",
      "got wet",
      "wet device",
    ],
    title: "Possible liquid damage",
    possibleCauses: [
      "Moisture inside the item",
      "Corrosion or damage to internal components",
    ],
    recommendations: [
      "Turn it off if you can do so safely.",
      "Do not charge it or use heat to dry it.",
      "Arrange a professional inspection.",
    ],
    severity: "high",
    needsProfessional: true,
  },
  {
    id: "battery",
    categories: ["phone", "laptop", "headphones", "other"],
    keywords: [
      "battery draining",
      "battery drains",
      "battery dying quickly",
      "battery dies quickly",
      "poor battery life",
      "battery not lasting",
    ],
    title: "Battery problem",
    possibleCauses: [
      "Battery ageing or deterioration",
      "High power consumption",
      "Battery or charging system fault",
    ],
    recommendations: [
      "Check battery usage if your device provides that information.",
      "Close apps consuming excessive power where applicable.",
      "If the battery is swollen or unusually hot, stop using and charging the item and seek professional help.",
    ],
    severity: "medium",
    needsProfessional: true,
  },
];

const fallbackResult: DiagnosisResult = {
  title: "More information is needed",
  possibleCauses: [
    "No matching diagnosis rule was found for this category and description.",
  ],
  recommendations: [
    "Describe exactly what happens when you use the item.",
    "Include any error messages, unusual sounds, or visible damage.",
    "If the item appears unsafe, stop using it and seek professional help.",
  ],
  severity: "low",
  needsProfessional: false,
};

const severityRank = {
  low: 1,
  medium: 2,
  high: 3,
};

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function normalizeCategory(value: string): Category {
  const category = value.toLowerCase().trim();

  if (category.includes("phone") || category.includes("mobile")) {
    return "phone";
  }

  if (category.includes("laptop") || category.includes("computer")) {
    return "laptop";
  }

  if (
    category.includes("headphone") ||
    category.includes("earphone") ||
    category.includes("earbud")
  ) {
    return "headphones";
  }

  if (
    category.includes("home appliance") ||
    category.includes("appliance")
  ) {
    return "home appliance";
  }

  return "other";
}

export function diagnoseProblem(
  problem: string,
  itemCategory = "other"
): DiagnosisResult {
  const normalizedProblem = problem
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedProblem) {
    return fallbackResult;
  }

  const category = normalizeCategory(itemCategory);

  const matches = diagnosisRules
    .filter((rule) => rule.categories.includes(category))
    .map((rule) => ({
      rule,
      score: rule.keywords.filter((keyword) =>
        normalizedProblem.includes(keyword)
      ).length,
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);

  if (matches.length === 0) {
    return fallbackResult;
  }

  const causes = uniqueStrings(
    matches.flatMap((match) => match.rule.possibleCauses)
  );

  const recommendations = uniqueStrings(
    matches.flatMap((match) => match.rule.recommendations)
  );

  const highestSeverity = matches.reduce<
    DiagnosisResult["severity"]
  >(
    (highest, match) =>
      severityRank[match.rule.severity] > severityRank[highest]
        ? match.rule.severity
        : highest,
    "low"
  );

  return {
    title:
      matches.length === 1
        ? matches[0].rule.title
        : "Multiple possible issues detected",
    possibleCauses: causes,
    recommendations,
    severity: highestSeverity,
    needsProfessional: matches.some(
      (match) => match.rule.needsProfessional
    ),
  };
}
