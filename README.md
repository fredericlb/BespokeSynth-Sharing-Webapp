# Bespoke/Patches

A webapp to list and download Bespoke patches. It features :

- Search and tag filtering
- Graph display of the patch content
- Showing scripts and comment nodes content
- Patch uploads without user account (using simple mail token validation)

A global instance of this project is available here : [https://patches.bespokesynth.com](https://patches.bespokesynth.com)
# Configuration

The project won't run without a valid env file for server. You can set them up in ```bespoke-patches-server/src/.env``` or in the docker-compose file if you're running it through Docker. 

Configuration keys are : 

- ```SMTP_HOST, SMTP_LOGIN, SMTP_PASSWORD```: Required, your mail server credentials
- ```SMTP_FROM```: Required, sender email for messages sent by the server. Ie : ```"Bespoke Patches" <bespoke@server.com>```
- ```URL```: Required, url to your Bespoke/Patches instance
- ```ADMIN```: Required, mail to which draft patches and validation links are sent
- ```DISABLE_ACTION_TOKEN_CHECK```: Optional, set to true if you'd like to skip server-side mail validation
- ```PYTHON_EXEC```: Required, path to your Python3 exec (ie. ```python3``` for macos)
- ```STORAGE_DIR```: Required, path where sqlite database and patches files are stored
- ```VITE_APP_UMAMI```: Optional, set this for client app if you'd like to collect metrics with UMAMI. Provided string should be ```"tracker_url;website_id;host"```

# Install and run

## Without docker
```
$ sh build.sh
$ cd bespoke-patches-client && npm start
$ cd bespoke-patches-server && npm start
```

## With docker

- Copy the docker-compose example and set it with your own vars
- ```$ docker-compose up```

# API

The server is GraphQL first and uses Sofa to provide a REST Api. Currently the REST API is only available for queries as mutations including files is not yet supported by SOFA.
# Contributing

Every contributions are welcome. The project uses husky with eslint/prettier/commitlint to maintain consistent coding style, please don't skip the corresponding git hooks. 

Project roadmap is available here:  [Github project roadmap](https://github.com/fredericlb/BespokeSynth-Sharing-Webapp/projects/1)