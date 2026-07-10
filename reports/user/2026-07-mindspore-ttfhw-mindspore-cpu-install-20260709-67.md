# TTHFW 用户场景验证报告

## 一、概述

- 目标：`MindSpore CPU 版`
- 文档入口：https://www.mindspore.cn/install
- 时间：2026-07-09T13:56:00Z ~ 2026-07-09T14:10:00Z（840 秒）
- 镜像：`docker.io/ubuntu:24.04` —— TEST_IMAGE未指定；TTFHW标准base镜像架构不匹配（exec format error）；临时降级使用docker.io Ubuntu 24.04公网镜像

## 二、环境

- 容器 OS：Ubuntu 24.04.4 LTS｜架构：x86_64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：https://www.mindspore.cn/install（动态Vue页，Playwright MCP抓取）　（来源：prompt指定官方文档入口）
- **prerequisites**：OS: Ubuntu（示例18.04）；Python: 3.9-3.12；GCC: 7.3.0-11.3.0（优选7.3.0）　（来源：文档 - 安装MindSpore与依赖软件章节）
- **install_commands**：export MS_VERSION=2.9.0；pip install mindspore==${MS_VERSION} -i https://repo.mindspore.cn/pypi/simple --trusted-host repo.mindspore.cn --extra-index-url https://repo.huaweicloud.com/repository/pypi/simple　（来源：文档 - 安装MindSpore章节 + 页面实时生成）
- **use_commands**：python -c "import mindspore;mindspore.set_device(device_target='CPU');mindspore.run_check()"　（来源：文档 - 验证是否成功安装章节）
- **contribution_entry**：GitCode Issue 提交　（来源：prompt指定）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 300 | 0 |
| 安装 | 部分成功（环境镜像缺陷+文档缺陷） | 360 | 2 |
| 使用 | 成功 | 120 | 0 |
| 贡献 | 成功 | 60 | 0 |

## 五、文档缺陷清单

- {'title': 'TTFHW 标准基础镜像不支持 amd64 节点（exec format error）', 'stage': '安装', 'severity': '严重', 'source': 'CLAUDE.md § 容器基础镜像 catalog', 'suggestion': '为每个base image提供多架构版本（amd64+arm64），或明确标注架构', 'impact': '所有amd64场景无法使用TTFHW base image'}
- {'title': 'mindspore.cn 安装文档未说明 Ubuntu 24.04 的 PEP 668 限制及处理方法', 'stage': '安装', 'severity': '重要', 'source': 'https://www.mindspore.cn/install - 安装MindSpore章节', 'suggestion': '文档需补充venv/Conda虚拟环境安装方法，或说明Ubuntu 20.04+的PEP 668处理', 'impact': 'Ubuntu 20.04及以上版本用户按文档安装会失败'}
- {'title': '文档 GCC 版本要求（7.3.0-11.3.0）未包含 Ubuntu 24.04 默认 GCC 13.3.0', 'stage': '安装', 'severity': '一般', 'source': 'https://www.mindspore.cn/install - 依赖表格', 'suggestion': '更新GCC版本范围至7.3.0-13.3.0，明确Ubuntu 24.04默认GCC可用', 'impact': '用户可能担心GCC版本不兼容，实际兼容'}

## 六、遇到的问题

- TTFHW base image exec format error（架构不匹配） → 临时改用docker.io/ubuntu:24.04公网镜像（来源：TTFHW base image catalog）
- pip install报错externally-managed-environment（PEP 668） → 创建venv虚拟环境后再安装（来源：mindspore.cn官网安装命令）

## 七、结论

模拟用户按mindspore.cn官网安装指南在Ubuntu 24.04+x86_64环境真实安装MindSpore 2.9.0，了解/使用阶段完全成功，安装阶段遇到2个断点（环境镜像缺陷+文档PEP 668缺陷）后解决，最终验证通过。发现3个文档缺陷：1) TTFHW base镜像架构不匹配（环境配套资源）；2) Ubuntu 24.04 PEP 668保护未说明（安装步骤缺失）；3) GCC版本要求过时（版本范围未更新）。MindSpore安装成功，官方验证命令输出符合预期。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。