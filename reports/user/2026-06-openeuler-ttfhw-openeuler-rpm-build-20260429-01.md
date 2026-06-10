# TTHFW 测试报告

**报告编号**: ttfhw-openeuler-rpm-build-20260429-01
**测试日期**: 2026-04-29
**测试人员**: ttfhw-actions
**测试结果**: 部分成功 - 按文档完成 RPM 构建，但发现多处文档缺陷

---

## 一、概述

### 1.1 测试用例

**测试目标**: 作为 openEuler 贡献者，按官方文档在测试 Pod 内搭建 RPM 构建开发环境、为 sqlite 编写 spec 文件、本地 rpmbuild 构建、验证 sqlite 功能（SELECT 1+1），目的是发现贡献文档与构建文档在真实环境下的缺陷。

**四阶段输入**:

| 阘段 | 输入描述 |
|------|----------|
| 了解 | 从 docs.openeuler.org 获取 RPM 构建和软件包贡献文档，抽取环境依赖、spec 模板、构建命令 |
| 获取/安装 | 创建测试 Pod，执行文档中的安装命令，创建 rpmbuild 目录，编写 sqlite.spec，构建 RPM 包 |
| 使用 | 安装生成的 sqlite RPM 包，运行 SELECT 1+1 验证功能 |
| 贡献 | 整理文档缺陷成 Issue 格式 |

### 1.2 测试总结

- **测试对象**: sqlite RPM 包构建
- **最终结论**: 部分成功 - RPM 构建流程可完成，但需多处绕过文档缺陷
- **文档完备性**: 不足 - 文档模板不完整，缺少容器化说明，版本信息过期
- **核心问题**: 版本过期、镜像认证、spec模板不完整、无验证示例

---

## 二、四阶段执行记录

| 阶段 | 状态 | 耗时 | 断点数 |
|------|------|------|--------|
| 了解 | 成功 | 15 分钟 | 0 |
| 获取/安装 | 成功（需绕过） | 25 分钟 | 3 |
| 使用 | 成功 | 5 分钟 | 0 |
| 贡献 | 完成 | 5 分钟 | 0 |

### 阶段一:了解

**时间口径**:100字/分钟;链接校验 1分钟/条
**实际用时**: 15 分钟

**搜索过程**:

起点 URL https://docs.openeuler.org 自动重定向到 https://docs.openeuler.openatom.cn/zh/

社区仓库已迁移至 AtomGit 平台: https://atomgit.com/openeuler/community

关键文档位置: zh/contributors/
- prepare-environment.md: 开发环境准备
- packaging.md: 打包规范
- create-package.md: 新增软件包流程

**链接有效性校验**:

| 链接 | 状态 | 备注 |
|------|------|------|
| https://docs.openeuler.org | 有效 | 重定向到 openatom.cn |
| https://atomgit.com/openeuler/community | 有效 | 社区仓库已迁移 |
| https://atomgit.com/openeuler/community/blob/master/zh/contributors/prepare-environment.md | 有效 | 开发环境准备文档 |
| https://atomgit.com/openeuler/community/blob/master/zh/contributors/packaging.md | 有效 | 打包规范文档 |
| https://atomgit.com/openeuler/community/blob/master/zh/contributors/create-package.md | 有效 | 新增软件包文档 |
| https://repo.openeuler.org/openEuler-20.03-LTS/OS/aarch64/RPM-GPG-KEY-openEuler | 有效 | GPG公钥（但版本过期） |

**阶段结论**: 成功从官方文档抽取环境依赖、spec模板、构建命令；发现 sqlite 归属 DB SIG。

---

### 阶段二:获取/安装

**时间口径**:获取 1分钟/条;安装 3分钟/条;报错排查 10分钟/次
**实际用时**: 25 分钟

**获取 — 提取内容**:

1. 安装命令: yum install gcc rpm-build rpm-devel rpmlint make python bash coreutils diffutils patch rpmdevtools
2. 工作目录: rpmdev-setuptree 创建 ~/rpmbuild/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
3. spec 检查: rpmlint xxx.spec
4. 构建命令: rpmbuild -ba xxx.spec

**资料来源标注**: 官方文档 - AtomGit openEuler/community 仓库

**安装 — 环境初始化**:

- Pod 创建: kubectl apply -f test-pod.yaml
- 集群: ttfhw namespace, amd64 node
- 容器 OS: Ubuntu 24.04 LTS（因 openEuler 镜像需认证）

**断点记录**:

```
断点1: openEuler 镜像拉取失败
- 错误信息: Failed to pull image: 401 Unauthorized
- 根因分析: SWR openeuler/openeuler 镜像需要登录认证
- 排查路径: 检查镜像可用性 → 发现需认证 → 改用 Ubuntu 镜像
- 修复措施: 使用 Ubuntu 24.04-base 镜像，安装 rpm 包
- 缺陷定性: 文档缺陷 - 未说明容器镜像获取方式
```

```
断点2: Ubuntu 默认仓库无 rpm 包
- 错误信息: Package 'rpm' has no installation candidate
- 根因分析: Ubuntu 24.04-base 默认未启用 universe 仓库
- 排查路径: apt-cache search → 无结果 → add-apt-repository universe
- 修复措施: 添加 universe 仓库后安装 rpm 包
- 缺陷定性: 环境差异 - 非文档缺陷但文档未覆盖此场景
```

```
断点3: rpmbuild 依赖检查失败
- 错误信息: Failed build dependencies: gcc is needed, make is needed
- 根因分析: Ubuntu 上 rpmbuild 的依赖检查基于 rpm 数据库而非系统实际安装的包
- 排查路径: 检查 gcc/make 存在 → rpm 依赖机制差异 → 使用 --nodeps
- 修复措施: 使用 rpmbuild -ba --nodeps
- 缺陷定性: 文档缺陷 - 未说明非 rpm 系统处理方式
```

```
断点4: 构建成功但打包文件遗漏
- 错误信息: Installed (but unpackaged) file(s): libsqlite3.a, sqlite3.pc, sqlite3.1.gz
- 根因分析: spec 模板未包含 man 手册和 pkgconfig 文件
- 排查路径: 更新 %files 部分 → 重新构建
- 修复措施: 在 spec 中添加 %{_mandir}/man1/*.gz, %{_libdir}/pkgconfig/*.pc
- 缺陷定性: 文档缺陷 - spec 模板不完整
```

---

### 阶段三:使用

**时间口径**:3分钟/条;验证失败 10分钟/次
**实际用时**: 5 分钟

**Hello World 与功能验证**:

- sqlite3 命令可用: `/usr/bin/sqlite3` ✓
- 版本信息: `3.45.0 2024-01-15` ✓
- SELECT 1+1 = 2 ✓
- CREATE TABLE / INSERT / SELECT ✓

**文档缺陷发现**: packaging.md 未提供 hello-world 验证命令示例

---

### 阶段四:贡献

**时间口径**:3分钟/条
**实际用时**: 5 分钟

整理的文档缺陷:
1. prepare-environment.md 版本过期（20.03 LTS → 应更新）
2. 文档使用 yum 命令而非 dnf
3. openEuler 镜像需要认证但文档未说明
4. spec 模板不完整，缺少 man/pkgconfig/静态库示例
5. 文档未说明非 rpm 系统的处理方式
6. packaging.md 未提供验证命令示例

SQLite SIG 归属: DB SIG

---

## 三、测试环境

### 3.1 执行环境

| 项目 | 值 |
|------|----|
| 执行模式 | 当前对话直跑模式 |
| 本地控制端 OS | Ubuntu 24.04 |
| 远端连接方式 | kubectl exec |
| 目标集群 | Kubernetes ttfhw namespace |
| 测试 Pod | ttfhw-rpm-build-test |

### 3.2 容器/Pod 环境

| 项目 | 值 |
|------|----|
| 容器名称 | ttfhw-rpm-build-test |
| 基础镜像 | swr.cn-south-1.myhuaweicloud.com/ascendhub/ubuntu:24.04-base |
| 容器 OS | Ubuntu 24.04 LTS |
| Python 版本 | Python 3.12 |
| 计算资源 | 2 CPU, 2Gi Memory |

### 3.3 软件栈

| 软件 | 版本 | 来源 |
|------|------|------|
| rpm/rpmbuild | 4.18.2 | Ubuntu universe |
| rpmlint | 2.5.0 | Ubuntu universe |
| gcc | Ubuntu 默认版本 | apt-get |
| sqlite (构建产物) | 3.45.0 | 自构建 RPM |

---

## 四、文档缺陷清单

### 缺陷 1: prepare-environment.md 版本过期 (重要)

| 项目 | 内容 |
|------|------|
| **缺陷级别** | 重要 |
| **来源** | AtomGit openEuler/community zh/contributors/prepare-environment.md |
| **现象** | 文档使用 openEuler-20.03-LTS，repo 源和 GPG 公钥 URL 都指向过期版本 |
| **根因** | 文档未随版本发布同步更新 |
| **影响** | 用户可能使用过期版本，无法获取最新软件包 |
| **建议** | 更新为当前稳定版本（24.03 LTS）或添加版本选择说明 |

---

### 缺陷 2: 文档使用 yum 命令而非 dnf (一般)

| 项目 | 内容 |
|------|------|
| **缺陷级别** | 一般 |
| **来源** | prepare-environment.md |
| **现象** | 文档使用 yum 命令，openEuler 默认使用 dnf |
| **建议** | 将所有 yum 命令替换为 dnf 命令 |

---

### 缺陷 3: openEuler 镜像需要认证 (严重)

| 项目 | 内容 |
|------|------|
| **缺陷级别** | 严重 |
| **来源** | prepare-environment.md |
| **现象** | 文档要求使用 openEuler 系统，但 SWR 镜像需认证才能拉取 |
| **错误信息** | 401 Unauthorized |
| **建议** | 提供公开镜像地址或说明认证流程 |

---

### 缺陷 4: spec 模板不完整 (重要)

| 项目 | 内容 |
|------|------|
| **缺陷级别** | 重要 |
| **来源** | packaging.md |
| **现象** | helloworld.spec 模板缺少 man/pkgconfig/静态库示例 |
| **错误信息** | Installed (but unpackaged) file(s) found |
| **建议** | 扩展模板或添加完整示例 |

---

### 缺陷 5: 文档未说明非 rpm 系统处理 (重要)

| 项目 | 内容 |
|------|------|
| **缺陷级别** | 重要 |
| **来源** | packaging.md |
| **现象** | BuildRequires 在 Ubuntu 上无法满足依赖检查 |
| **建议** | 明确仅适用 openEuler 或提供跨系统方案 |

---

### 缺陷 6: 无验证命令示例 (一般)

| 项目 | 内容 |
|------|------|
| **缺陷级别** | 一般 |
| **来源** | packaging.md |
| **现象** | 未提供构建后验证命令 |
| **建议** | 添加 rpm -qpl、rpm -ivh、功能验证示例 |

---

## 五、时间统计

| 阶段 | 操作数 | 计算口径 | 估算时长 |
|------|--------|----------|----------|
| 了解 | 6 条文档 | 100字/分钟;1分钟/链接 | 约 15 分钟 |
| 获取/安装 | 获取 4 条;安装 8 条;排查 4 次 | 1分钟/条;3分钟/条;10分钟/次 | 约 25 分钟 |
| 使用 | 验证 4 条 | 3分钟/条 | 约 5 分钟 |
| 贡献 | 6 条缺陷 | 3分钟/条 | 约 5 分钟 |
| 输出 | 本报告 | 实际生成时间 | 约 5 分钟 |
| **合计** | | | **约 55 分钟** |

---

## 六、测试结论

**最终验证结果**: 部分成功

**成功/失败路径**:

1. 文档检索：成功（来源：官方 AtomGit 仓库）
2. Pod 创建：成功（使用 Ubuntu 镜像代替 openEuler）
3. rpm 安装：成功（添加 universe 仓库）
4. rpmbuild 构建：成功（使用 --nodeps 绕过依赖检查）
5. spec 修复：成功（扩展 %files 部分）
6. Hello World：成功（SELECT 1+1 = 2）

**来源说明**:
- 官方文档: https://atomgit.com/openeuler/community/blob/master/zh/contributors/*.md
- 外网补充: Ubuntu universe 仓库、sqlite.org 源码

**绕过步骤**:
- openEuler 镜像认证 → 使用 Ubuntu 镜像
- rpm 包不在默认仓库 → add-apt-repository universe
- BuildRequires 无法满足 → 使用 --nodeps
- spec 文件不完整 → 手动扩展 %files

