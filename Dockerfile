ARG NODE_VERSION="15"
FROM node:${NODE_VERSION}

ARG DISCORD_CHAT_EXPORTER_VERSION="2.27"
ARG timezone=Etc/UTC

ENV NODE_VERSION=${NODE_VERSION}
ENV DISCORD_CHAT_EXPORTER_VERSION=${DISCORD_CHAT_EXPORTER_VERSION}
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates wget zip python3 && wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg && \
    mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ && \
    wget -q https://packages.microsoft.com/config/debian/10/prod.list && \
    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list && \
    chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
    chown root:root /etc/apt/sources.list.d/microsoft-prod.list && apt-get update && apt-get install -y dotnet-runtime-3.1 && apt-get autoremove
WORKDIR /usr/src
RUN wget https://github.com/Tyrrrz/DiscordChatExporter/releases/download/${DISCORD_CHAT_EXPORTER_VERSION}/DiscordChatExporter.CLI.zip && unzip DiscordChatExporter.CLI.zip -d DiscordChatExporter.CLI && chmod -R 777 DiscordChatExporter.CLI && mkdir -p /var/exports && chmod -R 777 /var/exports
WORKDIR /var/exports
RUN python3 -m http.server &
WORKDIR /usr/src/app
COPY . .
RUN ln -snf /usr/share/zoneinfo/$timezone /etc/localtime && echo $timezone > /etc/timezone && chmod 777 public/exports && npm install
EXPOSE 3000
USER 1001
CMD cd /var/exports/ && python3 -m http.server & node bin/www