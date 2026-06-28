# TTHFW 用户场景验证报告

## 一、概述

- 目标：`Triton-Ascend 3.2.1（CANN 9.0.0 / torch_npu 2.7.1.post4 / Python 3.11.15）。`
- 时间：2026-05-31T09:00:00 ~ 2026-05-31T09:29:00（1740 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 Triton（triton-ascend）开发者，在 Atlas A2 NPU 环境下，按官方"开发者编程指南"入口 `docs/zh/programming_guide/index.md` 及子章节走一遍开发体验：按文档装齐环境、跑通文档示例 kernel、以 `test_fusedattention.py::test_op`（7 用例）统一验证。目的是排查"开发者编程指南"在 A2 NPU 场景下的缺陷。　（来源：测试目标）
- **doc_completeness**：可仅凭官方文档独立完成"开箱即用 → 跑示例 → 跑验证"，未依赖外网补查。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 600 | 0 |
| 安装 | 成功 | 360 | 0 |
| 使用 | 成功 | 480 | 0 |
| 贡献 | 成功 | 300 | 1 |

## 五、文档缺陷清单

- #1：programming_guide/index.md 示例未提示 `import torch_npu` 前需 source CANN 环境变量（中）
- #2：triton 版本号显示不一致未解释（低）
- #3：`npu-smi info` 容器内兼容问题未记录（低）
- #4：示例代码缺少完整可运行文件指向（低）
- 示例代码未提示 `import torch_npu` 前需 `source set_env.sh`；triton 版本显示差异未解释；`npu-smi` 容器内兼容问题未记录；示例缺完整可运行文件指向。

## 七、结论

**成功**。镜像开箱即用，文档示例与统一验证用例（7/7）在 A2 NPU 上跑通；发现 4 项文档缺陷。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。