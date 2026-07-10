# TTHFW 用户场景验证报告

## 一、概述

- 目标：``
- 时间：2026-07-01T09:00:00 ~ 2026-07-01T09:00:00（0 秒）
- 镜像：`swr.cn-southwest-2.myhuaweicloud.com/modelfoundry/ttfhw-ubuntu-24.04-base:latest` —— 从历史 md 正文解析机器/镜像

## 二、环境

- 容器 OS：Ubuntu 24.04｜架构：aarch64｜Python：

## 三、文档阅读 / 抽取


## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 失败 | 0 | 0 |
| 安装 | 失败 | 0 | 0 |
| 使用 | 失败 | 0 | 0 |
| 贡献 | 失败 | 0 | 0 |

## 五、文档缺陷清单

- #1: README 缺少最小验证命令
- #2: torch_npu whl 包路径不明确
- #3: CANN 安装步骤缺失
- #10: Python 版本建议与实际不匹配
- #11: 未说明 npu-smi 也依赖 CANN toolkit
- #12: 未说明 MindSpeed-LLM 无 CPU fallback
- #4: 未说明 torch_npu 强依赖 CANN toolkit
- #5: 版本号过时（torch_npu）
- #6: 未给出 CANN toolkit 的具体下载命令
- #7: 未说明 CANN 下载可能需要账号登录
- #8: 未提供 CANN 的备用安装方案
- #9: URL 大小写错误
- 来源文档: install_guide.md
- 位置: 安装步骤结束后
- 现象: 文档只提供安装步骤，未给出类似 "import mindspeed_llm" 的最小验证命令
- 影响: 用户无法确认安装是否成功
- 建议: 在安装步骤末尾添加验证命令示例
- 级别: 中等
- 位置: "安装PyTorch以及torch_npu" 章节
- 现象: 文档说"参考 PyTorch releases"，但只给示例文件名，未给出具体下载 URL
- 影响: 用户需要额外查找下载链接，增加安装难度
- 建议: 直接给出完整的下载 URL（https://gitcode.com/Ascend/pytorch/releases/download/v...）
- 级别: 高
- 位置: "安装CANN" 章节
- 现象: 文档只引用"参考 CANN 软件安装"，未给出具体命令
- 影响: 新手无法独立完成 CANN 安装
- 建议: 至少给出 CANN toolkit 的下载 URL 和基础安装命令
- 级别: 严重（阻塞）
- 位置: 环境准备章节
- 现象: 文档建议 Python 3.10，但官方镜像用的是 3.12
- 影响: 用户可能误以为必须用 3.10
- 建议: 明确支持的 Python 版本范围（3.10-3.12）
- 级别: 低
- 位置: 全文
- 现象: 文档未说明 npu-smi 需要 CANN 库才能执行
- 影响: 用户在无 CANN 环境下执行 npu-smi 会失败，不知道原因
- 建议: 在验证步骤说明 npu-smi 需要 CANN 环境
- 现象: 文档未说明 MindSpeed-LLM 必须依赖 NPU，无 CPU 版本
- 影响: 用户无法在无 NPU 环境下测试
- 建议: 添加说明"MindSpeed-LLM 仅支持 NPU 环境，不支持 CPU"

## 七、结论

- 按文档安装了所有组件，但无法完成最小验证

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。