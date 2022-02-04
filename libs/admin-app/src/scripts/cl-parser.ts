import parseChangelog from 'changelog-parser';
import path from 'path';

parseChangelog(
  path.resolve(__dirname, '../../docs/CHANGELOG.md'),
  function (err, result) {
    if (err) {
      throw err;
    }

    console.log(result);
  }
);
