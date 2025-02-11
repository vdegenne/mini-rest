# @vdegenne/mini-rest

### Usage

```js
import {Rest} from '@vdegenne/mini-rest';

const api = new Rest('localhost:xxxx/api/v1');

const {text} = await api.get('ping'); // http://localhost:xxxx/api/v1/ping
console.log(await text()); // "pong"

const {status} = await api.post('blog/entry', {title: '...', content: '...'});
if (status === 200) {
	// success, do something
}
```

### Precache

```js
const api = new Rest('localhost:xxxx/api/v1', {precache: 'json'});

const {json} = await api.get('data');
console.log(json.something);

// You can always avoid caching 'json' if the response type does not match
const {text} = await api.get('roman', 'text');
console.log(text);

// or
await api.get('just-a-signal', undefined); // to avoid caching anything if precache was set
```
