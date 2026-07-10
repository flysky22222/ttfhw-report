# TTHFW 用户场景验证报告

## 一、概述

- 目标：`sqlite RPM 构建`
- 文档入口：https://docs.openeuler.openatom.cn/zh/docs/24.03_LTS_SP4/server/development/application_dev/building_an_rpm_package.html
- 时间：2026-07-09T16:25:48 ~ 2026-07-09T16:43:00（990 秒）
- 镜像：`swr.cn-south-1.myhuaweicloud.com/ascendhub/ubuntu:24.04-base` —— 任务默认指定，但与文档不匹配（文档要求 openEuler）

## 二、环境

- 容器 OS：Ubuntu 24.04 LTS｜架构：x86_64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：https://docs.openeuler.org → 重定向到 https://docs.openeuler.openatom.cn/zh/　（来源：用户指定官方文档入口）
- **prerequisites**：OS: openEuler；权限: root；repo源: 已设置openEuler的repo软件源　（来源：文档 - 搭建开发环境章节）
- **install_commands**：dnf install rpmdevtools*；rpmdev-setuptree　（来源：文档 - 第1节）
- **spec_template**：hello.spec 示例（GNU Hello World）　（来源：文档 - 第3节）
- **build_commands**：rpmbuild -ba hello.spec；可选参数：-bp, -bc, -bi, -bl, -ba, -bb, -bs　（来源：文档 - 第4节）
- **sig_info**：sqlite 可能归属于 DB SIG 或 Base-service SIG　（来源：SIG 列表页面）
- **verification_commands**：执行 hello 命令（未给出 sqlite 验证）　（来源：文档 - Hello World 示例）
- **container_notes**：文档未说明容器化场景的特殊注意事项　（来源：文档未提及）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 150 | 3 |
| 安装 | 部分成功 | 660 | 1 |
| 使用 | 成功 | 120 | 2 |
| 贡献 | 成功 | 60 | 0 |

## 五、文档缺陷清单

- {'title': 'sqlite 包无明确的构建示例', 'stage': '了解', 'severity': '重要', 'source': '文档第 3 节', 'suggestion': '补充 sqlite、nginx、redis 等常见软件包的 spec 文件模板示例', 'impact': '用户按照文档无法学习如何为 sqlite 等软件包编写 spec 文件'}
- {'title': 'sqlite 包的 SIG 归属未明确说明', 'stage': '了解', 'severity': '重要', 'source': '文档全文', 'suggestion': '在文档中补充常见软件包的 SIG 归属说明', 'impact': '用户不知道应该向哪个 SIG 提交 sqlite 包的 PR'}
- {'title': '容器化场景缺少特化说明', 'stage': '了解', 'severity': '一般', 'source': '文档全文', 'suggestion': '补充容器化场景的构建指南', 'impact': '用户在容器环境中可能遇到权限、网络、存储等问题'}
- {'title': '文档未说明如何在非 openEuler 系统上构建 RPM 包', 'stage': '安装', 'severity': '严重', 'source': '文档第 1 节', 'suggestion': '补充跨系统构建指南或引导用户使用 openEuler 容器', 'impact': '用户在 Ubuntu 等系统上无法按文档构建 RPM 包'}
- {'title': 'sqlite 无最小验证示例', 'stage': '使用', 'severity': '重要', 'source': '文档全文', 'suggestion': '补充常见软件的最小验证示例', 'impact': '用户不知道如何验证 sqlite 是否正确安装'}
- {'title': '跨系统验证问题', 'stage': '使用', 'severity': '重要', 'source': '文档全文', 'suggestion': '说明如何验证 RPM 包的内容和结构', 'impact': '用户在 Ubuntu 等系统上无法直接安装验证 RPM 包'}

## 六、遇到的问题

- 文档命令 dnf install rpmdevtools* 失败：Ubuntu 系统无 dnf 命令 → 文档外补充：启用 universe 源并安装 rpm build-essential wget（来源：文档第 1 节）
- 文档命令 rpmdev-setuptree 失败：Ubuntu 系统无此命令 → 文档外补充：手动创建工作空间目录（来源：文档第 2 节）
- RPM 包无法在 Ubuntu 上安装：缺少 libc.so.6 等依赖 → 文档外补充：重新构建 sqlite3 二进制文件并验证功能（来源：文档验证方法）

## 七、结论

本次测试模拟 openEuler 贡献者按官方文档构建 sqlite RPM 包，阶段一成功从文档抽取关键信息，阶段二因测试环境使用 Ubuntu 导致文档命令失败（发现严重缺陷），阶段三成功验证 sqlite3 功能，阶段四整理 6 个文档缺陷。测试发现文档主要问题：（1）只支持 openEuler 系统，缺少跨系统构建指南；（2）只提供 Hello World 示例，缺少 sqlite 等常见软件包示例；（3）未说明软件包 SIG 归属；（4）缺少容器化场景指导。建议优先处理跨系统构建指南（严重缺陷）。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。