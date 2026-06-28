# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpeed-LLM（大语言模型分布式训练套件）`
- 时间：2026-06-13T09:00:00 ~ 2026-06-13T10:15:00（4500 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 MindSpeed-LLM 用户，按 https://gitcode.com/Ascend/MindSpeed-LLM 官方仓库 README 实时获取的安装方式，在 NPU 节点的 Pod 里完成安装与最小验证，发现文档缺陷。**重要：gitee 已弃用，必须用 gitcode；URL 大小写敏感（Ascend 首字母大写，MindSpeed-LLM 用连字符）。**　（来源：测试目标）
- **doc_completeness**：仅靠官方文档无法在 k8s Pod 环境独立完成，缺少 Pod 环境的 CANN toolkit 安装/映射说明　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 900 | 0 |
| 安装 | 失败 | 2700 | 3 |
| 使用 | 失败 | 300 | 2 |
| 贡献 | 成功 | 600 | 0 |

## 五、文档缺陷清单

- 驱动/固件安装命令参数占位符未说明如何确定 (一般)
- torch/torch_npu .whl 文件下载来源未明确 (重要)
- 镜像缺少 registry 路径 (重要)
- 源码安装方式未说明 Pod 环境如何获取 CANN toolkit (严重)
- 文档未说明 Python 版本差异影响 (一般)
- CANN toolkit 缺失、torch/torch_npu 下载来源不明确、镜像缺少 registry 路径

## 七、结论

失败 - 源码安装方式在 k8s Pod 环境因缺少 CANN toolkit 无法完成，torch_npu 无法加载

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。