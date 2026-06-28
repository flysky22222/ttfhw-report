# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpeed-LLM（大语言模型分布式训练套件）`
- 时间：2026-05-30T09:00:00 ~ 2026-05-30T10:05:00（3900 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 MindSpeed-LLM 用户，按 https://gitcode.com/Ascend/MindSpeed-LLM 官方仓库 README 实时获取的安装方式，在 NPU 节点的 Pod 里完成安装与最小验证，发现文档缺陷。**重要：gitee 已弃用，必须用 gitcode；URL 大小写敏感（Ascend 首字母大写，MindSpeed-LLM 用连字符）。**　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法独立完成，需要额外查找镜像地址、CANN 安装方式、torch_npu 依赖等　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 900 | 0 |
| 安装 | 成功 | 2400 | 2 |
| 使用 | 成功 | 600 | 0 |
| 贡献 | 失败 | 0 | 0 |

## 五、文档缺陷清单

- 镜像 registry 地址缺失（严重）
- CANN 版本矛盾（中等）
- torch_npu wheel 包获取方式缺失（严重）
- torch_npu 缺少依赖说明（中等）
- CANN 安装步骤缺失（严重）
- Python 版本不匹配（轻微）
- mindspeed_llm 没有 __version__ 属性（轻微）
- PyPI 镜像源建议缺失（建议）
- 镜像地址缺失、CANN 版本矛盾、torch_npu wheel 包获取方式不明、缺少依赖说明

## 七、结论

部分成功 - 安装流程可执行，但发现 8 项文档缺陷，需要补充依赖说明和简化安装步骤

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。