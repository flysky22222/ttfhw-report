# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpeed-LLM`
- 文档入口：https://gitcode.com/Ascend/MindSpeed-LLM
- 时间：2026-07-09T15:28:00Z ~ 2026-07-09T15:55:00Z（1620 秒）
- 镜像：`swr.cn-south-1.myhuaweicloud.com/ascendhub/cann:8.5.2-910b-openeuler24.03-py3.11` —— 文档 OVERVIEW.md 提供的基础镜像地址，CANN 8.5.2 已预装

## 二、环境

- 容器 OS：openEuler 24.03 LTS｜架构：aarch64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：https://gitcode.com/Ascend/MindSpeed-LLM/blob/master/docs/en/pytorch/training/install_guide.md　（来源：Playwright MCP 实时抓取 gitcode.com/Ascend/MindSpeed-LLM）
- **prerequisites**：Atlas A2/A3 training products NPU；CANN 8.5.2 或 9.0.0；PyTorch 2.7.1 + torch_npu 2.7.1；Python 3.11；openEuler 24.03 或 Ubuntu 22.04　（来源：文档 - 安装指南）
- **install_commands**：git clone https://gitcode.com/ascend/MindSpeed.git；pip3 install -r requirements.txt (MindSpeed)；pip3 install -e . (MindSpeed)；git clone https://gitcode.com/ascend/MindSpeed-LLM.git；git clone https://github.com/NVIDIA/Megatron-LM.git；git checkout core_v0.12.1 (Megatron-LM)；cp -r megatron ../MindSpeed-LLM/；pip3 install -r requirements.txt (MindSpeed-LLM)　（来源：文档 - install_guide.md Method 2）
- **use_commands**：　（来源：文档未提供明确验证命令）
- **contribution_entry**：https://gitcode.com/Ascend/MindSpeed-LLM/issues　（来源：文档 - README）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 600 | 5 |
| 安装 | 部分成功 | 900 | 2 |
| 使用 | 失败 | 60 | 1 |
| 贡献 | 成功 | 60 | 0 |

## 五、文档缺陷清单

- {'title': '预构建镜像缺少完整 registry 地址', 'stage': '了解', 'severity': '严重', 'source': 'install_guide.md - Method 1: Image Installation', 'suggestion': '增加完整镜像拉取命令，如：docker pull swr.cn-south-1.myhuaweicloud.com/ascendhub/mindspeed-llm:26.0.0-910b-openeuler24.03-py3.11-aarch64', 'impact': '用户无法直接 pull 预构建镜像，必须自己构建或额外查找 registry 信息'}
- {'title': 'CANN 安装引用外部链接未给出具体命令', 'stage': '安装', 'severity': '重要', 'source': 'install_guide.md - Method 2 步骤 1', 'suggestion': '在文档中补充 CANN 安装的关键步骤或提供离线安装包下载链接', 'impact': '用户需要额外查找 CANN 安装文档，增加安装复杂度'}
- {'title': 'PyTorch/torch_npu 版本匹配要求不明确', 'stage': '安装', 'severity': '严重', 'source': 'install_guide.md - Method 2 步骤 2', 'suggestion': '明确标注 torch_npu 版本与 CANN 版本的配套关系表，如：torch_npu 2.7.1 需要 CANN 9.0，torch_npu 2.5.x 需要 CANN 8.5.x', 'impact': '用户按示例安装会遇到版本不匹配错误，无法正常使用'}
- {'title': 'PyTorch .whl 文件获取方式未说明', 'stage': '安装', 'severity': '一般', 'source': 'install_guide.md - Method 2 步骤 2', 'suggestion': '说明 .whl 文件下载地址（gitcode releases 页面）或提供在线安装命令', 'impact': '用户不知道如何获取文档示例中的 .whl 文件'}
- {'title': '前置依赖安装流程不完整', 'stage': '了解', 'severity': '重要', 'source': 'install_guide.md - Preparation', 'suggestion': '整合前置依赖安装流程，提供一站式安装脚本或详细步骤', 'impact': '用户需要多份外部文档才能完成前置安装'}
- {'title': '镜像说明与实际不符（称预装 PyTorch 但实际未预装）', 'stage': '安装', 'severity': '重要', 'source': 'OVERVIEW.md 和 hiascend 镜像详情页', 'suggestion': '更新镜像说明，明确标注镜像预装内容（仅 CANN，不含 PyTorch）', 'impact': '用户误以为 PyTorch 已预装，实际需要额外安装'}
- {'title': '缺少明确的验证命令', 'stage': '使用', 'severity': '重要', 'source': 'install_guide.md 全文', 'suggestion': "增加最小验证示例，如：python -c 'import mindspeed_llm; print(mindspeed_llm.__version__)'", 'impact': '用户安装完成后无法快速验证是否成功'}

## 六、遇到的问题

- torch_npu 导入失败：ImportError: libruntime_common.so undefined symbol → CANN 8.5.2 与 torch_npu 2.7.1 版本不匹配，需要 CANN 9.0 或降级到 torch_npu 2.5.x（来源：实测发现）

## 七、结论

模拟用户按官方文档在 NPU A2 Pod 内尝试安装 MindSpeed-LLM，发现 7 处文档缺陷。阶段一（了解）成功，阶段二（安装）部分成功（Pod 创建和 PyTorch 安装成功，但 torch_npu 版本不匹配导致导入失败），阶段三（使用）因 torch_npu 无法导入而失败，阶段四（贡献）成功整理文档缺陷。核心问题：文档未明确说明 torch_npu 与 CANN 的版本配套关系，用户按示例安装会遇到 ImportError。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。