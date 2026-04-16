// backend/src/lib/narrativeValidator.ts
// Post-processing validation pass for AI-generated narrative text.
// Catches wrong-industry language and flags neverMention violations.

import { getVerticalContext } from './verticalContext'

export interface ValidationResult {
  passed:     boolean
  violations: string[]
  text:       string
}

// Cross-industry contamination patterns: maps a forbidden term to the
// industries it is legitimate in, so we can skip the check when the
// audited business is in one of those industries.
const CROSS_VERTICAL_GUARDS: Array<{
  terms:          RegExp
  legitimateIn:   string[]
  description:    string
}> = [
  {
    terms:        /\bpatients?\b/gi,
    legitimateIn: ['DENTAL', 'MEDICAL', 'VETERINARY'],
    description:  'medical/patient language in non-healthcare vertical',
  },
  {
    terms:        /\b(attorney|attorneys|counsel|legal advice)\b/gi,
    legitimateIn: ['LAW_FIRM'],
    description:  'legal professional language in non-legal vertical',
  },
  {
    terms:        /\b(prescription|diagnos(?:is|e[ds])|symptoms?)\b/gi,
    legitimateIn: ['MEDICAL', 'DENTAL', 'VETERINARY'],
    description:  'clinical/medical language in non-healthcare vertical',
  },
  {
    terms:        /\b(menu|diners?|reservation|cuisine|restaurant)\b/gi,
    legitimateIn: ['RESTAURANT'],
    description:  'restaurant language in non-restaurant vertical',
  },
  {
    terms:        /\b(bays?|oil change|brake[ds]?|transmission)\b/gi,
    legitimateIn: ['AUTO_REPAIR'],
    description:  'auto repair language in non-automotive vertical',
  },
]

/**
 * Validate and sanitise AI-generated narrative text against vertical rules.
 *
 * Returns:
 *   - passed:     true if no violations found
 *   - violations: list of human-readable violation descriptions
 *   - text:       the original text (callers decide whether to discard or keep)
 */
export function validateNarrative(text: string, industry: string): ValidationResult {
  const ctx        = getVerticalContext(industry)
  const violations: string[] = []

  // 1. Check neverMention words from the vertical's own config
  for (const word of ctx.neverMention) {
    if (!word) continue
    // Escape special regex characters in the word/phrase
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex   = new RegExp(`\\b${escaped}\\b`, 'gi')
    if (regex.test(text)) {
      violations.push(`Forbidden term for ${industry}: "${word}"`)
    }
  }

  // 2. Cross-vertical contamination checks
  for (const guard of CROSS_VERTICAL_GUARDS) {
    if (guard.legitimateIn.includes(industry)) continue
    if (guard.terms.test(text)) {
      violations.push(`Cross-vertical contamination (${guard.description})`)
    }
    // Reset lastIndex for global regexes used in test()
    guard.terms.lastIndex = 0
  }

  return {
    passed:     violations.length === 0,
    violations,
    text,
  }
}

/**
 * Log validation results without throwing — audit must never fail due to
 * validator errors. Returns the original text unchanged.
 */
export function validateAndLog(text: string, industry: string, context: string): string {
  try {
    const result = validateNarrative(text, industry)
    if (!result.passed) {
      console.warn(
        `[NarrativeValidator] ${context} | industry=${industry} | violations=`,
        result.violations,
      )
    }
  } catch (err) {
    console.error('[NarrativeValidator] unexpected error:', err)
  }
  return text
}
