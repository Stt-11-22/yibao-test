import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
};

export default nextConfig;

// Cloudflare开发模式需要Wrangler权限，在受限环境中注释掉以下代码
// 如需使用Cloudflare功能，请确保有适当的权限配置
// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
// initOpenNextCloudflareForDev();
