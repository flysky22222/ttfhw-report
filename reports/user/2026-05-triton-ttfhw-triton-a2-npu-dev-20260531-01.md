# TTHFW 用户场景验证报告

## 一、概述

- 目标：`Triton-Ascend 3.2.1（CANN 9.0.0 / torch_npu 2.7.1.post4 / Python 3.11.15），官方开发者编程指南 `docs/zh/programming_guide/`。`
- 时间：2026-05-31T09:00:00 ~ 2026-05-31T10:19:00（4740 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 Triton（triton-ascend）开发者，在 Atlas A2 NPU 环境下，按官方"开发者编程指南"入口文档 `docs/zh/programming_guide/index.md` 及其全部子章节（Vector / Cube / CV 融合算子开发）完整走一遍 triton-ascend 算子开发体验：按文档把开发环境装齐、按文档示例写并跑通至少一个最小 triton kernel、以仓库自带 `test_fusedattention.py::test_op` 作为统一验证用例跑全部 7 个参数化用例。目的是排查"开发者编程指南"在 A2 NPU 场景下的缺陷。　（来源：测试目标）
- **doc_completeness**：开发者编程指南 + 安装指南组合，**可独立**完成"拉官方镜像 → 跑示例 → 跑验证"的开箱即用路径，未依赖外网社区补查。但"进阶 max_autotune"与"Vector 复杂算子"两节存在与已发布包对不上的 API，照抄会报错。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 1500 | 0 |
| 安装 | 成功 | 1200 | 0 |
| 使用 | 成功 | 1320 | 0 |
| 贡献 | 成功 | 720 | 1 |

## 五、文档缺陷清单

- `max_autotune` 导入路径无效，且两篇文档互相矛盾（重要）
- `vector_operator.md` 引用不存在的 `tl.insert_slice` / `tl.extract_slice`（重要）
- UB 预算伪代码使用未定义的 `get_npu_properties()`，与官方核数检测写法不一致（一般）
- `index.md` 多处 Python 代码块误标为 ` ```diff `（一般）
- `max_autotune` 导入路径在两篇文档间互相矛盾且均无法导入；`vector_operator.md` 引用不存在的 `tl.insert_slice/tl.extract_slice`；UB 预算伪代码用未定义的 `get_npu_properties()`；index.md 多处 Python 代码块误标为 ` ```diff `。

## 七、结论

**成功**。无需任何"私自补参/改写命令"的绕过——文档示例与统一验证用例在 A2 NPU 上原样跑通。唯一一处偏离官方文档的是 **TTFHW workflow 自身把测试镜像 tag 写成了文档没有的 `py3.10`**（属环境/配置问题，非文档缺陷，已修复，见 §2 阶段二与 §6）。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。