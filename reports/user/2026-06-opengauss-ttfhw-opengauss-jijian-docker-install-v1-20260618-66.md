# TTHFW 用户场景验证报告

## 一、概述

- 目标：`openGauss 7.0.0-RC3 极简版 Docker 镜像 (x86_64)`
- 时间：2026-06-18T09:00:00 ~ 2026-06-18T09:15:00（900 秒）
- 镜像：`` —— 历史 md 报告未结构化记录镜像

## 二、环境

- 容器 OS：｜架构：｜Python：

## 三、文档阅读 / 抽取

- **test_goal**：作为 openGauss 用户，按 openGauss 官网最新版本（7.0.0-RC3）的安装文档（架构 x86，操作系统 openEuler 24.03 LTS）安装网页上的极简版 Docker 镜像，完成下载、安装、使用，发现安装文档缺陷。　（来源：测试目标）
- **doc_completeness**：基本完备，但存在镜像名不一致的问题，用户无法直接按文档执行。　（来源：1.2 测试总结）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 480 | 0 |
| 安装 | 成功 | 300 | 1 |
| 使用 | 成功 | 120 | 0 |
| 贡献 | 失败 | 0 | 0 |

## 五、文档缺陷清单

- 用户按文档执行 \`docker run opengauss/opengauss-server:latest\` 会失败
- 需使用 \`docker images\` 查看实际镜像名后修正命令
- Docker 镜像名不一致（文档示例 opengauss/opengauss-server:latest vs 实际 opengauss:7.0.0-RC3）

## 七、结论

成功。数据库正常启动，gsql 连接和 SQL 验证通过。但发现文档镜像名与实际不一致，需修正。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。