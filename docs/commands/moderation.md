---
description: 23 commands
---

Contents

- [WARNINGS](#warnings)
- [MOD ACTIONS](#mod-actions)
- [VC MOD ACTIONS](#vc-mod-actions)
- [CHANGE NICKNAMES](#change-nicknames)
- [PURGE MESSAGES](#purge-messages)

# Moderation

REQUIRED PERMISSIONS: `KICK_MEMBERS` | `BAN_MEMBERS` | `MANAGE_SERVER` | `MANAGE_MESSAGES` | `KICK_MEMBERS` | `BAN_MEMBERS` | ~~`ADMIN`~~ | `MANAGE_CHANNELS` | `MANAGE_MESSAGES` | `MANAGE_ROLES`

### WARNINGS

| COMMAND                    | DESCRIPTION                   |
| -------------------------- | ----------------------------- |
| **!warnings list [user]**  | list all warnings for a user  |
| **!warnings clear [user]** | clear all warnings for a user |
| **!warn [user] [reason]**  | warns the specified user      |

### MOD ACTIONS

|                               |                                                        |
| ----------------------------- | ------------------------------------------------------ |
| **!timeout [user] [reason]**  | timeout the specified user                             |
| **!untimout [user] [reason]** | untimout the specified user                            |
| **!kick [user] [reason]**     | kicks the specified user                               |
| **!softban [user] [reason]**  | softban the specified user. Kicks and deletes messages |
| **!ban [user] [reason]**      | ban the specified user                                 |
| **!unban [user] [reason]**    | unban a banned user                                    |

### VC MOD ACTIONS

|                                 |                                               |
| ------------------------------- | --------------------------------------------- |
| **!vmute [user] \<amount>**     | mute a user                                   |
| **!vunmute [user] \<amount>**   | unmute a muted user                           |
| **!deafen [user] [reason]**     | deafen a user                                 |
| **!undeafen [user] [reason]**   | undeafen a deafened user                      |
| **!move [user] [reason]**       | move a user from one voice channel to another |
| **!disconnect [user] [reason]** | kick a user from voice channel                |

### CHANGE NICKNAMES

|                        |                          |
| ---------------------- | ------------------------ |
| **!nick set [user]**   | change a user's nickname |
| **!nick reset [user]** | reset a user's nickname  |

### PURGE MESSAGES

|                                   |                                                  |
| --------------------------------- | ------------------------------------------------ |
| **!purge \<amount>**              | purge all messages                               |
| **!purgeattach \<amount>**        | purge all messages with attachments              |
| **!purgebots \<amount>**          | purge all bot messages                           |
| **!purgelinks \<amount>**         | purge all messages with links                    |
| **!purgetoken [token] \<amount>** | purge all messages containing the specified word |
| **!purgeuser [user] \<amount>**   | purge all messages from the specified user       |

