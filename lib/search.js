const spawn = require('child_process').spawn;
const repoDirectory = process.env.REPO_DIR;
/**
 * Search html markup using grep
 * @param searchString
 * @param [fileExtension=html]
 * @returns {Promise}
 */
const searchMarkup = (searchString, fileExtension = 'html') => {
  return new Promise((resolve, reject) => {
    const grep = spawn('grep', ['-nrliF', `--include=*\.${fileExtension}`, searchString, repoDirectory]);

    grep.stdout.on('data', data => console.log(data.toString()));

    grep.stderr.on('data', data => console.error(`Error: ${data.toString()}`));

    grep.on('error', err => reject(`Error: ${err}`));

    grep.on('close', code => resolve());

    grep.on('exit', code => grep.kill());
  });
};

export default searchMarkup;
