import { 
    AgentActionKey, 
    AgentConfig, 
    AgentConstraintConfig, 
    AIModels,
    AllModels,
    LiteModels,
    RegularModels,
} from "./config.types";
import { env } from 'cloudflare:workers';

// Common configs - Nebius Token Factory defaults (open-source models, OpenAI-compat).
const COMMON_AGENT_CONFIGS = {
    screenshotAnalysis: {
        name: AIModels.DISABLED,
        reasoning_effort: 'medium' as const,
        max_tokens: 8000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_QWEN_3_30B,
    },
    realtimeCodeFixer: {
        name: AIModels.NEBIUS_QWEN_3_30B,
        reasoning_effort: 'low' as const,
        max_tokens: 32000,
        temperature: 0.2,
        fallbackModel: AIModels.NEBIUS_GLM_4_5_AIR,
    },
    fastCodeFixer: {
        name: AIModels.DISABLED,
        reasoning_effort: undefined,
        max_tokens: 64000,
        temperature: 0.0,
        fallbackModel: AIModels.NEBIUS_QWEN_3_CODER_480B,
    },
    templateSelection: {
        name: AIModels.NEBIUS_GLM_4_5_AIR,
        max_tokens: 2000,
        fallbackModel: AIModels.NEBIUS_QWEN_3_30B,
        temperature: 1,
    },
} as const;

const SHARED_IMPLEMENTATION_CONFIG = {
    reasoning_effort: 'low' as const,
    max_tokens: 48000,
    temperature: 1,
    fallbackModel: AIModels.NEBIUS_DEEPSEEK_V3,
};

//======================================================================================
// Platform config — used at build.cloudflare.dev.
// Routes inference through Nebius Token Factory (NEBIUS_API_KEY required).
//======================================================================================
const PLATFORM_AGENT_CONFIG: AgentConfig = {
    ...COMMON_AGENT_CONFIGS,
    blueprint: {
        name: AIModels.NEBIUS_QWEN_3_235B,
        reasoning_effort: 'high',
        max_tokens: 20000,
        fallbackModel: AIModels.NEBIUS_DEEPSEEK_V3,
        temperature: 1.0,
    },
    projectSetup: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        reasoning_effort: 'medium',
        max_tokens: 8000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_QWEN_3_235B,
    },
    phaseGeneration: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        reasoning_effort: 'medium',
        max_tokens: 8000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_DEEPSEEK_V3,
    },
    firstPhaseImplementation: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    phaseImplementation: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    conversationalResponse: {
        name: AIModels.NEBIUS_LLAMA_3_3_70B,
        reasoning_effort: 'low',
        max_tokens: 4000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_GLM_4_5_AIR,
    },
    deepDebugger: {
        name: AIModels.NEBIUS_DEEPSEEK_R1,
        reasoning_effort: 'high',
        max_tokens: 8000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_QWEN_3_235B,
    },
    fileRegeneration: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        reasoning_effort: 'low',
        max_tokens: 16000,
        temperature: 0.0,
        fallbackModel: AIModels.NEBIUS_QWEN_3_30B,
    },
    agenticProjectBuilder: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        reasoning_effort: 'medium',
        max_tokens: 8000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_QWEN_3_235B,
    },
};

//======================================================================================
// Default config — used when PLATFORM_MODEL_PROVIDERS is not set.
// Same Nebius Token Factory defaults; only NEBIUS_API_KEY is required.
//======================================================================================
const DEFAULT_AGENT_CONFIG: AgentConfig = {
    ...COMMON_AGENT_CONFIGS,
    templateSelection: {
        name: AIModels.NEBIUS_GLM_4_5_AIR,
        max_tokens: 2000,
        fallbackModel: AIModels.NEBIUS_QWEN_3_30B,
        temperature: 0.6,
    },
    blueprint: {
        name: AIModels.NEBIUS_QWEN_3_235B,
        reasoning_effort: 'high',
        max_tokens: 64000,
        fallbackModel: AIModels.NEBIUS_DEEPSEEK_V3,
        temperature: 1,
    },
    projectSetup: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    phaseGeneration: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    firstPhaseImplementation: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    phaseImplementation: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        ...SHARED_IMPLEMENTATION_CONFIG,
    },
    conversationalResponse: {
        name: AIModels.NEBIUS_LLAMA_3_3_70B,
        reasoning_effort: 'low',
        max_tokens: 4000,
        temperature: 0,
        fallbackModel: AIModels.NEBIUS_GLM_4_5_AIR,
    },
    deepDebugger: {
        name: AIModels.NEBIUS_DEEPSEEK_R1,
        reasoning_effort: 'high',
        max_tokens: 8000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_QWEN_3_235B,
    },
    fileRegeneration: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        reasoning_effort: 'low',
        max_tokens: 32000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_QWEN_3_30B,
    },
    agenticProjectBuilder: {
        name: AIModels.NEBIUS_QWEN_3_CODER_480B,
        reasoning_effort: 'high',
        max_tokens: 8000,
        temperature: 1,
        fallbackModel: AIModels.NEBIUS_QWEN_3_235B,
    },
};

export const AGENT_CONFIG: AgentConfig = env.PLATFORM_MODEL_PROVIDERS 
    ? PLATFORM_AGENT_CONFIG 
    : DEFAULT_AGENT_CONFIG;


export const AGENT_CONSTRAINTS: Map<AgentActionKey, AgentConstraintConfig> = new Map([
	['fastCodeFixer', {
		allowedModels: new Set([AIModels.DISABLED]),
		enabled: true,
	}],
	['realtimeCodeFixer', {
		allowedModels: new Set([AIModels.DISABLED]),
		enabled: true,
	}],
	['fileRegeneration', {
		allowedModels: new Set(AllModels),
		enabled: true,
	}],
	['phaseGeneration', {
		allowedModels: new Set(AllModels),
		enabled: true,
	}],
	['projectSetup', {
		allowedModels: new Set([...RegularModels, AIModels.GEMINI_2_5_PRO]),
		enabled: true,
	}],
	['conversationalResponse', {
		allowedModels: new Set(RegularModels),
		enabled: true,
	}],
	['templateSelection', {
		allowedModels: new Set(LiteModels),
		enabled: true,
	}],
]);