FROM docker-registry.eyeosbcn.com/eyeos-fedora21-node-base

ENV WHATAMI rabbitmq-auth-backend-http

MAINTAINER eyeos

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf ${InstallationDir}/src/eyeos-rabbitmq-auth-backend-http.js

COPY . ${InstallationDir}

RUN npm install --verbose && \
    npm cache clean
