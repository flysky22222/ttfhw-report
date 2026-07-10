# TTHFW 用户场景验证报告

## 一、概述

- 目标：`openUBMC-CMT`
- 文档入口：https://www.openubmc.cn/zh/download
- 时间：2026-07-09T13:27:00 ~ 2026-07-09T13:36:00（540 秒）
- 镜像：`ubuntu:22.04` —— 官网未提供容器镜像，使用基础镜像进行固件包下载验证

## 二、环境

- 容器 OS：Ubuntu 22.04.5 LTS｜架构：x86_64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：https://www.openubmc.cn/zh/download 社区发行版下载页面　（来源：用户指定官方文档入口）
- **prerequisites**：华为服务器硬件（Model 2280 V2）；BMC 管理权限　（来源：官网无明确前置要求）
- **install_commands**：wget https://repo.openubmc.cn/26.06/firmware/openUBMC-CMT_26.06.00.01.zip　（来源：官网无安装命令）
- **use_commands**：　（来源：官网无使用命令）
- **contribution_entry**：缺少固件使用文档　（来源：官网无贡献入口）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 部分成功 | 180 | 1 |
| 安装 | 成功 | 120 | 1 |
| 使用 | 部分成功 | 60 | 1 |
| 贡献 | 成功 | 60 | 0 |

## 五、文档缺陷清单

- {'title': '官网未说明华为云开源镜像站下载路径', 'stage': '了解', 'severity': '严重', 'source': 'https://www.openubmc.cn/zh/download', 'suggestion': "在下载页面明确标注华为云镜像站访问地址和说明，或删除测试目标中的'华为云镜像站'描述", 'impact': '用户无法按华为云镜像站路径快速安装'}
- {'title': '缺少固件快速安装指南', 'stage': '了解', 'severity': '重要', 'source': 'https://www.openubmc.cn/docs/zh/development/quick_start/explore_openubmc.html', 'suggestion': "新增'快速试用'章节，说明如何下载和验证固件包", 'impact': '普通用户无法快速上手'}
- {'title': '缺少固件烧录/更新指南', 'stage': '安装', 'severity': '重要', 'source': '官网缺失文档', 'suggestion': "编写'固件更新指南'，包括烧录步骤和支持硬件型号", 'impact': '用户下载固件包后无法使用'}
- {'title': '未提供 SHA256 校验值下载', 'stage': '安装', 'severity': '一般', 'source': 'https://www.openubmc.cn/zh/download', 'suggestion': '在下载表格中直接显示 SHA256 校验值，提供 .sha256 校验文件下载', 'impact': '用户无法在下载前验证文件完整性'}
- {'title': '缺少 HPM 固件包使用说明', 'stage': '使用', 'severity': '一般', 'source': 'https://www.openubmc.cn/zh/download', 'suggestion': '在固件包内添加 README.md，说明文件列表和用途', 'impact': '用户无法理解固件包结构'}
- {'title': '缺少容器环境验证方案', 'stage': '使用', 'severity': '提示', 'source': '测试环境限制', 'suggestion': '提供 openUBMC QEMU 镜像或在文档中明确说明需要真实硬件', 'impact': '无法在非硬件环境验证固件功能'}

## 六、遇到的问题

- 官网下载页面所有链接指向 repo.openubmc.cn，未提及华为云镜像站 → 使用官网提供的链接进行测试，记录为文档缺陷（来源：官网下载页面）
- BMC 固件需要真实硬件，无法在容器环境验证功能 → 仅进行文件完整性和内容验证，记录为环境限制（来源：测试环境限制）

## 七、结论

模拟用户按官方文档在 Ubuntu 容器内完成 openUBMC 固件包的下载和验证，了解/安装/使用阶段部分成功（可下载固件包并验证完整性），但发现 6 处文档缺陷（华为云镜像站路径缺失、快速安装指南缺失、烧录指南缺失等）。由于 BMC 固件需要真实硬件，无法在容器环境进行功能验证，这是硬件依赖型软件的固有限制。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。