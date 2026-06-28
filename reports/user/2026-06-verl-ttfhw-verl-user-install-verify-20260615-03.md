# TTHFW 用户场景验证报告

## 一、概述

- 目标：`verl (Volcano Engine Reinforcement Learning for LLMs) v0.9.0.dev`
- 时间：2026-06-15T09:00:00 ~ 2026-06-15T09:43:00（2580 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 verl 项目新用户，按其官方文档在 NPU A2 环境中进行真实安装与上手验证，目的是发现安装与上手文档缺陷。　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法独立完成自定义安装，需要补充 CANN 获取和 torch_npu 安装说明　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 600 | 0 |
| 安装 | 部分成功 | 1500 | 4 |
| 使用 | 部分成功 | 300 | 2 |
| 贡献 | 成功 | 180 | 0 |

## 五、文档缺陷清单

- 自定义安装缺少 CANN Toolkit 获取方法（严重）
- 依赖表缺少 torch_npu 安装方法（严重）
- Ubuntu 24.04 需要启用 universe 源（重要）
- Ubuntu 24.04 Python externally-managed-environment（重要）
- 验证示例缺少离线方案（重要）
- 自定义安装假设环境已有 CANN、torch_npu 安装方法缺失、Ubuntu 24.04 适配说明缺失

## 七、结论

部分成功。verl Python 包安装成功，但 NPU 硬件验证失败（缺少 CANN Toolkit）

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。