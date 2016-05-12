IMPORTANT
=========

Integration tests are done with the **BDD interface** of mocha because it
provides us with the hooks `before` and `after`. These hooks are executed just
once at the beginning and end of the `suite` (called `describe` in BDD). The
regular `setup` and `teardown` hooks that are run before and after every test
are called `beforeEach` and `afterEach`.
