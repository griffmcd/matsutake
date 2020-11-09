import * as dotenv from 'dotenv';
import * as commandLineArgs from 'command-line-args';

const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'development',
    type: String,
  },
]);

const result2 = dotenv.config({
  path: `./env/${options.env as string}.env`,
  debug: true,
});

if (result2.error) {
  throw result2.error;
}