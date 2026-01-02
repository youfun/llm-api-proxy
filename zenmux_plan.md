# ZenMux 集成计划书

## 1. 简介

ZenMux 是一个多供应商 LLM 聚合服务，完全兼容 OpenAI API 协议。本计划旨在参考 `src/llm/openrouter.ts` 的实现模式，将 ZenMux 集成到 `llm-api-proxy` 中。

## 2. 技术方案

鉴于 ZenMux 的 API 结构与 OpenRouter 高度相似（都是 OpenAI 兼容接口，Base URL 不同），我们将采用复用 `openaiBase` 的策略。

### 2.1 环境变量

新增以下环境变量：

- `ZENMUX_API_KEY`: ZenMux API Key (必填)。
- `ZENMUX_MODELS`: (可选) 自定义支持的模型列表，逗号分隔。

### 2.2 代码实现

1.  **新建 `src/llm/zenmux.ts`**:
    -   导入 `openaiBase` 和 `IChat`。
    -   实现 `zenmux(env: Record<string, string>): IChat` 函数。
    -   初始化 `OpenAI` 客户端，配置 `baseURL` 为 `https://zenmux.ai/api/v1`。
    -   配置 `apiKey` 使用 `env.ZENMUX_API_KEY`。
    -   设置默认支持的模型列表。
    -   设置 `requiredEnv` 为 `['ZENMUX_API_KEY']`。

2.  **注册入口**:
    -   修改 `src/index.ts`，在模型匹配逻辑中引入 `zenmux` 并注册。
    -   确保其模型匹配优先级符合项目规范。

### 2.3 测试

1.  **新建 `src/llm/zenmux.test.ts`**:
    -   参考 `src/llm/openrouter.test.ts`。
    -   测试基本的 `invoke` (非流式) 调用。
    -   测试 `stream` (流式) 调用。

## 3. 实施步骤

1.  [x] **创建实现文件**: 新建 `src/llm/zenmux.ts`。
2.  [x] **创建测试文件**: 新建 `src/llm/zenmux.test.ts`。
3.  [x] **注册 Provider**: 修改 `src/api/common.ts`。
4.  [ ] **更新配置定义**: 修改 `wrangler.jsonc`（可选）。
5.  [x] **更新文档**: 修改 `README.md` 和 `README.zh-CN.md`。

## 4. 预期代码示例 (src/llm/zenmux.ts)

```typescript
import OpenAI from 'openai'
import { IChat } from './base'
import { openaiBase } from './openai'

export function zenmux(env: Record<string, string>): IChat {
  const r = openaiBase({
    createClient: () => {
      return new OpenAI({
        baseURL: 'https://zenmux.ai/api/v1',
        apiKey: env.ZENMUX_API_KEY,
      })
    },
  })
  r.name = 'ZenMux'
  r.supportModels = env.ZENMUX_MODELS?.split(',').map((it) => it.trim()) ?? [
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-5-sonnet-20240620',
    'anthropic/claude-3-5-sonnet@20240620',
    'google/gemini-2.0-flash-exp',
  ]
  r.requiredEnv = ['ZENMUX_API_KEY']
  return r
}
```
