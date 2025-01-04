# @vdegenne/mini-rest

### Usage

```js
import {Rest} from '@vdegenne/mini-rest';

const api = new Rest('localhost:xxxx/api/v1');

const {text} = await api.get('ping'); // http://localhost:xxx/api/v1/ping
console.log(await text()); // "pong"

const {status} = await api.post('blog/entry', {title: '...', content: '...'});
if (status === 200) {
	// success, do something
}
```
