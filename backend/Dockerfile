FROM python:3.10
LABEL maintainer="Sagun Devkota"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./app /app
WORKDIR /app
EXPOSE 8000

ARG DEV=false
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apt-get update && apt-get install -y postgresql-client && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    rm -rf /tmp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

ENV PATH="/py/bin:$PATH"

USER django-user
