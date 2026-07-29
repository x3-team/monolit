import assert from "node:assert/strict";
import test from "node:test";
import { validateExtractedData, validateInn } from "@/lib/validation";

test("validateInn accepts known valid 10-digit INN", () => {
  assert.equal(validateInn("7707083893"), true);
});

test("validateInn rejects bad checksum", () => {
  assert.equal(validateInn("7707083890"), false);
});

test("validateExtractedData flags amount mismatch", () => {
  const result = validateExtractedData(
    {
      total_amount: 100,
      net_amount: 80,
      vat_amount: 10,
    },
    [
      { targetFieldName: "total_amount", dataType: "NUMBER", required: true },
      { targetFieldName: "net_amount", dataType: "NUMBER" },
      { targetFieldName: "vat_amount", dataType: "NUMBER" },
    ],
    0.95
  );
  assert.equal(result.needsReview, true);
  assert.ok(result.issues.some((i) => i.code === "AMOUNT_MISMATCH"));
});
