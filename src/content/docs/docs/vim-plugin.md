---
title: cinch.vim
description: Vim and Neovim plugin that auto-pushes yanked text and exposes CinchPull, CinchHistory, and friends.
---

[cinch.vim](https://github.com/cinchcli/cinch.vim) integrates the Cinch CLI into Vim and Neovim. Yanked text is pushed to your relay automatically (opt-in mappings), and you can pull the latest clip, browse history, or push from a specific device without leaving the editor.

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

With `g:cinch_auto_push = 1` (the default), any yank operation pushes the yanked text to your relay:

| Key / motion | Effect |
|---|---|
| `yy` | Yank line → auto-push |
| `yw` | Yank word → auto-push |
| `y$` | Yank to end of line → auto-push |
| any `y{motion}` | Yank → auto-push |

### Optional `yc`-family mappings

The `yc` / `ycc` / `yC` mappings are **opt-in**. Enable them by setting `g:cinch_default_mappings = 1` before the plugin loads:

```vim
let g:cinch_default_mappings = 1
```

| Mapping | `<Plug>` | Effect |
|---|---|---|
| `yc{motion}` | `<Plug>(cinch-push)` | Push the text covered by `{motion}` |
| `ycc` | `<Plug>(cinch-push-line)` | Push the current line |
| `yC` | `<Plug>(cinch-push-eol)` | Push from cursor to end of line |
| (visual) `yc` | `<Plug>(cinch-push)` | Push the visual selection |

Bind any `<Plug>` map yourself if you prefer different keys. Additional `<Plug>` maps for pull / paste / history:

- `<Plug>(cinch-pull)` — pull and insert at cursor
- `<Plug>(cinch-pull-after)` / `<Plug>(cinch-pull-before)` — pull and paste linewise
- `<Plug>(cinch-history)` — open the history picker

### Commands

| Command | Description |
|---|---|
| `:CinchPush` | Push the current register (or `[range]` of lines) to the relay. |
| `:CinchPull` | Pull the latest clip and insert it at the cursor. |
| `:CinchPullFrom {device}` | Pull the latest clip from a specific device. Tab-completes device names from the relay. |
| `:CinchToggle` | Toggle `g:cinch_auto_push` for the current session. |
| `:CinchStatus` | Show auth status, last push / pull, and auto-push state. |
| `:CinchHistory[!]` | Browse and paste from clip history. Default loads the most recent 50; `!` loads 200. |

`:CinchHistory` automatically uses the best picker available in the current editor — [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim), [fzf-lua](https://github.com/ibhagwan/fzf-lua), [snacks.nvim](https://github.com/folke/snacks.nvim) picker, a Neovim floating-window builtin, or a Vim 8 `popup` / scratch-buffer fallback.

## Configuration

All options have sensible defaults. Set them in your config before the plugin loads.

**Vim (`~/.vimrc`)**

```vim
" Disable auto-push on yank (enable manually with :CinchPush or :CinchToggle)
let g:cinch_auto_push = 0

" Enable the opt-in yc / ycc / yC mappings
let g:cinch_default_mappings = 1

" Register to push/pull (default: unnamed register)
let g:cinch_push_register = '"'

" Default --from device for :CinchPull (empty = latest from any device)
let g:cinch_default_source = 'devbox'

" Exclude clips from this machine when pulling
let g:cinch_pull_exclude_self = 1

" Path to the cinch binary if it is not on $PATH
let g:cinch_binary = '/usr/local/bin/cinch'

" Echo extra info (push/pull byte counts, errors) to :messages
let g:cinch_verbose = 1
```

**Neovim (`~/.config/nvim/init.lua`)**

```lua
vim.g.cinch_auto_push          = 0
vim.g.cinch_default_mappings   = 1
vim.g.cinch_push_register      = '"'
vim.g.cinch_default_source     = 'devbox'
vim.g.cinch_pull_exclude_self  = 1
vim.g.cinch_binary             = '/usr/local/bin/cinch'
vim.g.cinch_verbose            = 1
```

### Option reference

| Variable | Default | Description |
|---|---|---|
| `g:cinch_auto_push` | `1` | Push to relay on every yank. |
| `g:cinch_default_mappings` | `0` | Install the opt-in `yc` / `ycc` / `yC` mappings. |
| `g:cinch_push_register` | `"` | Vim register used for push and pull. |
| `g:cinch_default_source` | `''` | Default `--from` device for pulls. Empty means "latest from any device". |
| `g:cinch_pull_exclude_self` | `0` | When `1`, pull skips clips authored by this machine. |
| `g:cinch_binary` | `'cinch'` | Path to the `cinch` binary. |
| `g:cinch_verbose` | `0` | Print push/pull byte counts and errors to `:messages`. |
