const nextConfig = {
  eslint: {
    // Cloudflare build currently invokes eslint with legacy options; skip during build.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
