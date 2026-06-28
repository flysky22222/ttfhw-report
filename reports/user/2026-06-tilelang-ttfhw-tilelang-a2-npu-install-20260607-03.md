# TTHFW 用户场景验证报告

## 一、概述

- 目标：`TileLang-mlir-ascend（GitHub: tile-ai/tilelang-mlir-ascend）`
- 时间：2026-06-07T09:00:00 ~ 2026-06-07T11:25:00（8700 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 TileLang（tilelang-mlir-ascend）用户，在 Atlas A2 NPU 环境下，按官方 README（Quick Start）文档完整走一遍开发者体验：能获取到官方安装文档、能在仅具备基础 CANN 环境的机器上按文档完成 tilelang-mlir-ascend 的源码获取 / 构建 / 安装及其全部依赖（含 pybind11 / torch_npu 等）、能使用并验证（官方 README 提供的向量加法示例 vector add）。目的是排查官方 README 在 A2 NPU 场景下的缺陷。　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法在受限网络环境下完成安装。文档缺少内网镜像源、非 git 构建方式、预构建包等关键信息。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 900 | 1 |
| 安装 | 失败 | 7200 | 2 |
| 使用 | 未执行 | 0 | 1 |
| 贡献 | 成功 | 600 | 0 |

## 五、文档缺陷清单

- README 未说明在无法访问 GitHub 的环境下如何获取代码（严重）
- 构建脚本依赖完整 git repo，未处理非 git 场景（严重）
- README 未提供预构建安装包（重要）
- README Quick Start 使用硬编码 NPU 设备 ID（一般）
- README 未说明构建依赖 clang/lld（重要）
- 网络限制导致代码获取失败、构建脚本依赖 git repo、缺少预构建安装包

## 七、结论

失败。因 Pod 网络限制无法访问 github.com，代码获取失败；采用 runner clone + kubectl cp 复制代码后，构建脚本依赖完整 git repo 导致无法执行。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。