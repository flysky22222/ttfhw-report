# CANN 使用报告

> **报告日期：** 2026-04-09
> **环境：** A3 NPU 环境 (aarch64) 基础镜像: swr.cn-south-1.myhuaweicloud.com/ascendhub/ubuntu:24.04-base
> **CANN版本：** 8.5.0

---

## 一、测试概述

### 阶段口径说明

- 了解：从主流搜索引擎搜索到对应文档阅读完成。
- 安装：开始尝试从 README 或官方文档提供的安装方式开始下载，到整体安装完成。
- 使用：安装完成后，到跑通 Hello World 或指定场景 case。
- 贡献：按问题数统计，1 个问题按 5 分钟计；没有问题则记 0 分钟。

## 二、测试结论

| 阶段 | 状态 | 耗时 | 断点数 |
|------|------|------|--------|
| 了解 | 成功 | 9分钟 | 0 |
| 安装 | 成功 | 2小时49分钟 | 7 |
| 使用 | 成功 | 1小时34分钟 | 4 |
| 贡献 | 成功 | 35分钟 | 7 |

---

## 三、了解阶段

**时间范围：** 12:02 - 12:11（约 9 分钟）

| 序号 | 活动内容 | 结果 |
|------|---------|------|
| 1 | 通过主流搜索入口定位 CANN 官方文档 | 找到正式文档入口 |
| 2 | 阅读安装总览、系统要求和依赖说明 | 确定后续执行路径 |
| 3 | 确认 Toolkit、A3-ops 和 AddExample 的文档入口 | 完成文档阅读 |

**阶段结论：**
- 了解阶段只统计“找到文档并完成阅读”的时间，不计入安装排障和参数试错。

---

## 四、安装阶段

**时间范围：** 12:12 - 15:00（约 2 小时 48 分钟）

| 序号 | 活动内容 | 耗时 | 状态 |
|------|---------|------|------|
| 1 | 安装基础依赖 | ~10分钟 | ⚠️ 部分失败 |
| 2 | 安装NPU驱动 (atlas-a3-hdk-npu-driver=25.5.1) | ~5分钟 | ❌ 失败 |
| 3 | 安装Toolkit (ascend-cann-toolkit=8.5.0) | ~30分钟 | ✅ 成功（需注意协议确认） |
| 4 | 安装A3-ops库 | ~20分钟 | ❌ 在线安装失败 |
| 5 | 离线下载并安装 ascend-cann-A3-ops | ~10分钟 | ✅ 成功 |

### 遇到的问题及解决方案

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 快速入门链接跳转到 gitcode 的 master 分支，页面内容为空 | 文档版本入口未闭环 | 转而使用可访问的正式安装文档和离线安装路径 |
| `--soc` 参数说明不足 | 文档未给出芯片型号与参数映射 | 通过后续实际编译测试确认使用 `ascend910_93` |
| `python3-pip` 包不可用 | Ubuntu 24.04 版本变更 | 跳过该依赖 |
| `linux-headers` 找不到 | 内核版本特殊 (5.10.0-<redacted-ip>.r1941_123.hce2.aarch64) | 跳过该依赖 |
| NPU驱动安装失败 | 容器权限限制 (`Operation not permitted`) | 底层驱动已预装，跳过此步 |
| Toolkit安装后找不到路径 | 安装过程误按回车导致安装失败 | 卸载安装包后，重新安装等待同意协议 出现后输入 Y |
| `ascend-cann-A3-ops` 在线安装失败 | 在线仓库未包含该包 | 采用离线下载 .run 文件安装 |

### 关键命令记录

```bash
# 离线安装A3-ops
wget https://ascend-repo.obs.cn-east-2.myhuaweicloud.com/CANN/CANN%208.5.T63/Ascend-cann-A3-ops_8.5.0_linux-aarch64.run
bash ./Ascend-cann-A3-ops_8.5.0_linux-aarch64.run --install

# 下载ops-math仓库
git clone https://gitcode.com/cann/ops-math.git
cd ops-math

# 验证ACL安装
source /usr/local/Ascend/cann/set_env.sh
python3 -c "import acl;print(acl.get_soc_name())"
```

---

## 五、使用阶段

**时间范围：** 15:00 - 16:34（约 1 小时 34 分钟）

| 序号 | 活动内容 | 耗时 | 状态 |
|------|---------|------|------|
| 1 | 配置环境变量 | 2分钟 | ✅ |
| 2 | 验证ACL安装 | 1分钟 | ✅ |
| 3 | 安装编译依赖 (install_deps.sh) | 15分钟 | ⚠️ 部分失败 |
| 4 | 编译AddExample算子（第一次） | 5分钟 | ❌ 失败 |
| 5 | 切换分支到 8.5.0 | 2分钟 | ✅ |
| 6 | 编译AddExample算子（第二次） | 40分钟 | ✅ 成功 |
| 7 | 安装算子包 | 5分钟 | ✅ |

### 编译问题及解决

| 问题 | 解决方案 |
|------|---------|
| `gawk: command not found` | `apt-get install gawk` |
| `cmake: command not found` | 安装 cmake |
| `Invalid socVersion ascend950` | 切换仓库分支到 8.5.0 |
| `aclnnAddExampleGetWorkspaceSize failed. ERROR: 161001` | 使用正确的 soc 参数 |

### 正确编译命令

```bash
# 切换到匹配版本分支
git checkout 8.5.0

# 安装依赖
bash install_deps.sh

# 使用正确的 soc 参数编译
bash build.sh --pkg --soc=ascend910_93 --ops=add_example
```

### 环境变量配置

```bash
source /usr/local/Ascend/cann/set_env.sh
export LD_LIBRARY_PATH=/usr/local/Ascend/cann-8.5.0/opp/vendors/custom_math/op_api/lib/:${LD_LIBRARY_PATH}
```

---

## 六、贡献阶段

**时间范围：** 16:34 - 17:09（约 35 分钟）

| 序号 | 活动内容 | 耗时 | 状态 |
|------|---------|------|------|
| 1 | 安装编译好的算子包 | 3分钟 | ✅ |
| 2 | 配置自定义算子环境变量 | 2分钟 | ✅ |
| 3 | 运行算子样例测试（第一次） | 5分钟 | ❌ 失败 |
| 4 | 排查soc参数问题 | 8分钟 | ✅ 找到原因 |
| 5 | 重新编译并运行测试 | 7分钟 | ✅ 成功 |
| 6 | 整理文档问题 1-3 | 8分钟 | ✅ 完成 |
| 7 | 整理文档问题 4-7 | 7分钟 | ✅ 完成 |

### 测试命令

```bash
# 安装算子包
./build_out/cann-ops-math-custom_linux-aarch64.run

# 运行算子样例测试
bash build.sh --run_example add_example eager cust --vendor_name=custom
```

**预期输出：** 打印算子 AddExample 的加法计算结果，表明算子已成功部署并正确执行。

### 贡献问题清单

| 序号 | 问题标题 | 所属阶段 | 问题摘要 |
|------|----------|----------|----------|
| 1 | 快速安装页面默认选项缺失 | 安装 | 同意协议后未默认选择版本、产品系列、CPU 架构、操作系统和安装方式。 |
| 2 | `ops-math` 快速入门链接跳转空页面 | 安装 | 版本入口不闭环，用户无法直接进入正确文档。 |
| 3 | 官网与 `gitcode` 安装方式不一致 | 安装 | 官网走组件安装，示例文档偏向镜像路径，增加理解成本。 |
| 4 | 在线仓库缺少 `ascend-cann-A3-ops` | 安装 | 在线安装无法闭环，最终需要转离线安装。 |
| 5 | 协议确认步骤无明确提示 | 安装 | 安装过程中误按回车会导致 Toolkit 安装失败。 |
| 6 | `--soc` 参数与芯片型号映射说明不足 | 使用 | 编译示例时需要人工试错才能确定正确参数。 |
| 7 | 自定义算子贡献闭环依赖人工归档 | 贡献 | 问题更多停留在文档记录层，缺少社区侧修复闭环指引。 |

---

## 七、耗时统计汇总

| 阶段 | 开始时间 | 结束时间 | 耗时 | 主要活动 |
|------|---------|---------|------|---------|
| **了解** | 12:02 | 12:11 | 9分钟 | 文档定位、文档阅读 |
| **安装** | 12:11 | 15:00 | 2小时49分钟 | 安装准备、依赖安装、环境搭建 |
| **使用** | 15:00 | 16:34 | 1小时34分钟 | 编译配置、算子构建 |
| **贡献** | 16:34 | 17:09 | 35分钟 | 测试验证、问题归档 |
| **总计** | 12:02 | 17:09 | **约5小时07分钟** | 完整流程 |

### 耗时分布图

```
了解阶段  ██░░░░░░░░░░░░░░░░░░  2.7%  (9分钟)
安装阶段  ██████████████████░░  59.5%  (2小时49分钟)
使用阶段  ███████████░░░░░░░░░  28.2%  (1小时34分钟)
贡献阶段  █████░░░░░░░░░░░░░░░  11.4%  (35分钟)
```

---

## 八、问题总结与建议

### 1. 文档问题

| 问题 | 建议 |
|------|------|
|快速安装页面  https://www.hiascend.com/cann/download设计不合理,同意协议后没有默认选择版本，产品系列，cpu架构，操作系统，安装方式|默认选择|
| 没有常见的安装问题记录与解决方案 | 补充相关案例 |
| CANN的描述不具体,不能一目了然的知道CANN是什么，能做什么，怎么使用，典型场景 | 补充典型场景 |
| 官网文档与跳转到的gitcode使用方式不一致，官网使用组件安装，gitcode中的文档用例推荐使用docker镜像安装 | 官网补充镜像安装方式，提高安装效率，减少安装错误率 |
| ops-math快速入门链接跳转到空页面 | 建议提供版本选择，默认跳转到对应版本分支 |
| 算子编译时`--soc` 参数缺乏说明 | 文档中列出支持的 soc 值及对应芯片型号 |
| 协议确认步骤未说明 | 明确提示安装过程需等待协议出现，不可按回车跳过 |

### 2. 安装问题

| 问题 | 建议 |
|------|------|
| `install_deps.sh` 在 root 用户下执行失败 | 提供适配 root 用户的安装脚本 |
| 部分依赖包在特定系统版本不可用 | 提供替代方案或预检脚本 |
| 在线仓库缺少 `ascend-cann-A3-ops` | 补充到在线仓库或明确提供离线安装指引 |

### 3. SOC 参数对照表（根据实际验证）

| 环境 | 正确的 SOC 参数 |
|------|----------------|
| A3 环境 | `ascend910_93` |
| ascend910b | `ascend910b` |

### 4. 完整安装流程总结

```bash
# 1. 安装基础依赖
apt-get install -y gcc python3 cmake gawk

# 2. 配置CANN软件源（如未配置）
# 参考: https://www.hiascend.com/document/detail/zh/canncommercial/80RC2/envig/instg/instg_000004.html

# 3. 安装Toolkit
apt-get install ascend-cann-toolkit=8.5.0
# 注意：等待协议界面出现后输入 Y，不要按回车跳过

# 4. 离线安装A3-ops库
wget https://ascend-repo.obs.cn-east-2.myhuaweicloud.com/CANN/CANN%208.5.T63/Ascend-cann-A3-ops_8.5.0_linux-aarch64.run
bash ./Ascend-cann-A3-ops_8.5.0_linux-aarch64.run --install

# 5. 配置环境变量
source /usr/local/Ascend/cann/set_env.sh

# 6. 验证安装
python3 -c "import acl;print(acl.get_soc_name())"
npu-smi info

# 7. 编译自定义算子
git clone https://gitcode.com/cann/ops-math.git
cd ops-math
git checkout 8.5.0  # 切换到匹配版本分支
bash build.sh --pkg --soc=ascend910_93 --ops=add_example

# 8. 安装算子包
./build_out/cann-ops-math-custom_linux-aarch64.run

# 9. 配置算子环境变量
export LD_LIBRARY_PATH=/usr/local/Ascend/cann-8.5.0/opp/vendors/custom_math/op_api/lib/:${LD_LIBRARY_PATH}

# 10. 运行测试
bash build.sh --run_example add_example eager cust --vendor_name=custom
```

---

## 九、参考资料

- [CANN 官方文档](https://www.hiascend.com/cann/aol)
- [ops-math 仓库](https://gitcode.com/cann/ops-math)
- [快速入门指南](https://gitcode.com/cann/ops-math/blob/8.5.0/docs/QUICKSTART.md)

---

**报告生成时间：** 2026-04-09 17:35
