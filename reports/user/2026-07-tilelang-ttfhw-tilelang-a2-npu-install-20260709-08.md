# TTHFW 用户场景验证报告

## 一、概述

- 目标：`tilelang-mlir-ascend`
- 文档入口：https://github.com/tile-ai/tilelang-mlir-ascend/blob/main/README.md
- 时间：2026-07-09T13:56:00Z ~ 2026-07-09T15:10:00Z（4440 秒）
- 镜像：`quay.io/ascend/cann:8.5.2-910b-ubuntu22.04-py3.11` —— 用户指定测试镜像，预装 CANN toolkit 8.5.2 + Python 3.11

## 二、环境

- 容器 OS：Ubuntu 22.04.5 LTS｜架构：aarch64｜Python：

## 三、文档阅读 / 抽取

- **doc_entry**：https://github.com/tile-ai/tilelang-mlir-ascend/blob/main/README.md　（来源：用户指定官方 README URL）
- **prerequisites**：CANN toolkit 8.3.RC1.alpha002；Python 3.7.x - 3.11.4；pip 包: attrs, cython, numpy>=1.19.2,<=1.24.0, decorator, sympy, cffi, pyyaml, pathlib2, psutil, protobuf==3.20.0, scipy, requests, absl-py　（来源：README Environment Setup 章节）
- **install_commands**：git clone https://github.com/tile-ai/tilelang-mlir-ascend.git --recursive；cd tilelang-mlir-ascend && bash install_npuir.sh；pip install pybind11 torch_npu　（来源：README Build 章节 + install_npuir.sh 脚本）
- **use_commands**：python3 examples/elementwise/vec_add_1d.py；验证: torch.testing.assert_close(y_ref, v3, rtol=1e-2, atol=1e-2)　（来源：README Quick Start 章节 + examples/elementwise/vec_add_1d.py）
- **contribution_entry**：GitHub Issues: https://github.com/tile-ai/tilelang-mlir-ascend/issues　（来源：README 无贡献章节）

## 四、四阶段 / 结果

| 阶段 | 状态 | 耗时(s) | 断点 |
|------|------|--------|------|
| 了解 | 成功 | 240 | 0 |
| 安装 | 失败 | 4200 | 3 |
| 使用 | 未执行 | 0 | 0 |
| 贡献 | 成功 | 300 | 0 |

## 五、文档缺陷清单

- {'title': 'README Environment Setup 段落与 Latest News CANN 版本声明不一致', 'stage': '了解', 'severity': '重要', 'source': 'README.md Environment Setup 章节 vs Latest News 章节', 'suggestion': '更新 Environment Setup 章节，明确支持的 CANN 版本范围（如 8.3 - 8.5）', 'impact': '用户可能使用错误的 CANN 版本导致构建失败'}
- {'title': 'README 未列出构建 AscendNPU-IR 所需的系统依赖', 'stage': '安装', 'severity': '严重', 'source': 'README.md Build 章节 + install_npuir.sh 脚本', 'suggestion': '在 Environment Setup 或 Build 章节添加系统依赖列表：clang, clang++, lld, ninja>=1.12, patch, zlib1g-dev, libzstd-dev', 'impact': '用户按文档操作会因为缺少依赖而失败'}
- {'title': 'README 未明确 CMake 版本要求（需要 >= 3.28）', 'stage': '安装', 'severity': '重要', 'source': 'AscendNPU-IR/CMakeLists.txt 第一行', 'suggestion': '在 Build 章节明确 CMake 版本要求，提供 pip install cmake 安装方法', 'impact': '用户使用系统 cmake 会配置失败'}
- {'title': 'install_npuir.sh 在 llvm-project clone 网络中断后放弃', 'stage': '安装', 'severity': '严重', 'source': 'install_npuir.sh 脚本', 'suggestion': '添加重试循环（至少 10 次），提供国内镜像/离线包下载选项', 'impact': '用户在网络不稳定环境下无法完成构建'}
- {'title': 'README 未提供受限网络环境的获取途径和 pip 换源指引', 'stage': '安装', 'severity': '重要', 'source': 'README.md Build 章节', 'suggestion': '添加受限网络环境章节，提供国内镜像配置方法', 'impact': '用户在网络受限环境无法完成安装'}
- {'title': 'README Quick Start 与 examples 目录代码 API 不一致', 'stage': '使用', 'severity': '一般', 'source': 'README.md Quick Start 章节 vs examples/elementwise/vec_add_1d.py', 'suggestion': '统一 API 使用说明，或在文档中解释不同 API 的适用场景', 'impact': '用户困惑，可能导致验证失败'}
- {'title': 'README 未说明 bishengir-compile 版本兼容性问题', 'stage': '安装', 'severity': '重要', 'source': 'install_npuir.sh 脚本逻辑', 'suggestion': '明确说明 bishengir-compile 的获取方式（构建或使用 CANN 自带）', 'impact': '用户可能遇到版本不兼容问题'}

## 六、遇到的问题

- llvm-project clone 网络中断 → 手动重试 git submodule update --init --recursive 10 次（来源：网络环境）
- apply_patches.sh 执行后 cmake 仍报依赖目标不存在 → 手动应用 patches 后重试 cmake，仍然失败（来源：构建系统）
- cmake 配置失败：BiShengIRLinalgDialectExt 不存在 → 无法解决，构建终止（来源：BiShengIR 构建系统）

## 七、结论

模拟用户按官方 README 在 A2 NPU 环境下完成了解阶段，安装阶段因构建系统问题（llvm-project clone 网络中断、BiShengIR cmake 配置失败）无法完成。发现 7 处文档缺陷（已整理为 Issue 草稿）。测试结果：失败，建议官方检查构建脚本和依赖配置。

> 本 md 由 `tools/ttfhw/cli/render_report.py` 从标准 JSON 报告渲染，JSON 为唯一真值源。