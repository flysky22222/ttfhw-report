# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpeed-LLM（大语言模型分布式训练套件）`
- 时间：2026-06-12T09:00:00 ~ 2026-06-12T09:28:00（1680 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 MindSpeed-LLM 用户，按 https://gitcode.com/Ascend/MindSpeed-LLM 官方仓库 README 实时获取的安装方式，在 NPU 节点的 Pod 里完成安装与最小验证，发现文档缺陷。**重要：gitee 已弃用，必须用 gitcode；URL 大小写敏感（Ascend 首字母大写，MindSpeed-LLM 用连字符）。**　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法独立完成，关键依赖（CANN）的安装信息缺失　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 180 | 0 |
| 安装 | 部分成功 | 1320 | 1 |
| 使用 | 失败 | 120 | 1 |
| 贡献 | 成功 | 60 | 0 |

## 五、文档缺陷清单

- CANN 安装指导缺失（严重）
- 镜像 registry 地址缺失（严重）
- torch_npu wheel 包来源不明确（重要）
- 验证命令缺失（重要）
- Python 版本要求不明确（一般）
- CANN 安装指导缺失、镜像 registry 地址缺失、torch_npu wheel 包来源不明确

## 七、结论

失败 - 源码安装方式因文档缺少 CANN toolkit 安装指导而无法完成

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。