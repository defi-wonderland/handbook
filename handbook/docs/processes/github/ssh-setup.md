# SSH Set Up

This guide will show you how to:

- Use 1Password to store your private ssh credentials.
- Have a biometrics security check whenever you commit or push.
- Have your personal and anon git account live side by side safely.
- Have signed commits.

> 📎
> Wonderland provides paid 1Password accounts for every member of the org.

# Requirements

1. Install [1Password](https://1password.com/) as an application on your computer.

# Steps

**1. Create a new SSH key**

If you want a fresh start, create a new SSH key with the following steps:

*Go to 1Password → New Item → SSH Key → Add Private Key → Generate a New Key*

If you want to use your current SSH for this setup:

*Go to 1Password → New Item → SSH Key → Add Private Key → Import a Key File*

<aside>
📌

Do the above **2 times**, to have both a personal and an anon ssh key (**ONLY Mac/Linux**).

</aside>

**2. Turn on the 1Password SSH agent**

*If you are on **Windows (Ubuntu WSL)*** you will need to check if the **OpenSSH Authentication Agent** service is installed and disable it: 

- Press Win+R and look for **OpenSSH Authentication Agent** in the list of services
    1. If you don’t see it on the list, skip ahead.
    2. if you see it on the list then double click on **OpenSSH Authentication Agent**, in the “**Startup type**” menu, choose “**Disabled**”.

To Turn on the SSH agent for any OS: 

1. Open 1Password app, click your account and choose **Settings** > **Developer**
2. Select **Set Up SSH Agent** then choose whether you want to display SSH key names when you authorize connections.

Test your connection:

- **Windows (WSL)**
    
    ```bash
    ssh.exe -T git@github.com
    ```
    
- **Mac / Linux**
    
    ```bash
    ssh -T git@github.com
    ```
    

**3. Configure your git profile**

- **Windows (WSL)**
    1. Create `~/.gitconfig`
- **Mac / Linux**
    
    The following files will make sure you automatically use your anon ssh key whenever inside `~/Code/wonderland`, and your personal one whenever inside `~/Code/personal`.
    
    Make sure to adapt it to fit your needs.
    
    File: `~/.gitconfig`
    
    File: `~/.gitconfig-personal`
    
    File: `~/.gitconfig-wonderland`
    
    In order to try this out, using the terminal go to any **git project** inside `~/Code/wonderland` and paste the following:
    
    That command should print your anon git information.
    

**4. Configure your SSH**

- **Windows (WSL)**
    
    No action required.
    
    (Optional) If you have multiple SSH keys within 1Password vaults you can edit its priority order by editing the `agent.toml` file located at `C:\Users\Mati\AppData\Local\1Password\config\ssh\agent.toml`
    
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
    
    **Warning**: This doesn’t allow you to use multiple keys for different host as mentioned in [https://www.notion.so/defi-wonderland/Git-and-SSH-Setup-with-1Password-22cf4135c7074898b95a4e88ac3e05c4?pvs=4#14c0bf386ef74c09b889b7cc85823af9](https://www.notion.so/Git-and-SSH-Setup-with-1Password-22cf4135c7074898b95a4e88ac3e05c4?pvs=21)
    
    In this case, it is only useful for specifying the default ssh keys that 1Password will use.
    
- **Mac / Linux**
    
    File: `~/.config/1Password/ssh/agent.toml`
    
    File: `~/.ssh/pub/personal_git.pub`
    
    File: `~/.ssh/config`
    
    <aside>
    ℹ️ This setup will ensure your anon ssh key is always used by default, but whenever you specify `personalgit` in your remote it will use your personal ssh key.
    
    Sample remote: `personalgit:my-user/very-important-project.git`
    
    </aside>
    

**5. Configure your Github account**

1. Go to https://github.com/settings/keys.
2. Make sure “**Flag unsigned commits as unverified”** is checked.
3. Click on New SSH Key
    1. Title: **1Password Wonderland**
    2. Key type: **Authentication Key**
    3. Key: **Paste your anon ssh public key**
4. Click on New SSH Key
    1. Title: **1Password Wonderland**
    2. Key type: **Signing Key**
    3. Key: **Paste your anon ssh public key**
    

<aside>
ℹ️ **Authentication keys** are used whenever you push/pull.
**Signing keys** are used whenever you commit.
In this case, you want to have both being the same ssh key.

</aside>

# That’s it!

Go ahead and try it out now.

![image.png](/img/thats-too-easy.png)

# References

- https://developer.1password.com/docs/ssh/get-started/
- https://developer.1password.com/docs/ssh/integrations/wsl/