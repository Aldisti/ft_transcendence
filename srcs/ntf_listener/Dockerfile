FROM python:3.12.0

RUN apt update && apt upgrade -y 

RUN pip install pika
RUN pip install requests

COPY ./tools/listener.py /listener.py

ENTRYPOINT ["python", "listener.py"]
