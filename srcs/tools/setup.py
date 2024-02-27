
from getpass import getpass
import os
import re


APP_ENV: dict[str, dict[str, str]] = {
    'DJANGO': {
        'path': './srcs/transcendence/.env',
        'db_path': './srcs/postgres/.env_django',
        'PROJECT_NAME': 'transcendence',
        'DB_NAME': 'transcendence',
        'DB_USER': os.environ.get('USERNAME', ''),
        'DB_PASSWORD': 'password',
        'DB_HOST': 'postgres',
        'DB_PORT': '5432',
    },
    'AUTH': {
        'path': './srcs/auth/.env',
        'db_path': './srcs/postgres/.env_auth',
        'PROJECT_NAME': 'authentication',
        'DB_NAME': 'authentication',
        'DB_USER': os.environ.get('USERNAME', ''),
        'DB_PASSWORD': 'password',
        'DB_HOST': 'authdb',
        'DB_PORT': '5432',
        'INTRA_ID': 'u-s4t2ud-eff0cd3d5bfca5625c1acb7d97431e26ec2965c19596f83a6e2428d0870432d0',
        'INTRA_SECRET': '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',
        'GOOGLE_ID': '608692791188-2nkebjcfel5f7n5mlsvmtd1662i6bebl.apps.googleusercontent.com',
        'GOOGLE_SECRET': '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',
    },
    'PONG': {
        'path': './srcs/pong/.env',
        'db_path': './srcs/postgres/.env_pong',
        'PROJECT_NAME': 'pong',
        'DB_NAME': 'pong',
        'DB_USER': os.environ.get('USERNAME', ''),
        'DB_PASSWORD': 'password',
        'DB_HOST': 'pongdb',
        'DB_PORT': '5432',
    },
    'CHAT': {
        'path': './srcs/chat/.env',
        'db_path': './srcs/postgres/.env_chat',
        'PROJECT_NAME': 'chat',
        'DB_NAME': 'chat',
        'DB_USER': os.environ.get('USERNAME', ''),
        'DB_PASSWORD': 'password',
        'DB_HOST': 'chatdb',
        'DB_PORT': '5432',
    },
    'NTF': {
        'path': './srcs/ntf/.env',
        'db_path': './srcs/postgres/.env_ntf',
        'PROJECT_NAME': 'ntf',
        'DB_NAME': 'ntf',
        'DB_USER': os.environ.get('USERNAME', ''),
        'DB_PASSWORD': 'password',
        'DB_HOST': 'ntfdb',
        'DB_PORT': '5432',
    },
    # 'NGINX': {
	# 	'path': './srcs/nginx/.env',
	# },
    'ALL': {
        'path': './srcs/.env',
        # dbs
        'PGDATA': '/var/lib/postgresql/data/pgdata',
        # nginx
        'SERVER_FRONTEND_IP': 'localhost',
        'FRONT_PORT': '4242',
		'NGINX_HOST': 'localhost',
		'DJANGO_HOST': 'django',
		'DJANGO_PORT': '8000',
		'AUTH_HOST': 'auth',
  		'AUTH_PORT': '8000',
		'PONG_HOST': 'pong',
		'PONG_PORT': '7000',
		'CHAT_HOST': 'chat',
		'CHAT_PORT': '6000',
		'NTF_HOST': 'ntf',
  		'NTF_PORT': '9000',
        # boh
        'EXCHANGE': 'my_exchange',
        # rabbit
        'RABBIT_HOST': 'rabbit_mq',
        'RABBIT_PORT': '5672',
        'RABBIT_HEARTBEAT': '20',
        'RABBIT_BC_TIMEOUT': '10',
        'THREAD': '5',
		'RABBITMQ_DEFAULT_USER': os.environ.get('USERNAME'),
		'RABBITMQ_DEFAULT_PASS': 'password',
        # ntf
        'NTF_ROUTING_KEY': 'notification',
        'NTF_QUEUE': 'ntf_queue',
        'VHOST_NTF': 'notification',
        # email
        'EMAIL_PORT': '465',
        'EMAIL_HOST': 'smtp.gmail.com',
        'EMAIL_HOST_USER': 'transcendence.trinity@gmail.com',
        'EMAIL_HOST_PASSWORD': 'awmvotojcdvmdwge',
        'EMAIL_QUEUE': 'email_queue',
        'EMAIL_ROUTING_KEY': 'email',
		# admin
		'ADMIN_USERNAME': os.environ['USERNAME'],
		'ADMIN_EMAIL': f"{os.environ['USERNAME']}@localhost",
		'ADMIN_PASSWORD': 'password',
    }
}

DB_VARS = {
    'DB_NAME': 'POSTGRES_DB',
    'DB_USER': 'POSTGRES_USER',
	'DB_PORT': 'POSTGRES_PORT',
    'DB_PASSWORD': 'POSTGRES_PASSWORD',
}


class EnvFile:

    @staticmethod
    def str_to_json(text: str) -> dict[str, str]:
        """
        input:
        key1="value1"
        key2="value2"
        output:
        {'key1': 'value1', 'key2': 'value2'}
        """
        return {key: value for key, value in [line.split('=') for line in text.replace('\"', "").splitlines() if line != ""]}

    @staticmethod
    def json_to_str(json: dict[str, str]) -> str:
        """
        input:
        {'key1': 'value1', 'key2': 'value2'}
        output:
        key1="value1"
        key2="value2"
        """
        return "".join([f"{key}=\"{value}\"\n" for key, value in json.items()])

    @staticmethod
    def add_prefix_to_json(prefix: str, json: dict[str, str]) -> dict[str, str]:
        new_json = {}
        for key, value in json.items():
            new_json[prefix + key] = value
        return new_json

    @staticmethod
    def remove_lower_keys(json: dict[str, any]) -> dict[str, any]:
        new_json = {}
        for key, value in json.items():
            if re.match(r'^[A-Z_]+$', key) is None:
                continue
            new_json[key] = value
        return new_json

    @staticmethod
    def fill_var(name: str, default: str) -> str:
        message = f"{'*' if default == '' else ' '} Insert `{name}` value: "
        user_value = ""
        while user_value == "":
            user_value = (input(message) if 'PASSWORD' not in name else getpass(message)) or default
        return default

    def __create_env(self) -> None:
        print(f"> creating {self.name} env file")
        for key, value in self.def_vars.items():
            self.new_vars[key] = self.fill_var(key, value)
        with open(self.path, 'w') as file:
            file.write(self.json_to_str(self.new_vars))

    def __update_env(self) -> None:
        if (list(self.def_vars.keys()) in list(self.env_vars.keys())
            and not any(set(map(lambda value: value == '', self.env_vars.values())))):
            self.new_vars = self.env_vars
            return
        print(f"> updating {self.name} env file")
        for key in self.def_vars.keys():
            if self.env_vars.get(key, '') == '':
                self.new_vars[key] = self.fill_var(key, self.def_vars[key])
            else:
                self.new_vars[key] = self.env_vars[key]
        with open(self.path, 'w') as file:
            file.write(self.json_to_str(self.new_vars))

    def __create_db_env(self) -> None:
        if self.db_path is None:
            return
        if self.new_vars == {}:
            raise Exception()
        json = {}
        for key in DB_VARS:
            json[DB_VARS[key]] = self.new_vars[key]
        with open(self.db_path, 'w') as file:
            file.write(self.json_to_str(json))

    def save(self):
        if os.path.exists(self.path):
            self.__update_env()
        else:
            self.__create_env()
        self.__create_db_env()

    def load_env(self) -> None:
        if not os.path.exists(self.path):
            return
        with open(self.path, 'r') as file:
            text = file.read()
        self.env_vars.update(self.str_to_json(text))

    def load_vars(self, vars: dict[str, str]) -> None:
        vars = vars.copy()
        self.path = vars.pop('path', '') or self.path
        self.db_path = vars.pop('db_path', '') or None
        self.def_vars.update(vars)


    def __init__(self, name: str = "", path: str = "") -> None:
        self.name = name
        self.path = path
        self.env_vars = {}
        self.def_vars = {}
        self.new_vars = {}
        self.db_path = None

    def __str__(self) -> str:
        return (f"{self.name}\t{self.path}\n\n{self.json_to_str(self.new_vars)}")


def main() -> None:
    for app, vars in APP_ENV.items():
        env_file = EnvFile(name=app, path=vars.get('path', ''))
        env_file.load_env()
        env_file.load_vars(vars)
        env_file.save()


if __name__ == '__main__':
    main()
