`40` commands

---

Contents

- [ADMIN](#admin)
- [Set Prefix](#Set-Prefix)
- [Auto Mod](#Auto-Mod)
- [Mod Logs](#Mod-Logs)
- [Auto Role](#Auto-Role)
- [Greeting](#Greeting)
- [Reaction Roles](#Reaction-Roles)
- [Allowed Content Replacements](#Allowed-Content-Replacements)
- [Bot Owner](#Bot-Owner)

---

# SETUP

Create **ADMIN** and **MOD** roles with these permissions present:

- **ADMIN**: `MANAGE_SERVER`
- **MOD**: `KICK_MEMBERS` | `BAN_MEMBERS` | `MANAGE_GUILD` | `MANAGE_MESSAGES`

These are the perms the bot recognizes for mod and admin users by default.

# ADMIN

~~REQUIRED PERMISSIONS: **MANAGE_SERVER**~~  
_currently rewriting default permissions_

### SET PREFIX

- **DESCRIPTION**: Set bot prefix
- **COMMAND**: `!setprefix [prefix]`

### AUTO MOD

By default, Auto mod ignores members with the deafult **MOD** and **ADMIN** permissions.

`!automodconfig debug on` will disable this, so use it carefully.

|                                                |                                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| **!automodconfig debug [on\|off]**             | toggle ON to have automod no longer ignore members with mod/admin perms |
| **!automodconfig status**                      | view configuration status                                               |
| **!automodconfig strikes \<amount>**           | set max number of strikes before taking an action                       |
| **!automodconfig action [timeout\|mute\|ban]** | set action to be performed after receiving max strikes                  |
| **!automodconfig whitelist**                   | get list of whitelisted channels                                        |
| **!automodconfig whitelistadd [#channel]**     | add channel to whitelist                                                |
| **!automodconfig whitelistremove [#channel]**  | remove channel from whitelist                                           |

**SETTINGS**

|                                              |                                                            |
| -------------------------------------------- | ---------------------------------------------------------- |
| **!anti ghostping [on\|off]**                | logs ghost mentions (Requires designated `modlog` channel) |
| **!anti spam [on\|off]**                     | enable or disable antispam detection                       |
| **!anti massmention [on\|off] \<threshold>** | enable or disable massmention detection `default: 3`       |

**AUTO DELETE**

|                                       |                                           |
| ------------------------------------- | ----------------------------------------- |
| **!autodelete attachments [on\|off]** | allow or disallow file attachments        |
| **!autodelete invites [on\|off]**     | allow or disallow sending discord invites |
| **!automod links [on\|off]**          | allow or disallow sending links           |
| **!automod maxlines \<amount>**       | sets maximum lines allowed per message    |

**WARNINGS**

|                                          |                                                        |
| ---------------------------------------- | ------------------------------------------------------ |
| **!maxwarn limit \<amount>**             | set max warnings before taking an action `default: 10` |
| **!maxwarn action [timeout\|kick\|ban]** | set action `default: timeout`                          |

Breaking automod rules **results in a strike**.  
When the max number of strikes is reached, the `maxwarn` action is triggered.

### MOD LOGS

- **DESCRIPTION**: Enables logging of all **mod** and **automod** events.
- **COMMAND**: `!modlog [#channel] [on|off]`

### AUTO ROLE

- **DESCRIPTION**: set role to auto assign when a new member joins the server
- **COMMAND**: `!autorole [role] [on|off]`

### GREETING

**WELCOME**

|                                   |                                                       |
| --------------------------------- | ----------------------------------------------------- |
| **!welcome status \<on\|off>**    | enable or disable welcome message                     |
| **!welcome channel \<#channel>**  | configure channel where welcome messages must be sent |
| **!welcome preview**              | send a welcome preview                                |
| **!welcome desc \<content>**      | set welcome embed description                         |
| **!welcome footer \<content>**    | set welcome embed footer                              |
| **!welcome thumbnail \<on\|off>** | enable or disable welcome message thumbnail           |
| **!welcome color \<#hex>**        | set welcome embed color                               |
| **!welcome image \<image-url>**   | set welcome embed image                               |

**FAREWELL**

|                                    |                                                        |
| ---------------------------------- | ------------------------------------------------------ |
| **!farewell status \<on\|off>**    | enable or disable farewell message                     |
| **!farewell channel \<#channel>**  | configure channel where farewell messages must be sent |
| **!farewell preview**              | send a farewell preview                                |
| **!farewell desc \<content>**      | set farewell embed description                         |
| **!farewell footer \<content>**    | set farewell embed footer                              |
| **!farewell thumbnail \<on\|off>** | enable or disable farewell message thumbnail           |
| **!farewell color \<#hex>**        | set farewell embed color                               |
| **!farewell image \<#image-url>**  | set farewell embed image                               |

### REACTION ROLES

|                                                  |                                                      |
| ------------------------------------------------ | ---------------------------------------------------- |
| **!addrr [#channel] [messageId] [role] [emote]** | setup reaction role for the specified message        |
| **!removerr [#channel] <messageId>**             | remove configured reaction for the specified message |

#### CONTENT REPLACEMENTS

- `{server}`: Server Name
- `{count}`: Server member count
- `{member:nick}`: Member Nickname
- `{member:name}`: Member Name
- `{member:dis}`: Member Discriminator
- `{member:tag}`: Member Tag
- `{member:avatar}`: Member Avatar URL
- `{inviter:name}`: Inviter Name
- `{inviter:tag}`: Inviter Tag
- `{invites}`: Inviter Invites

---

# BOT OWNER

These commands are only available to the Bot Owner.  
Feel free to clone this repository, but be warned that **I am not an experienced developer** and some or many features may not work as inended.

| COMMAND                    | DESCRIPTION                | USAGE                          | PERMS |
| -------------------------- | -------------------------- | ------------------------------ | ----- |
| **!eval [script]**         | evaluates script           | _!eval print("Hello, World!")_ | admin |
| **!leaveserver [guildID]** | leave a server             | _!leaveserver 4739103846283_   | admin |
| **!listservers [match]**   | lists all/matching servers | _!listservers_                 | admin |

Enjoy! 🖤

