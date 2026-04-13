import Anthropic from '@anthropic-ai/sdk'
import { AgentName, buildAgentRequest, parseAgentResponse, AGENT_TOKEN_BUDGETS } from './prompts'
import { guardAgent } from '../stateMachine'
import { BusinessState, AgentType } from '@prisma/client'

const client = new Anthropic()

export interface CycleInput {
  audit_id:       string
  cycle_id:       string
  business_name:  string
  website:        string
  industry:       string
  business_state: BusinessState
  scores:         Record<string, number>
  score_delta:    Record<string, number> | null
  signals:        Record<string, unknown>
  vertical_avg:   number | null
  quick_wins:     string[]
  allowed_agents: AgentType[]
}

export interface AgentResult {
  agentType:  AgentName
  status:     'success' | 'error' | 'skipped' | 'validation_failed'
  output:     unknown
  durationMs: number
  tokensUsed: number
  error?:     string
}

export interface CycleResult {
  cycleId:     string
  auditId:     string
  results:     AgentResult[]
  totalMs:     number
  totalTokens: number
}

async function runSingleAgent(
  agentName: AgentName,
  input: object
): Promise<{ output: unknown; tokensUsed: number; durationMs: number }> {
  const req      = buildAgentRequest(agentName, input)
  const start    = Date.now()
  const response = await client.messages.create(req as any)
  const durationMs = Date.now() - start
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as any).text)
    .join('')
  const output     = parseAgentResponse(text)
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens
  return { output, tokensUsed, durationMs }
}

async function runValidator(
  agentType: AgentName,
  auditPayload: CycleInput,
  agentOutput: unknown
): Promise<{ passed: boolean; tokensUsed: number }> {
  const validatorInput = { audit_payload: auditPayload, agent_type: agentType, agent_output: agentOutput }
  try {
    const { output, tokensUsed } = await runSingleAgent('VALIDATOR', validatorInput)
    const result = output as any
    return { passed: result.validation_status === 'PASSED', tokensUsed }
  } catch {
    return { passed: true, tokensUsed: 0 } // validator failure = pass through
  }
}

export async function runCycle(input: CycleInput): Promise<CycleResult> {
  const cycleStart = Date.now()
  const results: AgentResult[] = []
  let totalTokens = 0

  const agentsToRun = input.allowed_agents.filter(
    (a) => !guardAgent(input.business_state, a)
  ) as AgentName[]

  const runSpecialist = async (agentType: AgentName): Promise<AgentResult> => {
    const start = Date.now()
    try {
      const { output, tokensUsed, durationMs } = await runSingleAgent(agentType, input)
      const { passed, tokensUsed: valTokens } = await runValidator(agentType, input, output)
      totalTokens += tokensUsed + valTokens
      if (!passed) {
        return { agentType, status: 'validation_failed', output, durationMs: Date.now() - start, tokensUsed: tokensUsed + valTokens }
      }
      return { agentType, status: 'success', output, durationMs, tokensUsed: tokensUsed + valTokens }
    } catch (err: any) {
      return { agentType, status: 'error', output: null, durationMs: Date.now() - start, tokensUsed: 0, error: err.message }
    }
  }

  const agentResults = await Promise.all(agentsToRun.map(runSpecialist))
  results.push(...agentResults)

  const apiUrl     = process.env.VITE_API_URL ?? 'http://localhost:4000'
  const cronSecret = process.env.CRON_SECRET  ?? ''

  for (const result of results) {
    if (result.status !== 'success' || !result.output) continue
    const output          = result.output as any
    const callbackPayload = {
      audit_id:   input.audit_id,
      cycle_id:   input.cycle_id,
      agent_type: result.agentType,
      status:     'success',
      actions:    output.actions ?? [],
    }
    try {
      await fetch(`${apiUrl}/api/callback`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cronSecret}` },
        body:    JSON.stringify(callbackPayload),
      })
    } catch (err: any) {
      console.error(`[AgentRunner] Callback failed for ${result.agentType}:`, err.message)
    }
  }

  return { cycleId: input.cycle_id, auditId: input.audit_id, results, totalMs: Date.now() - cycleStart, totalTokens }
}

export function fireCycleAsync(input: CycleInput): void {
  runCycle(input).catch((err) => {
    console.error(`[AgentRunner] Cycle failed — cycle_id: ${input.cycle_id}`, err)
  })
}
