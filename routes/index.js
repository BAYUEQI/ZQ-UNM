const Router = require("koa-router");
const match = require("@unblockneteasemusic/server");
const router = new Router();

// 根目录
router.get("/", async (ctx) => {
  await ctx.render("index");
});

// 信息
router.get("/info", async (ctx) => {
  ctx.body = {
    code: 200,
    version: packageJson.version,
    enable_flac: process.env.ENABLE_FLAC,
  }
}),
// 测试
router.get("/test", async (ctx) => {
  const data = await match(1962165898, [
    "kugou",
    "qq",
    "migu",
    "pyncmd",
    "bilibili",
    "youtube",
    "youtube-dl",
    "yt-dlp",
    "kuwo",
  ]).then((res) => {
    return res;
  });
  ctx.body = {
    code: 200,
    message: "获取成功",
    data,
  };
});

// 匹配
router.get("/match", async (ctx) => {
  try {
    const id = ctx.request.query.id;
    const server = ctx.request.query.server
      ? ctx.request.query.server.split(",")
      : ["pyncmd", "kuwo", "bilibili", "migu", "kugou", "qq", "youtube", "youtube-dl", "yt-dlp"];
    console.log("开始匹配：" + id + " - " + server);
    if (!id) {
      ctx.body = { code: 400, message: "参数不完整" };
      ctx.status = 400;
      return false;
    }
    const data = await match(id, server).then((res) => {
      return res;
    });
    // 反代
    const proxy = process.env.PROXY_URL;
    if (proxy && data.url.includes("kuwo")) {
      data.proxyUrl = proxy + data.url.replace(/^http:\/\//, "http/");
    }
    ctx.body = {
      code: 200,
      message: "匹配成功",
      data,
    };
  } catch (error) {
    console.log("匹配出现错误：" + error);
    ctx.body = {
      code: 500,
      message: "匹配失败",
    };
    ctx.status = 500;
  }
});

/* 网易云音乐获取
十分感谢自GDStudio的音源API, 这里贴个链接: music.gdstudio.xyz
*/
// 下载路由
router.get("/ncmget", async (ctx) => {
  try {
    const { id, br = "320" } = ctx.request.query; // 从请求参数获取 br
    
    // 参数验证
    if (!id) {
      ctx.status = 400;
      ctx.body = { code: 400, message: "缺少必要参数 id" };
      return;
    }
    
    // 验证 br 参数有效性
    const validBR = ["128", "192", "320", "740" ,"999"];
    if (!validBR.includes(br)) {
      ctx.status = 400;
      ctx.body = { 
        code: 400, 
        message: "无效音质参数",
        allowed_values: validBR
      };
      return;
    }

    // 构造 API 请求
    const apiUrl = new URL("https://music-api.gdstudio.xyz/api.php");
    apiUrl.searchParams.append("types", "url");
    apiUrl.searchParams.append("id", id);
    apiUrl.searchParams.append("br", br); // 使用用户指定的 br

    const response = await fetch(apiUrl.toString());
    if (!response.ok) throw new Error(`API 响应状态: ${response.status}`);
    
    const result = await response.json();
    
    // 代理逻辑
    const proxy = process.env.PROXY_URL;
    if (proxy && result.url && result.url.includes("kuwo")) {
      result.proxyUrl = proxy + result.url.replace(/^http:\/\//, "http/");
    }

    ctx.body = {
      code: 200,
      message: "请求成功",
      data: {
        id,
        br, // 返回实际使用的音质参数
        url: result.url,
        ...(proxy && { proxyUrl: result.proxyUrl })
      }
    };

  } catch (error) {
    console.error("下载请求失败:", error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "服务器处理请求失败",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message 
      })
    };
  }
});

/* 网易云解灰other音源音乐获取
十分感谢自GDStudio的音源API, 这里贴个链接: music.gdstudio.xyz
*/
// 下载路由
router.get("/otherget", async (ctx) => {
  try {
    const { name } = ctx.request.query; // 从请求参数获取 br
    
    // 参数验证
    if (!name) {
      ctx.status = 400;
      ctx.body = { code: 400, message: "缺少必要参数 name" };
      return;
    }

    // 构造other歌曲搜索 API 请求
    const apiUrl = new URL("https://music-api.gdstudio.xyz/api.php");
    apiUrl.searchParams.append("types", "search");
    apiUrl.searchParams.append("source", "kuwo");
    apiUrl.searchParams.append("name", name);
    apiUrl.searchParams.append("count", "1");
    apiUrl.searchParams.append("pages", "1");
    console.log("请求的url:", apiUrl);
    const response = await fetch(apiUrl.toString());
    if (!response.ok) throw new Error(`API 响应状态: ${response.status}`);
    console.log("获得的搜索数据", response);
    const result = await response.json();
    const qqid = result[0].url_id;
    const idurl = new URL("https://music-api.gdstudio.xyz/api.php");
    idurl.searchParams.append("types", "url");
    idurl.searchParams.append("source", "kuwo");
    idurl.searchParams.append("id", qqid);
    idurl.searchParams.append("br", "999");
    console.log("请求的音乐idUrl:", idurl)
    const responseUrl = await fetch(idurl.toString());
    if (!responseUrl.ok) throw new Error(`API 响应状态: ${responseUrl.status}`);
    console.log("请求的音乐url结果:", responseUrl);
    const resultUrl = await responseUrl.json();
    console.log("获取的最终结果:", resultUrl);
    // 构造音乐 URL 请求
    ctx.body = {
      code: 200,
      message: "请求成功",
      data: {
        url: resultUrl.url,
      }
    };

  } catch (error) {
    console.error("下载请求失败:", error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: "服务器处理请求失败",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message 
      })
    };
  }
});
// 404 路由
router.use(async (ctx) => {
  await ctx.render("404");
});

module.exports = router;
