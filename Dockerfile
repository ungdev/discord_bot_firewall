ARG NODE_VERSION="20"
FROM node:${NODE_VERSION}

ARG DISCORD_CHAT_EXPORTER_VERSION="2.36.4"
ARG timezone=Etc/UTC

ENV NODE_VERSION=${NODE_VERSION}
ENV DISCORD_CHAT_EXPORTER_VERSION=${DISCORD_CHAT_EXPORTER_VERSION}
RUN apt-get update && apt-get install -y apt-transport-https zip && \
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft-prod.gpg && \
    mv microsoft-prod.gpg /usr/share/keyrings/ && \
    wget -q https://packages.microsoft.com/config/debian/12/prod.list && \
    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list && \
    chown root:root /usr/share/keyrings/microsoft-prod.gpg && \
    chown root:root /etc/apt/sources.list.d/microsoft-prod.list && \
    apt-get update && apt-get install -y dotnet-runtime-6.0 && \
    apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src
RUN wget https://github.com/Tyrrrz/DiscordChatExporter/releases/download/${DISCORD_CHAT_EXPORTER_VERSION}/DiscordChatExporter.CLI.zip && unzip DiscordChatExporter.CLI.zip -d DiscordChatExporter.CLI && chmod -R 777 DiscordChatExporter.CLI && mkdir -p /var/exports && chmod -R 777 /var/exports
WORKDIR /var/exports
RUN python3 -m http.server &
WORKDIR /usr/src/app
COPY . .
RUN ln -snf /usr/share/zoneinfo/$timezone /etc/localtime && echo $timezone > /etc/timezone && chmod 777 public/exports && npm ci
EXPOSE 3000
USER 1001
CMD cd /var/exports/ && python3 -m http.server & node bin/www
