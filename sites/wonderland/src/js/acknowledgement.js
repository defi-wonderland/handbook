import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const acknowledgement = `
    ____            _                      __   __             _____ __             __  __  
   / __ \\___  _____(_)___ _____  ___  ____/ /  / /_  __  __   / ___// /__________ _/ /_/ /_ 
  / / / / _ \\/ ___/ / __ \`/ __ \\/ _ \\/ __  /  / __ \\/ / / /   \\__ \\/ __/ ___/ __ \`/ __/ __ \\
 / /_/ /  __(__  ) / /_/ / / / /  __/ /_/ /  / /_/ / /_/ /   ___/ / /_/ /  / /_/ / /_/ / / /
/_____/\\___/____/_/\\__, /_/ /_/\\___/\\__,_/  /_.___/\\__, /   /____/\\__/_/   \\__,_/\\__/_/ /_/ 
                  /____/                          /____/                                    
https://strath.work/
`;

if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    if (body) {
      const comment = document.createComment(acknowledgement);
      body.insertBefore(comment, body.firstChild);
    }
  });
}