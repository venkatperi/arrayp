<a name="module_arrayp"></a>

## arrayp
`arrayp` provides functions for manipulating collections of JavaScript `Promise` objects.

<a name="exp_module_arrayp--chain"></a>

### chain(iterable, initial) ⇒ <code>Promise</code> ⏏
The `chain` method evaluates each promise in the iterable in series and returns a
`Promise` that resolves with the value from the last item in the iterable, or rejects
with the reason from the first item in the iterable that rejects. The value from one
item in the iterable is passed as an argument to the next item. An optional `initial`
value to the `chain` method will be passed to the first promise of the iterable.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| iterable | <code>Array</code> \| <code>Iterable</code> | an iterable object, such as an `Array`. |
| initial | <code>\*</code> | an optional value passed to the first item. |

