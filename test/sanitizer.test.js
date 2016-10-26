import test from 'ava';
import sanitizer from './../lib/utils/sanitizer';

test('single css class rule should return an array containing 1 rule', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule');

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule');
});

test('multiple css class rules should return an array of rules', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule, .second-example-rule');

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 2);
  t.is(sanitisedSearchTerms[0], 'example-rule');
  t.is(sanitisedSearchTerms[1], 'second-example-rule');
});

test('css id rule should be correctly formatted', t => {
  const sanitisedSearchTerms = sanitizer('#example-rule');

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule');
});

test('single child css class rule should be returned', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule .child-class-rule');

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'child-class-rule');
});

test('multiple child css class rules should be returned', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule .child-class-rule, .other-example-rule .other-child-class-rule'
  );

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 2);
  t.is(sanitisedSearchTerms[0], 'child-class-rule');
  t.is(sanitisedSearchTerms[1], 'other-child-class-rule');
});

test('pseudo-classes selectors should be removed', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule:nth-of-type, .other-example-rule:pseudo-selector, .another-example-rule::double-pseudo'
  );

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 3);
  t.is(sanitisedSearchTerms[0], 'example-rule');
  t.is(sanitisedSearchTerms[1], 'other-example-rule');
  t.is(sanitisedSearchTerms[2], 'another-example-rule');
});

test('universal selectors should be removed', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule *'
  );

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule');
});

test('direct child selector should be removed', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule >'
  );

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule');
});

test('next sibling selector should be removed', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule + .example-rule-other'
  );

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule-other');
});

test('General sibling combinator should be removed', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule ~ .example-rule-other'
  );

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule-other');
});

test('Extraneous whitespace should be removed', t => {
  const sanitisedSearchTerms = sanitizer('   .example-rule-other   ');

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule-other');
});

test('Selector sanitization should work on unconventional selectors', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule ~ .example-rule-other, .example-rule-one + .example-rule-other-one, .example-rule-two > *'
  );

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 3);
  t.is(sanitisedSearchTerms[0], 'example-rule-other');
  t.is(sanitisedSearchTerms[1], 'example-rule-other-one');
  t.is(sanitisedSearchTerms[2], 'example-rule-two');
});

test('Attribute selectors should be removed', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule[disabled]');

  t.true(Array.isArray(sanitisedSearchTerms));
  t.true(sanitisedSearchTerms.length === 1);
  t.is(sanitisedSearchTerms[0], 'example-rule');
});


