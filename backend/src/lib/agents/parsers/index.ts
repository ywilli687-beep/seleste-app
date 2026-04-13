import { AGENT_REGISTRY } from '../registry'

// Mock migration function for now until specific migrations are written
function migrateOutput<T>(output: any, oldVersion: string, agentId: string): T | null {
  console.warn(`Running migration for ${agentId} from version ${oldVersion}`)
  // In production, this looks up a migration map and transforms the schema
  return output as T
}

export function parseAgentOutput<T>(
  run: any,
  agentId: string
): T | null {
  const registration = AGENT_REGISTRY[agentId]
  if (!registration) return null

  // If version is supported — parse directly
  if (registration.supportedVersions.includes(run.agentVersion)) {
    return run.outputJson as T
  }

  // If version is deprecated — run through migration transform
  if (registration.deprecatedVersions.includes(run.agentVersion)) {
    return migrateOutput<T>(run.outputJson, run.agentVersion, agentId)
  }

  // Unknown version — log and return null. Dashboard shows stale state.
  console.error(`Unknown agent version: ${agentId}@${run.agentVersion}`)
  return null
}
