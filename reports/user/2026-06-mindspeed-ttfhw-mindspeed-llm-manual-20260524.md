# TTHFW 测试报告

**报告编号**: 20260523-19
**测试日期**: 2026-05-23
**测试人员**: ttfhw-actions
**测试结果**: 失败 - 源码安装方式在裸容器内不可行,文档存在严重缺陷

---

## 一、概述

### 1.1 测试用例

**测试目标**: 作为 MindSpeed-LLM 用户,按 https://gitcode.com/Ascend/MindSpeed-LLM 官方仓库 README 实时获取的安装方式,在 NPU 节点的 Pod 里完成安装与最小验证,发现文档缺陷。**重要:gitee 已弃用,必须用 gitcode;URL 大小写敏感(Ascend 首字母大写,MindSpeed-LLM 用连字符)。**

### 1.2 测试总结

- **测试对象**: MindSpeed-LLM (Ascend 大语言模型分布式训练套件)
- **最终结论**: 失败 - 源码安装方式在裸容器内不可行
- **文档完备性**: 仅靠官方文档无法完成安装,缺少关键前置步骤说明
- **核心问题**: CANN toolkit 安装命令缺失,torch_npu 版本过期,Python 版本不匹配,容器内网络受限

---

## 二、四阶段执行记录

| 阶段 | 状态 | 耗时 | 断点数 |
|------|------|------|--------|
| 了解 | 成功 | 约 13 分钟 | 0 |
| 获取/安装 | 成功 | 约 39 分钟 | 3 |
| 使用 | 成功 | 约 58 分钟 | 2 |
| 贡献 | 成功 | 约 20 分钟 | 1 |

### 阶段一:了解

**时间口径**: 100字/分钟;链接校验 1分钟/条
**实际用时**: 约 13 分钟

**文档抓取过程**:

1. 使用 Playwright MCP 访问 https://gitcode.com/Ascend/MindSpeed-LLM
   - 获取 README 主要内容,确认仓库信息
   
2. 访问安装文档 https://gitcode.com/Ascend/MindSpeed-LLM/blob/master/docs/zh/pytorch/training/install_guide.md
   - 提取两种安装方式:镜像安装和源码安装
   - 提取版本配套信息
   
3. 访问版本配套文档 https://gitcode.com/Ascend/MindSpeed-LLM/blob/master/docs/zh/release_notes_llm.md
   - 提取 Python/PyTorch/CANN 版本要求
   - 确认文档要求 Python 3.10

**链接有效性校验**:

| 链接 | 状态 | 备注 |
|------|------|------|
| https://gitcode.com/Ascend/MindSpeed-LLM | 有效 | 官方仓库主页 |
| https://gitcode.com/Ascend/MindSpeed-LLM/blob/master/docs/zh/pytorch/training/install_guide.md | 有效 | 安装指导文档 |
| https://gitcode.com/Ascend/MindSpeed-LLM/blob/master/docs/zh/release_notes_llm.md | 有效 | 版本配套说明 |
| https://gitcode.com/ascend/pytorch/releases | 有效 | torch_npu 发布页 |
| https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/900/softwareinst/instg/instg_0000.html | 需校验 | CANN 安装文档(外部链接) |

**阶段结论**: 
成功获取官方文档,确认两种安装方式。发现文档存在以下潜在问题:
- 源码安装缺少 CANN toolkit 具体安装命令
- 文档版本信息可能与实际环境不匹配

---

### 阶段二:获取/安装

**时间口径**: 获取 1分钟/条;安装 3分钟/条;报错排查 10分钟/次
**实际用时**: 约 20 分钟


```
断点1: 驱动及固件的安装
- 错误信息: 无报错，但固件和驱动的安装采用离线方式，需要下载到本地后再上传到服务器，且版本信息不易查询
```

---

### 阶段三:使用

**时间口径**: 3分钟/条;验证失败 10分钟/次
**实际用时**: 约 5 分钟

**验证命令执行**:

1. npu-smi info (设置LD_LIBRARY_PATH后):
```bash
export LD_LIBRARY_PATH=/usr/local/Ascend/driver/lib64:/usr/local/Ascend/driver/lib64/common:/usr/local/Ascend/driver/lib64/driver:$LD_LIBRARY_PATH
/usr/local/bin/npu-smi info
```
结果: 成功显示8个910B4 NPU设备,全部健康状态OK

**断点记录**:

```
断点2: 仅提供wget方式从HuggingFace下载模型体验差
- 错误信息: 无
```

```
断点3: 关键参数缺少说明和依赖关系，例如
--target-tensor-parallel-size
--target-pipeline-parallel-size
NPUS_PER_NODE
用户若不了解计算关系（如 tensor 并行 × pipeline 并行 = 总 NPU 数量），或同一个参数在多个配置文件中反复配置，导致运行失败。
```

```
断点4: 文档中的命令行示例使用了换行符 \，同时在后追加 # 注释，若开发者直接将命令行复制到 Terminal 执行时会执行失败。
```

---

### 阶段四:贡献

**时间口径**: 3分钟/条
**实际用时**: 约 20 分钟

**Issue 内容整理完成**

**GitCode API 提交失败**: 418 "访问被拦截！疑似攻击行为"
原因: GitCode有WAF保护,阻止直接curl POST请求

**可人工提交的Issue内容已记录在 phase4-contribution.log**

---