# centercore
Geometry Dash server emulator in TypeScript and MySQL

# ATTENTION

This core is under development and testing, so it may have critical security and performance issues. Please wait for release before use it for your GDPS.
<p style="text-align: right;margin-right: 50px;">- myst</p>

## Setup

```bash
npm i # (or "yarn") install dependencies
cp example.env .env # copy example settings
```
edit .env for your server

## Build and start

```bash
npm run build # (or "yarn build") build TS files
npm run start # (or "yarn start") start builded server
```

## Features

### Mod system

- elder moderators can do **everything**

- normal moderators **can**:
    - **star rate levels immediately**
    - change demon difficulty
    - set levels as featured

- normal moderators **can't**:
    - set levels as epic
    - add levels to daily list
    - delete levels

### Commands
List of available commands (you can use it in level comments):

- Moderation:
    - `!delete` - delete level from server, need elder moderator
    
    - `!rate <stars>` (ex. `!rate 5`) - rate a level, need normal or elder moderator
        - `!rate 0` will remove rate from level
        - `!rate 1` will set level as auto
        - `!rate 10` will set level as easy demon, you can change demon difficulty by `!demon` command

    - `!demon <name>` (ex. `!demon medium`) - set demon difficulty, only works if level was rated as demon

    - `!featured <1 or 0>` (ex. `!featured 1`) - set level as featured or not, need normal or elder moderator

    - `!epic <1 or 0>` (ex. `!epic 1`) - set level as epic or not, need elder moderator

## Credits

- [Cvolton](https://github.com/cvolton)
- All [creators](https://gdprogra.me/#/CREDITS) of [gdprogra.me](https://gdprogra.me/#)
