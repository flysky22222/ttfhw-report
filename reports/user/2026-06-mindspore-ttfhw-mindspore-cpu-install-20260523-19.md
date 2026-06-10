# TTHFW 测试报告

**报告编号**: ttfhw-mindspore-cpu-install-20260523-19
**测试日期**: 2026-05-23
**测试人员**: TTFHW 自动化测试
**测试结果**: 成功（发现3条文档缺陷，安装验证通过）

---

## 一、概述

### 1.1 测试用例

**测试目标**: 作为 MindSpore 用户，按 mindspore.cn 官网实时获取的安装方式，在 amd64 节点的 Pod（dind 模式）里完成 MindSpore CPU 版的安装与最小验证（import + 简单 Tensor 运算），发现安装文档缺陷。

**四阶段输入**:

| 阶段 | 输入描述 |
|------|----------|
| 了解 | 通过 Playwright MCP 访问 https://www.mindspore.cn/install （动态页必须 Playwright），实时点选 Linux + x86_64 + CPU + 当前最新版本，拿到官网真实给出的安装命令和 wheel/docker URL，完整截图记录每一步选择；如果 mindspore.cn 链接失效或内容不足，自动用豆包/百度补查通用依赖，但主软件包的 URL 必须是 mindspore.cn 官网这次实时给出的；最终选定 1-2 篇官方文档作为后续阶段依据。 |
| 获取/安装 | 直接用阶段一从 mindspore.cn 官网实时获取的安装方式安装 MindSpore；报错时先查官网，查不到再走豆包/外网两层补查通用依赖；主软件包安装失败记缺陷继续，禁止用豆包/搜索结果替换 mindspore.cn 给的 URL。 |
| 使用 | 按官方文档提供的最小验证用例验证 MindSpore 可用性，至少完成验证命令返回正确结果，且完整记录命令和回显。 |
| 贇献 | 把发现的所有文档缺陷整理成结构化 GitCode Issue；GITCODE_TOKEN secret 已注入则自动 POST 提交，缺失则记为断点输出可人工提交的内容。 |

### 1.2 测试总结

- **测试对象**: MindSpore 2.9.0 CPU 版
- **最终结论**: 成功安装并验证，但需绕过 Ubuntu 24.04 的 PEP 668 限制
- **文档完备性**: 仅靠官方文档无法在 Ubuntu 24.04 上独立完成
- **核心问题**: Ubuntu 24.04 PEP 668 限制、ascendhub镜像无universe源、GCC版本范围过窄

---

## 二、四阶段执行记录

| 阶段 | 状态 | 耗时 | 断点数 |
|------|------|------|--------|
| 了解 | 成功 | 5 分钟 | 0 |
| 获取/安装 | 成功（需绕过） | 25 分钟 | 3 |
| 使用 | 成功 | 5 分钟 | 0 |
| 贡献 | 断点（Token权限不足） | 5 分钟 | 1 |


### 阶段一:了解

**时间口径**:100字/分钟;链接校验 1分钟/条
**实际用时**: 5 分钟

通过 Playwright MCP 访问 mindspore.cn/install，成功获取 MindSpore 2.9.0 CPU 版安装命令。

安装命令（来自官网）:
```
pip install mindspore==2.9.0 -i https://repo.mindspore.cn/pypi/simple --trusted-host repo.mindspore.cn --extra-index-url https://repo.huaweicloud.com/repository/pypi/simple
```

截图已保存至 logs/phase1-screenshots/

---

### 阶段二:获取/安装

**实际用时**: 25 分钟

发现并解决3个断点:

1. docker:dind Pod 不兼容 MindSpore wheel (musl/glibc 问题) - 切换到 Ubuntu Pod
2. 镜像架构不匹配 - 使用 ascendhub/ubuntu:24.04-base
3. Ubuntu 24.04 PEP 668 限制 - 使用虚拟环境绕过

最终安装命令（虚拟环境方式）:
```bash
python3 -m venv /root/mindspore_env
source /root/mindspore_env/bin/activate
pip install mindspore==2.9.0 -i https://repo.mindspore.cn/pypi/simple --trusted-host repo.mindspore.cn --extra-index-url https://repo.huaweicloud.com/repository/pypi/simple
```

安装成功: MindSpore 2.9.0

---

### 阶段三:使用

**实际用时**: 5 分钟

官网验证命令执行成功:
```
MindSpore version: 2.9.0
The result of multiplication calculation is correct, MindSpore has been installed on platform [CPU] successfully!
```

Prompt 要求的验证成功:
```
2.9.0
[5 7 9]
```

---

### 阶段四:贡献

**实际用时**: 5 分钟

GitCode Issue 提交失败: 403 Forbidden (Token权限不足)
已记录可人工提交的 Issue 内容至 phase4-contribution.log


---

## 三、测试环境

### 3.1 执行环境

| 项目 | 值 |
|------|----|
| 执行模式 | workflow 模式 |
| 远端连接方式 | kubectl exec |
| 目标集群 | K8s (ttfhw namespace) |

### 3.2 容器/Pod 环境

| 项目 | 值 |
|------|----|
| 基础镜像 | ascendhub/ubuntu:24.04-base |
| 容器 OS | Ubuntu 24.04 LTS x86_64 |
| Python | 3.12.3 |
| GCC | 13.2.0 |
| CPU | Intel Xeon Gold 6278C, 32 cores |

---

## 四、文档缺陷清单

### 缺陷 #1: 文档未说明 Ubuntu 24.04 的 PEP 668 限制

- **缺陷级别**: 中等
- **来源文档**: https://www.mindspore.cn/install
- **现象**: Ubuntu 24.04 pip install 报 externally-managed-environment 错误
- **建议**: 增加 Ubuntu 24.04 说明，推荐虚拟环境

### 缺陷 #2: 文档未说明 ascendhub/ubuntu 需启用 universe 源

- **缺陷级别**: 低
- **来源文档**: https://www.mindspore.cn/install
- **现象**: 镜像无 universe 源，无法安装 python3-pip
- **建议**: 说明启用 universe 源步骤

### 缺陷 #3: GCC 版本要求范围过窄

- **缺陷级别**: 低
- **来源文档**: https://www.mindspore.cn/install
- **现象**: 文档要求 7.3.0-9.4.0，但 GCC 13.2.0 可工作
- **建议**: 更新版本范围

---

## 五、时间统计

| 阶段 | 实际用时 |
|------|----------|
| 了解 | 5 分钟 |
| 获取/安装 | 25 分钟 |
| 使用 | 5 分钟 |
| 贡献 | 5 分钟 |
| **总计** | **40 分钟** |

---

## 六、测试结论

MindSpore 2.9.0 CPU 版安装验证成功，发现3条文档缺陷。

建议改进: 文档应增加 Ubuntu 24.04 安装说明，推荐使用虚拟环境绕过 PEP 668 限制。

