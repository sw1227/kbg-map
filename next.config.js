/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.GITHUB_ACTIONS ? "/kbg-map" : "",
  trailingSlash: true,
  images: {
    loader: 'imgix',
    path: '/',
  },
}

module.exports = nextConfig
