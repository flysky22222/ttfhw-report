# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpeed-LLM master 分支（在研版本）`
- 时间：2026-07-05T09:00:00 ~ 2026-07-05T10:40:00（6000 秒）
- 镜像：`swr.cn-southwest-2.myhuaweicloud.com/modelfoundry/ttfhw-ubuntu-24.04-base:latest` —— 从历史 md 正文解析机器/镜像

## 二、环境

- 容器 OS：Ubuntu 24.04｜架构：aarch64｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 MindSpeed-LLM 用户，按 https://gitcode.com/Ascend/MindSpeed-LLM 官方仓库 README 实时获取的安装方式，在 NPU 节点的 Pod 里完成安装与最小验证，发现文档缺陷。　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法在容器内完成安装，缺少 CANN toolkit 安装步骤和 wheel 包下载地址。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 1800 | 0 |
| 安装 | 失败 | 2100 | 5 |
| 使用 | 失败 | 900 | 2 |
| 贡献 | 成功 | 1200 | 0 |

## 五、文档缺陷清单

- 缺少容器内 CANN toolkit 安装方法（严重）
- Ubuntu 24.04 pip externally-managed-environment 限制未说明（一般）
- GitHub Megatron-LM 克隆无国内镜像替代方案（一般）
- torch_npu wheel 包缺少明确下载地址（一般）
- 安装步骤依赖关系不明确（提示）
- 容器内 CANN 缺失、Ubuntu 24.04 pip 限制未说明、GitHub Megatron-LM 访问问题、torch_npu wheel 缺下载地址、安装步骤依赖关系不明确

## 七、结论

失败。文档的"源码安装方式"未提供容器内 CANN toolkit 安装方法，导致纯净容器无法完成安装。发现的 5 个文档缺陷已整理成 Issue 草稿。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。