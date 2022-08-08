# Destiny
## Introduction
> A toolbox

## build

## Install
> 应用安装完成后切勿着急打开
> 务必保证数据库存在并能够成功连接
1. 打开应用的 Resources -> static 文件夹
2. 配置 AppConfig.json
3. 建立数据库，执行 destiny.sql
4. 打开应用

## Usage
* Start Downie4 download through custom URL. Of course, first of all, you need to have a Downie4.
> open the url in browser
> destiny://cmd=downie4.download&url=https://www.xxx.com/video.m3u8&title=VideoTitle
```bash
cmd: constant value
url: video url
title: video title
```
## Issue
* 程序闪退
1. 检查 AppConfig.json 文件是否配置正确
2. 检查数据库是否存在
## PS
* destiny sql
```bash
# add follow
DROP DATABASE IF EXISTS destiny;
CREATE DATABASE destiny CHARSET=utf8mb4;
USE destiny;
```
* 双向通信
1. electron 通信
```bash
# 1. 在 funcs.ts 中编写函数
# 2. 在 preload.ts 中关联加载
# 3. 在 InitApp.ts 中注册 ipc
# bg -> ft: this.win.webContents.send('print', url)
# ft -> bg: Electron.ts -> hello()
```
2. 前后端通信
> 当开启本地服务器时，可通过 API 接口通信
