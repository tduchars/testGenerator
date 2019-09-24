const fs = require('fs');
const { exec } = require('child_process');
const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateProject(done) {
  fs.writeFile('index.js', '', (err, indexFile) => {
    if (err) console.log(err);
    else {
      fs.mkdir('spec', (err, specDir) => {
        if (err) console.log(err);
        else {
          fs.writeFile(
            'spec/index.spec.js',
            "const { expect } = require('chai');\n\ndescribe('', () => {\nit('', () => {});\n});",
            (err, specFile) => {
              if (err) console.log(err);
              else {
                exec('npm init -y\nnpm i mocha chai -D', (err, commands) => {
                  if (err) console.log(err);
                  else {
                    fs.readFile('package.json', (err, readPackage) => {
                      if (err) console.log(err);
                      else {
                        const parsed = JSON.parse(readPackage);
                        parsed.scripts.test = 'mocha spec';
                        const stringified = JSON.stringify(parsed);
                        fs.writeFile(
                          'package.json',
                          stringified,
                          (err, response) => {
                            if (err) console.log(err);
                            else {
                              fs.writeFile(
                                '.gitignore',
                                'node_modules',
                                (err, response) => {
                                  if (err) console.log(err);
                                  else {
                                    rl.question(
                                      'Would you like to initialize a github repo? (y/n)',
                                      answer => {
                                        if (answer === 'n') done(null);
                                        if (answer === 'y') {
                                          exec('git init', (err, response) => {
                                            if (err) console.log(err);
                                            else {
                                              exec(
                                                'git add .',
                                                (err, response) => {
                                                  if (err) console.log(err);
                                                  else {
                                                    exec(
                                                      'git commit -m "First commit with index js file"',
                                                      (err, response) => {
                                                        if (err)
                                                          console.log(err);
                                                        else {
                                                          rl.question(
                                                            "Paste your github repository's quick setup link...",
                                                            answer => {
                                                              exec(
                                                                `git remote add origin ${answer}\ngit remote -v\ngit push -u origin master`,
                                                                (
                                                                  err,
                                                                  response
                                                                ) => {
                                                                  if (err)
                                                                    console.log(
                                                                      err
                                                                    );
                                                                  else
                                                                    done(null);
                                                                }
                                                              );
                                                            }
                                                          );
                                                        }
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                            }
                                          });
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    });
                  }
                });
              }
            }
          );
        }
      });
    }
  });
}

generateProject((err, response) => {
  if (err) console.log(err);
  else {
    console.log('Project Generated');
  }
});
