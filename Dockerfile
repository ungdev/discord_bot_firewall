FROM node:15.10
RUN apt-get update && apt-get install -y cron apt-transport-https ca-certificates wget zip python3 && wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg && \
    mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ && \
    wget -q https://packages.microsoft.com/config/debian/10/prod.list && \
    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list && \
    chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
    chown root:root /etc/apt/sources.list.d/microsoft-prod.list && apt-get update && apt-get install -y dotnet-runtime-3.1 && apt-get autoremove
WORKDIR /usr/src
RUN wget https://github.com/Tyrrrz/DiscordChatExporter/releases/download/2.18/DiscordChatExporter.CLI.zip && unzip DiscordChatExporter.CLI.zip -d DiscordChatExporter.CLI && chmod -R 777 DiscordChatExporter.CLI && mkdir -p /var/exports && chmod -R 777 /var/exports
WORKDIR /var/exports
RUN python3 -m http.server &
WORKDIR /usr/src/app
COPY . .
ARG timezone=Etc/UTC
ARG cronMinHour="0 0"
RUN ln -snf /usr/share/zoneinfo/$timezone /etc/localtime && echo $timezone > /etc/timezone && chmod 777 public/exports && chmod 4755 /usr/sbin/cron && echo "$cronMinHour * * * root rm -f /usr/src/app/public/exports/*" >> /etc/cron.d/exportclean && npm install
EXPOSE 3000
USER 1001
CMD cron && cd /var/exports/ && python3 -m http.server & node bin/www