FROM docker-registry.eyeosbcn.com/alpine6-node-base

ENV WHATAMI rabbitmq-auth-backend-http
ENV InstallationDir /var/service/

MAINTAINER eyeos

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf ${InstallationDir}/src/eyeos-rabbitmq-auth-backend-http.js

COPY . ${InstallationDir}

RUN apk update && \
    /scripts-base/buildDependencies.sh --production --install && \
    npm install --verbose --production && \
    npm cache clean && \
    /scripts-base/buildDependencies.sh --production --purgue && \
    rm -rf /etc/ssl /var/cache/apk/* /tmp/*
