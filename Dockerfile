# 使用轻量级的 Node.js 20 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json（如果以后你需要装第三方库，这一步很有用）
COPY package*.json ./

# 安装依赖（由于我们没有第三方依赖，这步很快）
RUN npm install --production

# 复制所有代码到容器的 /app 目录
COPY . .

# 暴露 8431 端口
EXPOSE 8431

# 默认启动命令（即使控制台不填，它也会跑这句）
CMD ["node", "index.js"]