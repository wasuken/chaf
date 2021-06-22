FROM ruby:latest

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN sh -c 'echo "deb https://dl.yarnpkg.com/debian/ stable main" >> /etc/apt/sources.list.d/yarn.list'

RUN apt-get update && \
	apt-get install -y default-mysql-client

RUN apt install -y yarn

RUN rm -rf /var/lib/apt/lists/*

COPY run.sh run.sh
RUN  chmod +x run.sh

CMD [ "/run.sh" ]
