from setuptools import setup

setup(
    name='rtravel_countries',
    version=0.1,
    description='Data analysis using NLTK.',
    url='https://github.com/voje/rtravel_countries',
    author='Kristjan Voje',
    author_email='kristjan.voje@gmail.com',
    licence='MIT',
    packages=['rtravel_countries'],
    install_requires=['praw', 'sqlite3'],
    zip_safe=False
)
