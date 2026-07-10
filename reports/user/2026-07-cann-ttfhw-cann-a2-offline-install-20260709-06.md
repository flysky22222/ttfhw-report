# TTHFW 用户场景验证报告

## 一、概述

- 目标：`CANN A2 离线安装`
- 文档入口：https://www.hiascend.com/cann/download
- 时间：2026-07-09T12:42:35 ~ 2026-07-09T13:03:00（1225 秒）
- 镜像：`swr.cn-southwest-2.myhuaweicloud.com/modelfoundry/ttfhw-ubuntu-24.04-base:latest` —— workflow默认镜像，预装wget/curl/git/python3-pip

## 二、环境

- 容器 OS：Ubuntu 24.04｜架构：aarch64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：https://www.hiascend.com/cann/download + https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/900/softwareinst/instg/　（来源：用户指定官方文档入口）
- **prerequisites**：gcc；python3；python3-pip；linux-headers；make；dkms　（来源：文档 - 安装依赖章节）
- **install_commands**：groupadd HwHiAiUser；useradd -g HwHiAiUser -d /home/HwHiAiUser -m HwHiAiUser -s /bin/bash；apt-get update；apt-get install -y gcc python3 python3-pip；wget https://ascend-cann-open.obs.cn-north-4.myhuaweicloud.com/CANN/CANN%209.0.1/Ascend-cann_9.0.1_linux-aarch64.run；bash ./Ascend-cann_9.0.1_linux-aarch64.run --install --quiet；wget https://ascend-repo.obs.cn-east-2.myhuaweicloud.com/CANN/CANN%209.0.1/Ascend-cann-910b-ops_9.0.1_linux-aarch64.run；bash ./Ascend-cann-910b-ops_9.0.1_linux-aarch64.run --install --quiet；source /usr/local/Ascend/cann/set_env.sh　（来源：文档 - 快速安装页 + 安装指南）
- **use_commands**：python3 -c "import acl;print(acl.get_soc_name())"　（来源：文档 - 安装后验证章节）
- **contribution_entry**：GitCode CANN仓库: https://gitcode.com/cann/　（来源：文档未提供）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 235 | 0 |
| 安装 | 成功 | 900 | 2 |
| 使用 | 成功 | 30 | 0 |
| 贡献 | 成功 | 60 | 0 |

## 五、文档缺陷清单

- {'title': '快速安装页与安装指南版本不一致（9.0.1 vs 9.0.0）', 'stage': '了解', 'severity': '严重', 'source': '快速安装页 vs 安装指南文档', 'suggestion': '安装指南应与快速安装页同步到最新版本', 'impact': '用户按默认入口下载的版本与详细文档不匹配'}
- {'title': 'OPS包必要性说明位置不当', 'stage': '安装', 'severity': '重要', 'source': '安装指南 - 安装驱动&Toolkit合一包章节', 'suggestion': '将OPS必要性说明移到OPS章节开头'}
- {'title': '快速安装页缺少NNAL包信息', 'stage': '了解', 'severity': '一般', 'source': '快速安装页安装指引', 'suggestion': '快速安装页应补充NNAL包信息（标注为可选）'}
- {'title': '依赖列表分散（系统依赖与Python依赖分离）', 'stage': '安装', 'severity': '重要', 'source': '安装指南 - 安装依赖章节 + 安装后配置章节', 'suggestion': '将所有依赖集中到一个章节'}
- {'title': '快速安装页缺少make和dkms依赖', 'stage': '安装', 'severity': '重要', 'source': '快速安装页 vs 安装指南', 'suggestion': '快速安装页应补齐make和dkms依赖'}
- {'title': '快速安装页未说明容器场景差异', 'stage': '安装', 'severity': '一般', 'source': '快速安装页', 'suggestion': '快速安装页应补充容器场景说明'}
- {'title': '文档未解释为何分两个OBS源', 'stage': '了解', 'severity': '提示', 'source': '准备软件包章节', 'suggestion': '补充说明（如主包在cn-north-4，算子库在cn-east-2）'}
- {'title': '文档未提及sha256校验方法', 'stage': '了解', 'severity': '一般', 'source': '准备软件包 - 软件数字签名验证章节', 'suggestion': '补充sha256校验方法或链接'}
- {'title': '快速安装页未说明--quiet参数接受EULA', 'stage': '安装', 'severity': '严重', 'source': '快速安装页安装命令', 'suggestion': '在命令中添加--quiet参数或说明静默安装方法', 'impact': '导致自动化安装卡在EULA交互界面'}
- {'title': 'ops包安装命令同样需要--quiet参数', 'stage': '安装', 'severity': '严重', 'source': '快速安装页ops包安装命令', 'suggestion': '在ops包安装命令中也添加--quiet参数', 'impact': '导致自动化安装卡在EULA交互界面'}

## 六、遇到的问题

- CANN Toolkit安装命令不加--quiet参数卡在EULA交互界面 → 添加--quiet参数接受EULA（来源：文档 - 快速安装页步骤3）
- npu-smi info缺少libc_sec.so库 → 环境问题，非文档缺陷，不计入文档缺陷（来源：硬件实证（非文档要求））

## 七、结论

作为CANN用户，按官方CANN A2离线安装文档（快速安装页+安装指南），在NPU A2节点的测试Pod内真实下载、安装、验证。阶段一成功提取文档要素，阶段二安装过程中发现并修正--quiet参数缺失缺陷，阶段三验证命令成功返回芯片型号Ascend910B4。共发现文档缺陷10条（严重3条、重要3条、一般3条、提示1条），已整理为结构化Issue草稿。环境问题（npu-smi缺少库）不计入文档缺陷。整体验证结论：文档基本可用但存在严重缺陷（版本不一致、--quiet参数缺失）需要修复。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。