# TTHFW 用户场景验证报告

## 一、概述

- 目标：`Triton-Ascend 3.2.1 + torch_npu 2.7.1.post4 + CANN 9.0.0-beta.2`
- 时间：2026-05-22T09:00:00 ~ 2026-05-22T10:15:00（4500 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 Triton（triton-ascend）用户，在 Atlas A2 NPU 环境下，按官方"快速上手/安装"文档完整走一遍开发者体验：能搜索获取到官方安装文档、能在仅具备基础 CANN 环境的机器上按文档安装 triton-ascend 及其全部依赖（含 torch_npu/pytorch-ascend）、能使用并验证（向量加法 test_add / vector-add）。目的是排查官方文档在 A2 NPU 场景下的缺陷。　（来源：测试目标）
- **doc_completeness**：需外网补查（requirements.txt版本与CANN不兼容，需参照installation_guide.md修复）　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 600 | 0 |
| 安装 | 部分成功 | 2700 | 2 |
| 使用 | 成功 | 900 | 0 |
| 贡献 | 成功 | 300 | 0 |

## 五、文档缺陷清单

- #1: requirements.txt torch-npu版本与CANN不兼容
- #2: source命令需bash执行
- #3: pip安装命令不一致
- #4: npu-smi在容器内报错
- torch-npu版本不兼容、pip安装命令不一致、source命令shell差异

## 七、结论

验证成功（向量加法输出正确），但安装过程需绕过requirements.txt版本缺陷

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。