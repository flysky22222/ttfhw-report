# TTHFW 用户场景验证报告

## 一、概述

- 目标：`Triton-Ascend 3.2.1（CANN 9.0.0 / torch 2.7.1 / torch_npu 2.7.1.post4↔2.7.1 / Python 3.11.15），文档 `docs/zh/programming_guide/`。`
- 时间：2026-05-31T09:00:00 ~ 2026-05-31T11:00:00（7200 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 Triton（triton-ascend）开发者，在 Atlas A2 NPU 环境下，按官方"开发者编程指南"入口 `docs/zh/programming_guide/index.md` 及其全部子章节，**严格遵从文档原文**走一遍开发体验：按文档把环境装齐、按文档示例写并跑通最小 kernel、以 `test_fusedattention.py::test_op`（7 用例）统一验证。目的是排查"开发者编程指南"在 A2 NPU 场景下的缺陷。　（来源：测试目标）
- **doc_completeness**：开箱即用主路径（拉镜像→跑示例→跑验证）与 pip 自装路径**均可仅凭官方文档独立完成**，未走外网社区补查。缺陷集中在"进阶 / 复杂算子 / 跨文档版本一致性"。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 1800 | 0 |
| 安装 | 成功 | 2400 | 0 |
| 使用 | 成功 | 1800 | 0 |
| 贡献 | 成功 | 1200 | 1 |

## 五、文档缺陷清单

- D1：`max_autotune` 导入路径在三处文档全部失效（严重）
- D2：index.md masked_fill「Tiling优化」示例用未定义的 `@libentry()` 与 `runtime.get_tuned_config()`（重要）
- D3：`tl.insert_slice`/`tl.extract_slice` 不存在，应为 `extension.*`（重要；两处子文档）
- D8：cv_fusion_operator.md 示例用 `extension.*` 但全文无任何 import（重要）
- D6：quick_start.md 极简 `pip install triton-ascend` 只装到旧版 3.2.0（重要）
- D5：torch_npu 版本自相矛盾，`pip install -r requirements.txt` 静默降级（一般）
- D4：vector_operator.md UB 预算伪代码用未定义 `get_npu_properties()`（一般 / partial）
- D7：index.md 多处纯 Python 代码块误标 ` ```diff `（一般）
- `max_autotune` 三处文档导入路径全部失效；`tl.*_slice`（两处子文档）与 `cv_fusion` 缺 import 等 API 写法问题；`torch_npu` 版本自相矛盾静默降级；`quick_start` 极简 pip 命令只装到旧版 3.2.0；多处代码块误标 ```diff。

## 七、结论

**成功**，且是真测。两条安装路径都按原文走通；`index.md` 自带 7 个可运行代码示例里 5 个 PASS、2 个是文档缺陷；统一验证用例两路均 7/7 PASS。**没有引入任何文档之外的修复来凑成功**。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。