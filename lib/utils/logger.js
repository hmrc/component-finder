import winston from 'winston';
import {EOL as newline} from 'os';

const formatter = options => {
  const fileList = options.meta.files.map(file => `  ${file + newline}`).join('');

  return `${options.meta.name} [${options.meta.count}]${newline + fileList}`;
}

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      formatter
    }),
    new (winston.transports.File)({
      name: 'text',
      filename: 'search-results.txt',
      json: false,
      formatter
    })
  ]
});

export default logger;
