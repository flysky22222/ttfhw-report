# TTHFW 用户场景验证报告

## 一、概述

- 目标：`openUBMC Docker开发环境搭建文档 + openUBMC Docker镜像（swr.cn-north-4.myhuaweicloud.com/openubmc/ubuntu:24.04.2_26.03）`
- 时间：2026-05-09T09:00:00 ~ 2026-05-09T11:46:00（9960 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 openUBMC 开发者，按 https://www.openubmc.cn/docs/zh/development/quick_start/prepare_environment/docker_env.html 这篇文档，把里面提到的**所有 Docker 开发环境准备方式**都跑一遍发现安装文档缺陷。覆盖率要求：文档列出几种 mirror / base image / 工具变体 / Conan 版本，**每种都要按文档原命令真跑一次**，能跑通的报"通"，跑不通的记真实错误现象作为缺陷。　（来源：测试目标）
- **doc_completeness**：docker run/docker compose部分完备，可直接执行；Conan 1.x部分命令与镜像预装版本不兼容；apt安装部分镜像站网络不可达。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 3060 | 0 |
| 安装 | 部分成功 | 5400 | 3 |
| 使用 | 成功 | 900 | 0 |
| 贡献 | 成功 | 600 | 0 |

## 五、文档缺陷清单

- 华为云镜像站部分仓库不可达（中等）
- openUBMC镜像内置apt源不可达（高）
- Conan版本兼容性问题（高）
- 华为云镜像站updates仓库不可达、openUBMC镜像内置apt源不可达、Conan版本兼容性问题

## 七、结论

部分成功。文档提供的docker/docker compose/Conan 2.x命令可以正常执行，但apt install/Conan 1.x命令因环境限制或版本兼容性问题失败。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。