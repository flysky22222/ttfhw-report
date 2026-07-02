# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindCluster`
- 文档入口：https://gitcode.com/Ascend/mind-cluster (README + docs/zh 用户指南)
- 时间：2026-07-02T10:00:00 ~ 2026-07-02T10:30:00（1800 秒）
- 镜像：`hub.oepkgs.net/openeuler/openeuler:24.03-lts` —— 在 A2 NPU 节点起 openEuler 24.03 Pod（nodeSelector os.modelarts.node/xpu.type=ascend-d910b + huawei.com/ascend-1980）；privileged 挂了 /dev/davinci* 但未挂宿主机昇腾驱动运行时库。

## 二、环境

- 容器 OS：openEuler 24.03 LTS｜架构：aarch64｜Python：
- NPU：A2/910B（/dev/davinci* 已挂）

## 三、文档阅读 / 抽取

- **doc_entry**：gitcode.com/Ascend/mind-cluster README + docs/zh 用户指南　（来源：官方仓库）
- **intro**：MindCluster(AI集群系统软件)：为 NPU 训练/推理提供集群作业调度、运维监测、故障恢复；组件含 ascend-device-plugin/clusterd/volcano/npu-exporter/noded 等　（来源：README 简介）
- **prerequisites**：k8s 集群 + cluster-admin 权限；多节点昇腾 NPU + 各节点安装昇腾驱动；helm；Volcano CRD　（来源：README 兼容性/用户指南）
- **install_commands**：经 helm-deploy-tool 把 device-plugin/volcano/clusterd 等 DaemonSet/CRD 部署到集群(kube-system/volcano-system)　（来源：helm-deploy-tool）
- **use_commands**：kubectl get nodes 查看 NPU 资源上报；提交 volcano NPU 作业验证调度　（来源：用户指南）
- **contribution_entry**：gitcode Ascend/mind-cluster issue　（来源：contributing.md）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 300 | 0 |
| 安装 | 无法执行 | 900 | 2 |
| 使用 | 无法执行 | 0 | 0 |
| 贡献 | 成功 | 300 | 0 |

## 五、文档缺陷清单


## 六、遇到的问题

- 无集群级权限部署 MindCluster(DaemonSet@kube-system/CRD/ClusterRole) → 当前 kubeconfig 是 ttfhw namespace 级 serviceaccount；MindCluster 需 cluster-admin。属环境权限限制，非文档缺陷（来源：kubectl auth can-i）
- 测试 Pod 内 npu-smi 缺 libc_sec.so → privileged 仅挂 /dev/davinci* 设备，需额外挂宿主机 /usr/local/Ascend/driver 驱动库；属环境配置，非文档缺陷（来源：npu-smi info）

## 七、结论

按使用者场景在 A2(910B) NPU Pod（openeuler-a2，经跳转机 139.9.248.39）测试 MindCluster：了解阶段成功——clone 官方仓库、读懂 MindCluster 是 NPU 集群系统软件，经 helm-deploy-tool 把 device-plugin/volcano/clusterd/npu-exporter 等部署到集群。安装/使用阶段受环境限制无法完成：①当前 kubeconfig 是 ttfhw 命名空间级 serviceaccount，实测无集群级权限(create daemonsets@kube-system/customresourcedefinitions/clusterroles 均 can-i=no)，而 MindCluster 是集群级软件必须 cluster-admin 部署；②测试 Pod 仅 privileged 挂了 /dev/davinci* 设备、未挂宿主机昇腾驱动运行时库(npu-smi 缺 libc_sec.so)。以上均为环境权限/驱动限制，按环境断点记，不计入文档缺陷、不判失败。结论：了解成功；安装/使用受限于环境(需 cluster-admin + 多节点 NPU 集群 + 节点驱动)，未发现文档缺陷。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。