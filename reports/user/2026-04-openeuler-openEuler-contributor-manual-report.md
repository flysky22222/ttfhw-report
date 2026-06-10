# openEuler 社区易用性评估报告 - 贡献者场景

**测试日期**: 2026-04-10
**测试场景**: openEuler 贡献者 - 为社区引入软件包（sqlite）

---

## 一、测试概述

### 1.1 测试目标
作为 openEuler 的开发者，为社区引入一款软件包：
1. 在 Baidu 及豆包搜索平台中搜索 openEuler 的相关信息，了解 sqlite 软件及其依赖应该属于 openEuler 的哪一个 SIG
2. 根据搜索到的信息进行本地 openEuler 开发环境的配置，完成软件包 Spec 的编写
3. 完成本地编译构建和测试
4. 根据社区提供的贡献指导，完成软件包引入的各个社区流程的 PR 提交

### 1.2 阶段口径说明

- 了解：从主流搜索引擎搜索到对应文档阅读完成。
- 安装：开始尝试从 README 或官方文档提供的安装方式开始下载，到整体安装完成。
- 使用：安装完成后，到跑通 Hello World 或指定场景 case。
- 贡献：按问题数统计，1 个问题按 5 分钟计；没有问题则记 0 分钟。

## 二、测试结论

| 阶段 | 状态 | 耗时 | 断点数 |
|------|------|------|--------|
| 了解 | 成功 | 5 分钟 | 0 |
| 安装 | 成功 | 15 分钟 | 0 |
| 使用 | 成功 | 45 分钟 | 0 |
| 贡献 | 成功 | 0 分钟 | 0 |

---

## 三、阶段一：了解

### 2.1 了解 sqlite 属于哪一个 SIG

**（1）百度搜索**

在百度搜索 “sqlite 软件包在 openEuler 中属于哪一个 sig”，查看前三页内容：

- 均无法解直接解答问题
- 均无与问题近似或相关的结果
- 无任何与 openEuler 官网或官方代码仓相关的内容



**（2）豆包**

在百度搜索 “sqlite 软件包在 openEuler 中属于哪一个 sig”，结果如下：

```
sqlite 软件包在 openEuler 中归属 sig-DB（数据库特别兴趣小组）。
补充说明
sig-DB 负责 openEuler 社区内所有数据库相关软件包（含 SQLite、MySQL、PostgreSQL、MariaDB 等）的维护、更新与漏洞修复。
源码仓库：https://gitee.com/src-openeuler/sqlite，由 sig-DB 维护。
可在 openEuler 社区 SIG 列表（https://www.openeuler.org/zh/sig/sig-list/）查询 sig-DB 的完整维护范围与成员信息。
需要我帮你查询 openEuler 中其他数据库 / 基础库对应的 SIG 归属吗？
```

- 直接获取到所属 SIG 信息，经验证无误
- 给出了 sig-DB 关于维护范围、成员的详细信息
- 给出已有的 sqlite 的仓库



### 2.2 了解 openEuler 软件包贡献指南

[openEuler贡献攻略地图 | openEuler贡献攻略 | openEuler社区](https://www.openeuler.openatom.cn/zh/community/contribution/)

[community/zh/contributors/create-package.md-代码预览-community:基于 openEuler 生态的社区信息管理项目 - AtomGit | GitCode](https://atomgit.com/openeuler/community/blob/master/zh/contributors/create-package.md)



## 四、阶段二：安装

### 3.1 搭建本地 openEuler 开发环境

**由豆包直接获取到 openEuler 官网指导文档：**

[应用开发指南 | 文档 | openEuler社区](https://docs.openeuler.openatom.cn/zh/docs/24.03_LTS_SP3/server/development/application_dev/application_development.html)

[构建RPM包 | 文档 | openEuler社区](https://docs.openeuler.openatom.cn/zh/docs/24.03_LTS_SP3/server/development/application_dev/building_an_rpm_package.html?f_link_type=f_linkinlinenote&flow_extra=eyJpbmxpbmVfZGlzcGxheV9wb3NpdGlvbiI6MCwiZG9jX3Bvc2l0aW9uIjowLCJkb2NfaWQiOiIwYjQ4YThkOGQwMDIyYTRkLWQ5NDQ0ODljM2M5NjA1N2MifQ%3D%3D)



### 3.2 编写 spec 文件

**由豆包获取：**

- 建议直接使用已有的源码仓：https://gitee.com/src-openeuler/sqlite

- 同时也给出了标准 sqlite.spec 模板、sqlite 官方源码下载地址：https://www.sqlite.org/download.html

此处为达到测试效果，采用手动编写的方式，sqlite.spec 文件如下：

```bash
Name:           sqlite
Version:        3.53.0
Release:        1%{?dist}
Summary:        Self-contained, serverless, zero-configuration SQL database engine
License:        Public Domain
URL:            https://www.sqlite.org/
Source0:        https://www.sqlite.org/2026/sqlite-autoconf-3530000.tar.gz

BuildRequires:  gcc make readline-devel zlib-devel libtool

Provides: libsqlite3.so.0()(64bit)

%description
SQLite is a self-contained, high-reliability, embedded, full-featured,
public-domain, SQL database engine.

%package devel
Summary:        Development tools for SQLite
%description devel
Development tools and header files for SQLite.

%prep
%setup -q -n sqlite-autoconf-3530000

%build
export CC=gcc
%configure \
  --enable-readline \
  --enable-threadsafe \
  --enable-fts5 \
  --disable-rpath \
  --disable-static

%make_build

%install

%make_install

find %{buildroot} -name '*.la' -delete

%files
%{_bindir}/sqlite3
%{_libdir}/libsqlite3.so.*
%{_mandir}/man1/sqlite3.1.gz

%doc README.txt

%files devel
%{_includedir}/sqlite3*.h
%{_libdir}/libsqlite3.so
%{_libdir}/pkgconfig/sqlite3.pc
%{_mandir}/man1/sqlite3.1*

%changelog
* Fri Apr 10 2026 YanZhicong <mryanzhicong@email> - 3.53.0-1
- Initial build for openEuler
```



### 3.2 测试方案

**由豆包获取：**

详细测试过程见 4.2




## 五、阶段三：使用

### 4.1 本地编译构建

==构建过程中出现的问题均使用千问解决==

**（1）构建前准备**

```bash
# 安装构建工具
$ dnf install rpmdevtools

# 初始化构建目录
$ rpmdev-setuptree

# 编写 sqlite.spec 文件，文件内容见 3.2
$ cd /root/rpmbuild/SPECS
$ vim sqlite.spec

# 下载源码包
$ cd /root/rpmbuild/SOURCES
$ wget https://www.sqlite.org/2026/sqlite-autoconf-3530000.tar.gz
```



**（2）构建**

```bash
# 进入 SPECS 目录
$ cd /root/rpmbuild/SPECS

# 安装构建依赖
$ dnf builddep -y sqlite.spec

# 执行构建
$ rpmbuild -ba --define="dist .oe2403sp1" sqlite.spec

# 查看构建的包
$ ls -l /root/rpmbuild/RPMS/x86_64
total 8592
-rw-r--r-- 1 root root 1227677 Apr 10 11:13 sqlite-3.53.0-1.oe2403sp1.x86_64.rpm
-rw-r--r-- 1 root root 4837629 Apr 10 11:13 sqlite-debuginfo-3.53.0-1.oe2403sp1.x86_64.rpm
-rw-r--r-- 1 root root 2544973 Apr 10 11:13 sqlite-debugsource-3.53.0-1.oe2403sp1.x86_64.rpm
-rw-r--r-- 1 root root  177989 Apr 10 11:13 sqlite-devel-3.53.0-1.oe2403sp1.x86_64.rpm
```



### 4.2 测试

**（1）安装测试**

```shell
# 安装
$ cd /root/rpmbuild/RPMS/x86_64
$ dnf install ./sqlite-3.53.0-1.oe2403sp1.x86_64.rpm

# 查看版本号
$ sqlite3 --version
3.53.0 2026-04-09 11:41:38 4525003a53a7fc63ca75c59b22c79608659ca12f0131f52c18637f829977f20b (64-bit)
```



**（2）功能测试**

```bash
# 进入数据库
sqlite3
```



```sqlite
/* 执行测试命令 */
sqlite> CREATE TABLE test(id INT, info TEXT);
sqlite> INSERT INTO test VALUES (1, 'openEuler build success');
sqlite> SELECT * FROM test;
╭────┬─────────────────────────╮
│ id │          info           │
╞════╪═════════════════════════╡
│  1 │ openEuler build success │
╰────┴─────────────────────────╯
sqlite> .quit
```



## 六、阶段四：贡献

```bash
# 将 fork 完成的 community 仓库 clone 到本地
$ git clone https://gitcode.com/yanzhicong1/community.git

# 进入所属的 sig-DB 目录
$ cd community/sig/DB

# 修改 sig-info.yaml，将要新增的软件包以"- src-openeuler/zip"的形式添加到对应的sig组列表下
$ tail -n1  sig-info.yaml 
  - src-openeuler/sqlite
  
# 建仓：在 sig/{sig目录}/src-openeuler/软件名首字母 新增下对应的 yaml 文件
$ cd src-openeuler/s
$ cat sqlite.yaml 
name: sqlite
description: ''
branches:
- name: master
  type: protected
......
- name: openEuler-24.03-LTS-SP4
  type: protected
  create_from: openEuler-24.03-LTS-Next
type: public

# 提交
$ git add ../../sig-info.yaml
$ git commit -m "add packages: sqlite"
$ git push
```

由于仓库中已经存在 sqlite 软件包，此处不再提 PR



**报告时间：2026年4月10日**



