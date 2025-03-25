# Git Enviroment

**Security Recommendation**

The most secure approach is to create a separate user account on your computer for your anonymous profile, completely isolating it from your personal one. **This provides the strongest separation of concerns and security.**

The following guide describes how to configure both profiles under a single user account if you choose not to create a separate user. However, be aware this is less secure than full user isolation.

This guide walks you through setting up dual Git environments on WSL2 - one for personal use and another for anonymous DeFi use. You'll learn how to:

- Configure separate Git profiles with different identities
- Generate and manage SSH keys for each profile
- Set up GPG signing for verified commits
- Structure your workspace for seamless profile switching

---

## Prerequisites

- Windows with WSL2 installed and Ubuntu terminal
- Git installed on WSL2
- GnuPG installed (`sudo apt-get install gnupg`)

## Directory Structure Setup

Create separate directories for personal and DeFi development:

```bash
mkdir ~/personal
mkdir ~/defi
```

## Git Profile Configuration

We’re going to mention your anon and personal email in the guide below, but keep in mind that Github creates a [private email](https://github.com/settings/emails) for you that can shield you from unwanted inquires.

### Create Personal Profile

```bash
nano ~/.gitconfig-personal
```

Add the following configuration (replace with your details):

```
[user]
        email = your.email@example.com
        name = Your Name
        signingkey = <gpg_key>
[commit]
        gpgsign = true
```

### Create DeFi Profile

```bash
nano ~/.gitconfig-defi
```

Add the following configuration:

```
[user]
        email = your-anon@defi.sucks
        name = 0xYourAlias
        signingkey = <gpg_key>
[commit]
        gpgsign = true
```

## SSH Key Setup

### Create SSH directories

```bash
mkdir -p ~/.ssh/personal
mkdir -p ~/.ssh/defi
```

### Generate personal SSH key

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

When prompted:

- Save to: `/home/your_user/.ssh/personal/id_ed25519`
- Set passphrase (optional)

### Generate DeFi SSH key

```bash
ssh-keygen -t ed25519 -C "your-anon@defi.sucks"
```

When prompted:

- Save to: `/home/your_user/.ssh/defi/id_ed25519`
- Set passphrase (optional)

### Add SSH keys to GitHub

```bash
# View personal key
cat ~/.ssh/personal/id_ed25519.pub

# View DeFi key
cat ~/.ssh/defi/id_ed25519.pub
```

Add each public key to the corresponding GitHub account under Settings → SSH Keys

## GPG Key Setup

### Generate GPG key:

```bash
gpg --full-generate-key
```

Select:

- RSA and RSA (default)
- 3072 bits
- No expiration
- Set a password for commit signing

### List your GPG keys

```bash
gpg --list-secret-keys --keyid-format=long
```

Note the key ID after `sec rsa3072/`

### Export GPG key for GitHub

```bash
gpg --armor --export YOUR_KEY_ID
```

Add the output to GitHub under Settings → GPG Keys

### Update your Git configs with the GPG key ID:

- Edit both `~/.gitconfig-personal` and `~/.gitconfig-defi`
- Add the key ID to the `signingkey` field

## Profile Integration

### Create master Git config

```bash
nano ~/.gitconfig
```

Add:

```
[includeIf "gitdir:~/personal/"]
        path = .gitconfig-personal
[includeIf "gitdir:~/defi/"]
        path = .gitconfig-defi
[program]
        pgp = /usr/bin/gpg
[core]
        autocrlf = input
```

### Configure SSH profiles

```bash
nano ~/.ssh/config
```

Add:

```
Host github-defi
        HostName github.com
        User git
        IdentitiesOnly yes
        IdentityFile ~/.ssh/defi/id_ed25519

Host github.com
        HostName github.com
        User git
        IdentitiesOnly yes
        IdentityFile ~/.ssh/personal/id_ed25519
```

### Configure GPG for terminal

```bash
echo "export GPG_TTY=\\$(tty)" >> ~/.bash_profile
```

## Usage

### Cloning Repositories

For personal repos:

```bash
git clone git@github.com:owner/repo.git
```

For DeFi repos:

```bash
git clone git@github-defi:owner/repo.git
```

### Verifying Setup

Test SSH connection:

```bash
# Personal
ssh -T git@github.com

# DeFi
ssh -T git@github-defi
```

Test GPG signing:

```bash
# Force GPG signing if not working
git config --global commit.gpgsign true

# Make a test commit and verify it shows as "verified" on GitHub
```

## Troubleshooting

### Commits aren't being signed

1. Verify GPG key configuration:

```bash
git config --global --list | grep gpg
```

1. Ensure GPG agent is running:

```bash
gpg-agent --daemon
```

1. Test GPG signing:

```bash
echo "test" | gpg --clearsign
```

### SSH authentication fails

1. check SSH agent:

```bash
eval $(ssh-agent -s)
ssh-add ~/.ssh/personal/id_ed25519
ssh-add ~/.ssh/defi/id_ed25519
```

1. Verify key permissions:

```bash
chmod 600 ~/.ssh/personal/id_ed25519
chmod 600 ~/.ssh/defi/id_ed25519
```