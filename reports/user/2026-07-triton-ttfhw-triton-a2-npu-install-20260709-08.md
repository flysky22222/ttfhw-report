# TTHFW 用户场景验证报告

## 一、概述

- 目标：`triton-ascend`
- 文档入口：https://github.com/triton-lang/triton-ascend/blob/main/docs/zh/quick_start.md
- 时间：2026-07-09T17:00:00Z ~ 2026-07-09T17:45:00Z（2700 秒）
- 镜像：`quay.io/ascend/cann:9.0.0-beta.2-910b-ubuntu22.04-py3.10` —— 用户指定测试镜像（来自 triton-ascend 官方文档推荐）

## 二、环境

- 容器 OS：Ubuntu 22.04（预期）｜架构：x86_64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：https://github.com/triton-lang/triton-ascend/blob/main/docs/zh/quick_start.md　（来源：用户指定官方文档入口）
- **prerequisites**：操作系统: Linux (aarch64/x86_64)；Ascend 产品: Atlas A2/A3/A5 系列；Python: 3.9-3.11 (quick_start.md) 或 3.9-3.13 (installation_guide.md)；CANN: 9.0.0；torch_npu: 2.7.1.post4　（来源：文档 - 软件依赖章节）
- **install_commands**：pip install triton-ascend==3.2.1 --extra-index-url=https://triton-ascend.osinfra.cn/pypi/simple；pip install -r requirements.txt (含 torch-npu==2.7.1)　（来源：文档 - 软件包安装章节）
- **use_commands**：source /usr/local/Ascend/ascend-toolkit/set_env.sh；git clone https://github.com/triton-lang/triton-ascend.git；python3 ./triton-ascend/third_party/ascend/tutorials/01-vector-add.py　（来源：文档 - 快速开始章节）
- **contribution_entry**：https://github.com/triton-lang/triton-ascend (GitHub Issues)　（来源：文档 - README）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 600 | 4 |
| 安装 | blocked | 1500 | 1 |
| 使用 | blocked | 0 | 0 |
| 贡献 | 成功 | 300 | 0 |

## 五、文档缺陷清单

- {'title': 'quick_start.md 软件依赖章节缺少 torch_npu 安装指引', 'stage': '了解', 'severity': '严重', 'source': 'https://github.com/triton-lang/triton-ascend/blob/main/docs/zh/quick_start.md - 软件依赖章节', 'suggestion': '补充 torch_npu 安装命令（如 pip install torch-npu==2.7.1.post4）或链接到 PyTorch 官方 torch_npu 安装文档', 'impact': "新用户按文档操作会在运行验证示例时遇到 ModuleNotFoundError: No module named 'torch_npu'"}
- {'title': 'installation_guide.md CANN 镜像版本映射表未列出 beta 版本', 'stage': '了解', 'severity': '重要', 'source': 'https://github.com/triton-lang/triton-ascend/blob/main/docs/en/installation_guide.md - Table 4', 'suggestion': '补充 beta 版本镜像 tag 到映射表，或在文档注释中说明 beta 版本不在官方支持范围', 'impact': '用户使用 beta 版镜像时无法从文档确认兼容性'}
- {'title': 'requirements.txt 与 quick_start.md/installation_guide.md 的 torch_npu 版本号不一致', 'stage': '了解', 'severity': '提示', 'source': 'https://github.com/triton-lang/triton-ascend/blob/main/requirements.txt', 'suggestion': '统一版本号描述，明确推荐使用 2.7.1.post4 版本', 'impact': '用户可能安装错误版本导致兼容性问题'}
- {'title': 'quick_start.md 未提及 requirements.txt 安装步骤', 'stage': '了解', 'severity': '一般', 'source': 'https://github.com/triton-lang/triton-ascend/blob/main/docs/zh/quick_start.md', 'suggestion': '在软件包安装章节后补充安装运行依赖步骤：pip install -r requirements.txt', 'impact': '用户按 quick_start.md 安装后运行示例会因缺少 torch_npu 而失败'}

## 六、遇到的问题

- 测试镜像 quay.io/ascend/cann:9.0.0-beta.2-910b-ubuntu22.04-py3.10 拉取失败 → 环境阻塞，无解法（离线集群无法访问外网 quay.io）（来源：installation_guide.md Table 4）

## 七、结论

本次测试因环境阻塞（离线集群无法拉取外网 quay.io 镜像）在安装阶段终止。阶段一文档抓取成功，发现 4 处文档缺陷：1) quick_start.md 缺少 torch_npu 安装指引（严重）；2) 镜像版本映射表未列出 beta 版本（重要）；3) torch_npu 版本号不一致（提示）；4) requirements.txt 安装时机未说明（一般）。建议在有外网访问能力的环境下重新测试验证这些缺陷是否会在实际运行中触发。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。