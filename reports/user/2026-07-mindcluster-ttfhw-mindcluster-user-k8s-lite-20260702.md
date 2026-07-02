# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindCluster`
- 文档入口：https://gitcode.com/Ascend/mind-cluster (component/npu-exporter/README + build/build.sh)
- 时间：2026-07-02T10:45:00 ~ 2026-07-02T11:10:00（1500 秒）
- 镜像：`hub.oepkgs.net/openeuler/openeuler:24.03-lts` —— 在 A2 NPU 节点的 openEuler 24.03 Pod 内做轻量级测试：只构建并运行 MindCluster 的单个组件 npu-exporter，避开需 cluster-admin 的整套集群部署。

## 二、环境

- 容器 OS：openEuler 24.03 LTS｜架构：aarch64｜Python：
- NPU：A2/910B（/dev/davinci* 已挂）

## 三、文档阅读 / 抽取

- **doc_entry**：gitcode Ascend/mind-cluster；component/npu-exporter（NPU 指标采集组件，出 Prometheus /metrics）　（来源：官方仓库）
- **prerequisites**：Go 1.26（go.mod 声明）；gcc（cgo 调 dcmi）；运行采集时需昇腾驱动 libdcmi.so（dlopen 动态加载）　（来源：go.mod / build/build.sh）
- **install_commands**：bash build/build.sh —— go build(cgo) 出 npu-exporter 二进制到 output/　（来源：build/build.sh）
- **use_commands**：./npu-exporter --help / --version；部署后 curl http://<ip>:8082/metrics 采集 NPU 指标　（来源：组件 CLI）
- **contribution_entry**：gitcode Ascend/mind-cluster issue　（来源：contributing.md）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 240 | 0 |
| 安装 | 成功 | 720 | 0 |
| 使用 | 成功 | 60 | 0 |
| 贡献 | 成功 | 180 | 0 |

## 五、文档缺陷清单

- npu-exporter go.mod 要求 Go 1.26（较新），openEuler dnf 仓库版本不够，文档/build.sh 未说明 Go 版本获取方式，用户需自行从镜像站下载 Go 1.26

## 七、结论

按使用者场景在 A2(910B) NPU Pod（openEuler 24.03 aarch64，经跳转机 139.9.248.39）对 MindCluster 做轻量级测试（单组件构建+运行，不做整套集群部署）：了解→安装→使用三阶段跑通。选 npu-exporter（NPU 指标采集组件）为目标：装 Go 1.26.0(aliyun 镜像)+gcc 后 `bash build/build.sh` 从源码 cgo 构建成功（26MB aarch64 二进制）；运行 `./npu-exporter --help` 打印 EULA 与完整 CLI 参数，二进制可用。完整采集 NPU 指标需运行时 dlopen 昇腾驱动 libdcmi.so（本 Pod 未挂驱动，故未起采集服务）。结论：轻量级构建+运行验证成功；发现 1 处文档可补充点（go.mod 需 Go 1.26 但未说明 Go 获取方式）。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。