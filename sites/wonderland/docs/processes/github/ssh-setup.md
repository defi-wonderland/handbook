# SSH Set Up

This guide will show you how to:

- Use 1Password to store your private SSH credentials.
- Have a biometric security check whenever you commit or push.
- Have your personal and anonymous git account live side by side safely.
- Have signed commits.

> 📎 Wonderland provides paid 1Password accounts for every member of the org.

## Requirements

1. Install [1Password](https://1password.com/) as an application on your computer.

## Steps

### 1. Create a new SSH key

If you want a fresh start, create a new SSH key with the following steps:

_Go to 1Password → New Item → SSH Key → Add Private Key → Generate a New Key_

If you want to use your current SSH for this setup:

_Go to 1Password → New Item → SSH Key → Add Private Key → Import a Key File_

:::tip
Do the above **2 times**, to have both a personal and an anonymous SSH key (**ONLY Mac/Linux**).
:::

### 2. Turn on the 1Password SSH agent

\*If you are on **Windows (Ubuntu WSL)\*** you will need to check if the **OpenSSH Authentication Agent** service is installed and disable it:

- Press Win+R and look for **OpenSSH Authentication Agent** in the list of services
  1. If you don't see it on the list, skip ahead.
  2. If you see it on the list, then double click on **OpenSSH Authentication Agent**, in the "**Startup type**" menu, choose "**Disabled**".

To turn on the SSH agent for any OS:

1. Open 1Password app, click your account and choose **Settings** > **Developer**
2. Select **Set Up SSH Agent**, then choose whether you want to display SSH key names when you authorise connections.

Test your connection:

- **Windows (WSL)**
  ```bash
  ssh.exe -T git@github.com
  ```
- **Mac / Linux**
  ```bash
  ssh -T git@github.com
  ```

### 3. Configure your git profile

- **Windows (WSL)**
  1. Create `~/.gitconfig`
- **Mac / Linux**
  The following files will make sure you automatically use your anon SSH key whenever inside `~/Code/wonderland`, and your one whenever inside `~/Code/personal`.
  Make sure to adapt it to fit your needs.
  File: `~/.gitconfig`
  File: `~/.gitconfig-personal`
  File: `~/.gitconfig-wonderland`
  To try this out, using the terminal, go to any **git project** inside `~/Code/wonderland` and paste the following:
  ```bash
  git config --get user.name && git config --get user.email
  ```
  That command should print your anonymous git information.

### 4. Configure your SSH

- **Windows (WSL)**
  No action required.
  (Optional) If you have multiple SSH keys within 1Password vaults, you can edit their priority order by editing the `agent.toml` file located at `C:\Users\Mati\AppData\Local\1Password\config\ssh\agent.toml`

  ```bash
  # Wonderland Anon Github Token
  [[ssh-keys]]
  item = "Github Anon"
  vault = "Private"
  account = "Wonder Ltd."

  # Personal Github Token
  [[ssh-keys]]
  item = "Github Personal"
  vault = "Personal"
  account = "<THE_1PASSWORD_ACCOUNT_WHERE_YOU_HAVE_YOUR_PERSONAL_SSH>"
  ```

- **Mac / Linux**
  File: `~/.config/1Password/ssh/agent.toml`
  File: `~/.ssh/pub/personal_git.pub`
  File: `~/.ssh/config`
    <aside>
    ℹ️ This setup will ensure your anon SSH key is always used by default, but whenever you specify `personalgit` in your remote, it will use your personal SSH key.
    
    Sample remote: `personalgit:my-user/very-important-project.git`
    
    </aside>

### 5. Configure your GitHub account

1. Go to https://github.com/settings/keys.
2. Make sure "**Flag unsigned commits as unverified"** is checked.
3. Click on New SSH Key
   1. Title: **1Password Wonderland**
   2. Key type: **Authentication Key**
   3. Key: **Paste your anon SSH public key**
4. Click on New SSH Key
   1. Title: **1Password Wonderland**
   2. Key type: **Signing Key**
   3. Key: **Paste your anon SSH public key**

:::info
**Authentication keys** are used whenever you push/pull.
**Signing keys** are used whenever you commit.
In this case, you want to have both be the same SSH key.
:::

## That's it!

Go ahead and try it out now.

![image.png](/img/thats-too-easy.jpg)

## References

- https://developer.1password.com/docs/ssh/get-started/
- https://developer.1password.com/docs/ssh/integrations/wsl/
