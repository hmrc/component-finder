import test from 'ava'
import sanitizer from './../lib/utils/sanitizer'

test('single css class rule should return 1 rule', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule')

  t.is(sanitisedSearchTerms, 'example-rule')
})

test('css id rule should be correctly formatted', t => {
  const sanitisedSearchTerms = sanitizer('#example-rule')

  t.is(sanitisedSearchTerms, 'example-rule')
})

test('single child css class rule should be returned', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule .child-class-rule')

  t.is(sanitisedSearchTerms, 'child-class-rule')
})

test('pseudo-classes selectors should be removed', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule::double-pseudo')

  t.is(sanitisedSearchTerms, 'example-rule')
})

test('universal selectors should be removed', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule *')

  t.is(sanitisedSearchTerms, 'example-rule')
})

test('direct child selector should be removed', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule >')

  t.is(sanitisedSearchTerms, 'example-rule')
})

test('next sibling selector should be removed', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule + .example-rule-other')

  t.is(sanitisedSearchTerms, 'example-rule-other')
})

test('General sibling combinator should be removed', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule ~ .example-rule-other')

  t.is(sanitisedSearchTerms, 'example-rule-other')
})

test('Extraneous whitespace should be removed', t => {
  const sanitisedSearchTerms = sanitizer('   .example-rule-other   ')

  t.is(sanitisedSearchTerms, 'example-rule-other')
})

test('Selector sanitization should work on unconventional selectors', t => {
  const sanitisedSearchTerms = sanitizer(
    '.example-rule ~ .example-rule-other .example-rule-one + .example-rule-other-one .example-rule-two > *')

  t.is(sanitisedSearchTerms, 'example-rule-two')
})

test('Attribute selectors should be removed', t => {
  const sanitisedSearchTerms = sanitizer('.example-rule[disabled]')

  t.is(sanitisedSearchTerms, 'example-rule')
})
