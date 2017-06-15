# React Timespan

A neat timeline component that displays a gallery of activities with a pannable plot.

![Demonstration](https://github.com/colepatrickturner/react-timespan/raw/master/demo.gif)

## How to use


## API

The display precision is based on year, which is a large unit. Sorting precision is down to the millisecond.

```
import Timeline from 'react-timespan';

const activities = [
  {
    name: 'Cole Turner',
    start: '1991-02-24',
    url: 'http://cole.codes/',
    body: 'As a baby I was born because something about birds and bees.',
    image: 'http://...'
  },
  {
    name: 'The Year I Wrote This',
    start: '2017-01-01',
    end: '2017-12-31',
    url: 'http://cole.codes/',
    body: 'Truly I made this for my portfolio and decided to sh are.',
    image: 'http://...'
  }
];


<Timeline activities={activities} />

```

[A SASS stylesheet is included separately](stylesheet.scss)...


## Make it better
I decided to share this because I am fond of the end result and hope it will inspire a pull request to make it better.

Pull requests are warmly welcomed.

## Contributors
Cole Turner
