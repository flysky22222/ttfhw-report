# TTHFW 用户场景验证报告

## 一、概述

- 目标：`openGauss`
- 文档入口：https://docs.opengauss.org/zh/docs/latest/docs/InstallationGuide/使用docker安装.html
- 时间：2026-07-02T09:00:00 ~ 2026-07-02T09:19:00（1140 秒）
- 镜像：`swr.cn-southwest-2.myhuaweicloud.com/base_image/opengauss-server:latest` —— openGauss 官方文档「使用 docker 安装」指定的容器镜像；在 k8s 里以 Pod 形式部署。首次未加 nodeSelector 被调度到 aarch64 NPU 节点导致 exec format error，加 os.architecture=amd64 调度到 x86 节点后成功。

## 二、环境

- 容器 OS：openGauss 官方镜像(基于 openEuler)｜架构：x86_64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：docs.opengauss.org 安装指南 - 使用 docker 安装章节　（来源：官方文档入口）
- **prerequisites**：Docker/容器运行时；设置 GS_PASSWORD 环境变量(强口令)；端口 5432　（来源：文档 - 环境要求）
- **install_commands**：docker run --name opengauss -e GS_PASSWORD=... opengauss-server:latest（本次改为等效 k8s Pod）　（来源：文档 - docker 安装章节）
- **use_commands**：gsql -d postgres -p 5432 -c "select version();"；gsql 执行 SQL　（来源：文档 - 连接数据库）
- **contribution_entry**：gitcode opengauss issue 入口　（来源：文档 - 反馈）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 300 | 0 |
| 安装 | 成功 | 540 | 1 |
| 使用 | 成功 | 120 | 0 |
| 贡献 | 成功 | 180 | 1 |

## 五、文档缺陷清单

- 官方 docker 安装文档未标注镜像架构（opengauss-server:latest 为 x86_64 单架构），在含 aarch64/ARM 或 NPU 节点的多架构 k8s 集群里不指定调度会 exec format error
- 文档以单机 docker run 为主，未给 k8s/Pod 部署时的节点选择/资源建议

## 六、遇到的问题

- Pod exec format error → 镜像 x86 单架构、被调度到 aarch64 NPU 节点；加 nodeSelector os.architecture=amd64 调度到 x86 节点后成功（来源：kubectl logs）

## 七、结论

按使用者场景在 k8s（ttfhw 命名空间，经跳转机 139.9.248.39）内真实部署 openGauss：了解→安装→使用→贡献四阶段跑通。安装阶段发现官方容器镜像为 x86_64 单架构且文档未标注，在含 ARM/NPU 节点的多架构集群里需显式 nodeSelector 调度到 x86 节点（记为文档缺陷，非环境失败）；调度到 x86 节点后部署成功，gsql `select 'hello openGauss'` 返回成功、`select version()` 返回 openGauss 7.0.0-RC1。整体结论：成功，发现 2 处文档缺陷。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。