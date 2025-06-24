<!-- Thanks to https://zhconvert.org's Chinese (China) converter ! -->

<img src="./public/favicon.png" alt="logo" width="140" height="140" align="right">

# 网易云音乐解灰API（UNM-Server）详细使用说明

---

## 1. 项目简介

本项目用于解决网易云音乐因版权变灰无法播放的问题，自动从酷我、酷狗、B站等多个音源获取同一首歌的播放链接，让你继续畅听喜欢的音乐。

---

## 2. 部署 

### vercel部署
#### 1 一键部署

1. 注册并登录 [Vercel](https://vercel.com/)
2. Fork 本项目到你的 GitHub 账号
3. 打开 Vercel 官网，点击 **New Project**，选择你 Fork 的仓库
4. 保持默认设置，点击 **Deploy**，等待几分钟即可自动部署完成
#### 2 访问你的API服务

- 部署完成后，Vercel 会分配一个域名，比如：
  ```
  https://your-project-name.vercel.app
  ```
- 你可以直接用这个域名访问API，例如：
  ```
  https://your-project-name.vercel.app/match?id=1962165898&server=kuwo,kugou
---

### 本地部署

#### 1 环境准备
- 需要安装 [Node.js](https://nodejs.org/)（建议16及以上版本）
- 推荐使用 [Git](https://git-scm.com/) 进行代码管理

#### 2 下载项目

```bash
git clone https://github.com/你的仓库地址.git
cd ZQ-UNM-master
```

#### 3 安装依赖

```bash
npm install
```

#### 4 启动服务

```bash
npm start
```

- 启动后，命令行会显示端口号（如5678或5680），记住这个端口号。
- 如果端口被占用，程序会自动+1（如5680、5681等）。

---

## 3. API接口使用方法

### 1 获取网易云歌曲ID
1. 打开网易云音乐网页版：https://music.163.com/
2. 搜索并点击你想听的歌曲
3. 浏览器地址栏会显示：
   ```
   https://music.163.com/#/song?id=1962165898
   ```
4. 复制`id=`后面的数字（如：1962165898）
5. 配置好参数（见下方参数说明）

### 2 通过API获取播放链接

#### 方法一：部署好后浏览器直接访问

1. 如果是vercel部署，在浏览器地址栏输入：
   ```
   https://your-project-name.vercel.app/match?id=1962165898&server=kuwo,kugou,bilibili
   ```
   如果是本地部署，在浏览器地址栏输入：
   ```
   https://localhost:端口号/match?id=1962165898&server=kuwo,kugou,bilibili
   ```
   
2. 回车后会看到一段"原始数据"，找到"url"后面的链接，复制到新标签页打开即可听歌。

#### 方法二：命令行调用

```powershell
   curl "http://localhost:端口号/match?id=1962165898&server=kuwo,kugou"
```

#### 方法三 网页端使用

1. vercel部署访问：
   ```
   https://your-project-name.vercel.app/
   ```
   本地部署访问访问：
   ```
   https://localhost:端口号/
   ```
3. 页面会显示"小白"友好的三步操作指引
4. 输入网易云歌曲ID，点击"一键查歌"即可获取播放链接
5. 复制下方的播放链接，在新标签页打开即可听歌或下载

---

## 4. 参数

| 参数   | 默认           |
| ------ | -------------- |
| id     | /              |
| server | 见下方音源清单 |

### 音源清单

| 名称                        | 代号         | 默认启用 | 注意事项                                                    |
| --------------------------- | ------------ | -------- | ----------------------------------------------------------- |
| QQ 音乐                     | `qq`         |          | 需要准备自己的 `QQ_COOKIE`                                  |
| 酷狗音乐                    | `kugou`      | ✅       |                                                             |
| 酷我音乐                    | `kuwo`       | ✅       |                                                             |
| 咪咕音乐                    | `migu`       | ✅       | 需要准备自己的 `MIGU_COOKIE`                                |
| JOOX                        | `joox`       |          | 需要准备自己的 `JOOX_COOKIE`，似乎有严格地区限制。          |
| YouTube（纯 JS 解析方式）   | `youtube`    |          | 需要 Google 认定的**非中国大陆区域** IP 地址。              |
| yt-download                 | `ytdownload` |          | **似乎不能使用**。                                          |
| YouTube（通过 `youtube-dl`) | `youtubedl`  |          | 需要自行安装 `youtube-dl`。                                 |
| YouTube（通过 `yt-dlp`)     | `ytdlp`      | ✅       | 需要自行安装 `yt-dlp`（`youtube-dl` 仍在活跃维护的 fork）。 |
| B 站音乐                    | `bilibili`   | ✅       |                                                             |
| 第三方网易云 API            | `pyncmd`     |          |                                                             |


---
## 5. 反向代理

> 如需使用该功能，需要自行部署 [siteproxy](https://github.com/netptop/siteproxy)

如需在前端页面中使用，则可能会有部分音源的 `url` 不支持 `https`，则此时可以使用反向代理来解决（请在 `.env` 文件中填入部署后的接口地址）


## 6. 常见问题与小贴士

- **为什么浏览器显示一堆英文和链接？**
  - 这是API返回的"数据"，不是网页。复制`url`里的链接到新标签页就能听歌。
- **怎么获取网易云歌曲ID？**
  - 在网易云网页版，点击歌曲后查看浏览器地址栏。
- **如何让前端播放器自动解灰？**
  - 在前端项目的`.env`文件中配置本服务的地址即可。
---

## 7. 反馈与支持

- 有问题欢迎提issue或联系作者。
- 本项目仅供学习交流，请勿用于商业用途。

---

如需更详细的帮助，随时问我！


