# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpeed-LLM v2.3.0`
- 时间：2026-07-04T09:00:00 ~ 2026-07-04T10:45:00（6300 秒）
- 镜像：`swr.cn-southwest-2.myhuaweicloud.com/modelfoundry/ttfhw-ubuntu-24.04-base:latest` —— 从历史 md 正文解析机器/镜像

## 二、环境

- 容器 OS：Ubuntu 24.04｜架构：aarch64｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 MindSpeed-LLM 用户，按 https://gitcode.com/Ascend/MindSpeed-LLM 官方仓库 README 实时获取的安装方式，在 NPU 节点的 Pod 里完成安装与最小验证，发现文档缺陷。　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法独立完成安装，缺少从零开始的完整方案　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 3000 | 4 |
| 安装 | 失败 | 1200 | 4 |
| 使用 | 失败 | 300 | 2 |
| 贡献 | 部分成功 | 1800 | 1 |

## 五、文档缺陷清单

- 镜像未提供完整 registry 路径（严重）
- Python 版本要求与实际不匹配（严重）
- 缺少从零开始的完整安装方案（严重）
- triton-ascend 安装源未说明（严重）
- torch_npu 版本号表述不一致（重要）
- npu-smi 命令依赖未说明（重要）
- v26.0.0 版本安装文档缺失（重要）
- 镜像路径缺失、Python版本不匹配、缺少CANN安装指导、triton-ascend源未说明

## 七、结论

失败（环境受限）

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。