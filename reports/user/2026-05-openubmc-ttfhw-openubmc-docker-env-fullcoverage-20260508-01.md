# TTHFW 用户场景验证报告

## 一、概述

- 目标：`openUBMC Docker 开发环境搭建文档`
- 时间：2026-05-08T09:00:00 ~ 2026-05-08T09:41:00（2460 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 openUBMC 开发者，按 https://www.openubmc.cn/docs/zh/development/quick_start/prepare_environment/docker_env.html 这篇文档，把里面提到的**所有 Docker 开发环境准备方式**都跑一遍发现安装文档缺陷。覆盖率要求：文档列出几种 mirror / base image / 工具变体 / Conan 版本，**每种都要按文档原命令真跑一次**，能跑通的报"通"，跑不通的记真实错误现象作为缺陷。　（来源：测试目标）
- **doc_completeness**：文档命令整体准确，但存在 apt mirror 不可达的备用方案缺失问题，以及 Conan 版本差异说明不足问题。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 60 | 0 |
| 安装 | 部分成功 | 1800 | 2 |
| 使用 | 成功 | 300 | 0 |
| 贡献 | 部分成功 | 300 | 1 |

## 五、文档缺陷清单

- 华为云 apt mirror noble-updates/noble-security 不可达、Conan 1.x 命令在 Conan 2.x 版本无法执行、缺少镜像预装环境说明

## 七、结论

部分成功。成功验证 3 种方式（镜像拉取、容器创建、Conan 2.x 配置），2 种方式因环境受限未完成（SSH 服务安装），1 种方式发现文档缺陷（Conan 1.x 命令与 Conan 2.x 版本不兼容）。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。