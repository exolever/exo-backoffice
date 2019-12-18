FROM node:9-alpine as builder

LABEL maintainer="Devops Team <devops@openexo.com>"

WORKDIR /projects/exo-backoffice

RUN apk --no-cache add \
        git \
        python2 \
        build-base \
    && \
    rm -rf /var/cache/apk/*

# Copying only package.json (and npm-shrinkwrap.json) for optimize docker layer cache build
COPY package.json npm-shrinkwrap.json ./

RUN npm install

# Copying only bower.json for optimize docker layer cache build
COPY bower.json .
RUN export PATH=$PATH:node_modules/.bin/ && bower install --allow-root

# Copying rest of files
COPY . .

# Compilation
RUN export PATH=$PATH:node_modules/.bin/ && gulp build

# Cleaning unused assets
RUN rm -rf /projects/exo-backoffice/dist/app && \
	rm -rf /projects/exo-backoffice/dist/assets && \
	rm -rf /projects/exo-backoffice/dist/fonts && \
	rm -rf /projects/exo-backoffice/dist/scripts && \
	rm -rf /projects/exo-backoffice/dist/styles && \
	rm -rf /projects/exo-backoffice/dist/templates && \
	rm -rf /projects/exo-backoffice/dist/theme

# This results in a single layer image with compiled backbone.js files
FROM busybox as exo-backoffice

COPY --from=builder /projects/exo-backoffice/dist/base.html /projects/service-exo-core/exo-backoffice/templates/exo-backoffice/
COPY --from=builder /projects/exo-backoffice/dist/static/ /projects/service-exo-core/exo-backoffice/static/

# FIX for celery start
RUN touch /projects/service-exo-core/exo-backoffice/__init__.py


