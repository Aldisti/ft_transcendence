# Transcendence

Transcendence is the last and most important project of the 42 Common core. In this project you have to create a single page **web app** that will allow users to play between them the ol' Pong game.
For more information about the project we suggest you to read the [subject](resources/subject.en.pdf).


## Installation

Clone this repository.

`git clone *this_repository_https_link*`


## Usage

> [!NOTE]
> Make sure to respect all the [requirements](Readme.md#Requirements).

In order to make the project easy to deploy we wrote a Makefile that contains some usefull commands.

* `make`
    This command will prepare the environment and run all the servers.
    The first time you'll be asked to insert some values. These are all environment variables and they are strictly necessary for the correct operation of the program.
    Furthermore you will notice that some variables are marked with an asterisk, these are mandatory to be inserted while the rest can be left blank.
    After all the environment variables have been set the docker-compose will be called and the containers will start running.
* `make fclean`
    This command will delete all the containers, images, networks and volumes created by docker and will also remove the databases mounted volumes.
* `make init`
    This command will execute only the startup scripts to prepare the environment for the containers build.
* `make demo`
    This command will create 35 random users in the databases and then it will print the respective usernames.
    The password of this new users will be password so be careful when using this comand.


## Contributing

This project will most likely no longer be maintained, therefore in the case of pull requests or issues they will probably be ignored.


## Requirements
- [ ] Python v3.10+
- [ ] Bash v5+
- [ ] Docker v25+


## Modules
Look [here](resources/ModulesList.md) to see what modules we did.


## Authors

* ![Aldisti github profile image](https://avatars.githubusercontent.com/u/76822748?s=25) [adi-stef](https://github.com/Aldisti)
* ![Marcopf github profile image](https://avatars.githubusercontent.com/u/83019220?s=25) [mpaterno](https://github.com/marcopf)
* ![]() [gpanico](https://github.com/Ukudot)


## Credits

A big thanks to two people in particular who patiently helped us test different parts of the project.
* ![lde-mich github profile image](https://avatars.githubusercontent.com/u/113907143?s=25) [lde-mich](https://github.com/lde-mich)
* ![dcastagn42 github profile image](https://avatars.githubusercontent.com/u/112878659?s=25) [dcastagn](https://github.com/DarioCastagnola)
