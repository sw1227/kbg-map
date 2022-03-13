/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/kbg-map",
  trailingSlash: true,
  images: {
    loader: 'imgix',
    path: '/',
  },
}

module.exports = nextConfig
