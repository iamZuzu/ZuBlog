/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // produces a static site in /out that can be hosted anywhere
  images: { unoptimized: true },
};

export default nextConfig;
