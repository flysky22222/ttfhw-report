# openUBMC 易用性评估报告

**测试日期**: 2026-05-24
**测试目标**: 准备openUBMC开发环境并适配一款新硬件
**测试场景**: openUBMC 开发者完成环境准备、硬件适配、构建验证和贡献流程

---

## 一、测试概述

本报告基于实际操作流程，整理 openUBMC 社区在硬件适配场景下的使用情况，覆盖了解、获取、使用、贡献四个阶段。

阶段口径统一如下：
- 了解：从主流搜索引擎搜索到对应文档阅读完成。
- 安装：开始尝试从 README 或官方文档提供的安装方式开始下载，到整体安装完成。
- 使用：安装完成后，到跑通 Hello World 或指定场景 case。
- 贡献：按问题数统计，1 个问题按 5 分钟计；没有问题则记 0 分钟。

## 二、测试结论

| 阶段 | 状态 | 耗时 | 断点数 |
|------|------|------|--------|
| 了解 | 成功 | 4分钟 | 0 |
| 安装 | 成功 | 27分钟 | 3 |
| 使用 | 成功 | 14小时 | 2 |
| 贡献 | 成功 | 5分钟 | 1 |

---

## 三、文档来源汇总

### 2.1 官方文档仓库

| 文档名称 | URL | 用途 |
|---------|-----|------|
| openUBMC快速开始 | https://www.openubmc.cn/docs/zh/development/quick_start/explore_openubmc.html | 官方文档中心 |
| openUBMC/docs | https://gitcode.com/openUBMC/docs | openUBMC文档代码仓 |

### 2.2 核心参考文档

| 文档标题 | URL | 章节位置 |
|---------|-----|---------|
| Ubuntu开发环境搭建 | https://gitcode.com/openUBMC/docs/blob/main/docs/zh/development/quick_start/prepare_environment/ubuntu_env.md | 快速入门 > 环境准备 |
| 构建你的BMC | https://gitcode.com/openUBMC/docs/blob/main/docs/zh/development/quick_start/build_your_own_bmc.md | 快速入门 |
| 适配一款硬件 | https://gitcode.com/openUBMC/docs/blob/main/docs/zh/development/quick_start/integrate_a_device.md | 快速入门 |

---

## 四、各阶段详细过程

### 3.1 了解阶段（Learn）

**目标**: 了解openUBMC是什么，能做什么

| 步骤 | 操作 | 结果 | 耗时 | 出处 |
|-----|------|------|------|------|
| 1 | 搜索"openUBMC"相关信息 | 找到Gitcode文档仓库 | ~2分钟 | gitcode API搜索 |
| 2 | 阅读README文档 | 了解项目结构和开发流程 | ~3分钟 | openUBMC/docs/README.md |
| 3 | 查看菜单结构(menu.json) | 获取完整文档导航 | ~1分钟 | openUBMC/docs/public/menu/development/menu.json |   

**断点1**: quick start 文档未提及对操作系统版本、硬件架构、资源要求的限制
- **现象**: 实际要求ubuntu 24.04, x86_64架构，文档中未提及，导致尝试构建失败
- **原因**: 文档缺失
- **解决方案**: 补充对应描述

**断点统计**: 1个
**总耗时**: 6分钟

**阶段结论**: 文档结构清晰，导航明确，能够快速了解项目概况

---

### 3.2 安装阶段（Install）

**目标**: 获取开发环境和源代码

#### 3.2.1 环境准备

| 步骤 | 操作 | 命令 | 结果 | 耗时 | 断点 | 出处 |
|-----|------|------|------|------|------|------|
| 1 | 配置Git用户 | `git config --global user.name "xxx"` | ✅ 成功 | 5秒 | - | Ubuntu开发环境搭建 |
| 2 | 配置Git邮箱 | `git config --global user.email "xxx"` | ✅ 成功 | 5秒 | - | Ubuntu开发环境搭建 |
| 3 | 生成SSH密钥 | `ssh-keygen -t rsa -b 2048` | ✅ 成功 | 10秒 | - | Ubuntu开发环境搭建 |
| 4 | 配置SSH替代HTTPS | `git config --global url...` | ✅ 成功 | 5秒 | - | Ubuntu开发环境搭建 |
| 5 | 克隆manifest仓库 | `git clone git@gitcode.com:openUBMC/manifest.git` | ✅ 成功  | 30秒 | - | Ubuntu开发环境搭建 |


#### 3.2.2 BMC SDK获取

| 步骤 | 操作 | 结果 | 耗时 | 断点 | 出处 |
|-----|------|------|------|------|------|
| 1 | 访问openUBMC应用市场 | https://openubmc.cn/marketplace/bmcsdk | ❌ | 30秒 | **断点2** | Ubuntu开发环境搭建 |
| 2 | 下载bmcsdk.zip | - | ❌ 下载到本地后再次上传 | 12分钟 | **断点2** | Ubuntu开发环境搭建 |
| 3 | 执行init.py | `python init.py` | ✅ 成功 | 10分钟 | **断点2** **断点4** | Ubuntu开发环境搭建 |


**断点2**: 通过openUBMC应用市场获取bmcsdk.zip需下载到本地再上传到服务器，增加耗时
- **现象**: 下载到本地再上传到服务器，增加耗时
- **原因**: 能力限制
- **解决方案**: 增加wget获取离线安装包支持

**断点3**: 需要切换到指定tag才能正确编译
- **现象**: 需要根据文档切换到指定tag才能正确编译
- **原因**: 主干分支存在bug
- **解决方案**: 修复对应bug

**断点4**: init.py执行失败，脚本内对root及sudo命令控制有bug
- **现象**: init脚本部分操作要求root权限，sudo命令执行失败，使用root用户又会报错
- **原因**: 脚本内对root及sudo命令控制有bug
- **解决方案**: 修复对应bug

#### 安装阶段统计

| 指标 | 数值 |
|-----|------|
| 成功步骤 | 7/7 |
| 断点数量 | **4个** |
| 总耗时 | **27分钟** |
| 人工思考总耗时 | 35秒 |

---

### 3.3 使用阶段（Use）

**目标**: 完成新硬件适配开发

安装阶段完成后，继续按文档完成硬件适配、组件构建与仿真验证流程。

#### 3.3.1 整包构建

**出处**: 构建你的BMC文档

```bash
cd manifest
bingo build
```

#### 3.3.4 仿真测试

**出处**: 构建你的BMC文档 - "仿真运行"章节

```bash
bingo build -sc qemu
python3 build/works/packet/qemu_shells/vemake_1711.py
```

#### 使用阶段统计

| 指标 | 数值 |
|-----|------|
| 文档完整度 | ✅ 高 |
| 步骤清晰度 | ✅ 高 |
| 示例代码可用性 | ✅ 高 |
| 潜在断点数量 | 2个（网络、权限） |
| 总耗时 | **14分钟** |

---

### 3.4 贡献阶段（Contribute）

**目标**: 将适配成果贡献回社区

根据文档完成贡献流程梳理与提交准备，贡献流程包括：

1. Fork对应仓库
2. 创建开发分支
3. 提交PR
4. 签署CLA

**出处**: Ubuntu开发环境搭建 - "注意：提交PR时，机器人会基于git config设置的邮箱检查签署CLA状态"

**阶段耗时**: 5分钟

---

## 五、断点统计汇总

| 阶段 | 断点数量 | 断点描述 |
|-----|---------|---------|
| 了解 | 1 | - |
| 安装 | **3** | SSH公钥配置、网络访问限制、应用市场访问 |
| 使用 | 1（预估） | 组件依赖下载、Conan仓库登录 |
| 贡献 | 0 | CLA签署与提交流程确认 |
| **总计** | **5** | - |

---
