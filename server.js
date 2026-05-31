const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const DATA_FILE = path.join(__dirname, "data.json");
const PUBLIC_DIR = path.join(__dirname, "public");

const ASSET_CATEGORIES = {
  cash: ["bank", "savings", "current account", "cash", "wallet", "deposit", "fd", "fixed deposit"],
  market_investment: ["stock", "share", "etf", "mutual fund", "bond", "broker", "demat", "isin"],
  private_investment: ["startup", "angel", "safe", "convertible", "private equity", "llp", "venture", "fund"],
  real_estate: ["property", "flat", "house", "land", "apartment", "plot", "real estate"],
  retirement: ["401k", "ira", "provident", "epf", "ppf", "nps", "pension", "retirement"],
  precious_metals: ["gold", "silver", "jewelry", "jewellery", "sovereign gold", "bullion"],
  insurance_cash_value: ["endowment", "ulip", "whole life", "cash value", "surrender value", "policy"],
  crypto: ["bitcoin", "ethereum", "crypto", "wallet", "token", "usdt", "btc", "eth"],
  receivable: ["lent", "loan given", "owed to me", "receivable", "deposit paid", "refund"],
  business_ownership: ["business", "company", "partnership", "inventory", "revenue", "royalty"]
};

const LIABILITY_CATEGORIES = {
  credit_card: ["credit card", "card bill", "statement due", "minimum due"],
  loan: ["loan", "emi", "mortgage", "home loan", "personal loan", "education loan", "auto loan"],
  tax: ["tax payable", "capital gains tax", "income tax", "gst", "irs", "tds demand"],
  payable: ["owed by me", "payable", "bill due", "rent due", "invoice due"],
  investment_obligation: ["margin", "short position", "capital call", "borrowed crypto", "futures"]
};

function defaultData() {
  return {
    items: [],
    drafts: [],
    snapshots: [],
    settings: {
      baseCurrency: "INR",
      targetNetWorth: 10000000,
      targetDate: "2030-12-31",
      monthlyContribution: 50000,
      expectedAnnualGrowthPct: 7
    }
  };
}

function demoData() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    ...defaultData(),
    items: [
      {
        id: "item_demo_savings",
        status: "confirmed",
        sourceType: "manual",
        createdAt: new Date().toISOString(),
        type: "asset",
        category: "cash",
        subcategory: "savings",
        name: "Emergency fund",
        institution: "Demo Bank",
        currency: "INR",
        currentValue: 650000,
        asOfDate: today,
        liquidity: "cash",
        confidence: 0.96,
        includeInNetWorth: "confirmed",
        missingFields: [],
        notes: ["Demo item: highly liquid, user-confirmed balance."]
      },
      {
        id: "item_demo_mutual_funds",
        status: "confirmed",
        sourceType: "manual",
        createdAt: new Date().toISOString(),
        type: "asset",
        category: "market_investment",
        subcategory: "mutual fund",
        name: "Index mutual funds",
        institution: "Demo Broker",
        currency: "INR",
        currentValue: 1850000,
        asOfDate: today,
        liquidity: "liquid",
        confidence: 0.91,
        includeInNetWorth: "confirmed",
        missingFields: [],
        notes: ["Demo item: market-linked asset entered as a confirmed holding."]
      },
      {
        id: "item_demo_gold",
        status: "confirmed",
        sourceType: "ai_document",
        createdAt: new Date().toISOString(),
        type: "asset",
        category: "precious_metals",
        subcategory: "gold",
        name: "Gold jewelry from invoice",
        institution: "",
        currency: "INR",
        currentValue: 420000,
        asOfDate: today,
        liquidity: "semi_liquid",
        confidence: 0.58,
        includeInNetWorth: "estimated",
        missingFields: ["latest market value", "purity verification"],
        notes: ["Demo item: AI-assisted value from invoice text; flagged as lower confidence."]
      },
      {
        id: "item_demo_home_loan",
        status: "confirmed",
        sourceType: "manual",
        createdAt: new Date().toISOString(),
        type: "liability",
        category: "loan",
        subcategory: "home loan",
        name: "Home loan outstanding",
        institution: "Demo Housing Finance",
        currency: "INR",
        currentValue: 1200000,
        asOfDate: today,
        liquidity: "not_applicable",
        confidence: 0.89,
        includeInNetWorth: "confirmed",
        missingFields: [],
        notes: ["Demo liability: outstanding principal reduces net worth."]
      }
    ],
    drafts: [
      {
        id: "draft_demo_startup",
        status: "needs_review",
        sourceType: "user_description",
        createdAt: new Date().toISOString(),
        type: "asset",
        category: "private_investment",
        subcategory: "startup",
        name: "Friend's startup investment",
        institution: "",
        counterparty: "Private company",
        currency: "INR",
        currentValue: 200000,
        amountInvested: 200000,
        principalOutstanding: null,
        asOfDate: today,
        liquidity: "illiquid",
        confidence: 0.62,
        includeInNetWorth: "estimated",
        missingFields: ["ownership percentage", "latest valuation or statement", "liquidity terms"],
        notes: [
          "Drafted from a user explanation.",
          "Suggested treatment: track at cost until a current valuation is available.",
          "Review classification and value before including this in confirmed net worth."
        ],
        rawInput: "I invested 2 lakh in my friend's startup in 2021. I do not know the current valuation."
      }
    ],
    snapshots: [],
    settings: {
      baseCurrency: "INR",
      targetNetWorth: 10000000,
      targetDate: "2030-12-31",
      monthlyContribution: 75000,
      expectedAnnualGrowthPct: 7
    }
  };
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return defaultData();
  return { ...defaultData(), ...JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const cleaned = String(value).replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function detectCurrency(text) {
  const lower = text.toLowerCase();
  if (text.includes("₹") || lower.includes("inr") || lower.includes("rs.")) return "INR";
  if (text.includes("$") || lower.includes("usd")) return "USD";
  if (text.includes("€") || lower.includes("eur")) return "EUR";
  if (text.includes("£") || lower.includes("gbp")) return "GBP";
  return "INR";
}

function extractAmount(text) {
  const normalized = text.replace(/,/g, "");
  const lakh = normalized.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakh|lac|lakhs|lacs)\b/i);
  if (lakh) return Math.round(Number(lakh[1]) * 100000);
  const crore = normalized.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(crore|cr)\b/i);
  if (crore) return Math.round(Number(crore[1]) * 10000000);
  const currencyAmount = normalized.match(/(?:₹|rs\.?|inr|\$|usd|eur|€|gbp|£)\s*(\d+(?:\.\d+)?)/i);
  if (currencyAmount) return Number(currencyAmount[1]);
  const plainAmount = normalized.match(/\b(\d{4,}(?:\.\d+)?)\b/);
  return plainAmount ? Number(plainAmount[1]) : null;
}

function matchCategory(text, map) {
  const lower = text.toLowerCase();
  let best = { category: null, score: 0, hits: [] };
  for (const [category, terms] of Object.entries(map)) {
    const hits = terms.filter(term => lower.includes(term));
    if (hits.length > best.score) best = { category, score: hits.length, hits };
  }
  return best;
}

function humanize(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function buildDraft(input) {
  const text = [input.description, input.documentText, input.transactionText].filter(Boolean).join("\n");
  const sourceType = input.sourceType || (input.documentText ? "document_text" : "user_description");
  const assetMatch = matchCategory(text, ASSET_CATEGORIES);
  const liabilityMatch = matchCategory(text, LIABILITY_CATEGORIES);
  const type = liabilityMatch.score > assetMatch.score ? "liability" : "asset";
  const match = type === "asset" ? assetMatch : liabilityMatch;
  const category = match.category || (type === "asset" ? "other_asset" : "other_liability");
  const amount = toNumber(input.value) ?? extractAmount(text);
  const currentValue = amount;
  const confidence = Math.min(
    0.92,
    0.28 + (match.score * 0.16) + (amount ? 0.18 : 0) + (input.documentText ? 0.12 : 0)
  );
  const missingFields = [];

  if (!amount) missingFields.push("current value or outstanding amount");
  if (!input.name && !match.hits.length) missingFields.push("clear instrument name");
  if (category.includes("private") || category === "business_ownership") {
    missingFields.push("ownership percentage", "latest valuation or statement", "liquidity terms");
  }
  if (category === "real_estate") missingFields.push("current property valuation", "ownership percentage");
  if (category === "loan") missingFields.push("interest rate", "next due date");

  const notes = [
    `Drafted from ${sourceType.replace(/_/g, " ")}.`,
    "Review classification and value before including this in confirmed net worth."
  ];
  if (confidence < 0.6) notes.push("Low confidence: the source did not include enough detail.");
  if (amount && (category === "private_investment" || category === "business_ownership")) {
    notes.push("Suggested treatment: track at cost until a current valuation is available.");
  }

  return {
    id: id("draft"),
    status: "needs_review",
    sourceType,
    createdAt: new Date().toISOString(),
    type,
    category,
    subcategory: match.hits[0] || "unknown_terms",
    name: input.name || humanize(category),
    institution: input.institution || "",
    counterparty: input.counterparty || "",
    currency: input.currency || detectCurrency(text),
    currentValue,
    amountInvested: type === "asset" ? amount : null,
    principalOutstanding: type === "liability" ? amount : null,
    asOfDate: input.asOfDate || new Date().toISOString().slice(0, 10),
    liquidity: type === "liability" ? "not_applicable" : inferLiquidity(category),
    confidence: Number(confidence.toFixed(2)),
    includeInNetWorth: amount ? "estimated" : "unknown_value",
    missingFields,
    notes,
    rawInput: text.slice(0, 4000)
  };
}

function inferLiquidity(category) {
  if (category === "cash") return "cash";
  if (category === "market_investment" || category === "crypto") return "liquid";
  if (category === "retirement" || category === "insurance_cash_value") return "locked";
  if (category === "real_estate" || category === "private_investment" || category === "business_ownership") return "illiquid";
  return "semi_liquid";
}

function summarize(data) {
  const confirmedItems = data.items.filter(item => item.status === "confirmed");
  const assets = confirmedItems.filter(item => item.type === "asset");
  const liabilities = confirmedItems.filter(item => item.type === "liability");
  const totalAssets = assets.reduce((sum, item) => sum + (Number(item.currentValue) || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + (Number(item.currentValue) || 0), 0);
  const lowConfidenceAssets = assets
    .filter(item => item.confidence < 0.65)
    .reduce((sum, item) => sum + (Number(item.currentValue) || 0), 0);
  const confirmedNetWorth = confirmedItems
    .filter(item => item.confidence >= 0.65)
    .reduce((sum, item) => sum + (item.type === "asset" ? 1 : -1) * (Number(item.currentValue) || 0), 0);

  return {
    totalAssets,
    totalLiabilities,
    estimatedNetWorth: totalAssets - totalLiabilities,
    confirmedNetWorth,
    lowConfidenceAssets,
    uncertainValue: lowConfidenceAssets + data.drafts.reduce((sum, item) => sum + (Number(item.currentValue) || 0), 0),
    pendingDrafts: data.drafts.length,
    itemCount: data.items.length
  };
}

function projectGoal(settings, currentNetWorth) {
  const target = Number(settings.targetNetWorth) || 0;
  const monthly = Number(settings.monthlyContribution) || 0;
  const annualGrowth = (Number(settings.expectedAnnualGrowthPct) || 0) / 100;
  const targetDate = new Date(settings.targetDate);
  const now = new Date();
  const months = Math.max(1, (targetDate.getFullYear() - now.getFullYear()) * 12 + targetDate.getMonth() - now.getMonth());
  const monthlyGrowth = Math.pow(1 + annualGrowth, 1 / 12) - 1;
  let projected = currentNetWorth;
  for (let i = 0; i < months; i += 1) projected = projected * (1 + monthlyGrowth) + monthly;
  const gap = target - projected;
  const requiredMonthly = monthlyGrowth === 0
    ? (target - currentNetWorth) / months
    : (target - currentNetWorth * Math.pow(1 + monthlyGrowth, months)) * monthlyGrowth / (Math.pow(1 + monthlyGrowth, months) - 1);

  return {
    target,
    targetDate: settings.targetDate,
    months,
    currentNetWorth,
    projectedNetWorth: Math.round(projected),
    gap: Math.round(gap),
    requiredMonthlyIncrease: Math.max(0, Math.round(requiredMonthly - monthly)),
    assumptions: {
      monthlyContribution: monthly,
      expectedAnnualGrowthPct: Number(settings.expectedAnnualGrowthPct) || 0,
      taxesIncluded: false,
      inflationIncluded: false,
      lowConfidenceItemsIncluded: true
    },
    indications: [
      "Increase recurring monthly net additions.",
      "Add periodic lump-sum contributions.",
      "Reduce high-interest liabilities faster.",
      "Improve data confidence for unknown or estimated assets."
    ]
  };
}

function serveStatic(req, res) {
  const requestedPath = req.url === "/" ? "/index.html" : decodeURIComponent(req.url);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    const contentType = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".json": "application/json"
    }[ext] || "text/plain";
    res.writeHead(200, { "content-type": contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const data = loadData();

    if (req.method === "GET" && req.url === "/api/summary") {
      return sendJson(res, 200, { summary: summarize(data), settings: data.settings });
    }

    if (req.method === "GET" && req.url === "/api/items") {
      return sendJson(res, 200, { items: data.items, drafts: data.drafts });
    }

    if (req.method === "POST" && req.url === "/api/intake/draft") {
      const body = await parseBody(req);
      const draft = buildDraft(body);
      data.drafts.unshift(draft);
      saveData(data);
      return sendJson(res, 201, { draft });
    }

    if (req.method === "POST" && req.url === "/api/demo/seed") {
      const seeded = demoData();
      saveData(seeded);
      return sendJson(res, 200, {
        message: "Demo workspace loaded",
        summary: summarize(seeded),
        settings: seeded.settings
      });
    }

    if (req.method === "POST" && req.url === "/api/demo/reset") {
      const empty = defaultData();
      saveData(empty);
      return sendJson(res, 200, {
        message: "Demo workspace reset",
        summary: summarize(empty),
        settings: empty.settings
      });
    }

    if (req.method === "POST" && req.url.startsWith("/api/drafts/") && req.url.endsWith("/confirm")) {
      const draftId = req.url.split("/")[3];
      const body = await parseBody(req);
      const draft = data.drafts.find(item => item.id === draftId);
      if (!draft) return sendJson(res, 404, { error: "Draft not found" });
      const confirmed = {
        ...draft,
        ...body,
        id: id("item"),
        draftId: draft.id,
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
        currentValue: toNumber(body.currentValue) ?? draft.currentValue ?? 0,
        confidence: Number(body.confidence ?? draft.confidence)
      };
      delete confirmed.rawInput;
      data.drafts = data.drafts.filter(item => item.id !== draftId);
      data.items.unshift(confirmed);
      saveData(data);
      return sendJson(res, 201, { item: confirmed, summary: summarize(data) });
    }

    if (req.method === "POST" && req.url === "/api/items/manual") {
      const body = await parseBody(req);
      const item = {
        id: id("item"),
        status: "confirmed",
        sourceType: "manual",
        createdAt: new Date().toISOString(),
        type: body.type || "asset",
        category: body.category || "other",
        subcategory: body.subcategory || "",
        name: body.name || "Manual item",
        institution: body.institution || "",
        currency: body.currency || data.settings.baseCurrency,
        currentValue: toNumber(body.currentValue) || 0,
        asOfDate: body.asOfDate || new Date().toISOString().slice(0, 10),
        liquidity: body.liquidity || "semi_liquid",
        confidence: Number(body.confidence || 0.9),
        includeInNetWorth: "confirmed",
        missingFields: [],
        notes: body.notes ? [body.notes] : ["Manually entered by user."]
      };
      data.items.unshift(item);
      saveData(data);
      return sendJson(res, 201, { item, summary: summarize(data) });
    }

    if (req.method === "POST" && req.url === "/api/settings") {
      const body = await parseBody(req);
      data.settings = { ...data.settings, ...body };
      saveData(data);
      return sendJson(res, 200, { settings: data.settings, goal: projectGoal(data.settings, summarize(data).estimatedNetWorth) });
    }

    if (req.method === "GET" && req.url === "/api/goal") {
      return sendJson(res, 200, { goal: projectGoal(data.settings, summarize(data).estimatedNetWorth) });
    }

    if (req.url.startsWith("/api/")) return sendJson(res, 404, { error: "Route not found" });
    serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Net Worth AI MVP running at http://${HOST}:${PORT}`);
});
