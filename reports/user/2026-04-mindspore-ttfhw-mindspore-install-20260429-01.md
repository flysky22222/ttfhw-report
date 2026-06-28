# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpore 2.8.0 (Ascend 版本)`
- 时间：2026-04-29T09:00:00 ~ 2026-04-29T09:55:00（3300 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 MindSpore 用户，按官方文档（mindspore.cn）在 Ascend NPU A2 测试 Pod 内真实安装 MindSpore + MindNLP / MindFormers 并跑通文档给的最小推理示例，发现安装与使用文档在真实 NPU 环境下的缺陷。　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法在容器内完成 Ascend 安装　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 900 | 0 |
| 安装 | 部分成功 | 1500 | 1 |
| 使用 | 部分成功 | 600 | 1 |
| 贡献 | 成功 | 300 | 0 |

## 五、文档缺陷清单

- MindSpore 安装文档没有容器化安装指南（严重）
- pip 源 URL 被 WAF 拦截（重要）
- Ubuntu 24.04 PEP 668 未说明（重要）
- 基础镜像缺少 universe 源（一般）
- MindNLP 文档不可访问（一般）
- 缺少容器化安装指南、缺少 CANN toolkit 说明、pip 源 WAF 拦截、PEP 668 未说明

## 七、结论

部分成功 - CPU 验证通过，Ascend 验证失败

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。