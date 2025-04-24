// utils/computeRisk.js

import Sentiment from "sentiment";

const WEIGHTS = {
  keywords:  0.35,  // ↑ keywords weight
  urls:      0.10,
  moneyAsk:  0.25,  // ↑ moneyAsk weight
  userTrust: 0.10,
  feedback:  0.10,
  sentiment: 0.10
};

// Expanded keyword list
const KEYWORDS = [
  "urgent","limited time","verify","account","password",
  "threat","legal","action","police","ssn",
  "owe","wire","transfer","tax","irs","immediately"
];

export default async function computeRisk({ text, urls, userMeta, feedbackMeta }) {
  const lower = text.toLowerCase();

  // 1) Keyword score
  const foundCount = KEYWORDS.filter(k => lower.includes(k)).length;
  const keywords = Math.min(1, foundCount / KEYWORDS.length);

  // 2) URL score
  const urlsScore = urls.length ? 1 : 0;

  // 3) Money-ask
  const moneyAsk = /\$|\bwire\b|\btransfer\b|gift card|ssn/.test(lower) ? 1 : 0;

  // 4) User trust
  const days = (Date.now() - new Date(userMeta.createdAt)) / 86400000;
  const userTrust = Math.min(1, Math.max(0, (30 - days) / 30));

  // 5) Feedback
  const { upVotes = 0, downVotes = 0 } = feedbackMeta;
  const feedback = upVotes + downVotes ? downVotes / (upVotes + downVotes) : 0;

  // 6) Sentiment
  const sentimentRaw = new Sentiment().analyze(text).comparative; // –1..+1
  const sentimentScore = sentimentRaw < 0 ? Math.min(1, -sentimentRaw) : 0;

  // Combine
  const raw =
    WEIGHTS.keywords  * keywords +
    WEIGHTS.urls      * urlsScore +
    WEIGHTS.moneyAsk  * moneyAsk +
    WEIGHTS.userTrust * userTrust +
    WEIGHTS.feedback  * feedback +
    WEIGHTS.sentiment * sentimentScore;

  // Map to 1–5
  const riskLevel = Math.min(5, Math.ceil(raw * 5));

  return {
    riskLevel,
    riskScores: { keywords, urls: urlsScore, moneyAsk, userTrust, feedback, sentiment: sentimentScore }
  };
}
