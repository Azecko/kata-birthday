# [Kata-birthday](https://github.com/ponsfrilus/kata-birthday) by [Azecko](https://github.com/Azecko)

## What's that?

This repository is a NodeJS script that send emails to remind the birthday of someone (from a JSON file).


## Make it work

1. Clone the repository on your computer.
2. Type `npm install` to install [dotenv](https://www.npmjs.com/package/dotenv) and [nodemailer](https://nodemailer.com/about/) (required to make the program work).
3. Rename the file `.env_example` in `.env`.
4. Insert your own data in the `.env` file (e.g. to be able to send mail).
5. Rename the file `birthdays.json_example` in `birthdays.json`.
6. Insert your own data in the `birthdays.json` file.
7. Run `node index.js` to start the program
8. Enjoy!


## Ansible

You may want to deploy this project using Ansible. It uses the 
[Ansible Suitcase] and will deploy the project in a Docker 
container plus a crontab (which will run at 7:03am).

Be sure to configure your host in [inventory.yml](./ops/inventory.yml)
and then run `./ops/birthsible`.


## Greetings

Thanks to [@ponsfrilus](https://github.com/ponsfrilus) for the help on the script.

[Ansible Suitcase]: https://github.com/epfl-si/ansible.suitcase
