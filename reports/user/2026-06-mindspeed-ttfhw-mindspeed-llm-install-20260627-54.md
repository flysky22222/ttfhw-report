# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpeed-LLM v26.0.0 (基于 PyTorch)`
- 时间：2026-06-27T09:00:00 ~ 2026-06-27T09:20:00（1200 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 MindSpeed-LLM 用户，按 https://gitcode.com/Ascend/MindSpeed-LLM 官方仓库 README 实时获取的安装方式，在 NPU 节点的 Pod 里完成安装与最小验证，发现文档缺陷。**重要：gitee 已弃用，必须用 gitcode；URL 大小写敏感（Ascend 首字母大写，MindSpeed-LLM 用连字符）。**　（来源：测试目标）
- **doc_completeness**：不完备 - 仅靠官方文档无法独立完成容器环境下的安装，缺少关键链接和步骤说明　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 480 | 0 |
| 安装 | 失败 | 600 | 2 |
| 使用 | 未执行 | 0 | 1 |
| 贡献 | 成功 | 120 | 0 |

## 五、文档缺陷清单

- #1: 镜像 registry URL 未提供 (严重)
- #2: 容器环境 CANN 安装说明缺失 (严重)
- #3: CANN 具体安装步骤缺失 (重要)
- #4: torch_npu 版本号不一致 (一般)
- #5: Python 版本建议不准确 (一般)
- 镜像 registry URL 缺失、容器环境 CANN 安装说明缺失、版本配套信息不准确

## 七、结论

失败 - 文档关键安装步骤缺失（CANN Toolkit 安装、镜像 registry URL），无法在 Pod 环境完成完整安装流程

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。