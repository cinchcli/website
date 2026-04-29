---
title: cinch.vim
description: Vim and Neovim plugin that auto-pushes yanked text and exposes CinchPull / CinchPush commands.
---

[cinch.vim](https://github.com/cinchcli/cinch.vim) integrates the Cinch CLI into Vim and Neovim so yanked text is pushed to your relay automatically, and you can pull the latest clip without leaving the editor.

## Requirements

- Vim 8.0+ or Neovim 0.5+
- `cinch` CLI installed and authenticated — see the [Quick Start](/docs/quick-start/) guide

## Installation

**lazy.nvim**

```lua
{ "cinchcli/cinch.vim" }
```

**vim-plug**

```vim
Plug 'cinchcli/cinch.vim'
```

## Usage

### Auto-push on yank

With the default configuration, any yank operation pushes the yanked text to your relay:

| Key / motion | Effect |
|---|---|
| `yy` | Yank line → auto-push |
| `yw` | Yank word → auto-push |
| `y$` | Yank to end of line → auto-push |
| any `y{motion}` | Yank → auto-push |

### Commands

| Command | Description |
|---|---|
| `:CinchPull` | Pull the latest clip and insert it at the cursor |
| `:CinchPush` | Manually push the current register to the relay |
| `:CinchToggle` | Toggle auto-push on or off for the current session |

## Configuration

All options have sensible defaults. Set them in your config before the plugin loads.

**Vim (`~/.vimrc`)**

```vim
" Disable auto-push on yank (enable manually with :CinchPush or :CinchToggle)
let g:cinch_auto_push = 0

" Register to push/pull (default: unnamed register)
let g:cinch_push_register = '"'

" Path to the cinch binary if it is not on $PATH
let g:cinch_binary = '/usr/local/bin/cinch'
```

**Neovim (`~/.config/nvim/init.lua`)**

```lua
vim.g.cinch_auto_push = 0
vim.g.cinch_push_register = '"'
vim.g.cinch_binary = '/usr/local/bin/cinch'
```

### Option reference

| Variable | Default | Description |
|---|---|---|
| `g:cinch_auto_push` | `1` | Push to relay on every yank |
| `g:cinch_push_register` | `"` | Vim register used for push and pull |
| `g:cinch_binary` | `'cinch'` | Path to the `cinch` binary |
