import test from 'ava';
import sinon from 'sinon';
import clone from './../lib/clone';

const mockServices = [
  {
    name: 'testData',
    githubUrls: [
      {
        name: 'github-com',
        displayName: 'GitHub.com',
        url: 'https://github.com/test-url'
      }
    ],
  },
  {
    name: 'testDataOther',
    githubUrls: [
      {
        name: 'github-com',
        displayName: 'GitHub.com',
        url: 'https://github.com/test-url-other'
      }
    ],
  }
];

test.before(t => sinon.stub(process.stdout, 'write'));

test.after(t => process.stdout.write.restore());

test('.clone() should resolve 2 cloneTask promises', async t => {
  const cloneTaskSpy = sinon.spy(() => {
    return new Promise(resolve => {
      resolve(mockServices);
    });
  });

  await clone(mockServices, cloneTaskSpy);

  t.true(cloneTaskSpy.calledTwice);
});

test('.clone() should error when a cloneTask promise is rejected', async t => {
  const mockError = 'mock error';

  const cloneTaskRejection = () => {
    return new Promise((resolve, reject) => {
      reject(new Error(mockError));
    });
  };

  await clone(mockServices, cloneTaskRejection)
    .catch(err => {
      t.true(err instanceof Error);
      t.is(err.message, mockError);
    });
});
