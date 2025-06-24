<!-- Thanks to https://zhconvert.org's Chinese (China) converter ! -->

<img src="./public/favicon.png" alt="logo" width="140" height="140" align="right">

# 网易云音乐解灰API（UNM-Server）详细使用说明

---

## 1. 项目简介

本项目用于解决网易云音乐因版权变灰无法播放的问题，自动从酷我、酷狗、B站等多个音源获取同一首歌的播放链接，让你继续畅听喜欢的音乐。

---

## 2. 快速部署到 Vercel（推荐！）

### 2.1 一键部署

1. 注册并登录 [Vercel](https://vercel.com/)
2. Fork 本项目到你的 GitHub 账号
3. 打开 Vercel 官网，点击 **New Project**，选择你 Fork 的仓库
4. 保持默认设置，点击 **Deploy**，等待几分钟即可自动部署完成
5. 
### 2.2 访问你的API服务

- 部署完成后，Vercel 会分配一个域名，比如：
  ```
  https://your-project-name.vercel.app
  ```
- 你可以直接用这个域名访问API，例如：
  ```
  https://your-project-name.vercel.app/match?id=1962165898&server=kuwo,kugou
---

## 3. 本地安装与运行

### 3.1 环境准备
- 需要安装 [Node.js](https://nodejs.org/)（建议16及以上版本）
- 推荐使用 [Git](https://git-scm.com/) 进行代码管理

### 3.2 下载项目

```bash
git clone https://github.com/你的仓库地址.git
cd ZQ-UNM-master
```

### 3.3 安装依赖

```bash
npm install
```

### 3.4 启动服务

```bash
npm start
```

- 启动后，命令行会显示端口号（如5678或5680），记住这个端口号。
- 如果端口被占用，程序会自动+1（如5680、5681等）。

---

## 4. API接口使用方法（Vercel云端推荐）

> 以下所有接口示例均以 Vercel 云端部署为主，假如你本地部署，请将 `https://your-project-name.vercel.app` 替换为 `http://localhost:端口号`

### 4.1 获取网易云歌曲ID
1. 打开网易云音乐网页版：https://music.163.com/
2. 搜索并点击你想听的歌曲
3. 浏览器地址栏会显示：
   ```
   https://music.163.com/#/song?id=1962165898
   ```
4. 复制`id=`后面的数字（如：1962165898）

### 4.2 通过API获取播放链接

#### 方法一：浏览器直接访问

1. 在浏览器地址栏输入：
   ```
   https://your-project-name.vercel.app/match?id=1962165898&server=kuwo,kugou,bilibili
   ```
2. 回车后会看到一段"原始数据"，找到"url"后面的链接，复制到新标签页打开即可听歌。

#### 方法二：命令行调用（Windows PowerShell）

```powershell
Invoke-RestMethod -Uri "https://your-project-name.vercel.app/match?id=1962165898&server=kuwo,kugou" -Method GET
```

#### 方法三：用Postman等API工具
- 新建GET请求，填入：
  ```
  https://your-project-name.vercel.app/match?id=1962165898&server=kuwo,kugou
  ```
- 发送请求，查看返回的url字段。

### 4.3 其他API

- **下载网易云音乐（高音质）**
  ```
  https://your-project-name.vercel.app/ncmget?id=1962165898&br=320
  ```
  - `br`参数可选：128、192、320、740、999

- **用歌名搜索其他音源**
  ```
  https://your-project-name.vercel.app/otherget?name=最伟大的作品
  ```

---

## 5. 网页端使用说明

1. 访问：
   ```
   https://your-project-name.vercel.app/
   ```
2. 页面会显示"小白"友好的三步操作指引
3. 输入网易云歌曲ID，点击"一键查歌"即可获取播放链接
4. 复制下方的播放链接，在新标签页打开即可听歌或下载

---

## 6. 支持的音源及参数

| 名称      | 代号      | 默认启用 | 说明                  |
| --------- | --------- | -------- | --------------------- |
| 酷狗音乐  | kugou     | ✅       |                       |
| 酷我音乐  | kuwo      | ✅       |                       |
| 咪咕音乐  | migu      | ✅       | 需配置MIGU_COOKIE     |
| B站音乐   | bilibili  | ✅       |                       |
| QQ音乐    | qq        | ❌       | 需配置QQ_COOKIE       |
| YouTube   | youtube   | ❌       | 需非中国大陆IP        |
| yt-dlp    | ytdlp     | ✅       | 需安装yt-dlp          |

- 推荐音源组合：`kuwo,kugou,bilibili`
- 高质量音源组合：`kuwo,kugou,bilibili,migu`

---

## 7. 配置说明（可选）

在 Vercel 或本地 `.env` 文件中可自定义端口、代理、Cookie等参数。

```env
ENABLE_FLAC=true            # 是否启用FLAC格式
PROXY_URL=                  # 反向代理地址（可选）
QQ_COOKIE=                  # QQ音乐Cookie（可选）
MIGU_COOKIE=                # 咪咕音乐Cookie（可选）
```

---

## 8. 常见问题与小贴士

- **为什么浏览器显示一堆英文和链接？**
  - 这是API返回的"数据"，不是网页。复制`url`里的链接到新标签页就能听歌。
- **怎么获取网易云歌曲ID？**
  - 在网易云网页版，点击歌曲后查看浏览器地址栏。
- **如何让前端播放器自动解灰？**
  - 在前端项目的`.env`文件中配置本服务的地址即可。
- **Vercel免费吗？**
  - 个人/小项目免费，流量大建议升级套餐。

---

## 9. 反馈与支持

- 有问题欢迎提issue或联系作者。
- 本项目仅供学习交流，请勿用于商业用途。

---

如需更详细的帮助，随时问我！


