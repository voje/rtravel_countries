from nltk import everygrams
from nltk import word_tokenize
import re

# script to process text from reddit

re_capital = re.compile('[A-Z][a-z,A-Z]+')

txt = """United States of America is what I'm Looking for
USA also comes in handy. Also North Korea, Cuba, so and so and so..."""

snt = re.split('[.,?!;]', txt)
ngrsnt = []
for s in snt:
    if len(s) <= 1:
        continue
    tks = word_tokenize(s)
    ngrsnt += [
        x for x in everygrams(tks, max_len=4) if re_capital.match(x[0])
    ]

# list of lower case strings, country name candidates
chunks = [(" ".join(x)).lower() for x in ngrsnt]
